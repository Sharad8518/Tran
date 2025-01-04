import axios from 'axios';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Image, Text, View} from 'react-native';
// import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Yup from 'yup';
import {withAppToaster} from '../../redux/AppState';
import {errorMessage} from '../../utils/errorMessage';
import ConsignorForm from './ConsignorForm';
const ConsignorSchema = Yup.object().shape({
  companyName: Yup.string('').required('Company Name is required'),
  adminName: Yup.string('')
    .matches(/^[a-zA-Z ]*$/, 'Must contain alphabets only')
    .required('Admin name required'),
  pan: Yup.string()
    .matches(/[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}/, 'Invalid PAN Number')
    .required('Please provide your PAN number'),
  gst: Yup.string('')
    // .required('GST is required')
    .matches(
      /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/,
      'Invalid GST Number',
    ),
  address: Yup.string('').required('Address is required'),
  location: Yup.string('').required('Location is required'),
  state: Yup.string('').required('State is required'),
  district: Yup.string('').required('District is required'),
  pincode: Yup.string('')
    .required('Pincode is required')
    .min(6, 'Please enter valid pincode')
    .max(6, 'Please enter valid pincode'),
});

const ConsignorRegistration = props => {
  const {navigation, setToast} = props;
  const [loading, setLoading] = useState(false);
  const params = props?.route?.params;
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
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
          textAlign: 'center',
        }}>
        Sign Up
      </Text>
      <Formik
        validationSchema={ConsignorSchema}
        component={formProps => (
          <ConsignorForm loading={loading} {...formProps} />
        )}
        initialValues={{
          companyName: '',
          adminName: '',
          pan: '',
          gst: '',
          address: '',
          location: '',
          district: '',
          state: '',
          pincode: '',
        }}
        onSubmit={data => {
          setLoading(true);
          const payload = {
            companyName: data.companyName,
            address: data.address,
            location: data.location,
            pincode: data.pincode,
            panNumber: data.pan,
            gstNumber: data.gst,
            district: data.district,
            state: data.state,
            adminName: data.adminName,
            userName: params?.username,
            contact: params?.contact,
            email: params.email.toLowerCase(),
            password: params.password,
            role: params.role,
          };
          axios
            .post('/register', payload)
            .then(res => {
              setLoading(false);
              if (!res.data.success) {
                setToast({
                  text: !!res.data.msg ? res.data.msg : res.data.error,
                  styles: 'error',
                });
              } else {
                setToast({
                  text: 'Registration Done! Please verify your email to continue',
                  styles: 'success',
                });
                navigation.navigate('SignIn');
              }
            })
            .catch(error => {
              setLoading(false);
              setToast({
                text: errorMessage(error).message,
                styles: 'error',
              });
            });
        }}
      />
    </ScrollView>
  );
};

export default withAppToaster(ConsignorRegistration);
