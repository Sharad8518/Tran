import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as Yup from 'yup';
import {FormInput} from './FormInput';
import {withAppToaster} from '../redux/AppState';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import {ActivityIndicator} from 'react-native-paper';
import {connect, useDispatch} from 'react-redux';
const ChangePassword = props => {
  const {navigation, setToast, role, transporter, consignor, consignee} = props;
  const SignInSchema = Yup.object().shape({
    oldPassword: Yup.string('').required('Enter old password'),
    password: Yup.string('').required('Password is required'),
    newPassword: Yup.string('')
      .oneOf([Yup.ref('password')], 'Confirm Password must matched Password')
      .required('Confirm password'),
  });
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaProvider style={{flex: 1, backgroundColor: '#fff'}}>
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
            source={require('./../../assets/tran.png')}
          />
        </View>
        <Text
          allowFontScaling={false}
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
              oldPassword: '',
              password: '',
              newPassword: '',
            }}
            onSubmit={data => {
              setLoading(true);
              const newPassword = data.newPassword;
              const oldPassword = data.oldPassword;
              axios
                .put('/set/new/password', {oldPassword, newPassword})
                .then(async res => {
                  setLoading(false);
                  setToast({text: res.data.msg, styles: 'success'});
                  role === 'transporter'
                    ? navigation.navigate('HomeTrans')
                    : role === 'consignee'
                    ? navigation.navigate('ConsigneeHome')
                    : navigation.navigate('ConsignorHome');
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
                <View style={{paddingHorizontal: '5%', marginBottom: hp(40)}}>
                  <KeyboardAvoidingView>
                    <FormInput
                      onChangeText={handleChange('oldPassword')}
                      errors={errors}
                      name="oldPassword"
                      touched={touched}
                      values={values}
                      placeholder="Enter old Password"
                      leftIcon={<Icon2 name="user" color="#424242" size={15} />}
                    />
                    <FormInput
                      onChangeText={handleChange('password')}
                      errors={errors}
                      name="password"
                      touched={touched}
                      values={values}
                      placeholder="Enter Password"
                      leftIcon={<Icon2 name="user" color="#424242" size={15} />}
                    />
                    <FormInput
                      onChangeText={handleChange('newPassword')}
                      errors={errors}
                      name="newPassword"
                      touched={touched}
                      values={values}
                      placeholder="Confirm Password"
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
                          allowFontScaling={false}
                          style={{
                            fontFamily: 'Lato-Bold',
                            fontSize: 15,
                            color: 'white',
                          }}>
                          Change Password
                        </Text>
                      )}
                    </TouchableOpacity>
                  </KeyboardAvoidingView>
                </View>
              );
            }}
          </Formik>
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const mapStateToProps = store => ({
  role: store.authReducer.role,
  consignor: store.userReducer.consignor,
  transporter: store.userReducer.transporter,
  consignee: store.userReducer.consignee,
});
export default withAppToaster(connect(mapStateToProps, {})(ChangePassword));
