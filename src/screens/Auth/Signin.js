import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View, Alert} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {withAppToaster} from '../../redux/AppState';
import {setUserLoggedIn} from '../../redux/auth/actions';
import SignInForm from './SignInForm';
import messaging from '@react-native-firebase/messaging';
import {setCityList} from '../../redux/user/actions';

const Signin = props => {
  const {navigation, setToast} = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const SignInSchema = Yup.object().shape({
    username: Yup.string('').required('Username is required'),
    password: Yup.string()
      .required('No password provided.')
      .min(8, 'Password is too short - should be 8 chars minimum.')
      .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  });
  const resendVerification = email => {
    Alert.alert(
      'Verify your account before login!',
      'Do you want resend Verification email  ',
      [
        {
          text: 'no',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'yes',
          onPress: () => {
            // setLoading(true);
            axios
              .post('/resend', {
                email: email,
              })
              .then(res => {
                setToast({
                  text: 'Resend mail on your email please verify your email',
                  styles: 'success',
                });
              })
              .catch(err => {
                setLoading(false);
              });
          },
        },
      ],
    );
  };
  const onAppBootstrap = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    if (fcmToken !== token) {
      // Save the token
      getCites();
      await postToApi(token);
    }
  };
  const postToApi = async fcmToken => {
    const token = await AsyncStorage.getItem('token');
    if (!!token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .post(`/user/fcmtoken`, {token: fcmToken})
        .then(async res => {
          await AsyncStorage.setItem('fcmToken', fcmToken);
        })
        .catch(err => {});
    }
  };
  const getCites = async () => {
    axios
      .get(`/city/name`)
      .then(async res => {
        const cityList = res.data ?? [];
        dispatch(setCityList(cityList));
      })
      .catch(err => {});
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View
          style={{
            backgroundColor: 'white',
            height: hp(30),
            width: wp(100),
            alignItems: 'center',
          }}>
          <Image
            resizeMode="contain"
            style={{height: hp(30), width: wp(80)}}
            source={require('./../../../assets/tran.png')}
          />
        </View>
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Lato-Regular',
            color: '#424242',
            fontSize: 25,
          }}>
          Sign In
        </Text>
        <View style={{}}>
          <Formik
            validationSchema={SignInSchema}
            component={formProps => (
              <SignInForm loading={loading} {...formProps} />
            )}
            initialValues={{
              username: '',
              password: '',
            }}
            onSubmit={data => {
              setLoading(true);
              axios
                .post('/login', {
                  email: data.username.toLowerCase(),
                  password: data.password,
                })
                .then(async res => {
                  setLoading(false);
                  if (!!res.data.access_token) {
                    await AsyncStorage.setItem('token', res.data.access_token);
                    await AsyncStorage.setItem('role', res.data.role);
                    axios.defaults.headers.common[
                      'Authorization'
                    ] = `Bearer ${res.data.access_token}`;
                    onAppBootstrap();
                    auth()
                      .signInAnonymously()
                      .then(firebaseResp => {
                        dispatch(
                          setUserLoggedIn(res.data.access_token, res.data.role),
                        );
                      });
                  } else {
                    setToast({text: res.data.message, styles: 'error'});
                    if (
                      res.data.message === 'Verify your account before login!'
                    ) {
                      resendVerification(data.username.toLowerCase());
                    }
                  }
                })
                .catch(err => {
                  setLoading(false);
                  // console.log('err', err);
                });
            }}
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={{marginTop: 10}}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Lato-Regular',
                color: '#424242',
                fontSize: 13,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={{marginTop: 10}}>
            <Text
              allowFontScaling={false}
              style={{
                fontFamily: 'Lato-Regular',
                color: '#424242',
                fontSize: 13,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Create New Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default withAppToaster(Signin);
