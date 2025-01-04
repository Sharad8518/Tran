import {Formik} from 'formik';
import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import {connect} from 'react-redux';
import {FormInput} from '../../Components/FormInput';
import {FullScreenModalSelect} from '../../Components/FullScreenModalSelect';
import {withAppToaster} from '../../redux/AppState';
import * as Yup from 'yup';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ActivityIndicator} from 'react-native-paper';
import store from '../../redux/store';

const NewConsigneeSchema = Yup.object().shape({
  companyName: Yup.string('').required('Company Name is required'),
  managerName: Yup.string('')
    .matches(/^[a-zA-Z ]*$/, 'Must contain alphabets only')
    .required('Admin Name is required'),
  userName: Yup.string('').required('Username is required'),
  email: Yup.string('')
    .required('Email is required')
    .email('Please enter valid email'),
  contact: Yup.string()
    .min(10, 'Enter valid contact')
    .max(10, 'Enter valid contact')
    .required('Contact is required')
    .matches(/^\d{10}$/, 'Enter valid contact'),
  panNumber: Yup.string()
    .matches(
      /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
      'Enter Valid Pan number',
    )
    .required('Pan number is required'),
  gstNumber: Yup.string('')
    // .required('Please provide your GST number')
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST Number',
    ),
  address: Yup.string('').required('Address is required'),
  location: Yup.string('').required('Location is required'),
  pincode: Yup.string('').required('Location is required'),
  password: Yup.string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
});
const EditConsigneeSchema = Yup.object().shape({
  companyName: Yup.string('').required('Company Name is required'),
  managerName: Yup.string('')
    .matches(/^[a-zA-Z ]*$/, 'Must contain alphabets only')
    .required('Admin Name is required'),
  userName: Yup.string('').required('Username is required'),
  email: Yup.string('')
    .required('Email is required')
    .email('Please enter valid email'),
  contact: Yup.string()
    .min(10, 'Enter valid contact')
    .max(10, 'Enter valid contact')
    .required('Contact is required')
    .matches(/^\d{10}$/, 'Enter valid contact'),
  panNumber: Yup.string()
    .matches(
      /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
      'Enter Valid Pan number',
    )
    .required('Pan number is required'),
  gstNumber: Yup.string('')
    .required('Please provide your GST number')
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST Number',
    ),
  address: Yup.string('').required('Address is required'),
  location: Yup.string('').required('Location is required'),
  pincode: Yup.string('').required('Location is required'),
});
const NewConsignee = props => {
  const {token, navigation, setToast, route} = props;
  const [loading, setLoading] = useState(false);
  const consignee = route?.params?.consignee;
  const edit = route?.params?.edit ?? false;
  const editConsignee = data => {
    setLoading(true);
    const payload = {
      ...data,
      adminName: data.managerName,
      state: data.location,
      district: data.location,
    };
    axios
      .put(`/consignee/${data._id}`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        setLoading(false);
        setToast({
          text: 'Consignee details updated successfully.',
          styles: 'success',
        });
        navigation.navigate('ConsignorHome');
      })
      .catch(error => {
        setLoading(false);
        // console.log('add consignee error', error);
        setToast({
          text: 'Something went wrong. Please try again',
          styles: 'error',
        });
      });
  };
  const newConsignee = data => {
    setLoading(true);
    axios
      .post(
        '/consignee/new',
        {
          ...data,
          adminName: data.managerName,
          state: data.location,
          district: data.location,
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then(res => {
        setLoading(false);
        setToast({
          text: 'Consignee added successfully, Please verify your email to continue.',
          styles: 'success',
        });
        navigation.navigate('ConsignorHome');
      })
      .catch(error => {
        setLoading(false);
        // console.log('add consignee error', error);
        setToast({
          text: 'Something went wrong. Please try again',
          styles: 'error',
        });
      });
  };
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: '5%',
        paddingTop: Platform.OS === 'ios' ? '15%' : 20,
      }}>
      <Formik
        validationSchema={edit ? EditConsigneeSchema : NewConsigneeSchema}
        onSubmit={data => (edit ? editConsignee(data) : newConsignee(data))}
        initialValues={
          edit
            ? consignee
            : {
                email: '',
                password: '',
                role: 'consignee',
                contact: '',
                userName: '',
                companyName: '',
                managerName: '',
                address: '',
                pincode: '',
                location: '',
                panNumber: '',
                gstNumber: '',
              }
        }
        component={formikProps => (
          <AddConsigneeForm loading={loading} edit={edit} {...formikProps} />
        )}
      />
      <View style={{marginTop: hp(5)}}></View>
    </ScrollView>
  );
};

const AddConsigneeForm = props => {
  const {
    errors,
    values,
    touched,
    handleChange,
    setFieldValue,
    handleSubmit,
    edit,
    loading,
  } = props;
  const citiesData = store.getState()?.userReducer?.CityList;
  const [showPassword, togglePassword] = useState(false);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always">
      <FormInput
        onChangeText={handleChange('companyName')}
        errors={errors}
        name="companyName"
        touched={touched}
        values={values}
        placeholder="Company Name"
        leftIcon={
          <Icon type="font-awesome" name="building" color="#424242" size={15} />
        }
      />
      <FormInput
        onChangeText={handleChange('managerName')}
        errors={errors}
        name="managerName"
        touched={touched}
        values={values}
        placeholder="Admin Name"
        leftIcon={<Icon2 name="user" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={handleChange('userName')}
        errors={errors}
        name="userName"
        touched={touched}
        values={values}
        placeholder="Username"
        leftIcon={<Icon2 name="user" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={text => setFieldValue('email', text.trim())}
        errors={errors}
        name="email"
        disabled={edit}
        touched={touched}
        values={values}
        placeholder="Email"
        leftIcon={<Icon name="email" color="#424242" size={15} />}
      />
      {!edit && (
        <FormInput
          onChangeText={handleChange('password')}
          secureTextEntry={!showPassword}
          errors={errors}
          name="password"
          touched={touched}
          values={values}
          placeholder="Password"
          leftIcon={
            <Icon type="entypo" name="lock" color="#424242" size={15} />
          }
          rightIcon={
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => togglePassword(!showPassword)}>
              {showPassword ? (
                <Icon name="eye-off" type="ionicon" color="#424242" size={15} />
              ) : (
                <Icon name="eye" type="ionicon" color="#424242" size={15} />
              )}
            </TouchableOpacity>
          }
        />
      )}

      <FormInput
        onChangeText={handleChange('contact')}
        errors={errors}
        name="contact"
        touched={touched}
        values={values}
        placeholder="Contact"
        leftIcon={<Icon type="ionicon" name="call" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={text => setFieldValue('panNumber', text.trim())}
        errors={errors}
        name="panNumber"
        touched={touched}
        values={values}
        placeholder="Pan No."
        leftIcon={<Icon name="email" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={text => setFieldValue('gstNumber', text.trim())}
        errors={errors}
        name="gstNumber"
        touched={touched}
        values={values}
        placeholder="GST No."
        leftIcon={<Icon name="email" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={handleChange('address')}
        errors={errors}
        name="address"
        touched={touched}
        values={values}
        placeholder="Address"
        leftIcon={
          <Icon type="font-awesome" name="edit" color="#424242" size={15} />
        }
      />
      <FullScreenModalSelect
        value={values['location']}
        onSelectItem={value => {
          setFieldValue('location', value.value);
        }}
        items={citiesData}
        masterArr={citiesData}
        disabled={false}
        placeholder="City"
        leftIcon={
          <Icon
            style={{alignSelf: 'center'}}
            name="map-signs"
            type="font-awesome"
            color="#424242"
            size={15}
          />
        }
        error={touched?.['location'] ? errors?.['location'] : ''}
      />
      <FormInput
        onChangeText={handleChange('pincode')}
        errors={errors}
        name="pincode"
        touched={touched}
        values={values}
        keyboardType="numeric"
        placeholder="Pincode"
        leftIcon={
          <Icon type="entypo" name="location-pin" color="#424242" size={15} />
        }
      />
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: '#549CFF',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
        }}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 15,
              color: 'white',
            }}>
            {!edit ? 'Add Consignee' : 'Update Details'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};
const mapStateToProps = store => ({
  token: store.authReducer.token,
});
export default withAppToaster(connect(mapStateToProps, {})(NewConsignee));
