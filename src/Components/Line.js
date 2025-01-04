import React from 'react'
import {View, StyleSheet, Text,TouchableOpacity} from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import Entypo from 'react-native-vector-icons/Entypo';

const Line = (props) => {
    const {navigation, name} = props

    return(
        <View
        style={{
          borderWidth: 0.3,
          borderColor: '#0000001A',
          width: wp(80),
          alignSelf: 'center',
        }}></View>
    )
}

const styles = StyleSheet.create({
    
  });

export default Line