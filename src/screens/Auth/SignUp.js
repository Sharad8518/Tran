import {Formik} from 'formik';
import React from 'react';
import {Image, Text, View} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Yup from 'yup';
import {
  checkForAlphabets,
  specialCharacterValidator,
} from '../../utils/validators';
import SignUpForm from './SignUpForm';
const RegisterStep1Schema = Yup.object().shape({
  username: Yup.string()
    .required('This field is required')
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
    .max(30, 'Must contain less than 30 characters'),
  role: Yup.string().required('Role is required'),
  email: Yup.string().email().required('Email is required'),
  password: Yup.string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  contact: Yup.string()
    .min(10, 'Enter valid contact')
    .max(10, 'Enter valid contact')
    .required('Contact is required')
    .matches(/^\d{10}$/, 'Enter valid contact'),
});
const SignUp = props => {
  const {navigation} = props;
  return (
    <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center'}}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 30,
          justifyContent: 'space-between',
        }}
        style={{flex: 1, backgroundColor: '#fff'}}>
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
            textAlign: 'center',
          }}>
          Sign Up
        </Text>
        <Formik
          validationSchema={RegisterStep1Schema}
          component={formProps => <SignUpForm {...formProps} />}
          initialValues={{
            role: '',
            username: '',
            email: '',
            password: '',
            contact: '',
          }}
          onSubmit={data => {
            if (data.role === 'consignor') {
              navigation.navigate('ConsignorRegistration', {...data});
            } else if (data.role === 'consignee') {
              navigation.navigate('ConsigneeRegistration', {...data});
            } else {
              navigation.navigate('TransporterRegistration', {...data});
            }
          }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          style={{
            marginTop: 10,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Lato-Bold',
              color: '#424242',
              fontSize: 13,
              textAlign: 'center',
            }}>
            Already have an Account?
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default SignUp;
