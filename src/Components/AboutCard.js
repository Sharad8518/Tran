import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AboutCard = (props) => {
  const { navigation, name, logo } = props
  return (
    <TouchableOpacity>
      <View
        style={ {
          flexDirection: 'row',
          marginTop: hp(2),
          height: hp(8),
          //   backgroundColor: 'red',
          alignItems: 'center',
        } }>
        <View style={ { width: wp(18) } }>
          <MaterialCommunityIcons
            name={ logo }
            size={ 38 }
            color="#549CFF"
            style={ { alignSelf: 'center' } }
          />
        </View>
        <View style={ { width: wp(55) } }>
          <Text
            allowFontScaling={ false }

            style={ {
              fontSize: 16,
              marginLeft: wp(3),
              color: '#8C8C8C',
              fontFamily: 'poppins',
              fontWeight: 'bold',
            } }>
            { name }
          </Text>
        </View>
        <View style={ { width: wp(10) } }>
          <AntDesign name="arrowright" size={ 18 } color="#676767" />
        </View>
      </View>


    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({

});

export default AboutCard