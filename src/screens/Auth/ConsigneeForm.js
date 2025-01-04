import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon4 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import {FormInput} from '../../Components/FormInput';
import {FullScreenModalSelect} from '../../Components/FullScreenModalSelect';
import statesJson from '../../../states-districts.json';
import store from '../../redux/store';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native';
import axios from 'axios';
import {Platform} from 'react-native';

const ConsigneeForm = props => {
  const {
    handleChange,
    errors,
    touched,
    handleSubmit,
    values,
    setFieldValue,
    loading,
  } = props;
  const statesData = statesJson.states;
  const citiesData = store.getState()?.userReducer?.CityList;
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [consignors, setConsignors] = useState([]);
  useEffect(() => {
    const data = statesData.map(s => ({...s, label: s.state, value: s.state}));
    setStates(data);
  }, []);
  const getDistricts = state => {
    const selected = states.find(s => s.state === state);
    const districts = selected.districts.map(d => ({value: d, label: d}));
    setDistricts(districts);
  };
  useEffect(() => {
    axios
      .get('/consignor/list')
      .then(res => {
        const list = res.data.consignors.map(c => ({
          ...c,
          label: c.companyName,
          value: c.userId,
        }));
        setConsignors(list);
      })
      .catch(error => {
        // console.log('error', error);
      });
  }, []);
  return (
    <View
      style={{
        paddingHorizontal: '8%',
        // paddingTop: Platform.OS === 'ios' ? '15%' : 0,
      }}>
      <FullScreenModalSelect
        value={values['consignorId']}
        onSelectItem={value => {
          setFieldValue('consignorId', value.value);
        }}
        items={consignors}
        masterArr={consignors}
        placeholder="Select Consignor"
        leftIcon={
          <Icon
            style={{alignSelf: 'center'}}
            type="entypo"
            name="user"
            color="#424242"
            size={15}
          />
        }
        error={touched?.['consignorId'] ? errors?.['consignorId'] : ''}
      />
      <FormInput
        onChangeText={handleChange('companyName')}
        errors={errors}
        name="companyName"
        touched={touched}
        values={values}
        placeholder="Company Name"
        leftIcon={<Icon2 name="user" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={handleChange('adminName')}
        errors={errors}
        name="adminName"
        touched={touched}
        values={values}
        placeholder="Admin Name"
        leftIcon={<Icon2 name="user" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={handleChange('managerName')}
        errors={errors}
        name="managerName"
        touched={touched}
        values={values}
        placeholder="Manager Name"
        leftIcon={<Icon2 name="user" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={text => setFieldValue('pan', text.trim())}
        errors={errors}
        name="pan"
        touched={touched}
        values={values}
        placeholder="Pan No."
        autoCaps={true}
        leftIcon={<Icon3 name="email" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={text => setFieldValue('gst', text.trim())}
        errors={errors}
        name="gst"
        touched={touched}
        values={values}
        placeholder="GST No."
        autoCaps={true}
        leftIcon={<Icon3 name="email" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={handleChange('address')}
        errors={errors}
        name="address"
        touched={touched}
        values={values}
        placeholder="Address"
        leftIcon={<Icon4 name="edit" color="#424242" size={15} />}
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
          <Icon type="entypo" name="location-pin" color="#424242" size={15} />
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
          <Icon type="entypo" name="location-pin" color="#424242" size={15} />
        }
      />
      {/* Romoved state and district Full dropDown */}
      {/* <FullScreenModalSelect
        value={values['state']}
        onSelectItem={value => {
          setFieldValue('state', value.value);
          getDistricts(value.value);
        }}
        items={states}
        masterArr={states}
        placeholder="State"
        leftIcon={
          <Icon
            style={{ alignSelf: 'center' }}
            type="entypo"
            name="map"
            color="#424242"
            size={15}
          />
        }
        error={touched?.['state'] ? errors?.['state'] : ''}
      />
      <FullScreenModalSelect
        value={values['district']}
        onSelectItem={value => {
          setFieldValue('district', value.value);
        }}
        items={districts}
        masterArr={districts}
        disabled={districts.length === 0}
        placeholder="District"
        leftIcon={
          <Icon
            style={{ alignSelf: 'center' }}
            name="map-signs"
            type="font-awesome"
            color="#424242"
            size={15}
          />
        }
        error={touched?.['district'] ? errors?.['district'] : ''}
      /> */}
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
        activeOpacity={0.8}
        onPress={handleSubmit}
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
            Sign Up
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
export default ConsigneeForm;
