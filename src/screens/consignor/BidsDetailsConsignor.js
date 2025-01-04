import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {withAppToaster} from '../../redux/AppState';
import {DetailsRow} from '../Transporter/EnqDetailsTran';
import * as _ from 'lodash';
import {connect} from 'react-redux';
import database from '@react-native-firebase/database';
import {databaseRefs} from '../../config/variables';
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
const BidsDetailsConsignor = props => {
  const transporter = {
    firebaseUid: props?.route?.params.bidDetails.firebaseUid,
    address: props?.route?.params.bidDetails.address,
    companyName: props?.route?.params.bidDetails.companyName,
    contact: props?.route?.params.bidDetails.contact,
    email: props?.route?.params.bidDetails.email,
    location: props?.route?.params.bidDetails.location,
    gstNumber: props?.route?.params.bidDetails.gstNumber,
    panNumber: props?.route?.params.bidDetails.panNumber,
    truckCount: props?.route?.params.bidDetails.truckCount,
    pincode: props?.route?.params.bidDetails.pincode,
  };

  const {consignor, firebaseUid, navigation, chats, setActiveChat, setToast} =
    props;
  const bidId = props?.route?.params?.bidId;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [remarks, setRemark] = useState('');
  const shipmentId = 1;
  const [transporterChats, setTransporterChats] = useState(null); // includes details of transporter saved in firebase database
  const isFocused = useIsFocused();
  useEffect(() => {
    const transporterId = transporter.firebaseUid;
    // const consigneeId = details?.toAddress.firebaseUid;
    database()
      .ref(databaseRefs.users)
      .child(`${transporterId}`)
      .once('value', snap => setTransporterChats(snap.val()));
  }, [isFocused]);
  const chatWithTransporter = async () => {
    const toUser = {
      firebaseUid: transporter.firebaseUid,
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
      initiateNewChat(transporter.firebaseUid, toUser, firebaseUid, fromUser);
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
  useEffect(() => {
    GetBidDetails();
  }, [bidId]);
  const confirmBidStatus = status => {
    if (remarks.length > 0) {
      setBtnLoader(true);
      Alert.alert('', `Are you sure you want to ${status} the bid ?`, [
        {
          text: 'Cancel',
          onPress: () => setBtnLoader(false),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            status === 'accept' ? acceptBid() : rejectBid();
          },
        },
      ]);
    } else {
      setToast({text: 'Please add your remark', styles: 'error'});
    }
  };
  const GetBidDetails = () => {
    axios
      .get(`/bid/details/${bidId}`)
      .then(res => {
        setDetails(res.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  };
  const acceptBid = () => {
    axios
      .post('/bid/accept', {bidId, remarks})
      .then(res => {
        setBtnLoader(false);
        GetBidDetails();
        if (!res.data.success) {
          setToast({text: res.data.msg, styles: 'error'});
        } else {
          navigation.navigate('ShipmentList');
          setToast({text: res.data.msg, styles: 'success'});
        }
      })
      .catch(error => {
        setBtnLoader(false);
      });
  };
  const rejectBid = () => {
    axios
      .post('/bid/reject', {bidId, remarks})
      .then(res => {
        setToast({text: res.data.msg, styles: 'success'});
        navigation.goBack();
      })
      .catch(error => {
        // console.log('bid reject error', res.data);
      });
  };
  return (
    <SafeAreaView style={{flex: 1}} edges={['bottom']}>
      <ScrollView
        style={{
          backgroundColor: '#fff',
          paddingVertical: Platform.OS === 'ios' ? '15%' : 0,
        }}>
        <View style={{height: hp(35), backgroundColor: '#fff'}}>
          <Image
            source={require('../../../assets/ShipmentSummary.png')}
            style={{height: hp(35), width: wp(80), alignSelf: 'center'}}
          />
        </View>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}>
            <ActivityIndicator color="#549CFF" />
          </View>
        ) : !!details ? (
          <View
            style={{
              backgroundColor: '#fff',
              flex: 1,
              paddingBottom: Platform.OS ? '15%' : 0,
            }}>
            <View
              style={{
                marginHorizontal: wp(5),
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingBottom: 10,
                elevation: 6,
                marginBottom: hp(3),
              }}>
              <View
                style={{
                  backgroundColor: '#549CFF',
                  borderRadius: 15,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                    marginTop: hp(2),
                  }}>
                  Bid Submitted by
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginTop: hp(0.4),
                    textTransform: 'capitalize',
                  }}>
                  {details.companyName}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                    marginTop: hp(0.4),
                  }}>
                  Pickup on
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 12,
                    marginTop: hp(0.4),
                  }}>
                  Enquiry Scheduled for
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginVertical: hp(0.4),
                    marginBottom: hp(1),
                  }}>
                  {moment(details.enquiry[0].loadingTime).format(
                    'Do MMMM YYYY',
                  )}
                </Text>
              </View>
              <DetailsRow
                labelColor={'#111'}
                value={
                  !!details.bid.pickup
                    ? moment(details.bid.pickup).format('Do MMMM YYYY')
                    : 'NA'
                }
                label="Pickup Date"
              />
              <DetailsRow
                labelColor={'#111'}
                value={
                  !!details.bid.estimatedDelivery
                    ? moment(details.bid.estimatedDelivery).format(
                        'Do MMMM YYYY',
                      )
                    : 'NA'
                }
                label="Estimated Delivery"
              />
              {details.bid.advance !== null && (
                <DetailsRow
                  labelColor={'#111'}
                  value={`₹ ${details.bid.advance}`}
                  label="Advance"
                />
              )}
              {details.bid.againstBill !== null && (
                <DetailsRow
                  labelColor={'#111'}
                  value={`₹ ${details.bid.againstBill}`}
                  label="Pay Against Delivery"
                />
              )}
              <DetailsRow
                labelColor={'#111'}
                value={`${details.bid.remarks}`}
                label="Remarks"
              />
              {details.bid.bid_rate_type !== null &&
                details.bid.rate !== null && (
                  <DetailsRow
                    labelColor={'#111'}
                    value={`₹${details.bid.rate}${
                      details.bid.bid_rate_type === 'MT'
                        ? ' Per ' + details.bid.bid_rate_type
                        : details.bid.bid_rate_type
                    }`}
                    label="Rate"
                  />
                )}
              {details.bid.total_freight !== null && (
                <DetailsRow
                  labelColor={'#111'}
                  value={`${details.bid.total_freight} MT`}
                  label="Total freight"
                />
              )}
              {details.bid.credit_period_for_balance_payment !== null && (
                <DetailsRow
                  labelColor={'#111'}
                  value={`${details.bid.credit_period_for_balance_payment} days`}
                  label="Credit period"
                />
              )}
              {details.bid.loading_included !== null && (
                <DetailsRow
                  labelColor={'#111'}
                  value={`${
                    details.bid.loading_included ? 'Included' : 'not Included'
                  }`}
                  label="Loading charges"
                />
              )}
              {details.bid.advance !== null &&
                details.bid.againstBill !== null && (
                  <Text
                    style={{
                      fontSize: 20,
                      color: '#FFA654',
                      fontFamily: 'Lato-Bold',
                      marginTop: hp(3),
                      alignSelf: 'center',
                    }}>
                    {`Total : ₹${
                      details.bid.advance + details.bid.againstBill
                    }`}
                  </Text>
                )}
            </View>
            <View
              style={{
                // marginHorizontal: wp(10),
                marginBottom: wp(3),
              }}>
              <TouchableOpacity
                onPress={() => chatWithTransporter()}
                style={{
                  backgroundColor: '#549CFF',
                  height: 45,
                  borderRadius: 20,
                  width: '80%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontSize: 15,
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  Chat with transporter
                </Text>
              </TouchableOpacity>
            </View>
            {details?.bid?.status === 'pending' ? (
              btnLoader ? (
                <ActivityIndicator color="#549CFF" />
              ) : (
                <>
                  <Input
                    placeholder="Remarks"
                    leftIcon={
                      <Icon
                        name="file-edit-outline"
                        type="material-community"
                      />
                    }
                    onChangeText={text => setRemark(text)}
                    placeholderTextColor={'#999'}
                    style={{color: '#000'}}
                    inputStyle={styles.inputStyle}
                    containerStyle={[styles.containerStyle, {height: 100}]}
                    inputContainerStyle={[
                      styles.inputContainerStyle,
                      {height: 100},
                    ]}
                    leftIconContainerStyle={[
                      styles.leftIconContainerStyle,
                      {height: 100},
                    ]}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: wp(6),
                    }}>
                    <TouchableOpacity
                      onPress={() => confirmBidStatus('reject')}
                      style={{
                        backgroundColor: '#EB5A46',
                        height: 50,
                        borderRadius: 10,
                        justifyContent: 'center',
                        flex: 0.47,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Lato-Bold',
                          fontSize: 15,
                          color: 'white',
                          textAlign: 'center',
                        }}>
                        Reject Bid
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => confirmBidStatus('accept')}
                      style={{
                        backgroundColor: '#549CFF',
                        height: 50,
                        borderRadius: 10,
                        justifyContent: 'center',
                        flex: 0.47,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Lato-Bold',
                          fontSize: 15,
                          color: 'white',
                          textAlign: 'center',
                        }}>
                        Accept Bid
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )
            ) : (
              <View
                style={{
                  marginBottom: 10,
                  height: 45,
                  backgroundColor:
                    details.bid.status === 'rejected' ? '#EB5A46' : '#28a745',
                  width: '80%',
                  alignSelf: 'center',
                  borderRadius: 20,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 15,
                    color: '#fff',
                    textAlign: 'center',
                  }}>
                  Bid {details.bid.status}
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 15,
    paddingLeft: 10,
    fontFamily: 'Lato-Regular',
  },
  containerStyle: {
    height: 45,
    marginVertical: 10,
    marginTop: 20,
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },
  inputContainerStyle: {
    height: 45,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#424242',
    borderRadius: 10,
    borderRightWidth: 1,
    margin: 0,
  },
  leftIconContainerStyle: {
    borderRightWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 5,
    width: 40,
    borderColor: '#424242',
  },
  label: {
    paddingLeft: '3%',
  },
});
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
  connect(mapStateToProps, mapDispatchToProps)(BidsDetailsConsignor),
);
