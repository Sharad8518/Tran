import React, {useEffect, useState} from 'react';
import {TouchableOpacity, ScrollView} from 'react-native';
import {Text} from 'react-native';
import {Platform} from 'react-native';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {connect} from 'react-redux';
import {setActiveChatId} from '../../redux/chat/actions';
import database from '@react-native-firebase/database';
import {databaseRefs} from '../../config/variables';
import {Icon} from 'react-native-elements';
const ChatList = props => {
  const {
    isLoading,
    chats,
    navigation,
    setActiveChat,
    firebaseUId,
    unreadCounts,
  } = props;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'ios' ? '15%' : 0,
      }}>
      <ScrollView>
        {isLoading ? (
          <View style={{flex: 1}}>
            <ActivityIndicator color="#549CFF" />
          </View>
        ) : chats.length > 0 ? (
          chats.map((c, i) => (
            <ChatCard
              unreadCounts={unreadCounts?.[c.key]?.count}
              lastSeen={unreadCounts?.[c.key]?.lastSeen}
              firebaseUId={firebaseUId}
              onPress={details => {
                setActiveChat(details.key);
                navigation.navigate('ChatScreen', {details});
              }}
              key={i}
              details={c}
            />
          ))
        ) : (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text style={{fontFamily: 'Lato-Bold', textAlign: 'center'}}>
              No Chats found!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const ChatCard = props => {
  const {details, onPress, firebaseUId, unreadCounts, lastSeen} = props;
  const [lastMessage, setLastMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    database()
      .ref(databaseRefs.chats)
      .child(`${details.key}/lastMessage`)
      .on('value', snap => {
        setLastMessage(snap.val());
      });
    return () => {
      database().ref(databaseRefs.chats).child(`${details.key}/lastSeen`).off();
    };
  }, []);
  useEffect(() => {
    setUnreadCount(unreadCounts);
  }, [unreadCounts]);
  useEffect(() => {
    if (!!lastSeen)
      database()
        .ref(`${databaseRefs.messages}/${details.key}`)
        .on('child_added', (data, previousChildName) => {
          database()
            .ref(`${databaseRefs.messages}/${details.key}`)
            .orderByChild('timestamp')
            .startAt(lastSeen)
            .endAt(new Date().getTime())
            .once('value', snap => {
              const unreadCount = snap.numChildren();
              setUnreadCount(unreadCount);
            });
        });
    return () =>
      database().ref(`${databaseRefs.messages}/${details.key}`).off();
  }, [lastSeen]);
  return (
    <TouchableOpacity
      onPress={() => {
        return onPress(details);
      }}
      style={{
        paddingHorizontal: '5%',
        paddingVertical: '3%',
        borderBottomWidth: 0.8,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{flex: 9}}>
        <Text style={{textTransform: 'capitalize', fontFamily: 'Lato-Bold'}}>
          {details.toUser.userName} ({details.toUser.role})
        </Text>
        {!!lastMessage && (
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            {firebaseUId === lastMessage.user._id && (
              <Icon name="ios-checkmark-sharp" type="ionicon" color="#549CFF" />
            )}
            <Text style={{fontFamily: 'Lato-Bold', color: '#424242'}}>
              {lastMessage.type === 'text'
                ? lastMessage?.text
                : 'Sent an image'}
            </Text>
          </View>
        )}
        {/* <Text
          style={{marginTop: 10, fontFamily: 'Lato-Regular', fontSize: 12}}>
          Shipment #{details.shipmentId}
        </Text> */}
      </View>
      <View style={{flex: 1}}>
        {unreadCount > 0 && (
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 20,
              backgroundColor: '#F99746',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Lato-Bold',
                textAlign: 'center',
              }}>
              {unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
const mapStateToProps = store => ({
  chats: store.chatsReducer.chats,
  isLoading: store.chatsReducer.isLoading,
  unreadCounts: store.chatsReducer.unreadCounts,
  firebaseUId: store.userReducer.firebaseUid,
});
const mapDispatchToProps = dispatch => ({
  setActiveChat: chatId => dispatch(setActiveChatId(chatId)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
