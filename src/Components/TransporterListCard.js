import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {withAppToaster} from '../redux/AppState';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import database from '@react-native-firebase/database';
import {databaseRefs} from '../config/variables';
import {setActiveChatId} from '../redux/chat/actions';
import {objToArray} from '../utils/objToArray';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
export const chatExists = (toUserChats, userId, shipmentId) => {
  if (toUserChats !== null && !!toUserChats) {
    const arr = objToArray(toUserChats);
    // const shipmentChat = arr.find(c => c.toUser.firebaseUid === userId);
    const shipmentChat = arr.find(
      c => c.shipmentId == shipmentId && c.toUser.firebaseUid === userId,
    );
    if (!!shipmentChat && shipmentChat.toUser.firebaseUid === userId) {
      return {key: shipmentChat.key, exists: true};
    }
  }
  return {exists: false};
};
const TransporterListCard = props => {
  const {tData, consignor, firebaseUid, setActiveChat, setToast} = props;

  const navigation = useNavigation();
  const [remarks, setRemark] = useState('');
  const shipmentId = 1;
  const [transporterChats, setTransporterChats] = useState(null); // includes details of transporter saved in firebase database
  const isFocused = useIsFocused();

  useEffect(() => {
    const transporterId = tData.firebaseUid;
    // const consigneeId = details?.toAddress.firebaseUid;
    database()
      .ref(databaseRefs.users)
      .child(`${transporterId}`)
      .once('value', snap => setTransporterChats(snap.val()));
  }, [isFocused, tData.firebaseUid]);
  const chatWithTransporter = async () => {
    const toUser = {
      firebaseUid: tData.firebaseUid,
      ..._.omit(transporterChats, ['chats', 'presence']),
    };
    const fromUser = {
      firebaseUid,
      contact: consignor.profile.contact,
      email: consignor.profile.email,
      role: 'consignor',
      userName: consignor.profile.userName,
    };
    // check anyone of consignor chatId matches with transporters chatId
    const isChatInitiated = await chatExists(
      transporterChats.chats,
      firebaseUid,
      shipmentId,
    );
    if (isChatInitiated.exists) {
      setActiveChat(isChatInitiated.key);
      navigation.navigate('ChatScreen', {
        details: {
          key: isChatInitiated.key,
          shipmentId,
          toUser: toUser,
        },
      });
    } else {
      // for new chat between transporter and consignor for given shipment
      initiateNewChat(tData.firebaseUid, toUser, firebaseUid, fromUser);
    }
  };
  const initiateNewChat = (toUserId, toUser, fromUserId, fromUser) => {
    const chatKey = database().ref(databaseRefs.chats).push().key;
    database()
      .ref(databaseRefs.chats)
      .child(chatKey)
      .set({
        shipmentId,
        users: {
          [toUserId]: toUser,
          [fromUserId]: fromUser,
        },
      })
      .then(() =>
        addChatIdToUsers(chatKey, toUserId, toUser, fromUserId, fromUser),
      );
  };
  const addChatIdToUsers = (
    chatKey,
    toUserId,
    toUser,
    fromUserId,
    fromUser,
  ) => {
    // setting chat id in consignors profile, with to user details and shipment id
    // first set toUser in current user
    const timeStamp = new Date().getTime();
    database()
      .ref(databaseRefs.users)
      .child(`${fromUserId}/chats/${chatKey}`)
      .set({
        toUser: toUser,
        shipmentId,
      })
      .then(() => {
        database()
          .ref(databaseRefs.lastSeen)
          .child(`${fromUserId}/${chatKey}`)
          .set({lastSeen: timeStamp});
      });

    // setting chat id in transporters profile, with to user details and shipment id
    // then set to user in other user
    database()
      .ref(databaseRefs.users)
      .child(`${toUserId}/chats/${chatKey}`)
      .set({
        toUser: fromUser,
        shipmentId,
      })
      .then(() => {
        database()
          .ref(databaseRefs.lastSeen)
          .child(`${toUserId}/${chatKey}`)
          .set({lastSeen: timeStamp});
        setActiveChat(chatKey);
        // and then navigate with details
        navigation.navigate('ChatScreen', {
          details: {
            key: chatKey,
            shipmentId,
            toUser: toUser,
          },
        });
      });
  };
  return (
    <TouchableOpacity
      onPress={() => chatWithTransporter()}
      style={{
        flexDirection: 'row',
        marginVertical: 5,
        borderBottomWidth: 0.8,
        borderColor: '#ccc',
      }}>
      <View
        style={{
          width: wp(15),
          alignItems: 'center',
          marginTop: hp(1),
          marginLeft: 10,
        }}>
        <MaterialCommunityIcons
          name="truck-check-outline"
          color="#FFA654"
          size={30}
        />
      </View>
      <View style={{marginLeft: wp(4)}}>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 16,
            textTransform: 'capitalize',
          }}>
          {tData.companyName}
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 12,
            textTransform: 'capitalize',
          }}>
          {`${tData.consignor_location} to ${tData.consignee_location}`}
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 12,
          }}></Text>
      </View>
    </TouchableOpacity>
  );
};

const mapStateToProps = store => ({
  token: store.authReducer.token,
  consignor: store.userReducer.consignor,
  firebaseUid: store.userReducer.firebaseUid,
  chats: store.chatsReducer.chats,
});
const mapDispatchToProps = dispatch => ({
  setActiveChat: chatId => dispatch(setActiveChatId(chatId)),
});

export default withAppToaster(
  connect(mapStateToProps, mapDispatchToProps)(TransporterListCard),
);
