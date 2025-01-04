import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {connect, useDispatch} from 'react-redux';
import ChatIcon from '../../../assets/svg/chat icon.svg';
import ScheduleIcon from '../../../assets/svg/conf schedule icon.svg';
import EnquiryIcon from '../../../assets/svg/View enqu icon.svg';
import {DashboardIcon} from '../../Components/DashboardIcon';
import {getConsigneeProfile} from '../../redux/user/actions';
import {useIsFocused} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
const ConsigneeHome = props => {
  const [loading, setLoading] = useState(true);
  const [enquiryList, setEnquiryList] = useState([]);
  const {navigation, consignee} = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  //get getEnquiryShort on focused
  useEffect(() => {
    if (isFocused) {
      getEnquiryShort();
    }
  }, [props.token, isFocused]);
  useEffect(() => {
    dispatch(getConsigneeProfile());
    // getEnquiryShort();
  }, [props.token]);
  const getEnquiryShort = () => {
    axios
      .get('/consignee/enquiry/details', {
        headers: {Authorization: `Bearer ${props.token}`},
      })
      .then(res => {
        setLoading(false);
        if (!!res.data) {
          const enquiries = res.data.enquiries.map((e, i) => {
            return {
              ...e,
              addr: res.data.consignorAddressList[i],
              enq: res.data.enquiries[i],
            };
          });
          setEnquiryList(enquiries.slice(0, 3));
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        // console.log('error', error);
      });
  };

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1}}>
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        {/* <View
          style={{
            alignContent: 'center',
            justifyContent: 'center',
            // marginTop: hp(7),
          }}>
          <Image
            resizeMode="contain"
            style={{height: hp(25), width: wp(100), marginTop: hp(0)}}
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
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}>
            <ActivityIndicator color="#549CFF" />
          </View>
        ) : (
          <View style={{backgroundColor: '#fff'}}>
            <View
              style={{
                backgroundColor: '#549CFF',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                marginTop: 10,
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: 1,
                  backgroundColor: 'white',
                  marginVertical: 15,
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  fontFamily: 'Lato-Medium',
                  fontSize: 20,
                  color: '#fff',
                  textAlign: 'center',
                }}>
                {consignee?.profile?.companyName}
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 13,
                  fontFamily: 'Lato-Regular',
                  textAlign: 'center',
                  paddingHorizontal: 50,
                }}>
                {consignee?.profile?.address}
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10,
                  justifyContent: 'center',
                }}
                onPress={() => navigation.navigate('EditProfileConsignee')}>
                <Icon name="edit" size={12} color="#fff" />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    fontFamily: 'Lato-Regular',
                    textAlign: 'center',
                    marginLeft: 3,
                    // marginVertical: 15,
                  }}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: 'white',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: 10,
                    justifyContent: 'space-evenly',
                    flex: 1,
                  }}>
                  <DashboardIcon
                    label={'View \n Enquiries'}
                    icon={<EnquiryIcon height={25} width={25} />}
                    onPress={() => navigation.navigate('ViewEnquiries')}
                  />
                  <DashboardIcon
                    label={'View \n Shipments'}
                    icon={<ScheduleIcon height={25} width={25} />}
                    onPress={() => navigation.navigate('ShipmentListConsignee')}
                  />
                  <DashboardIcon
                    label="Chat"
                    icon={<ChatIcon height={25} width={25} />}
                    onPress={() => navigation.navigate('ChatsList')}
                  />
                </View>
                {loading ? (
                  <View
                    style={{
                      width: wp(100),
                      flex: 1,
                      justifyContent: 'center',
                      height: hp(51),
                      backgroundColor: '#fff',
                    }}>
                    <ActivityIndicator color="#549CFF" />
                  </View>
                ) : enquiryList.length > 0 ? (
                  enquiryList.map((enq, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={1}
                        style={{
                          borderBottomWidth: 0.7,
                          paddingHorizontal: '5%',
                          paddingVertical: 10,
                          borderColor: '#CCCCCC',
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            flex: 2,
                            backgroundColor: '#FFA654',
                            height: hp(5),
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
                        <View style={{flex: 8, paddingHorizontal: '5%'}}>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Lato-Bold',
                            }}>
                            Enquiry: #{enq.enq._id}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              fontFamily: 'Lato-Regular',
                              marginVertical: 2,
                            }}>
                            Address: {enq.addr.address}
                          </Text>
                          <Text
                            style={{
                              marginVertical: 2,
                              fontSize: 14,
                              fontFamily: 'Lato-Regular',
                              textTransform: 'capitalize',
                            }}>
                            Loading Time:{'  '}
                            {moment(enq.enq.loadingTime).format(
                              'Do MMMM YYYY HH:mm A',
                            )}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('EnquiryDetailsConsignee', {
                                enqId: enq._id,
                                item: enq,
                              })
                            }
                            style={{
                              marginTop: hp(0.8),
                            }}>
                            <Text
                              style={{color: '#549CFF', fontWeight: 'bold'}}>
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
                      No Shipments founds
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = store => ({
  token: store.authReducer.token,
  consignee: store.userReducer.consignee,
});
export default connect(mapStateToProps, {})(ConsigneeHome);
