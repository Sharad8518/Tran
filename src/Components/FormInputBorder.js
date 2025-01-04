import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Input} from 'react-native-elements';
import {TextInput, HelperText} from 'react-native-paper';
export const FormInput = props => {
  const {
    errors,
    touched,
    name,
    required = false,
    labelText,
    values,
    autoCaps,
  } = props;
  return (
    <View>
      <TextInput
        label={props.placeholder}
        labelStyle={{marginBottom: 5}}
        placeholderTextColor={'#999'}
        mode="outlined"
        style={{
          color: '#000',
          backgroundColor: '#FFF',
          borderColor: 'gray',
          marginBottom: 10,
        }}
        theme={{
          colors: {
            placeholder: 'gray',
            text: 'black',
            primary: 'black',
            underlineColor: 'transparent',
            background: '#FFF',
          },
        }}
        allowFontScaling={false}
        autoCapitalize={
          autoCaps !== undefined && autoCaps !== null && autoCaps
            ? 'characters'
            : 'none'
        }
        inputStyle={styles.inputStyle}
        errorMessage={touched?.[name] && errors?.[name] ? errors?.[name] : ''}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        leftIconContainerStyle={styles.leftIconContainerStyle}
        errorStyle={{color: 'red', margin: 0, marginTop: 5}}
        value={values?.[name] ?? ''}
        {...props}
      />
      <HelperText type="error" visible={true} style={{marginTop: -5}}>
        {touched?.[name] && errors?.[name] ? errors?.[name] : ''}
      </HelperText>
    </View>
  );
};
export const FormInputArea = props => {
  const {errors, touched, name, required = false, labelText, values} = props;
  return (
    <TextInput
      label={props.placeholder}
      placeholderTextColor={'#999'}
      allowFontScaling={false}
      mode="outlined"
      style={{
        color: '#000',
        backgroundColor: '#FFF',
        borderColor: 'gray',
      }}
      theme={{
        colors: {
          placeholder: 'gray',
          text: 'black',
          primary: 'black',
          underlineColor: 'transparent',
          background: '#FFF',
        },
      }}
      inputStyle={styles.inputStyle}
      errorMessage={touched?.[name] && errors[name] ? errors[name] : ''}
      containerStyle={[styles.containerStyle, {height: 100}]}
      inputContainerStyle={[styles.inputContainerStyle, {height: 100}]}
      leftIconContainerStyle={[styles.leftIconContainerStyle, {height: 100}]}
      errorStyle={{color: 'red', margin: 0, marginTop: 5}}
      value={values?.[name] ?? ''}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 15,
    paddingLeft: 10,
    fontFamily: 'Lato-Regular',
  },
  containerStyle: {
    height: 50,
    marginVertical: 10,
    // marginTop: 10,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  inputContainerStyle: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#a5a2a2',
    borderRadius: 5,
    borderRightWidth: 1,
    // margin: 0,
  },
  leftIconContainerStyle: {
    borderRightWidth: 1,
    paddingLeft: 5,
    width: 40,
    borderColor: '#a5a2a2',
  },
  label: {
    paddingLeft: '3%',
  },
});
