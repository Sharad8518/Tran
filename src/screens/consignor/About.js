////screen 10
import React from 'react';
import {ScrollView} from 'react-native';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AboutCard from '../../Components/AboutCard';
import Line from '../../Components/Line';
import AppInfoIcon from '../../../assets/Group -3.svg';
import AppSettingIcon from '../../../assets/Group -2.svg';
import TermsIcon from '../../../assets/Group-1.svg';
import PrivacyIcon from '../../../assets/Group 226.svg';
import HelpIcon from '../../../assets/Group 225.svg';
import ChangeSecIcon from '../../../assets/Group 230.svg';
import ChangePassIcon from '../../../assets/Group 233.svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';

const About = props => {
  const {name, onBackPress, logout, role, transporter, consignor, consignee} =
    props;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1}}>
     
        <View style={{}}>
          <TouchableOpacity
            style={{paddingLeft: 10, paddingTop: 5, flex: 1}}
            onPress={() => {
              return onBackPress();
            }}>
            <Ionicons name="arrow-back" size={30} style={{}} color="#fff" />
          </TouchableOpacity>
          <View style={{width: wp(100)}}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Lato-Regular',
                alignSelf: 'center',
                // marginTop: hp(10),
              }}>
              Welcome
            </Text>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Lato-Bold',
                alignSelf: 'center',
                fontSize: 20,
              }}>
              {role === 'consignor'
                ? `${consignor?.profile?.companyName}`
                : role === 'supervisor'
                ? `${consignor?.profile?.companyName}`
                : role === 'transporter'
                ? `${transporter?.profile?.companyName}`
                : 'Consignee'}
            </Text>
          </View>
        </View>
     
      <ScrollView style={{}}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              width: wp(90),
              backgroundColor: 'white',
              // height: 400,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
              borderRadius: 20,
            }}>
            {/* <Text
              style={{
                color: 'black',
                fontFamily: 'Lato-Bold',
                // alignSelf: 'center',
                fontSize: 18,
                marginLeft: wp(4),
                marginTop: hp(1),
              }}>
              About
            </Text> */}
            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: hp(1),
                height: hp(8),
                //   backgroundColor: 'red',
                alignItems: 'center',
              }}>
              <View style={{width: wp(18)}}>
                <AppInfoIcon height={40} width={40} style={{marginLeft: 10}} />
              </View>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => Linking.openURL('https://tran.co.in')}>
                <View style={{width: wp(55)}}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginLeft: wp(3),
                      color: '#8C8C8C',
                      fontFamily: 'Lato-Bold',
                    }}>
                    App Info
                  </Text>
                </View>

                <View style={{width: wp(10)}}>
                  <AntDesign name="arrowright" size={18} color="#676767" />
                </View>
              </TouchableOpacity>
            </View> */}
            {/* <Line /> */}

            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: hp(2),
                height: hp(8),
                //   backgroundColor: 'red',
                alignItems: 'center',
              }}>
              <View style={{width: wp(18)}}>
                <AppSettingIcon
                  height={40}
                  width={40}
                  style={{marginLeft: 10}}
                />
              </View>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => Linking.openURL('https://tran.co.in')}>
                <View style={{width: wp(55)}}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginLeft: wp(3),
                      color: '#8C8C8C',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Apps Settings
                  </Text>
                </View>

                <View style={{width: wp(10)}}>
                  <AntDesign name="arrowright" size={18} color="#676767" />
                </View>
              </TouchableOpacity>
            </View> 
            <Line />
            */}

            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: hp(2),
                height: hp(8),
                //   backgroundColor: 'red',
                alignItems: 'center',
              }}>
              <View style={{width: wp(18)}}>
                <TermsIcon height={40} width={40} style={{marginLeft: 10}} />
              </View>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => Linking.openURL('https://tran.co.in/terms')}>
                <View style={{width: wp(55)}}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginLeft: wp(3),
                      color: '#8C8C8C',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Term And Agreement
                  </Text>
                </View>
                <View style={{width: wp(10)}}>
                  <AntDesign name="arrowright" size={18} color="#676767" />
                </View>
              </TouchableOpacity>
            </View>
            <Line /> */}

            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: hp(2),
                height: hp(8),
                //   backgroundColor: 'red',
                alignItems: 'center',
              }}>
              <View style={{width: wp(18)}}>
                <PrivacyIcon height={40} width={40} style={{marginLeft: 10}} />
              </View>

              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => Linking.openURL('https://tran.co.in/privacy')}>
                <View style={{width: wp(55)}}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginLeft: wp(3),
                      color: '#8C8C8C',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Privacy Policy
                  </Text>
                </View>
                <View style={{width: wp(10)}}>
                  <AntDesign name="arrowright" size={18} color="#676767" />
                </View>
              </TouchableOpacity>
            </View>
            <Line /> */}

            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: hp(2),
                height: hp(8),
                //   backgroundColor: 'red',
                alignItems: 'center',
              }}>
              <View style={{width: wp(18)}}>
                <HelpIcon height={40} width={40} style={{marginLeft: 10}} />
              </View>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => Linking.openURL('https://tran.co.in')}>
                <View style={{width: wp(55)}}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginLeft: wp(3),
                      color: '#8C8C8C',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Help Center
                  </Text>
                </View>
                <View style={{width: wp(10)}}>
                  <AntDesign name="arrowright" size={18} color="#676767" />
                </View>
              </TouchableOpacity>
            </View>
            <Line /> */}
          </View>
        </View>

        <View style={{alignItems: 'center', marginTop: 20}}>
          <View
            style={{
              width: wp(90),
              backgroundColor: 'white',
              // height: 400,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.22,
              shadowRadius: 2.22,
              elevation: 3,
              borderRadius: 20,
            }}>
            {/* <View
              style={{
                flexDirection: 'row',
                marginTop: hp(2),
                height: hp(8),
                //   backgroundColor: 'red',
                alignItems: 'center',
              }}>
              <View style={{width: wp(18)}}>
                <ChangeSecIcon
                  height={40}
                  width={40}
                  style={{marginLeft: 10}}
                />
              </View>
              <View style={{width: wp(55)}}>
                <Text
                  style={{
                    fontSize: 15,
                    marginLeft: wp(3),
                    color: '#8C8C8C',
                    fontFamily: 'Lato-Bold',
                  }}>
                  Change Security Question
                </Text>
              </View>
              <View style={{width: wp(10)}}>
                <AntDesign name="arrowright" size={18} color="#676767" />
              </View>
            </View> */}
            {/* <Line /> */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangePassword')}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(2),
                  height: hp(8),
                  //   backgroundColor: 'red',
                  alignItems: 'center',
                }}>
                <View style={{width: wp(18)}}>
                  <ChangePassIcon
                    height={40}
                    width={40}
                    style={{marginLeft: 10}}
                  />
                </View>
                <View style={{width: wp(55)}}>
                  <Text
                    style={{
                      fontSize: 15,
                      marginLeft: wp(3),
                      color: '#8C8C8C',
                      fontFamily: 'Lato-Bold',
                    }}>
                    Change Password
                  </Text>
                </View>
                <View style={{width: wp(10)}}>
                  <AntDesign name="arrowright" size={18} color="#676767" />
                </View>
              </View>
            </TouchableOpacity>
            <Line />
          </View>
        </View>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              color: '#C4C4C4',
              fontSize: 13,
            }}>
            Version 1.0.0 Copyright all reserved
          </Text>
          <TouchableOpacity
            onPress={() => {
              return logout();
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                color: '#549CFF',
                fontSize: 18,
              }}>
              LOGOUT
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = store => ({
  role: store.authReducer.role,
  consignor: store.userReducer.consignor,
  transporter: store.userReducer.transporter,
  consignee: store.userReducer.consignee,
});

export default connect(mapStateToProps, {})(About);
