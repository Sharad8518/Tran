import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect, useDispatch} from 'react-redux';
import ChatIcon from '../../../assets/svg/chat icon.svg';
import ScheduleIcon from '../../../assets/svg/conf schedule icon.svg';
import EnquiryIcon from '../../../assets/svg/View enqu icon.svg';
import {DashboardIcon} from '../../Components/DashboardIcon';
import ShipmentCardConsignee from '../../Components/ShipmentCardConsignee';
import {getConsignorDetails} from '../../redux/user/actions';
import {useIsFocused} from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const ConsignorHome = props => {
  const {navigation, consignor, loader, role, unreadCounts} = props;
  const [enquiryList, setEnquiryList] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  //get getEnquiryShort on focused
  useEffect(() => {
    if (isFocused) {
      getEnquiryShort();
    }
  }, [props.token, isFocused]);
  useEffect(() => {
    dispatch(getConsignorDetails());
    // getEnquiryShort();
  }, [props.token]);
  const getEnquiryShort = () => {
    axios
      .get('/enquiry', {headers: {Authorization: `Bearer ${props.token}`}})
      .then(res => {
        if (!!res.data) {
          const enquiries = res.data.enquiriesList.map((e, i) => {
            return {
              ...e,
              from: res.data.fromEnq[i],
              to: res.data.toEnq[i],
            };
          });
          setEnquiryList(enquiries.slice(0, 3));
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(error => {
        // console.log('error', error);
        setLoading(false);
      });
  };

  const deleteEnq = id => {
    axios
      .post(
        '/enquiry/single/delete',
        {enquiry_id: id},
        {headers: {Authorization: `Bearer ${props.token}`}},
      )
      .then(res => {
        getEnquiryShort();
      })
      .catch(error => {
        //  console.log('consignor enquiry', error);
      });
  };
  const defaultAddress = consignor?.address.find(a => a.isDefault);
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
          {loader ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontSize: 20,
                  color: '#fff',
                }}>
                {consignor?.profile?.companyName}
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontSize: 16,
                  color: '#fff',
                }}>
                {consignor?.profile?.adminName}
              </Text>
              {/* Removed address */}
              {/* <Text
                style={{
                  color: '#fff',
                  fontSize: 13,
                  fontFamily: 'Lato-Bold',
                  textAlign: 'center',
                  paddingHorizontal: 50,
                }}>
                {`${defaultAddress?.address}, ${defaultAddress?.location}, ${defaultAddress?.district}, ${defaultAddress?.state}`}
              </Text> */}
            </>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              flex: 1,
              width: wp(100),
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfileConsignor')}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 12,
                  fontFamily: 'Lato-Regular',
                  textAlign: 'center',
                  marginVertical: 15,
                }}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={ () => navigation.navigate('ConsignorAddressList') }>
              <Text
                style={ {
                  color: '#fff',
                  fontSize: 12,
                  fontFamily: 'Lato-Regular',
                  textAlign: 'center',
                  marginVertical: 15,
                } }>
                Add/Edit Address
              </Text>
            </TouchableOpacity> */}
          </View>

          <View
            style={{
              width: wp(100),
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{
                justifyContent: 'space-evenly',
                flex: 1,
              }}
              style={{
                flexDirection: 'row',
                // flex: 1,
                marginVertical: 10,
              }}>
              <DashboardIcon
                label={'Post \n Enquiry'}
                icon={<EnquiryIcon height={25} width={25} />}
                onPress={() => navigation.navigate('NewBooking')}
              />
              <DashboardIcon
                label={'Confirm \n Schedule'}
                icon={<ScheduleIcon height={25} width={25} />}
                onPress={() => navigation.navigate('ShipmentList')}
              />
              <DashboardIcon
                label="Chat"
                icon={<ChatIcon height={25} width={25} />}
                onPress={() => navigation.navigate('ChatsList')}
              />
              <DashboardIcon
                label={'Consignee \n List'}
                icon={
                  <Icon name="list-circle" type="ionicon" color="#549CFF" />
                }
                onPress={() => navigation.navigate('ConsigneeList')}
              />
            </ScrollView>
            <View>
              <View style={{flexDirection: 'row'}}>
                {role === 'consignor' && (
                  <DashboardIcon
                    label={'Supervisor \n List'}
                    icon={
                      <Icon name="list-circle" type="ionicon" color="#549CFF" />
                    }
                    onPress={() => navigation.navigate('SupervisorList')}
                  />
                )}
                {role === 'consignor' && (
                  <DashboardIcon
                    label={'Transporter \n List'}
                    icon={
                      <Icon name="list-circle" type="ionicon" color="#549CFF" />
                    }
                    onPress={() => navigation.navigate('TransporterList')}
                  />
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '5%',
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  color: '#549CFF',
                }}>
                Enquiry Register
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('EnqListConsignor');
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    color: '#757575',
                    fontSize: 11,
                  }}>
                  View all
                </Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  height: hp(51),
                  backgroundColor: '#fff',
                }}>
                <ActivityIndicator color="#549CFF" />
              </View>
            ) : (
              <View style={{}}>
                {enquiryList.length > 0 ? (
                  enquiryList.map(enq => {
                    return (
                      <ShipmentCardConsignee
                        item={enq}
                        nav={navigation}
                        key={enq._id}
                        deleteEnq={deleteEnq}
                      />
                    );
                  })
                ) : (
                  <View style={{paddingHorizontal: 20}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: 'Lato-Bold',
                        textAlign: 'center',
                      }}>
                      No Enquiries added
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('NewBooking')}
                      activeOpacity={0.8}
                      style={{
                        marginTop: 10,
                        backgroundColor: '#549CFF',
                        height: 45,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Lato-Bold',
                          fontSize: 15,
                          color: 'white',
                        }}>
                        Add New Enquiry
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const mapStateToProps = store => ({
  token: store.authReducer.token,
  role: store.authReducer.role,
  consignor: store.userReducer.consignor,
  loader: store.userReducer.loading,
  unreadCounts: store.chatsReducer.unreadCounts,
});
export default connect(mapStateToProps, {})(ConsignorHome);
