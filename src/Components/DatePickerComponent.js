import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const DatePickerComponent = ({
  error,
  onChange,
  minDate = new Date(),
  placeholder = 'Select Date',
  initialValue,
  mode = 'date',
  format = 'Do MMMM YYYY',
  placeholderValue,
  selectedDate,
}) => {
  const [localValue, setValue] = useState(selectedDate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const formatDate = moment(date).format(format);
    setValue(formatDate);
    hideDatePicker();
    return onChange(formatDate);
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => showDatePicker()}
        activeOpacity={0.8}
        style={{
          height: 45,
          width: '100%',
          borderWidth: 1,
          borderColor: '#424242',
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          backgroundColor: 'transparent',
          flex: 1,
        }}>
        <View
          style={{
            width: 40,
            borderRightWidth: 1,
            height: 45,
            justifyContent: 'center',
          }}>
          <Icon name="calendar" size={20} type="antdesign" color={'#000'} />
        </View>
        <View style={{flex: 8, paddingLeft: 10}}>
          {!!localValue ? (
            <Text style={{fontFamily: 'Lato-Regular', color: '#424242'}}>
              {localValue}
            </Text>
          ) : (
            <Text
              style={{
                color: '#999',
                fontFamily: 'Lato-Regular',
              }}>
              {placeholderValue}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <Text
        style={{
          color: 'red',
          fontSize: 12,
          fontFamily: 'Lato-Regular',
          marginTop: 5,
        }}>
        {error}
      </Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        values={selectedDate}
        minimumDate={minDate}
        maximumDate={moment(new Date()).add(1, 'year').toDate()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

export default DatePickerComponent;
