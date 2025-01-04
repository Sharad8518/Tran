import axios from 'axios';
import {Formik} from 'formik';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {default as Icon4} from 'react-native-vector-icons/MaterialIcons';
import {default as Icon5} from 'react-native-vector-icons/FontAwesome';
import {connect, useDispatch} from 'react-redux';
import * as Yup from 'yup';
import DatePickerComponent from '../../Components/DatePickerComponent';
import {FormInput, FormInputArea} from '../../Components/FormInput';
import {FullScreenModalSelect} from '../../Components/FullScreenModalSelect';
import {SET_DETAILS} from '../../redux/enquiry/types';
import {
  checkForAlphabets,
  notMoreThan10AnyNonAlphabeticalCharacter,
  specialCharacterValidator,
} from '../../utils/validators';

const NewBooking2Schema = Yup.object().shape({
  weight: Yup.string().required('Weight is required'),
  truckType: Yup.string().required('Truck type is required'),
  material: Yup.string()
    .required('Material is required')
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
    .test(
      'more special chars',
      'Cannot contain more than 10 special characters',
      notMoreThan10AnyNonAlphabeticalCharacter,
    ),
  unloadingExpense: Yup.string()
    .matches(/^[0-9 ]*$/, 'Must contain numbers only')
    .required('Unloading expense is required'),
  loadingExpense: Yup.string()
    .matches(/^[0-9 ]*$/, 'Must contain numbers only')
    .required('Loading expense is required'),
  loadingTime: Yup.mixed().required('Loading Date is required'),
  advance: Yup.string().matches(/^[0-9 ]*$/, 'Must contain numbers only'),
  // .required('Advance is required'),
  againstbill: Yup.string().matches(/^[0-9 ]*$/, 'Must contain numbers only'),
  // .required('Against bill is required'),
  remarks: Yup.string()
    .required('Remarks is required')
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
    .test(
      'more special chars',
      'Cannot contain more than 10 special characters',
      notMoreThan10AnyNonAlphabeticalCharacter,
    ),
});
const weights = [
  {label: '10 MT', value: '10 MT'},
  {label: '20 MT', value: '20 MT'},
  {label: '30 MT', value: '30 MT'},
];
const truckTypes = [
  {label: 'Open 7.5-43 Tons', value: 'Open 7.5-43 Tons'},
  {label: 'LCV 2.5-7 Tons', value: 'LCV 2.5-7 Tons'},
  {label: 'mini/pickup 0.75-7.5 Tons', value: 'mini/pickup 0.75-7.5 Tons'},
  {label: 'Trailer 16-43 Tons', value: 'Trailer 16-43 Tons'},
  {label: 'Container 9-30 Tons', value: 'Container 9-30 Tons'},
  {label: 'Tripper 9-30 Tons', value: 'Tripper 9-30 Tons'},
  {label: 'Tanker 8-36 Tons', value: 'Tanker 8-36 Tons'},
  {label: 'Dumper 9-36 Ton', value: 'Dumper 9-36 Ton'},
  {label: 'Bulker 20-36 Ton', value: 'Bulker 20-36 Ton'},
];
const NewBooking2 = props => {
  const {navigation, token} = props;
  // const [truckTypes, setTruckTypes] = useState([]);
  // useEffect(() => {
  //   axios
  //     .get('/transporter/trucktype/list', {
  //       headers: {Authorization: `Bearer ${token}`},
  //     })
  //     .then(res => {
  //       setTruckTypes(
  //         res.data.map(type => ({
  //           ...type,
  //           label: `${type.mt} ${type.truckType}`,
  //           value: `${type.mt} ${type.truckType}`,
  //         })),
  //       );
  //     })
  //     .catch(error => {
  //       // console.log('error', error);
  //     });
  // }, []);
  const dispatch = useDispatch();
  return (
    <ScrollView
      nestedScrollEnabled={true}
      style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{height: hp(7), width: wp(100)}}>
        <LottieView
          style={{width: '100%', height: hp(7)}}
          autoSize={true}
          source={require('../../../assets/truckAnimation.json')}
          autoPlay
          loop
        />
      </View>
      <View style={{marginTop: 20}}>
        <Text
          style={{
            marginLeft: wp(10),
            color: '#424242',
            fontFamily: 'Lato-Bold',
            fontSize: 15,
          }}>
          Shipment Details
        </Text>
      </View>
      <Formik
        validationSchema={NewBooking2Schema}
        initialValues={{
          weight: '',
          truckType: '',
          material: '',
          unloadingExpense: '',
          loadingExpense: '',
          loadingTime: '',
          advance: '',
          againstbill: '',
          remarks: '',
        }}
        onSubmit={data => {
          dispatch({type: SET_DETAILS, payload: data});
          navigation.navigate('NewBooking3');
        }}>
        {({
          handleChange,
          handleSubmit,
          values,
          setFieldValue,
          errors,
          touched,
        }) => {
          const [isDatePickerVisible, setDatePickerVisibility] =
            useState(false);

          const showDatePicker = () => {
            setDatePickerVisibility(true);
          };

          const hideDatePicker = () => {
            setDatePickerVisibility(false);
          };

          const handleConfirm = date => {
            console.warn('A date has been picked: ', date);
            hideDatePicker();
          };
          // console.log('errors', values);
          return (
            <View style={{paddingHorizontal: '5%'}}>
              <FullScreenModalSelect
                value={values.truckType}
                placeholder="Select Truck Type"
                items={truckTypes}
                masterArr={truckTypes}
                // keyboardType="numeric"
                searchable={true}
                addNew={true}
                leftIcon={
                  <Icon
                    style={{alignSelf: 'center'}}
                    name="truck"
                    type="font-awesome"
                    color="#424242"
                    size={15}
                  />
                }
                renderCustomComponent={false}
                minLength={0}
                error={
                  touched?.['truckType'] && errors?.['truckType']
                    ? errors.truckType
                    : ''
                }
                onSelectItem={value => {
                  setFieldValue('truckType', value.value);
                }}
              />

              <FullScreenModalSelect
                placeholder="Search or Add Custom"
                value={values.weight}
                items={weights}
                masterArr={weights}
                searchable={true}
                addNew={true}
                leftIcon={
                  <Icon
                    style={{alignSelf: 'center'}}
                    name="weight"
                    type="font-awesome-5"
                    color="#424242"
                    size={15}
                  />
                }
                renderCustomComponent={true}
                customComponent={(item, i, onSelect) => (
                  <TouchableOpacity
                    style={{marginVertical: 10}}
                    key={i}
                    onPress={() => {
                      setFieldValue('weight', item.value);
                      onSelect(item);
                    }}>
                    <Text style={{fontFamily: 'Lato-Regular', fontSize: 18}}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                minLength={0}
                onSelectItem={value => {
                  setFieldValue('weight', value.value);
                }}
                error={
                  touched?.['weight'] && errors?.['weight'] ? errors.weight : ''
                }
              />
              <FormInput
                onChangeText={handleChange('material')}
                errors={errors}
                name="material"
                touched={touched}
                values={values}
                placeholder="Material"
                leftIcon={<Icon4 name="edit" color="#424242" size={15} />}
              />
              <FormInput
                onChangeText={handleChange('unloadingExpense')}
                errors={errors}
                keyboardType="numeric"
                name="unloadingExpense"
                touched={touched}
                values={values}
                placeholder="Unloading Expense Per MT"
                leftIcon={<Icon5 name="rupee" color="#424242" size={15} />}
              />
              <FormInput
                onChangeText={handleChange('loadingExpense')}
                errors={errors}
                keyboardType="numeric"
                name="loadingExpense"
                touched={touched}
                values={values}
                placeholder="Loading Expense Per MT"
                leftIcon={<Icon5 name="rupee" color="#424242" size={15} />}
              />
              <DatePickerComponent
                format="YYYY-MM-DD HH:mm:ss"
                mode="datetime"
                placeholderValue="Select Pickup Date"
                onChange={date => {
                  setFieldValue('loadingTime', date);
                }}
                errors={
                  touched?.['loadingTime'] && errors?.['loadingTime']
                    ? errors?.['loadingTime']
                    : ''
                }
              />
              <FormInput
                onChangeText={handleChange('advance')}
                errors={errors}
                keyboardType="numeric"
                name="advance"
                touched={touched}
                values={values}
                placeholder="Advance"
                leftIcon={<Icon5 name="rupee" color="#424242" size={15} />}
              />
              <FormInput
                onChangeText={handleChange('againstbill')}
                errors={errors}
                name="againstbill"
                touched={touched}
                keyboardType="numeric"
                values={values}
                placeholder="Against Bill"
                leftIcon={<Icon5 name="rupee" color="#424242" size={15} />}
              />
              <FormInputArea
                onChangeText={handleChange('remarks')}
                errors={errors}
                name="remarks"
                touched={touched}
                values={values}
                placeholder="Remarks"
                leftIcon={<Icon4 name="edit" color="#424242" size={15} />}
              />

              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  marginVertical: hp(4),
                  backgroundColor: '#549CFF',
                  height: 50,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontSize: 15,
                    color: 'white',
                  }}>
                  Select Transporter
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </Formik>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  dropdownPlaceholder: {
    color: 'grey',
    fontSize: 15,
    fontFamily: 'Lato-Regular',
  },
  dropdownContainer: {
    height: 45,
    alignSelf: 'center',
    // marginTop: 20,
    // backgroundColor: '#000',
    marginVertical: 10,
    borderColor: '#424242',
    zIndex: 1000,
  },
  dropdownContainer2: {
    height: 45,
    alignSelf: 'center',
    // marginTop: 20,
    // backgroundColor: '#000',
    marginVertical: 10,
    borderColor: '#424242',
    // zIndex: 5,
  },
  dropdownStyle: {backgroundColor: 'black', borderColor: '#424242'},
  dropdownStyle1: {backgroundColor: 'white', borderColor: '#424242'},
  dropDownContainerStyle: {borderColor: '#424242'},
  searchContainerStyle: {borderColor: '#424242'},
  searchTextInputStyle: {borderColor: '#424242'},
});
const mapStateToProps = store => ({
  token: store.authReducer.token,
});
export default connect(mapStateToProps, {})(NewBooking2);
