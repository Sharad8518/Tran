import database from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { getRandomId } from '../../utils/getRandomId';
import { databaseRefs } from '../../config/variables';

const ChatScreen = (props) => {
  const { route, firebaseUId, userName,navigation, role } = props;

  console.log('userName',userName)


  const details = route?.params?.details;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    const chatRef = database().ref(`${databaseRefs.messages}/${details?.key}`);
    chatRef.on('child_added', (snapshot) => {
      setMessages((prevMessages) => [snapshot.val(), ...prevMessages]);
    });
    return () => chatRef.off();
  }, []);

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    const newMessage = {
      _id: getRandomId(),
      text: messageText,
      type: 'text',
      user: { name: userName, _id: firebaseUId, role },
      timestamp: new Date().getTime(),
    };
    database().ref(`${databaseRefs.messages}/${details.key}`).push().set(newMessage);
    setMessageText('');
  };

  const pickImage = () => {
    ImagePicker.openPicker({ cropping: true, mediaType: 'photo' }).then(handleImage);
  };

  const handleImage = (image) => {
    setUploading(true);
    const fileName = image.path.split('/').pop();
    const ref = storage().ref(`chatImages/${fileName}`);
    ref.putFile(image.path).then(async () => {
      const url = await ref.getDownloadURL();
      sendImageMessage(url, fileName);
      setUploading(false);
    }).catch(() => setUploading(false));
  };

  const sendImageMessage = (url, path) => {
    const newMessage = {
      _id: getRandomId(),
      text: null,
      url,
      type: 'image',
      user: { name: userName, _id: firebaseUId, role },
      timestamp: new Date().getTime(),
    };
    database().ref(`${databaseRefs.messages}/${details.key}`).push().set(newMessage);
  };

  console.log('message',messages)
  console.log('firebaseUId',firebaseUId)
  

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        inverted
        renderItem={({ item }) => (
          <View style={[styles.message, item.user._id === firebaseUId ? styles.myMessage : styles.otherMessage]}>
            {item.type === 'text' ? (
              <Text style={styles.messageText}>{item.text}</Text>
            ) : (
              <Image source={{ uri: item.url }} style={styles.image} />
            )}
          </View>
        )}
      />
      {uploading && <ActivityIndicator size="small" color="#000" />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageText}>📷</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  message: { padding: 10, borderRadius: 10, margin: 5, maxWidth: '70%' },
  myMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#ECECEC', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },
  image: { width: 150, height: 150, borderRadius: 10 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 10 },
  sendButton: { marginLeft: 10, padding: 10, backgroundColor: '#007AFF', borderRadius: 20 },
  sendText: { color: '#fff', fontSize: 16 },
  imageButton: { marginLeft: 10, padding: 10, backgroundColor: '#FF4081', borderRadius: 20 },
  imageText: { color: '#fff', fontSize: 18 },
});

const mapStateToProps = (store) => ({
  firebaseUId: store.userReducer.firebaseUid,
  userName: store.userReducer.userName,
  role: store.authReducer.role,
});

export default connect(mapStateToProps)(ChatScreen);
