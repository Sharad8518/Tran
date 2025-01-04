import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {withAppToaster} from '../../redux/AppState';

const Tran = props => {
  const {navigation} = props;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            backgroundColor: 'white',
            height: hp(40),
            width: wp(100),
            alignItems: 'center',
          }}>
          <Image
            resizeMode="contain"
            style={{height: hp(30), width: wp(80)}}
            source={require('./../../../assets/tran.png')}
          />
        </View>
        <View style={{marginHorizontal: hp(5), marginTop: hp(20)}}>
          <Text
            style={{
              color: '#424242',
              fontFamily: 'Lato-Bold',
              fontSize: 20,
              textAlign: 'center',
            }}>
            Fast, Safe & Secure Delivery
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 100}}>
          <View
            style={{
              borderBottomWidth: 2,
              borderBottomColor: '#424242',
              width: wp(3),
              marginHorizontal: 3,
            }}
          />
          <View
            style={{
              borderBottomWidth: 2,
              borderBottomColor: '#424242',
              width: wp(3),
              marginHorizontal: 3,
            }}
          />
          <View
            style={{
              borderBottomWidth: 2,
              borderBottomColor: '#424242',
              width: wp(10),
              marginHorizontal: 3,
            }}
          />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('SignIn');
            }}
            style={{
              width: wp(32),
              height: hp(7),
              backgroundColor: '#549CFF',
              marginVertical: 20,
              //   marginLeft: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              marginRight: 20,
            }}>
            <Text
              style={{fontSize: 15, color: '#fff', fontFamily: 'Lato-Bold'}}>
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              // props.setToast({ text: "testing....", styles: "success" })
              navigation.navigate('SignUp');
            }}
            style={{
              width: wp(32),
              height: hp(7),
              backgroundColor: '#fff',
              marginVertical: 20,
              marginLeft: 20,
              alignItems: 'center',
              justifyContent: 'center',
              //   marginLeft: 30,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#424242',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: '#424242',
                fontFamily: 'Lato-Bold',
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: hp(100),
  },
  text: {
    color: 'white',
    fontSize: 38,
    paddingTop: hp(10),
  },
  name: {
    height: hp(20),
    alignItems: 'center',
  },
  box: {
    width: wp(88),
    height: hp(7),
    borderWidth: 1,
    borderColor: '#fff',
    alignSelf: 'center',
    borderRadius: 5,
  },
  iconbox: {
    width: wp(15),
    height: hp(7),
    borderWidth: 1,
    borderRightColor: '#fff',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    backgroundColor: 'white',
  },
});

export default withAppToaster(Tran);
