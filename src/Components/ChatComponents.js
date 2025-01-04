import moment from 'moment';
import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {Actions, Bubble, Composer} from 'react-native-gifted-chat';
import {ActivityIndicator} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';

const window = Dimensions.get('window');
export const renderBubble = (props, openImage) => {
  if (props.currentMessage.type === 'image') {
    return (
      <ChatImage
        openImage={image => {
          return openImage(image);
        }}
        {...props}
      />
    );
  }

  return <Bubble {...props} />;
};

export const renderChatEmpty = isAdmin => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{rotateX: '180deg'}],
      }}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Text allowFontScaling={false} style={{fontFamily: 'Lato-Regular'}}>
          Send your first message!
        </Text>
      </View>
    </View>
  );
};
export const renderActions = (props, sendImage) => (
  <Actions
    {...props}
    containerStyle={{
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 4,
      marginRight: 4,
      marginBottom: 0,
    }}
    icon={() => <Icon color={'#549CFF'} name="attachment" type="entypo" />}
    options={{
      'Send Image From Gallery': () => {
        return sendImage('gallery');
      },
      'Capture Image': () => {
        return sendImage('camera');
      },
      Cancel: () => {
        // console.log('Cancel');
      },
    }}
    optionTintColor="#222B45"
  />
);
export const renderComposer = props => (
  <Composer
    {...props}
    textInputStyle={{
      color: '#222B45',
      borderWidth: 0,
      borderRadius: 5,
      borderColor: '#E4E9F2',
      paddingHorizontal: 12,
      marginLeft: 0,
      fontFamily: 'Lato-Regular',
    }}
  />
);
export const ImagePreviewModal = ({visible, close, uploading, send, image}) => {
  return (
    <Modal
      transparent={uploading}
      onDismiss={() => {
        return close();
      }}
      onRequestClose={() => {
        return close();
      }}
      visible={visible}>
      <SafeAreaView style={{flex: 1}}>
        {uploading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#999',
              opacity: 0.7,
            }}>
            <ActivityIndicator
              style={{position: 'absolute', zIndex: 1, alignSelf: 'center'}}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              padding: `${3}%`,
            }}>
            <View style={{flexDirection: 'row', height: 45}}>
              <TouchableOpacity
                onPress={() => {
                  return close();
                }}>
                <Icon
                  color={'#111'}
                  size={22}
                  name="chevron-left"
                  type="entypo"
                />
              </TouchableOpacity>
              <Text
                allowFontScaling={false}
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 15,
                  marginLeft: `${3}%`,
                }}>
                Send Image
              </Text>
            </View>
            {!!image && (
              <View style={{padding: `${5}%`}}>
                <Image
                  resizeMode="contain"
                  style={{height: window.height * 0.7}}
                  source={{uri: image.path}}
                />
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: `${3}%`,
              }}>
              <TouchableOpacity
                onPress={() => {
                  return close();
                }}
                style={{
                  backgroundColor: '#EB5A46',
                  height: 50,
                  borderRadius: 10,
                  justifyContent: 'center',
                  flex: 0.47,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontSize: 15,
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  return send();
                }}
                style={{
                  backgroundColor: '#549CFF',
                  height: 50,
                  borderRadius: 10,
                  justifyContent: 'center',
                  flex: 0.47,
                }}>
                <Text
                  allowFontScaling={false}
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontSize: 15,
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};
const ChatImage = props => {
  const {currentMessage} = props;
  return (
    <TouchableOpacity
      onPress={() => {
        return props.openImage({...currentMessage});
      }}
      style={{width: '75%', backgroundColor: 'transparent'}}>
      {/* <View style={{ borderWidth: 2, borderColor: '#549CFF', justifyContent: 'center', borderRadius: 10 }}> */}
      <Image
        resizeMode="cover"
        style={{width: '100%', height: window.height * 0.25}}
        source={{uri: currentMessage.url}}
      />
      {/* </View> */}
      <View style={styles.usernameView}>
        {props.user && props.currentMessage.user._id === props.user._id ? (
          <Text></Text>
        ) : (
          <Text allowFontScaling={false} style={[styles.username]}>
            ~ {props.currentMessage.user.name}
          </Text>
        )}
        <Text style={[styles.username]}>
          {moment(currentMessage?.timestamp).format('hh:mm a')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export const ImageModal = ({visible, close, imageMessage, setToast}) => {
  const shareImage = () => {
    RNFetchBlob.fetch('get', imageMessage.url)
      .then(res => {
        let base64 = res.data;
        share('data:image/jpeg;base64,' + base64);
      })
      .catch(err => {
        // console.log('errir', err);
      });
  };
  const share = async base64 => {
    const shareOptions = {
      url: base64,
      message: '',
      title: ``,
      type: 'image/jpg',
      activityItemSources: [
        {
          linkMetadata: {image: base64},
        },
      ],
      failOnCancel: false,
    };
    try {
      const ShareResponse = await Share.open(shareOptions);
      return close();
    } catch (error) {
      //   console.log('Error =>', error);
      return close();
    }
  };
  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        'Save remote Image',
        'Grant Me Permission to save Image',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } catch (err) {
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + err.message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  const downloadImage = async () => {
    if (Platform.OS === 'android') {
      const granted = await getPermissionAndroid();
      if (!granted) {
        return;
      }
    }
    let date = new Date();
    let image_URL = imageMessage.url;
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        setToast({text: 'Image Downloaded Successfully', styles: 'green'});
      });
  };
  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  return (
    <Modal visible={visible} onRequestClose={close} onDismiss={close}>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            backgroundColor: '#111',
          }}>
          <View
            style={{
              flexDirection: 'row',
              height: 45,
              alignItems: 'center',
              padding: `${3}%`,
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity onPress={close}>
              <Icon
                color={'#fff'}
                size={22}
                name="chevron-left"
                type="entypo"
              />
            </TouchableOpacity>
            <View>
              <Text
                allowFontScaling={false}
                style={{
                  marginLeft: `${3}%`,
                  alignSelf: 'center',
                  textTransform: 'capitalize',
                  fontFamily: 'Lato-Bold',
                }}>
                {imageMessage?.user.name}
              </Text>
              <Text
                allowFontScaling={false}
                style={{fontFamily: 'Lato-Regular'}}>
                {moment(imageMessage?.createdAt).format('DD-MM-YYYY, hh:mm a')}
              </Text>
            </View>

            <TouchableOpacity onPress={() => downloadImage()}>
              <Icon color={'#fff'} size={22} name="file-download" />
            </TouchableOpacity>
          </View>
          <View style={{padding: `${5}%`}}>
            <Image
              resizeMode="contain"
              style={{height: window.height * 0.7}}
              source={{uri: imageMessage?.url}}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              shareImage();
            }}
            style={{
              backgroundColor: '#549CFF',
              height: 50,
              borderRadius: 10,
              justifyContent: 'center',
            }}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: 15,
                color: 'white',
                textAlign: 'center',
              }}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  username: {
    top: -3,
    left: 0,
    fontSize: 12,
    backgroundColor: 'transparent',
    color: '#aaa',
  },
  usernameView: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'space-between',
  },
});
