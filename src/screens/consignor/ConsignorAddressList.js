import {FieldArray, Formik} from 'formik';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {CheckBox, Icon} from 'react-native-elements';
import Icon4 from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import statesJson from '../../../states-districts.json';
import {FormInput} from '../../Components/FormInput';
import {FullScreenModalSelect} from '../../Components/FullScreenModalSelect';
import {withAppToaster} from '../../redux/AppState';
import * as Yup from 'yup';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';
import store from '../../redux/store';

const ConsignorSchema = Yup.object().shape({
  address: Yup.array().of(
    Yup.object().shape({
      location: Yup.string().required('Please select location'),
      state: Yup.string().required('Please select state'),
      district: Yup.string().required('Please select district'),
      address: Yup.string().required('Please enter address'),
      pincode: Yup.string().required('Please enter pincode'),
    }),
  ),
});

const ConsignorAddressList = props => {
  const {address, setToast} = props;
  const [loading, setLoading] = useState(false);

  return (
    <ScrollView
      style={{flex: 1, paddingHorizontal: `5%`, backgroundColor: '#fff'}}>
      <Formik
        validationSchema={ConsignorSchema}
        initialValues={{address}}
        onSubmit={data => {
          setLoading(true);
          const payload = data.address.map(a => ({
            location: a.location,
            state: a.state,
            address: a.address,
            district: a.district,
            isDefault: a.isDefault,
            pincode: a.pincode,
          }));
          axios
            .put('/consignor/address', {addressDict: payload})
            .then(res => {
              setLoading(false);
            })
            .catch(error => {
              setLoading(false);
            });
        }}
        component={formikProps => (
          <>
            <FieldArray
              name="address"
              render={arrayHelpers => (
                <AddressSelection {...formikProps} {...arrayHelpers} />
              )}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={formikProps.handleSubmit}
              style={{
                height: 40,
                backgroundColor: '#549CFF',
                marginVertical: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 15,
                    color: 'white',
                  }}>
                  Update
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      />
    </ScrollView>
  );
};
const AddressSelection = props => {
  const {values, push, errors, touched, remove, setFieldValue} = props;
  return (
    <>
      {values?.address.map((a, i) => {
        return (
          <View key={i}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: 'Lato-Bold'}}>Address {i + 1}</Text>
              {!a.isDefault && (
                <TouchableOpacity onPress={() => remove(i)} activeOpacity={0.8}>
                  <Icon
                    name="close-circle"
                    type="material-community"
                    color="red"
                  />
                </TouchableOpacity>
              )}
            </View>
            <AddressRow
              changeDefault={() => {
                const currentDefaultIndex = values.address.findIndex(
                  v => v.isDefault,
                );
                values.address[currentDefaultIndex].isDefault = false;
                values.address[i].isDefault = true;
                setFieldValue('address', values.address);
              }}
              touched={touched?.['address']?.[i]}
              errors={errors?.['address']?.[i]}
              onPinChange={pincode => {
                values.address[i].pincode = pincode;
                setFieldValue('address', values.address);
              }}
              onAddressChange={address => {
                values.address[i].address = address;
                setFieldValue('address', values.address);
              }}
              onLocationChange={loc => {
                values.address[i].location = loc;
                setFieldValue('address', values.address);
              }}
              onDistrictChange={dis => {
                values.address[i].district = dis;
                setFieldValue('address', values.address);
              }}
              onStateChange={state => {
                values.address[i].state = state;
                setFieldValue('address', values.address);
              }}
              values={a}
              index={i}
            />
          </View>
        );
      })}
      <TouchableOpacity
        onPress={() =>
          push({
            address: '',
            location: '',
            state: '',
            district: '',
            isDefault: false,
            pincode: '',
          })
        }
        style={{
          height: 40,
          backgroundColor: '#F99746',
          marginVertical: 10,
          justifyContent: 'center',
          borderRadius: 5,
        }}>
        <Text
          style={{
            fontFamily: 'Roboto',
            fontSize: 15,
            color: 'white',
            textAlign: 'center',
          }}>
          Add Address
        </Text>
      </TouchableOpacity>
    </>
  );
};
const AddressRow = ({
  values,
  i,
  onAddressChange,
  onDistrictChange,
  onStateChange,
  onLocationChange,
  touched,
  errors,
  changeDefault,
  onPinChange,
}) => {
  const citiesData = store.getState()?.userReducer?.CityList;
  const statesData = statesJson.states.map(s => ({
    ...s,
    label: s.state,
    value: s.state,
  }));
  const [districts, setDistricts] = useState([]);
  useEffect(() => {
    if (values['state'].length > 0) getDistricts(values['state']);
  }, []);
  const getDistricts = state => {
    const selected = statesData.find(s => s.state === state);
    const districts = selected.districts.map(d => ({value: d, label: d}));
    setDistricts(districts);
  };
  return (
    <View>
      <FormInput
        onChangeText={text => onAddressChange(text)}
        errors={errors}
        name="address"
        touched={touched}
        values={values}
        placeholder="Address"
        leftIcon={<Icon4 name="edit" color="#424242" size={15} />}
      />
      <FullScreenModalSelect
        value={values['location']}
        onSelectItem={value => onLocationChange(value.value)}
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
      <FullScreenModalSelect
        value={values['state']}
        onSelectItem={value => {
          getDistricts(value.value);
          return onStateChange(value.value);
        }}
        items={statesData}
        masterArr={statesData}
        placeholder="State"
        leftIcon={
          <Icon
            style={{alignSelf: 'center'}}
            type="entypo"
            name="map"
            color="#424242"
            size={15}
          />
        }
        error={touched?.['state'] ? errors?.['state'] : ''}
      />
      {districts.length > 0 && (
        <FullScreenModalSelect
          value={values['district']}
          onSelectItem={value => onDistrictChange(value.value)}
          items={districts}
          masterArr={districts}
          disabled={districts.length === 0}
          placeholder="District"
          leftIcon={
            <Icon
              style={{alignSelf: 'center'}}
              name="map-signs"
              type="font-awesome"
              color="#424242"
              size={15}
            />
          }
          error={touched?.['district'] ? errors?.['district'] : ''}
        />
      )}
      <FormInput
        onChangeText={text => onPinChange(text)}
        errors={errors}
        name="pincode"
        touched={touched}
        keyboardType="numeric"
        values={values}
        placeholder="Pincode"
        leftIcon={<Icon4 name="edit" color="#424242" size={15} />}
      />
      <CheckBox
        disabled={values['isDefault']}
        onPress={() => changeDefault()}
        containerStyle={{backgroundColor: '#fff', borderWidth: 0, padding: 0}}
        checked={values['isDefault']}
        title={values['isDefault'] ? 'Default address' : 'Make as default'}
      />
    </View>
  );
};
const mapStateToProps = store => ({
  address: store.userReducer.consignor.address,
});
export default withAppToaster(
  connect(mapStateToProps, {})(ConsignorAddressList),
);
