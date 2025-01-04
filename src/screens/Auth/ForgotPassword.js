import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Yup from 'yup';
import {FormInput} from '../../Components/FormInput';
import {withAppToaster} from '../../redux/AppState';
import {setUserLoggedIn} from '../../redux/auth/actions';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import {ActivityIndicator} from 'react-native-paper';
import SignInForm from './SignInForm';
const ForgotPassword = props => {
  const {navigation, setToast} = props;
  const SignInSchema = Yup.object().shape({
    email: Yup.string('').email().required('Email is required'),
  });
  const [loading, setLoading] = useState(false);
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
          style={{
            fontFamily: 'Lato-Regular',
            color: '#424242',
            fontSize: 25,
          }}>
          TRAN
        </Text>
        <View style={{}}>
          <Formik
            validationSchema={SignInSchema}
            initialValues={{
              email: '',
            }}
            onSubmit={data => {
              setLoading(true);
              const email = data.email.toLowerCase();
              axios
                .post('/forgot/password', {email})
                // .post(`/forgot/password${mail}`)

                .then(async res => {
                  setLoading(false);
                  setToast({text: res.data.msg, styles: 'success'});
                })
                .catch(err => {
                  setLoading(false);
                  setToast({
                    text: 'Something went wrong. Please try again!',
                    styles: 'error',
                  });
                });
            }}>
            {({
              handleChange,
              handleSubmit,
              values,
              setFieldValue,
              errors,
              touched,
            }) => {
              return (
                <View style={{paddingHorizontal: '5%'}}>
                  <FormInput
                    onChangeText={text => setFieldValue('email', text.trim())}
                    errors={errors}
                    name="email"
                    touched={touched}
                    values={values}
                    placeholder="Email"
                    leftIcon={<Icon2 name="user" color="#424242" size={15} />}
                  />
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={{
                      marginTop: 20,
                      width: wp(80),
                      backgroundColor: '#549CFF',
                      height: 45,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 10,
                    }}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text
                        style={{
                          fontFamily: 'Lato-Bold',
                          fontSize: 15,
                          color: 'white',
                        }}>
                        Send Email
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
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
                      Login on the app
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          </Formik>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default withAppToaster(ForgotPassword);
