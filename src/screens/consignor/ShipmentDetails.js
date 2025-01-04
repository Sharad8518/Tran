import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity} from 'react-native';
import {Image} from 'react-native';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {connect} from 'react-redux';
import {withAppToaster} from '../../redux/AppState';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {DetailsRow} from '../Transporter/EnqDetailsTran';
import moment from 'moment';
import {Icon} from 'react-native-elements';
import database from '@react-native-firebase/database';
import {databaseRefs} from '../../config/variables';
import * as _ from 'lodash';
import {Tracker} from '../../Components/Tracker';
import {setActiveChatId} from '../../redux/chat/actions';
import {objToArray} from '../../utils/objToArray';
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
const ShipmentDetails = props => {
  const shipmentId = 1;
  const shipmentIdRoute = props?.route?.params.shipmentId;
  const {consignor, firebaseUid, navigation, chats, setActiveChat} = props;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, toggleShow] = useState(false);
  const [transporterChats, setTransporterChats] = useState(null); // includes details of transporter saved in firebase database
  const [consigneeChats, setConsigneeChats] = useState(null); // includes details of transporter saved in firebase database
  const isFocused = useIsFocused();
  useEffect(() => {
    axios
      .post(`/shipment/details`, {
        shipmentId: shipmentIdRoute,
      })
      .then(res => {
        const response = res.data;
        axios
          .get(`/bid/details/${response.shipment[0].bidId}`)
          .then(resp => {
            const details = {
              shipment: response.shipment[0],
              enquiry: response.enquiry[0],
              transporter: response.transporter[0],
              requester: response.requester[0],
              toAddress: response.toAddress[0],
              fromAddress: response.fromAddress[0],
              bid: resp.data.bid,
            };
            setDetails(details);
            setLoading(false);
          })
          .catch(error => {
            const details = {
              shipment: response.shipment[0],
              enquiry: response.enquiry[0],
              transporter: response.transporter[0],
              requester: response.requester[0],
              toAddress: response.toAddress[0],
              fromAddress: response.fromAddress[0],
            };
            setDetails(details);
            setLoading(false);
          });
      })
      .catch(error => {
        // console.log('error', error);
        setLoading(false);
      });
  }, [shipmentIdRoute, isFocused]);
  useEffect(() => {
    if (!!details) {
      const transporterId = details?.transporter.firebaseUid;
      const consigneeId = details?.toAddress.firebaseUid;
      database()
        .ref(databaseRefs.users)
        .child(`${transporterId}`)
        .once('value', snap => setTransporterChats(snap.val()));
      database()
        .ref(databaseRefs.users)
        .child(`${consigneeId}`)
        .once('value', snap => setConsigneeChats(snap.val()));
    }
  }, [details]);
  const chatWithTransporter = async () => {
    const toUser = {
      firebaseUid: details.transporter.firebaseUid,
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
      initiateNewChat(
        details.transporter.firebaseUid,
        toUser,
        firebaseUid,
        fromUser,
      );
    }
  };
  const chatWithConsignee = async () => {
    const fromUser = {
      firebaseUid,
      contact: consignor.profile.contact,
      email: consignor.profile.email,
      role: 'consignor',
      userName: consignor.profile.userName,
    };
    const toUser = {
      firebaseUid: details.toAddress.firebaseUid,
      ..._.omit(consigneeChats, ['chats', 'presence']),
    };
    const isChatInitiated = await chatExists(
      consigneeChats.chats,
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
      initiateNewChat(
        details.toAddress.firebaseUid,
        toUser,
        firebaseUid,
        fromUser,
      );
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
    <View style={{flex: 1}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : !!details ? (
        <ScrollView
          style={{flex: 1, backgroundColor: '#fff'}}
          contentContainerStyle={{paddingTop: `5%`}}>
          <View style={{height: hp(35), backgroundColor: '#fff'}}>
            <Image
              source={require('../../../assets/ShipmentSummary.png')}
              style={{height: hp(35), width: wp(80), alignSelf: 'center'}}
            />
          </View>
          <View style={{backgroundColor: '#fff'}}>
            <View
              style={{
                marginHorizontal: wp(5),
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingBottom: 10,
                borderWidth: 0.7,
                borderColor: '#ccc',
              }}>
              <View
                style={{
                  backgroundColor: '#549CFF',
                  borderRadius: 15,
                  alignItems: 'center',
                  padding: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1.5,
                    borderColor: '#fff',
                  }}>
                  <View style={{flex: 2}}>
                    <Image
                      style={{height: 80, width: '100%'}}
                      resizeMode="contain"
                      source={require('../../../assets/enqBox.png')}
                    />
                  </View>
                  <View style={{flex: 8, paddingHorizontal: '3%'}}>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Lato-Regular',
                        fontSize: 16,
                        marginTop: 5,
                      }}>
                      {details?.transporter?.companyName}
                    </Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontFamily: 'Lato-Regular',
                        fontSize: 14,
                        marginTop: 5,
                      }}>
                      Shipment #{details?.enquiry._id}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Lato-Regular',
                      fontSize: 14,
                      marginTop: 10,
                      textAlign: 'center',
                    }}>
                    Shipment Schedule Delivery
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Lato-Bold',
                      fontSize: 18,
                      textAlign: 'center',
                      marginVertical: 5,
                    }}>
                    {moment(details?.bid?.estimatedDelivery).format(
                      'ddd, DD MMMM YYYY ',
                    )}
                  </Text>
                </View>
              </View>
              <DetailsRow
                label="Pick From"
                value={`${details?.fromAddress.address}, ${details?.fromAddress.district}, ${details?.fromAddress.state}`}
              />
              <DetailsRow
                label="Deliver To"
                value={`${details?.toAddress.address}`}
              />
              {!show && (
                <Text
                  onPress={() => toggleShow(true)}
                  style={{
                    textAlign: 'center',
                    color: '#FFA654',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    marginVertical: 10,
                  }}>
                  View More Details
                </Text>
              )}
              {show && (
                <>
                  <DetailsRow
                    label="Pickup Date"
                    value={moment(details?.enquiry?.loadingTime).format(
                      'Do MMMM YYYY HH:mm A',
                    )}
                  />
                  <DetailsRow
                    label="Weight"
                    value={`${details?.enquiry?.weight}`}
                  />
                  <DetailsRow
                    label={'Loading Expense'}
                    value={`₹ ${details?.enquiry?.loadingExpense} Per MT`}
                  />
                  <DetailsRow
                    label={'Unloading Expense'}
                    value={`₹ ${details?.enquiry?.unloadingExpense} Per MT`}
                  />
                  {details?.enquiry?.advance !== null && (
                    <DetailsRow
                      label={'Advance'}
                      value={`₹ ${details?.enquiry?.advance}`}
                    />
                  )}
                  {details?.enquiry?.againstBill !== null && (
                    <DetailsRow
                      label={'Pay Against Delivery'}
                      value={`₹ ${details?.enquiry?.againstBill}`}
                    />
                  )}
                </>
              )}
              {show && (
                <Text
                  onPress={() => toggleShow(false)}
                  style={{
                    textAlign: 'center',
                    color: '#FFA654',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    marginVertical: 10,
                  }}>
                  View Less Details
                </Text>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: '5%',
              paddingVertical: 5,
            }}>
            <TouchableOpacity
              onPress={() => chatWithTransporter()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                color="#549CFF"
                size={16}
                name="chatbubble-ellipses-sharp"
                type="ionicon"
              />
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 14,
                }}>
                {'  '}Chat with Transporter
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => chatWithConsignee()}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                color="#549CFF"
                size={16}
                name="chatbubble-ellipses-sharp"
                type="ionicon"
              />
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontSize: 14,
                }}>
                {'  '}Chat with Consignee
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{padding: '5%', marginVertical: 10}}>
            <Tracker
              lastUpdate={details?.shipment?.timestamp}
              currentStatus={details?.shipment?.tracking_status}
              to={details?.toAddress.district}
              from={details?.fromAddress.district}
              isDelivered={
                !!details?.delivered ||
                details?.shipment?.tracking_status === 'delivered'
              }
            />
          </View>
        </ScrollView>
      ) : (
        <Text>Details not found</Text>
      )}
    </View>
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
  connect(mapStateToProps, mapDispatchToProps)(ShipmentDetails),
);
