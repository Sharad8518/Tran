import {Formik} from 'formik';
import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import {connect} from 'react-redux';
import store from '../../redux/store';
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
const NewSupervisorSchema = Yup.object().shape({
  userName: Yup.string('').required('Username is required'),
  email: Yup.string('')
    .required('Email is required')
    .email('Please enter valid email'),
  contact: Yup.string()
    .min(10, 'Enter valid contact')
    .max(10, 'Enter valid contact')
    .required('Contact is required')
    .matches(/^\d{10}$/, 'Enter valid contact'),

  password: Yup.string()
    .required('No password provided.')
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
});
const EditSupervisorSchema = Yup.object().shape({
  userName: Yup.string('').required('Username is required'),
  email: Yup.string('')
    .required('Email is required')
    .email('Please enter valid email'),
  contact: Yup.string()
    .min(10, 'Enter valid contact')
    .max(10, 'Enter valid contact')
    .required('Contact is required')
    .matches(/^\d{10}$/, 'Enter valid contact'),
});
const NewSupervisor = props => {
  console.log('props', props);
  const {token, navigation, setToast, route} = props;
  const [loading, setLoading] = useState(false);
  const supervisor = route?.params?.supervisor;
  const userId = props.consignor.userId;
  const edit = route?.params?.edit ?? false;
  const editSupervisor = data => {
    setLoading(true);
    console.log('data', data);
    const payload = {
      email: data.email,
      userName: data.userName,
      contact: data.contact,
      supervisor_id: data._id.toString(),
      supervisorUserId: data.SupervisorUserId.toString(),
    };
    axios
      .post(`/supervisor/update`, payload, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        setLoading(false);
        setToast({
          text: 'supervisor details updated successfully.',
          styles: 'success',
        });
        navigation.navigate('ConsignorHome');
      })
      .catch(error => {
        setLoading(false);
        setToast({
          text: 'Something went wrong. Please try again',
          styles: 'error',
        });
      });
  };
  const newSupervisor = data => {
    setLoading(true);
    axios
      .post(
        '/register',
        {
          ...data,
          adminName: data.managerName,
          state: data.location,
          district: data.location,
          consignorId: userId.toString(),
        },
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then(res => {
        setLoading(false);
        setToast({
          text: res.data.msg,
          styles: 'success',
        });
        navigation.navigate('ConsignorHome');
      })
      .catch(error => {
        setLoading(false);
        // console.log('add Supervisor error', error);
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
        validationSchema={edit ? EditSupervisorSchema : NewSupervisorSchema}
        onSubmit={data => (edit ? editSupervisor(data) : newSupervisor(data))}
        initialValues={
          edit
            ? supervisor
            : {
                email: '',
                password: '',
                role: 'supervisor',
                contact: '',
                userName: '',
                companyName: props.consignor.companyName,
                managerName: props.consignor.adminName,
                panNumber: props.consignor.panNumber,
                gstNumber: props.consignor.gstNumber,
              }
        }
        component={formikProps => (
          <AddSupervisorForm loading={loading} edit={edit} {...formikProps} />
        )}
      />
      <View style={{marginTop: hp(5)}}></View>
    </ScrollView>
  );
};

const AddSupervisorForm = props => {
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
      {/* <FormInput
        onChangeText={handleChange('companyName')}
        errors={errors}
        name="companyName"
        touched={touched}
        values={values}
        placeholder="Company Name"
        leftIcon={
          <Icon type="font-awesome" name="building" color="#424242" size={15} />
        }
      /> */}
      {/* <FormInput
        onChangeText={handleChange('managerName')}
        errors={errors}
        name="managerName"
        touched={touched}
        values={values}
        placeholder="Admin Name"
        leftIcon={<Icon2 name="user" color="#424242" size={15} />}
      /> */}
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
      {/* <FormInput
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
      /> */}
      {/* <FormInput
        onChangeText={handleChange('address')}
        errors={errors}
        name="address"
        touched={touched}
        values={values}
        placeholder="Address"
        leftIcon={
          <Icon type="font-awesome" name="edit" color="#424242" size={15} />
        }
      /> */}
      {/* <FullScreenModalSelect
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
      /> */}
      {/* <FormInput
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
      /> */}
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
            {!edit ? 'Add Supervisor' : 'Update Details'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};
const mapStateToProps = store => ({
  token: store.authReducer.token,
  consignor: store.userReducer.consignor.profile,
  address: store.userReducer.consignor.address,
});
export default withAppToaster(connect(mapStateToProps, {})(NewSupervisor));
