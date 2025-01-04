import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
export const DashboardIcon = ({icon, label, onPress, count = 0}) => {
  return (
    <TouchableOpacity
      style={{flex: 1, alignItems: 'center'}}
      activeOpacity={0.8}
      onPress={() => {
        return onPress();
      }}>
      {count > 0 && (
        <View
          style={{
            height: 20,
            width: 20,
            position: 'absolute',
            backgroundColor: '#FFA654',
            right: 5,
            borderRadius: 10,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Lato-Bold',
              color: '#fff',
              fontSize: 12,
            }}>
            {count}
          </Text>
        </View>
      )}
      <View
        style={{
          height: 50,
          width: 50,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: '#549CFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {icon}
      </View>
      <Text
        ellipsizeMode="clip"
        numberOfLines={2}
        style={{
          textAlign: 'center',
          fontFamily: 'Lato-Bold',
          fontSize: 11,
          marginTop: 10,
          color: '#549CFF',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
