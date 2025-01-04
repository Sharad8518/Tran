import database from '@react-native-firebase/database';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {ActivityIndicator} from 'react-native-paper';
import {connect} from 'react-redux';
import {
  ImageModal,
  ImagePreviewModal,
  renderActions,
  renderBubble,
  renderChatEmpty,
  renderComposer,
} from '../../Components/ChatComponents';
import {databaseRefs} from '../../config/variables';
import {withAppToaster} from '../../redux/AppState';
import {
  appendMessage,
  exitChat,
  setActiveChatId,
} from '../../redux/chat/actions';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {getRandomId} from '../../utils/getRandomId';
import axios from 'axios';

const getFileName = image => {
  return image.path.split('/').reverse()[0];
};
const ChatScreen = props => {
  const {
    route,
    messages,
    firebaseUId,
    isChatLoading,
    userName,
    role,
    navigation,
    exitChat,
    setToast,
  } = props;
  const details = route?.params?.details;
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // exitChat()
      database()
        .ref(databaseRefs.lastSeen)
        .child(`${firebaseUId}/${details?.key}`)
        .set({lastSeen: new Date().getTime()});
      database().ref(databaseRefs.messages).child(`${details?.key}`).off();
    });
    return () => unsubscribe();
  }, []);
  const createMessage = (message, type, imagePath) => {
    const newMessage = {
      _id: type === 'text' ? message._id : getRandomId(),
      text: type === 'text' ? message.text : null,
      url: type === 'text' ? null : message,
      imagePath: type === 'text' ? null : imagePath,
      type,
      user: {
        name: userName,
        _id: firebaseUId,
        role,
      },
      timestamp: new Date().getTime(),
    };
    return newMessage;
  };
  const SendNotification = async data => {
    axios
      .post(`/user/pushnotification`, {
        sendMessage: data.sendMessage,
        firebase_id: data.firebase_id,
        sender_name: data.sender_name,
      })
      .then(async res => {
        // console.log('res', res);
      })
      .catch(err => {
        // console.log('err', err.response);
      });
  };
  const onSend = useCallback((messages = []) => {
    const path = `${databaseRefs.messages}/${details.key}`;
    const newMessage = createMessage(messages[0], 'text');
    const data = {
      sendMessage: newMessage.text,
      firebase_id: details.toUser.firebaseUid,
      sender_name: newMessage.user.name,
    };
    SendNotification(data);
    database().ref(path).push().set(newMessage);
    database()
      .ref(databaseRefs.chats)
      .child(details.key)
      .update({lastMessage: newMessage});
  }, []);
  //for uploading image
  const [uploading, setUploading] = useState(false);
  const [imgPreview, setPreview] = useState(false);
  const [image, setImage] = useState();
  //for uploading image

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
    }).then(handleImage);
  };
  const openGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
      mediaType: 'photo',
    }).then(handleImage);
  };
  const handleImage = image => {
    // if (image.size > 1) {
    // setToast({ text: `Image size must be less than ${1}MB`, styles: 'error' });
    // } else {
    setImage(image);
    setPreview(true);
    // }
  };
  const sendImage = () => {
    setUploading(true);
    let fileName = getFileName(image);
    uploadImage(image, fileName);
  };

  // for displaying image
  const [imageModal, showImageModal] = useState(false);
  const [imageMessage, setImageMessage] = useState();
  // for displaying image

  const openImage = data => {
    showImageModal(true);
    setImageMessage(data);
  };
  const uploadImage = (image, fileName) => {
    let ref = storage().ref(`chatImages/${fileName}`);
    let task = ref.putFile(image.path);
    task
      .then(async res => {
        const url = await ref.getDownloadURL();
        createImageMessage(`chatImages/${fileName}`, url);
        setUploading(false);
        setPreview(false);
        setToast({text: `Image uploaded successfully`, styles: 'success'});
      })
      .catch(e => {
        setUploading(false);
        // console.log('uploading image error => ', e);
        setToast({text: `Something went wrong`, styles: 'error'});
      });
  };
  const createImageMessage = (path, url) => {
    const dbpath = `${databaseRefs.messages}/${details.key}`;
    const newMessage = createMessage(url, 'image', path);
    const data = {
      sendMessage: 'Photo',
      firebase_id: details.toUser.firebaseUid,
      sender_name: newMessage.user.name,
    };
    SendNotification(data);
    database().ref(dbpath).push().set(newMessage);
    setUploading(false);
    database()
      .ref(databaseRefs.chats)
      .child(details.key)
      .update({lastMessage: newMessage});
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {isChatLoading ? (
        <View style={{flex: 1}}>
          <ActivityIndicator color="#549CFF" />
        </View>
      ) : (
        <GiftedChat
          renderBubble={props => renderBubble(props, openImage)}
          renderActions={props =>
            renderActions(props, type => {
              type === 'camera' ? openCamera() : openGallery();
            })
          }
          renderChatEmpty={renderChatEmpty}
          messages={messages}
          renderComposer={renderComposer}
          onSend={messages => onSend(messages)}
          dateFormat="DD MMM YYYY"
          user={{
            _id: firebaseUId,
          }}
        />
      )}
      <ImageModal
        setToast={setToast}
        imageMessage={imageMessage}
        visible={imageModal}
        close={() => showImageModal(false)}
      />
      <ImagePreviewModal
        send={() => sendImage()}
        image={image}
        uploading={uploading}
        close={() => {
          setPreview(false);
          setImage(null);
        }}
        visible={imgPreview}
      />
    </View>
  );
};
const mapStateToProps = store => ({
  isChatLoading: store.chatsReducer.isChatLoading,
  messages: store.chatsReducer.messages,
  firebaseUId: store.userReducer.firebaseUid,
  activeChatId: store.chatsReducer.activeChatId,
  userName: store.userReducer.userName,
  role: store.authReducer.role,
});
const mapDispatchToProps = dispatch => ({
  fetchChat: chatId => dispatch(setActiveChatId(chatId)),
  appendMessage: message => dispatch(appendMessage(message)),
  exitChat: () => dispatch(exitChat()),
});
export default withAppToaster(
  connect(mapStateToProps, mapDispatchToProps)(ChatScreen),
);
