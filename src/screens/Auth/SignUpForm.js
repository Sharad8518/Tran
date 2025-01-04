import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {Dialog, Portal} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import {FormInput} from '../../Components/FormInput';
import {USER_ROLES} from '../../config/variables';
import { ScrollView } from 'react-native-gesture-handler';
const SignUpForm = props => {
  const {handleChange, errors, touched, handleSubmit, values, setFieldValue} =
    props;
  const [showPassword, togglePassword] = useState(false);
  return (
    <View
      style={{
        justifyContent: 'center',
        marginTop: wp(2),
        paddingHorizontal: '8%',
      }}>
      <DropDownPickerModal
        onSelect={value => {
          setFieldValue('role', value.value);
        }}
        value={values['role']}
        error={errors['role']}
        placeholder="Select Role"
      />
      <FormInput
        onChangeText={handleChange('username')}
        errors={errors}
        name="username"
        touched={touched}
        values={values}
        placeholder="Username"
        leftIcon={<Icon2 name="user" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={text => setFieldValue('email', text.trim())}
        errors={errors}
        name="email"
        touched={touched}
        values={values}
        placeholder="Email"
        leftIcon={<Icon2 name="envelope" color="#424242" size={15} />}
      />
      <FormInput
        onChangeText={handleChange('password')}
        secureTextEntry={!showPassword}
        errors={errors}
        name="password"
        touched={touched}
        values={values}
        placeholder="Password"
        leftIcon={<Icon2 name="lock" color="#424242" size={15} />}
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
      <FormInput
        onChangeText={handleChange('contact')}
        errors={errors}
        name="contact"
        touched={touched}
        keyboardType={'phone-pad'}
        values={values}
        placeholder="Contact"
        leftIcon={<Icon2 name="phone" color="#424242" size={15} />}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit}
        style={{
          marginTop: 20,
          backgroundColor: '#549CFF',
          height: 45,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          allowFontScaling={false}
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 15,
            color: 'white',
          }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export const DropDownPickerModal = ({placeholder, value, onSelect, error}) => {
  const [visible, setVisible] = useState(false);
  const [localValue, setValue] = useState(value);
  useEffect(() => {
    const sel = USER_ROLES.find(i => i.value === value);
    setValue(sel);
  }, [value]);
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: '#a5a2a2',
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 40,
            borderRightWidth: 1,
            height: 45,
            justifyContent: 'center',
            borderColor: '#a5a2a2',
          }}>
          <Icon2
            style={{alignSelf: 'center'}}
            name="phone"
            color="#424242"
            size={15}
          />
        </View>

    


        <View style={{flex: 8, paddingLeft: 10}}>
          {!!localValue ? (
            <Text
              allowFontScaling={false}
              style={{fontFamily: 'Lato-Regular', color: '#000'}}>
              {localValue.label}
            </Text>
          ) : (
            <Text
              allowFontScaling={false}
              style={{
                color: '#999',
                fontFamily: 'Lato-Regular',
                fontSize: 15,
              }}>
              {placeholder}
            </Text>
          )}
        </View>
        <View style={{flex: 1}}>
          <Icon2
            style={{alignSelf: 'center'}}
            name="arrow-down"
            color="#424242"
            size={15}
          />
        </View>
      </TouchableOpacity>
      {
        visible ?
        <ScrollView style={{height:120}}>
        {USER_ROLES.map((role, index) => {
         return (
          <TouchableOpacity
                onPress={() => {
                  setValue(role);
                  setVisible(false);
                  return onSelect(role);
                }}
                style={{height:40,padding:5}}
                key={index}>
                <Text
                  allowFontScaling={false}
                  style={{fontFamily: 'Lato-Regular', color: '#000'}}>
                  {role.label}
                </Text>
              </TouchableOpacity>

         );
       })}
    </ScrollView>
        :
        <></>


      }
    


      <Text
        allowFontScaling={false}
        style={{
          color: 'red',
          fontSize: 12,
          fontFamily: 'Lato-Regular',
          marginTop: 5,
        }}>
        {error}
      </Text>
       
    

       {/* <Portal>
        <Dialog
          style={{backgroundColor: '#fff'}}
          dismissable={true}
          onDismiss={() => setVisible(false)}
          visible={visible}>
          <Dialog.Title>
            <Text
              allowFontScaling={false}
              style={{fontFamily: 'Lato-Regular', color: '#000'}}>
              Select Role
            </Text>
          </Dialog.Title>
          <Dialog.Content>
            {USER_ROLES.map((role, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setValue(role);
                    setVisible(false);
                    return onSelect(role);
                  }}
                  style={{marginVertical: 10}}
                  key={index}>
                  <Text
                    allowFontScaling={false}
                    style={{fontFamily: 'Lato-Regular', color: '#000'}}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Dialog.Content>
        </Dialog>
      </Portal> */}
    </>
  );
};
export default SignUpForm;
