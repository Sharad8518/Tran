import axios from 'axios';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon3, {default as Icon4} from 'react-native-vector-icons/MaterialIcons';
import {connect, useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {setTransporterProfile} from '../../redux/user/actions';
import {FormInput} from './../../Components/FormInput';
import {withAppToaster} from '../../redux/AppState';
import {ActivityIndicator} from 'react-native-paper';

const editprofileschema = Yup.object().shape({
  companyName: Yup.string().required('Company Name is required'),
  userName: Yup.string().required('Username is required'),
  address: Yup.string().required(),
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
  truckCount: Yup.string().required(),
});

const EditProfileTrans = props => {
  const {navigation, name, onBackPress, transporter, setToast} = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{backgroundColor: '#fff'}}>
        <View style={{marginTop: 10}}>
          <Formik
            validationSchema={editprofileschema}
            enableReinitialize={true}
            initialValues={{
              companyName: transporter.companyName,
              userName: transporter.userName,
              address: transporter.address,
              panNo: transporter.panNumber,
              GSTno: transporter.gstNumber,
              truckCount: transporter.truckCount.toString(),
            }}
            onSubmit={data => {
              setLoading(true);
              const payload = {
                companyName: data.companyName,
                userName: data.userName,
                address: data.address,
                truckCount: data.truckCount,
                panNumber: data.panNo,
                gstNumber: data.GSTno,
              };
              axios
                .put('/transporter/profile', payload)
                .then(res => {
                  setLoading(false);
                  if (res.data.success) {
                    setToast({text: res.data.msg, styles: 'success'});
                    dispatch(setTransporterProfile());
                    navigation.navigate('HomeTrans');
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
                  // console.log('error edit profile trans', error?.response);
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
                    leftIcon={<Icon4 name="edit" color="#424242" size={15} />}
                    containerStyle={{
                      height: 50,
                      marginVertical: 20,
                      // marginTop: 10,
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
                      // marginTop: 10,
                      justifyContent: 'center',
                      paddingHorizontal: 0,
                    }}
                  />
                  <FormInput
                    onChangeText={handleChange('address')}
                    errors={errors}
                    name="address"
                    touched={touched}
                    values={values}
                    placeholder="Address"
                    label="Address"
                    leftIcon={<Icon4 name="edit" color="#424242" size={15} />}
                    containerStyle={{
                      height: 50,
                      marginVertical: 20,
                      // marginTop: 10,
                      justifyContent: 'center',
                      paddingHorizontal: 0,
                    }}
                  />
                  <FormInput
                    onChangeText={handleChange('truckCount')}
                    errors={errors}
                    name="truckCount"
                    touched={touched}
                    values={values}
                    placeholder="Truck Count"
                    label="Truck Count"
                    leftIcon={<Icon4 name="edit" color="#424242" size={15} />}
                    containerStyle={{
                      height: 50,
                      marginVertical: 20,
                      // marginTop: 10,
                      justifyContent: 'center',
                      paddingHorizontal: 0,
                    }}
                  />
                  <FormInput
                    onChangeText={text => setFieldValue('panNo', text.trim())}
                    errors={errors}
                    name="panNo"
                    touched={touched}
                    values={values}
                    placeholder="Pan No."
                    label="Pan No."
                    leftIcon={<Icon3 name="email" color="#424242" size={15} />}
                    containerStyle={{
                      height: 50,
                      marginVertical: 20,
                      // marginTop: 10,
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
                    leftIcon={<Icon3 name="email" color="#424242" size={15} />}
                    containerStyle={{
                      height: 50,
                      marginVertical: 20,
                      // marginTop: 10,
                      justifyContent: 'center',
                      paddingHorizontal: 0,
                    }}
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
  transporter: store.userReducer.transporter.profile,
});
export default withAppToaster(connect(mapStateToProps, {})(EditProfileTrans));
