import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import React, {useEffect} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {ROLE, TOKEN} from '../config/variables';
import {setUserLoggedIn, setUserLoggedOut} from '../redux/auth/actions';
import auth from '@react-native-firebase/auth';
import {errorMessage} from '../utils/errorMessage';
import {withAppToaster} from '../redux/AppState';
import messaging from '@react-native-firebase/messaging';
import {setCityList} from '../redux/user/actions';
const window = Dimensions.get('window');
export const Splash = withAppToaster(props => {
  const {setToast} = props;
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      getCites();
      checkSession();
    }, 1000);
    onAppBootstrap();
  }, []);
  const checkSession = async () => {
    const token = await AsyncStorage.getItem(TOKEN);
    const role = await AsyncStorage.getItem(ROLE);
    if (!!token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios
        .get(`/${role}/account`, {timeout: 10000})
        .then(res => {
          auth()
            .signInAnonymously()
            .then(firebaseResp => {
              dispatch(setUserLoggedIn(token, role));
            });
        })
        .catch(err => {
          const error = errorMessage(err);
          if (error.status === 401) {
            dispatch(setUserLoggedOut());
          } else if (error.status === 500) {
            // network error , show toast
            setToast({
              text: 'Network error. Please check your internet connection.',
            });
            dispatch(setUserLoggedOut());
          } else {
            dispatch(setUserLoggedOut());
            // auth().signInAnonymously().then(firebaseResp => {
            //   dispatch(setUserLoggedIn(token, role))
            // })
          }
        });
    } else {
      dispatch(setUserLoggedOut());
    }
  };
  const onAppBootstrap = async () => {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    const fcmToken = await AsyncStorage.getItem('fcmToken');
    if (fcmToken !== token) {
      // Save the token
      await postToApi(token);
    }
  };

  const postToApi = async fcmToken => {
    const token = await AsyncStorage.getItem(TOKEN);
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
    <SafeAreaView style={{flex: 1, backgroundColor: '#fafafa'}}>
      <View
        style={{flex: 1, backgroundColor: '#fafafa', justifyContent: 'center'}}>
        <Text
          style={{
            fontFamily: 'Lato-Regular',
            fontSize: 40,
            color: '#549CFF',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10,
          }}>
          TRAN
        </Text>
        <LottieView
          style={{width: '100%', height: window.width * 0.3}}
          autoSize={true}
          source={require('../../assets/truckAnimation.json')}
          autoPlay
          loop
        />
      </View>
    </SafeAreaView>
  );
});
