import axios from 'axios';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon3, {default as Icon4} from 'react-native-vector-icons/MaterialIcons';
import {connect, useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {withAppToaster} from '../../redux/AppState';
import {getConsignorDetails} from '../../redux/user/actions';
import {FormInput} from './../../Components/FormInput';
import {FullScreenModalSelect} from '../../Components/FullScreenModalSelect';
import store from '../../redux/store';
import {Icon} from 'react-native-elements';

const Editprofileschema = Yup.object().shape({
  companyName: Yup.string().required('Company Name is required'),
  userName: Yup.string()
    .matches(/^[a-zA-Z ]*$/, 'Must contain alphabets only')
    .required('Username is required'),
  // contactNumber: Yup.string().required(),
  panNo: Yup.string()
    .matches(
      /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/,
      'Enter Valid Pan number',
    )
    .required('Pan number is required'),
  GSTno: Yup.string('')
    // .required('Please provide your GST number')
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST Number',
    ),
});
const EditProfileConsignor = props => {
  const {navigation, consignor, address, setToast} = props;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const citiesData = store.getState()?.userReducer?.CityList;
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <ImageOverlay
        overlayAlpha={ 0.5 }
        containerStyle={ {
          height: hp(35),
          width: wp(100),
          paddingVertical: 10,
        } }
        source={ require('../../../assets/tran.png') }> */}
      {/* </ImageOverlay> */}
      <ScrollView style={{backgroundColor: '#fff'}}>
        <View style={{marginTop: 10}}>
          <Formik
            validationSchema={Editprofileschema}
            enableReinitialize={true}
            initialValues={{
              companyName: consignor.companyName,
              userName: consignor.userName,
              email: consignor.email,
              contactNumber: consignor.contact.toString(),
              panNo: consignor.panNumber,
              GSTno: consignor.gstNumber,
              address: address[0].address,
              location: address[0].location,
              district: address[0].district,
              state: address[0].state,
              pincode: address[0].pincode,
            }}
            onSubmit={data => {
              setLoading(true);
              const payload = {
                companyName: data.companyName,
                userName: data.userName,
                panNumber: data.panNo,
                gstNumber: data.GSTno,
                address: data.address,
                location: data.location,
                district: data.district,
                state: data.state,
                pincode: data.pincode,
              };
              axios
                .put('/consignor/profile', payload)
                .then(res => {
                  setLoading(false);
                  if (res.data.success) {
                    setToast({text: res.data.msg, styles: 'success'});
                    dispatch(getConsignorDetails());
                    navigation.navigate('ConsignorHome');
                  } else {
                    setToast({text: res.data.msg, styles: 'error'});
                  }
                })
                .catch(error => {
                  setToast({
                    text: 'Something went wrong. Please try again!',
                    styles: 'error',
                  });
                  setLoading(false);
                  // console.log('err', error?.response);
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
                    onChangeText={handleChange('companyName')}
                    errors={errors}
                    name="companyName"
                    touched={touched}
                    values={values}
                    placeholder="Company Name"
                    label="Company Name"
                    leftIcon={
                      <Icon4 name="business" color="#424242" size={15} />
                    }
                    containerStyle={{
                      height: 50,
                      marginVertical: 20,
                      justifyContent: 'center',
                      paddingHorizontal: 0,
                    }}
                  />
                  <FormInput
                    onChangeText={handleChange('userName')}
                    errors={errors}
                    name="userName"
                    touched={touched}
                    values={values}
                    placeholder="Username"
                    label="Username"
                    leftIcon={
                      <Icon4 name="person-outline" color="#424242" size={15} />
                    }
                    containerStyle={{
                      height: 50,
                      marginVertical: 20,
                      justifyContent: 'center',
                      paddingHorizontal: 0,
                    }}
                  />
                  <FormInput
                    onChangeText={text => setFieldValue('email', text.trim())}
                    errors={errors}
                    disabled={true}
                    name="email"
                    touched={touched}
                    values={values}
                    placeholder="Email"
                    label="Email"
                    leftIcon={<Icon4 name="email" color="#424242" size={15} />}
                    containerStyle={{
                      height: 50,
                      marginVertical: 20,
                      justifyContent: 'center',
                      paddingHorizontal: 0,
                    }}
                  />
                  {/* <FormInput
                    onChangeText={ handleChange('contactNumber') }
                    errors={ errors }
                    name="contactNumber"
                    touched={ touched }
                    values={ values }
                    placeholder="Contact Number"
                    label="Contact Number"
                    leftIcon={ <Icon4 name="edit" color="#424242" size={ 15 } /> }
                  /> */}
                  <FormInput
                    onChangeText={text => setFieldValue('panNo', text.trim())}
                    errors={errors}
                    name="panNo"
                    touched={touched}
                    values={values}
                    placeholder="Pan No."
                    label="Pan No."
                    leftIcon={<Icon3 name="edit" color="#424242" size={15} />}
                    containerStyle={{
                      height: 50,
                      marginVertical: 20,
                      justifyContent: 'center',
                      paddingHorizontal: 0,
                    }}
                  />
                  <FormInput
                    onChangeText={text => setFieldValue('GSTno', text.trim())}
                    errors={errors}
                    name="GSTno"
                    touched={touched}
                    values={values}
                    placeholder="GST No."
                    label="GST No."
                    leftIcon={<Icon3 name="edit" color="#424242" size={15} />}
                    containerStyle={{
                      height: 50,
                      marginVertical: 20,
                      justifyContent: 'center',
                      paddingHorizontal: 0,
                    }}
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
                    onChangeText={handleChange('state')}
                    errors={errors}
                    name="state"
                    touched={touched}
                    values={values}
                    placeholder="State"
                    leftIcon={
                      <Icon
                        type="entypo"
                        name="location-pin"
                        color="#424242"
                        size={15}
                      />
                    }
                  />
                  <FormInput
                    onChangeText={handleChange('district')}
                    errors={errors}
                    name="district"
                    touched={touched}
                    values={values}
                    placeholder="District"
                    leftIcon={
                      <Icon
                        type="entypo"
                        name="location-pin"
                        color="#424242"
                        size={15}
                      />
                    }
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
                      <Icon
                        type="entypo"
                        name="location-pin"
                        color="#424242"
                        size={15}
                      />
                    }
                  />
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmit}
                    style={{
                      marginVertical: 20,
                      backgroundColor: '#549CFF',
                      height: 45,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
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
                        Update
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            }}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const mapStateToProps = store => ({
  consignor: store.userReducer.consignor.profile,
  address: store.userReducer.consignor.address,
});
export default withAppToaster(
  connect(mapStateToProps, {})(EditProfileConsignor),
);
