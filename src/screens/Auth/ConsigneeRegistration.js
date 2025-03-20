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
import ConsigneeForm from './ConsigneeForm';
const ConsigneeSchema = Yup.object().shape({
  consignorId: Yup.string('').required('Please select Consignor'),
  companyName: Yup.string('')
    .matches(/^[a-zA-Z ]*$/, 'Must contain alphabets only')
    .required('Company Name is required'),
  adminName: Yup.string('')
    .matches(/^[a-zA-Z ]*$/, 'Must contain alphabets only')
    .required('Admin name required'),
  location: Yup.string('').required('Location is required'),
  pan: Yup.string()
    .matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Invalid PAN Number')
    .required('Pan number is required'),
  gst: Yup.string('')
    // .required('GST is required')
    .matches(
      /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/,
      'Invalid GST Number',
    ),
  address: Yup.string('').required('Address is required'),
  state: Yup.string('').required('State is required'),
  district: Yup.string('').required('District is required'),
  pincode: Yup.string('')
    .required('Pincode is required')
    .min(6, 'Please enter valid pincode')
    .max(6, 'Please enter valid pincode'),
});

const ConsigneeRegistration = withAppToaster(props => {
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
        validationSchema={ConsigneeSchema}
        component={formProps => (
          <ConsigneeForm loading={loading} {...formProps} />
        )}
        initialValues={{
          consignorId: '',
          companyName: '',
          adminName: '',
          managerName: '',
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
            email: params.email.toLowerCase(),
            password: params.password,
            consignorId:data.consignorId,
            role: params.role,
            contact: params?.contact,
            userName: params?.username,
            companyName: data.companyName,
            adminName: data.adminName,
            address: data.address,
            pincode: data.pan,
            location: data.location,
            gstNumber:data.gst,
            district:data.district,
            managerName:data.managerName,
            state:data.state,
            panNumber: data.pan
          };
          axios
            .post('/register', payload)
            .then(res => {
              console.log("data regist",res.data)
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
});

export default ConsigneeRegistration;
