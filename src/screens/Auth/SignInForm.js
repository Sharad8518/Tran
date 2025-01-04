import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import {FormInput} from '../../Components/FormInput';
const SignInForm = props => {
  const {
    handleChange,
    errors,
    touched,
    handleSubmit,
    values,
    loading,
    setFieldValue,
  } = props;
  const [showPassword, togglePassword] = useState(false);

  return (
    <View
      style={{
        // alignItems: 'center',
        justifyContent: 'center',
        marginTop: wp(2),
      }}>
      <FormInput
        onChangeText={text => setFieldValue('username', text.trim())}
        errors={errors}
        name="username"
        touched={touched}
        values={values}
        placeholder="Email"
        leftIcon={<Icon2 name="user" color="#424242" size={15} />}
      />

      <FormInput
        onChangeText={handleChange('password')}
        errors={errors}
        secureTextEntry={!showPassword}
        name="password"
        touched={touched}
        values={values}
        placeholder="Password"
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
        leftIcon={<Icon2 name="lock" color="#424242" size={15} />}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          marginTop: 20,
          width: wp(80),
          backgroundColor: '#549CFF',
          height: 45,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10,
        }}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            allowFontScaling={false}
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 15,
              color: 'white',
            }}>
            Sign In
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
export default SignInForm;
