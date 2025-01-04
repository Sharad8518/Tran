import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {connect, useDispatch} from 'react-redux';
import ChatIcon from '../../../assets/svg/chat icon.svg';
import ScheduleIcon from '../../../assets/svg/conf schedule icon.svg';
import MakeBid from '../../../assets/svg/make bid icon.svg';
import EnquiryIcon from '../../../assets/svg/View enqu icon.svg';
import {DashboardIcon} from '../../Components/DashboardIcon';
import {withAppToaster} from '../../redux/AppState';
import {SET_TRANS_BID_ENQ_IDS} from '../../redux/enquiry/types';
import {setTransporterProfile} from '../../redux/user/actions';
import {objToArray} from '../../utils/objToArray';
import {useIsFocused} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const HomeTrans = props => {
  const {navigation, transporter, token, loading, unreadCounts} = props;
  const dispatch = useDispatch();
  const [enquiryList, setEnquiryList] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [totalChats, setTotalChats] = useState(0);
  const isFocused = useIsFocused();
  //get getEnquiryShort on focused
  useEffect(() => {
    if (isFocused) {
      getEnquiryShort();
      getBids();
    }
  }, [token, isFocused]);

  useEffect(() => {
    // getEnquiryShort();
    getBids();
    dispatch(setTransporterProfile());
  }, [token]);
  const getBids = () => {
    axios
      .get('/bid/transporter/enquiryid', {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(resp => {
        const ids = resp.data.map(e => e.enquiryId);
        dispatch({type: SET_TRANS_BID_ENQ_IDS, payload: ids});
      })
      .catch(err => {});
  };
  const getEnquiryShort = () => {
    axios
      .get('/transporter/enquiry/short', {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        const dropLocations = res.data.dropLocationInfo;
        const enqInfo = res.data.enqInfo;
        const shortList = enqInfo.map((e, i) => ({
          ...e,
          dropLocation: dropLocations[i],
        }));
        setEnquiryList(shortList.slice(0, 3));
        setLocalLoading(false);
      })
      .catch(error => {
        setLocalLoading(false);
      });
  };
  useEffect(() => {
    const conv = objToArray(unreadCounts);
    const sum = conv.map(c => c.count).reduce((a, b) => b + a, 0);
    setTotalChats(sum);
  }, [unreadCounts]);
  return (
    <View style={{flex: 1, paddingTop: Platform.OS === 'ios' ? '15%' : 0}}>
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        {/* <View
          style={{
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <Image
            resizeMode="contain"
            style={{height: hp(25), width: wp(100)}}
            source={require('../../../assets/conhome.png')}
          />
        </View> */}
        <View
          style={{height: hp(7), width: wp(100), backgroundColor: '#e6e6e6'}}>
          <LottieView
            style={{width: '100%', height: hp(7)}}
            source={require('../../../assets/truckAnimation.json')}
            autoPlay
            loop
          />
        </View>
        <View
          style={{
            backgroundColor: '#549CFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: 10,
            alignItems: 'center',
          }}>
          <View
            style={{
              height: 1,
              width: wp(30),
              backgroundColor: 'white',
              marginVertical: 15,
            }}
          />
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontSize: 20,
                  color: '#fff',
                }}>
                {transporter?.profile?.managerName}
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 13,
                  fontFamily: 'Lato-Bold',
                  textAlign: 'center',
                  paddingHorizontal: 50,
                }}>
                {transporter?.profile?.companyName}
              </Text>
            </>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              flex: 1,
              width: wp(100),
            }}>
            <Text
              onPress={() => navigation.navigate('EditProfileTrans')}
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Lato-Regular',
                textAlign: 'center',
                marginVertical: 15,
              }}>
              Edit Profile
            </Text>
            <Text
              onPress={() => navigation.navigate('ChangeRoutes')}
              style={{
                color: '#fff',
                fontSize: 12,
                fontFamily: 'Lato-Regular',
                textAlign: 'center',
                marginVertical: 15,
              }}>
              Add/Edit Routes
            </Text>
          </View>

          <View
            style={{
              width: wp(100),
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <View
              style={{
                justifyContent: 'space-evenly',
                flex: 1,
                flexDirection: 'row',
                marginVertical: 10,
              }}>
              <DashboardIcon
                label={'View \n Schedule'}
                icon={<EnquiryIcon height={25} width={25} />}
                onPress={() => navigation.navigate('ShipmentListTrans')}
              />
              <DashboardIcon
                label={'Make \n Bids'}
                icon={<MakeBid height={25} width={25} />}
                onPress={() => navigation.navigate('EnqListTran')}
              />
              <DashboardIcon
                label={'Confirm \n Schedule'}
                icon={<ScheduleIcon height={25} width={25} />}
                onPress={() => navigation.navigate('ShipmentListTrans')}
              />
              <DashboardIcon
                count={totalChats}
                label="Chat"
                icon={<ChatIcon height={25} width={25} />}
                onPress={() => navigation.navigate('ChatsList')}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: '5%',
                paddingTop: '5%',
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  color: '#549CFF',
                }}>
                Enquiry Register
              </Text>
              <Text
                onPress={() => (getBids(), navigation.navigate('EnqListTran'))}
                style={{
                  fontFamily: 'Lato-Bold',
                  color: '#757575',
                  fontSize: 11,
                }}>
                View all
              </Text>
            </View>
            <View style={{padding: '5%'}}>
              {localLoading ? (
                <ActivityIndicator />
              ) : enquiryList.length > 0 ? (
                enquiryList.map((enq, i) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        borderBottomWidth: 0.7,
                        paddingHorizontal: '5%',
                        paddingVertical: 10,
                        borderColor: '#CCCCCC',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                      key={i}>
                      <View
                        style={{
                          flex: 2,
                          backgroundColor: '#FFA654',
                          height: hp(5),
                          width: wp(9),
                          justifyContent: 'center',
                          borderRadius: 30,
                        }}>
                        <SimpleLineIcons
                          name="direction"
                          size={18}
                          color="#FFFFFF"
                          style={{alignSelf: 'center'}}
                        />
                      </View>
                      <View style={{flex: 8, paddingLeft: 10}}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Lato-Bold',
                          }}>
                          Enquiry #{enq._id}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            fontFamily: 'Lato-Bold',
                          }}>
                          Delivery Location: {enq.dropLocation.address}
                        </Text>
                        <TouchableOpacity
                          onPress={() => (
                            getBids(),
                            navigation.navigate('EnqDetailsTran', {id: enq._id})
                          )}
                          style={{
                            marginTop: hp(0.8),
                          }}>
                          <Text style={{color: '#549CFF', fontWeight: 'bold'}}>
                            View Details
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Lato-Bold',
                      textAlign: 'center',
                    }}>
                    No Enquiries founds
                  </Text>
                </View>
              )}
            </View>
            {/* <TouchableOpacity
              style={ {
                marginVertical: hp(4),
                marginLeft: wp(10),
                width: wp(80),
                backgroundColor: '#549CFF',
                height: 50,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              } }>
              <Text
                style={ {
                  fontFamily: 'Lato-Bold',
                  fontSize: 15,
                  color: 'white',
                } }>
                Buy Subscription
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const mapStateToProps = store => ({
  token: store.authReducer.token,
  transporter: store.userReducer.transporter,
  loading: store.userReducer.loading,
  firebaseUid: store.userReducer.transporter?.profile?.firebaseUid,
  unreadCounts: store.chatsReducer.unreadCounts,
});
export default withAppToaster(connect(mapStateToProps, {})(HomeTrans));
