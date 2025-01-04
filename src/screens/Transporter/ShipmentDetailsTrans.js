import database from '@react-native-firebase/database';
import axios from 'axios';
import {Formik} from 'formik';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import * as Yup from 'yup';
import {FormInput, FormInputArea} from '../../Components/FormInput';
import {databaseRefs} from '../../config/variables';
import {withAppToaster} from '../../redux/AppState';
import {setActiveChatId} from '../../redux/chat/actions';
import {DetailsRow} from './EnqDetailsTran';
import * as _ from 'lodash';
import {chatExists} from '../consignor/ShipmentDetails';
import {
  checkForAlphabets,
  notMoreThan10AnyNonAlphabeticalCharacter,
  specialCharacterValidator,
} from '../../utils/validators';
import {FullScreenModalSelect} from '../../Components/FullScreenModalSelect';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

const UpdateShipmentSchema = Yup.object().shape({
  status: Yup.string()
    .required('Please select status')
    .test(
      'special character test',
      'This field cannot contain only special characters or numbers',
      specialCharacterValidator,
    )
    .test(
      'alphabets character test',
      'This field should contain at least one alphabet',
      checkForAlphabets,
    )
    .test(
      'more special chars',
      'Cannot contain more than 10 special characters',
      notMoreThan10AnyNonAlphabeticalCharacter,
    ),
  remark: Yup.string()
    .required('Please enter remark')
    .test(
      'special character test',
      'This field cannot contain only special characters or numbers',
      specialCharacterValidator,
    )
    .test(
      'alphabets character test',
      'This field should contain at least one alphabet',
      checkForAlphabets,
    )
    .test(
      'more special chars',
      'Cannot contain more than 10 special characters',
      notMoreThan10AnyNonAlphabeticalCharacter,
    )
    .max(100, 'Must contain less than 100 characters'),
});
const DeliverShipmentSchema = Yup.object().shape({
  remark: Yup.string()
    .required('Please enter remark')
    .test(
      'special character test',
      'This field cannot contain only special characters or numbers',
      specialCharacterValidator,
    )
    .test(
      'alphabets character test',
      'This field should contain at least one alphabet',
      checkForAlphabets,
    )
    .test(
      'more special chars',
      'Cannot contain more than 10 special characters',
      notMoreThan10AnyNonAlphabeticalCharacter,
    )
    .max(100, 'Must contain less than 100 characters'),
});
const ShipmentDetailsTrans = props => {
  const {setToast, navigation, firebaseUid, transporter, setActiveChat, token} =
    props;
  const shipmentIdRoute = props?.route?.params.shipmentId;
  const shipmentId = 1;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, toggleShow] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [deliverShip, setDeliver] = useState(false);
  const [consignorChats, setConsignorChats] = useState(null); // includes details of transporter saved in firebase database
  const [consigneeChats, setConsigneeChats] = useState(null); // includes details of transporter saved in firebase database
  const isFocused = useIsFocused();
  useEffect(() => {
    axios
      .post(
        `/shipment/details`,
        {shipmentId: shipmentIdRoute},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then(res => {
        const response = res.data;
        const res_details = {
          shipment: response.shipment[0],
          enquiry: response.enquiry[0],
          transporter: response.transporter[0],
          requester: response.requester[0],
          toAddress: response.toAddress[0],
          fromAddress: response.fromAddress[0],
        };
        setDetails(res_details);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, [isFocused, token]);
  useEffect(() => {
    if (!!details) {
      const consignorId = details?.requester.firebaseUid;
      const consigneeId = details?.toAddress.firebaseUid;
      database()
        .ref(databaseRefs.users)
        .child(`${consignorId}`)
        .once('value', snap => setConsignorChats(snap.val()));
      database()
        .ref(databaseRefs.users)
        .child(`${consigneeId}`)
        .once('value', snap => setConsigneeChats(snap.val()));
    }
  }, [details]);
  const [btnLoader, setBtnLoader] = useState(false);
  const deliverShipment = remark => {
    setBtnLoader(true);
    axios
      .post('/shipment/complete', {
        shipmentId: shipmentIdRoute,
        remark,
      })
      .then(res => {
        setToast({text: 'Shipment marked as delivered', styles: 'success'});
        navigation.navigate('HomeTrans');
      })
      .catch(error => {
        setToast({
          text: 'Something went wrong. Please try again.',
          styles: 'error',
        });
      });
  };
  const chatWithConsignor = async () => {
    const toUser = {
      firebaseUid: details.requester.firebaseUid,
      ..._.omit(consignorChats, ['chats', 'presence']),
    };
    const fromUser = {
      firebaseUid,
      contact: transporter.contact,
      email: transporter.email,
      role: 'transporter',
      userName: transporter.userName,
    };
    const isChatInitiated = await chatExists(
      consignorChats.chats,
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
        details.requester.firebaseUid,
        toUser,
        firebaseUid,
        fromUser,
      );
    }
  };
  const chatWithConsignee = async () => {
    const fromUser = {
      firebaseUid,
      contact: transporter.contact,
      email: transporter.email,
      role: 'transporter',
      userName: transporter.userName,
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
                      {details?.requester?.companyName}
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
                  {/* <Text
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
                  </Text> */}
                </View>
              </View>
              <DetailsRow
                label="Pick From"
                value={`${details?.fromAddress.address}, ${details?.fromAddress.district}, ${details?.fromAddress.state}`}
              />
              <DetailsRow
                label="Deliver To"
                value={`${details?.toAddress.address}, ${details?.toAddress.state}`}
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
                    value={`₹ ${details?.enquiry?.loadingExpense}  Per MT`}
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
          <View style={{paddingHorizontal: '5%', marginVertical: 5}}>
            <Text
              style={{
                textAlign: 'center',
                color: '#FFA654',
                fontFamily: 'Lato-Bold',
                fontSize: 14,
                textTransform: 'capitalize',
              }}>
              Current Status: {details?.shipment?.tracking_status}
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Lato-Regular',
                fontSize: 14,
              }}>
              Last Updated:{' '}
              {moment(details?.shipment?.lastUpdate).format(
                'Do MMMM YYYY hh:mm A',
              )}
            </Text>
            {!!details?.shipment.delivered &&
            details.shipment.tracking_status === 'delivered' ? (
              <View
                style={{
                  marginBottom: 10,
                  height: 45,
                  backgroundColor: '#28a745',
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
                  Shipment delivered
                </Text>
              </View>
            ) : updateStatus ? (
              <Formik
                validationSchema={UpdateShipmentSchema}
                initialValues={{
                  status: '',
                  remark: '',
                }}
                component={formikProps => (
                  <UpdateShipmentForm loading={btnLoader} {...formikProps} />
                )}
                onSubmit={data => {
                  setBtnLoader(true);
                  const payload = {
                    ...data,
                    shipmentId: shipmentIdRoute,
                  };
                  axios
                    .post('/shipment/update', payload)
                    .then(res => {
                      setBtnLoader(false);
                      if (res.data.success) {
                        setToast({
                          text: 'Shipment status updated successfully!',
                          styles: 'success',
                        });
                        navigation.navigate('ShipmentListTrans');
                      } else {
                        setToast({
                          text: 'Something went wrong. Please try again later.',
                          styles: 'error',
                        });
                      }
                    })
                    .catch(error => {
                      setBtnLoader(false);
                      setToast({
                        text: 'Something went wrong. Please try again later.',
                        styles: 'error',
                      });
                      // console.log('error', error);
                    });
                }}
              />
            ) : deliverShip ? (
              <Formik
                onSubmit={data => deliverShipment(data.remark)}
                validationSchema={DeliverShipmentSchema}
                initialValues={{remark: ''}}
                component={formikProps => (
                  <DeliverShipmetForm loading={btnLoader} {...formikProps} />
                )}
              />
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                }}>
                <TouchableOpacity
                  disabled={details.shipment.tracking_status === 'Delivered'}
                  onPress={() => setDeliver(true)}
                  style={{
                    backgroundColor:
                      details.shipment.tracking_status === 'Delivered'
                        ? '#549CFF'
                        : '#28a745',
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
                    {details.shipment.tracking_status === 'Delivered'
                      ? 'Delivered'
                      : 'Mark as Delivered'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setUpdateStatus(true)}
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
                    Update Status
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <Text>Details not found</Text>
      )}
    </View>
  );
};
const DeliverShipmetForm = props => {
  const {loading, handleChange, handleSubmit, errors, values, touched} = props;

  return (
    <>
      <FormInputArea
        name="remark"
        errors={errors}
        touched={touched}
        values={values}
        placeholder="Remarks"
        leftIcon={
          <Icon
            name="playlist-edit"
            type="material-community"
            color="#424242"
            size={20}
          />
        }
        onChangeText={handleChange('remark')}
        multiline={true}
        numberOfLines={5}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: '#549CFF',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
        }}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 15,
              color: 'white',
              textAlign: 'center',
            }}>
            Mark Shipment as Delivered
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};
const statusOptions = [
  {label: 'Preparing', value: 'Preparing'},
  {label: 'In Transit', value: 'In Transit'},
  {label: 'Delivered', value: 'Delivered'},
];
const UpdateShipmentForm = props => {
  const {
    loading,
    handleChange,
    handleSubmit,
    errors,
    values,
    touched,
    setFieldValue,
  } = props;
  return (
    <>
      <FullScreenModalSelect
        value={values.status}
        items={statusOptions}
        masterArr={statusOptions}
        placeholder="Select Status"
        renderCustomComponent={false}
        searchable={false}
        leftIcon={
          <Icon
            name="update"
            type="material-community"
            color="#424242"
            size={20}
          />
        }
        onSelectItem={value => {
          setFieldValue('status', value.value);
        }}
        error={touched['status'] ? errors['status'] : ''}
      />
      <FormInputArea
        name="remark"
        errors={errors}
        touched={touched}
        values={values}
        placeholder="Remarks"
        leftIcon={
          <Icon
            name="playlist-edit"
            type="material-community"
            color="#424242"
            size={20}
          />
        }
        onChangeText={handleChange('remark')}
        multiline={true}
        numberOfLines={5}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: '#549CFF',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
        }}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 15,
              color: 'white',
              textAlign: 'center',
            }}>
            Update Status
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};
const mapStateToProps = store => ({
  token: store.authReducer.token,
  firebaseUid: store.userReducer.firebaseUid,
  chats: store.chatsReducer.chats,
  transporter: store.userReducer.transporter.profile,
});
const mapDispatchToProps = dispatch => ({
  setActiveChat: chatId => dispatch(setActiveChatId(chatId)),
});

export default withAppToaster(
  connect(mapStateToProps, mapDispatchToProps)(ShipmentDetailsTrans),
);
