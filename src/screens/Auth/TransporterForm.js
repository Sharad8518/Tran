import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {FullScreenModalSelect} from '../../Components/FullScreenModalSelect';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon4 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import store from '../../redux/store';
import {FormInput} from '../../Components/FormInput';
import {FieldArray} from 'formik';
const TransporterForm = props => {
  const {
    handleChange,
    errors,
    touched,
    handleSubmit,
    values,
    setFieldValue,
    loading,
    setToast,
  } = props;
  const citiesData = store.getState()?.userReducer?.CityList;
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setToast({text: 'Please fill in valid inputs', styles: 'error'});
    }
  }, [errors]);
  return (
    <View style={{paddingHorizontal: '8%'}}>
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
        autoCaps={true}
        placeholder="Pan No."
        leftIcon={<Icon3 name="email" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={text => setFieldValue('gst', text.trim())}
        errors={errors}
        name="gst"
        touched={touched}
        values={values}
        autoCaps={true}
        placeholder="GST No."
        leftIcon={<Icon3 name="email" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={handleChange('truckCount')}
        errors={errors}
        name="truckCount"
        touched={touched}
        values={values}
        keyboardType={'phone-pad'}
        placeholder="Number of trucks"
        leftIcon={
          <Icon type="font-awesome" name="truck" color="#424242" size={15} />
        }
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
      <FieldArray
        name="routes"
        render={arrayHelpers => (
          <RouteSelection
            citiesData={citiesData}
            {...props}
            {...arrayHelpers}
          />
        )}
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
export const RouteSelection = props => {
  const {citiesData, values, push, errors, touched, remove, setFieldValue} =
    props;
  return (
    <>
      {values?.routes.map((route, i) => {
        return (
          <View key={i}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{fontFamily: 'Lato-Bold'}}>Route {i + 1}</Text>
              {i !== 0 && (
                <TouchableOpacity onPress={() => remove(i)} activeOpacity={0.8}>
                  <Icon
                    name="close-circle"
                    type="material-community"
                    color="red"
                  />
                </TouchableOpacity>
              )}
            </View>
            <FullScreenModalSelect
              value={values['routes'][i]['from']}
              onSelectItem={value => {
                values.routes[i].from = value.value;
                setFieldValue('routes', values.routes);
              }}
              items={citiesData}
              masterArr={citiesData}
              disabled={false}
              placeholder="From"
              leftIcon={
                <Icon
                  style={{alignSelf: 'center'}}
                  name="map-signs"
                  type="font-awesome"
                  color="#424242"
                  size={15}
                />
              }
              error={
                touched['routes']?.[i]?.['from']
                  ? errors['routes']?.[i]?.['from']
                  : ''
              }
            />
            <FullScreenModalSelect
              value={values['routes'][i]['to']}
              onSelectItem={value => {
                values.routes[i].to = value.value;
                setFieldValue('routes', values.routes);
              }}
              items={citiesData}
              masterArr={citiesData}
              disabled={false}
              placeholder="To"
              leftIcon={
                <Icon
                  style={{alignSelf: 'center'}}
                  name="map-signs"
                  type="font-awesome"
                  color="#424242"
                  size={15}
                />
              }
              error={
                touched['routes']?.[i]?.['to']
                  ? errors['routes']?.[i]?.['to']
                  : ''
              }
            />
          </View>
        );
      })}
      {values?.routes.length < 7 && (
        <TouchableOpacity
          onPress={() => push({from: '', to: ''})}
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
            Add Route
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};
export default TransporterForm;
