import axios from 'axios';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {Image, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import * as Yup from 'yup';
import {withAppToaster} from '../../redux/AppState';
import {errorMessage} from '../../utils/errorMessage';
import TransporterForm from './TransporterForm';
const TransporterSchema = Yup.object().shape({
  companyName: Yup.string('').required('Company Name is required'),
  adminName: Yup.string('')
    .matches(/^[a-zA-Z ]*$/, 'Must contain alphabets only')
    .required('Admin name required'),
  managerName: Yup.string('')
    .matches(/^[a-zA-Z ]*$/, 'Must contain alphabets only')
    .required('Manager name required'),
  pan: Yup.string()
    .matches(/[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}/, 'Invalid PAN Number')
    .required('Pan number is required'),
  gst: Yup.string('')
    // .required('GST is required')
    .matches(
      /^[0-9]{2}[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}[1-9A-Za-z]{1}Z[0-9A-Za-z]{1}$/,
      'Invalid GST Number',
    ),
  address: Yup.string('').required('Address is required'),
  pincode: Yup.string('')
    .required('Pincode is required')
    .min(6, 'Please enter valid pincode')
    .max(6, 'Please enter valid pincode'),
  routes: Yup.array().of(
    Yup.object().shape({
      from: Yup.string().required('Please select from district'),
      to: Yup.string()
        .required('Please select to district')
        .when('from', (value, schema) => {
          return schema.test('', 'From and To District cannot be same', to => {
            return value !== to;
          });
        }),
    }),
  ),
});

const TransporterRegistration = props => {
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
        validationSchema={TransporterSchema}
        validateOnBlur={false}
        validateOnChange={false}
        component={formProps => (
          <TransporterForm
            setToast={setToast}
            loading={loading}
            {...formProps}
          />
        )}
        initialValues={{
          companyName: '',
          adminName: '',
          managerName: '',
          pan: '',
          gst: '',
          truckCount: '',
          address: '',
          pincode: '',
          routes: [{from: '', to: ''}],
        }}


       onSubmit={data => {
  setLoading(true);
  
  // Prepare transporterRoutes correctly
  const transporterRoutes = data.routes.map(t => ({
    toAddress: t.to,
    fromAddress: t.from,
  }));

  const payload = {
    email: params.email.toLowerCase(),
    password: params.password,
    role: params.role,
    contact: params?.contact,
    userName: params?.username,
    companyName: data.companyName,
    adminName: data.adminName,
    address: data.address,
    pincode: data.pincode,
    location: "NA",
    gstNumber: data.gst,
    district: data.district,
    managerName: data.managerName,
    truckCount: data.truckCount,
    state: data.state,
    panNumber: data.pan
  };

  axios
    .post('/users/register', payload)
    .then(res => {
      setLoading(false);
      console.log('Register response:', res.data);

      if (res.data.success) {
        const token = res.data.accessToken;
        console.log("token",token)
        axios
          .post(
            'transporter/routes/add',
            {transporterRoutes},  // ✅ Pass array directly
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then(resp => {
            console.log('Add route response:', resp.data);
            setToast({
              text: 'Registration Done! Please verify your email to continue',
              styles: 'success',
            });
             navigation.navigate('SignIn');
          })
          .catch(error => {
            setToast({
              text: 'Registration Done! Add Routes after login.',
              styles: 'success',
            });
             navigation.navigate('SignIn');
          });

      } else {
        setToast({
          text: res.data.msg || res.data.error,
          styles: 'error',
        });
      }
    })
    .catch(error => {
      setLoading(false);
      setToast({
        text: 'Registration failed. Please try again.',
        styles: 'error',
      });
    });
}}
      />
    </ScrollView>
  );
};

export default withAppToaster(TransporterRegistration);
