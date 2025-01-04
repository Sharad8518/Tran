import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {Tracker} from '../../Components/Tracker';
import {withAppToaster} from '../../redux/AppState';
import {DetailsRow} from '../Transporter/EnqDetailsTran';
import database from '@react-native-firebase/database';
import {databaseRefs} from '../../config/variables';
import * as _ from 'lodash';
import {setActiveChatId} from '../../redux/chat/actions';
import {chatExists} from '../consignor/ShipmentDetails';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

const ShipmentDetailsConsignee = props => {
  const shipmentId = 1;
  const shipmentIdRoute = props?.route?.params.shipmentId;
  const {setToast, navigation, firebaseUid, consignee, setActiveChat} = props;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, toggleShow] = useState(false);
  const [transporterChats, setTransporterChats] = useState(null); // includes details of transporter saved in firebase database
  const [consignorChats, setConsignorChats] = useState(null); // includes details of transporter saved in firebase database
  const isFocused = useIsFocused();
  useEffect(() => {
    axios
      .post(`/shipment/details`, {shipmentId: shipmentIdRoute})
      .then(res => {
        const response = res.data;
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
      })
      .catch(error => {
        // console.log('error', error);
        setLoading(false);
      });
  }, [shipmentIdRoute, isFocused]);
  useEffect(() => {
    if (!!details) {
      const transporterId = details?.transporter.firebaseUid;
      const consignorId = details?.requester.firebaseUid;
      database()
        .ref(databaseRefs.users)
        .child(`${transporterId}`)
        .once('value', snap => setTransporterChats(snap.val()));
      database()
        .ref(databaseRefs.users)
        .child(`${consignorId}`)
        .once('value', snap => setConsignorChats(snap.val()));
    }
  }, [details, isFocused]);
  const chatWithConsignor = async () => {
    const toUser = {
      firebaseUid: details.requester.firebaseUid,
      ..._.omit(consignorChats, ['chats', 'presence']),
    };
    const fromUser = {
      firebaseUid: firebaseUid,
      contact: consignee.contact,
      email: consignee.email,
      role: 'consignee',
      userName: consignee.userName,
    };
    const isChatInitiated = await chatExists(
      consignorChats.chats,
      firebaseUid,
      shipmentId,
    );
    if (isChatInitiated.exists) {
      setActiveChat(true);
      navigation.navigate('ChatScreen', {
        details: {
          key: true,
          shipmentId,
          toUser: toUser,
        },
      });
    } else {
      initiateNewChat(
        details.requester.firebaseUid,
        toUser,
        firebaseUid,
        fromUser,
      );
    }
  };
  const chatWithTransporter = async () => {
    const toUser = {
      firebaseUid: details.transporter.firebaseUid,
      ..._.omit(transporterChats, ['chats', 'presence']),
    };
    const fromUser = {
      firebaseUid: firebaseUid,
      contact: consignee.contact,
      email: consignee.email,
      role: 'consignee',
      userName: consignee.userName,
    };
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
                    Sun, 13 July 2019
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
                    value={`₹ ${details?.enquiry?.unloadingExpense}  Per MT`}
                  />
                  {details?.enquiry?.advance !== null && (
                    <DetailsRow
                      label={'Advance'}
                      value={`₹ ${details?.enquiry?.advance}`}
                    />
                  )}
                  {details?.enquiry?.againstBill && (
                    <DetailsRow
                      label={'Pay Against Delivery'}
                      value={`₹ ${details?.enquiry?.againstBill}`}
                    />
                  )}
                </>
              )}
              {show &&
                details?.enquiry?.advance !== null &&
                details?.enquiry?.againstBill && (
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
              onPress={() => chatWithConsignor()}
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
                {'  '}Chat with Consignor
              </Text>
            </TouchableOpacity>
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
  firebaseUid: store.userReducer.firebaseUid,
  chats: store.chatsReducer.chats,
  consignee: store.userReducer.consignee.profile,
});
const mapDispatchToProps = dispatch => ({
  setActiveChat: chatId => dispatch(setActiveChatId(chatId)),
});

export default withAppToaster(
  connect(mapStateToProps, mapDispatchToProps)(ShipmentDetailsConsignee),
);
