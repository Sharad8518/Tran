import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ScheduleCard = props => {
  const {navigation, name} = props;

  return (
    <View>
      <TouchableOpacity style={{flexDirection: 'row', marginVertical: 5}}>
        <View
          style={{
            width: wp(15),
            alignItems: 'center',
            marginTop: hp(1),
            marginLeft: 10,
          }}>
          <MaterialCommunityIcons
            name="truck-check-outline"
            color="#FFA654"
            size={30}
          />
        </View>
        <View style={{marginTop: hp(1), marginLeft: wp(2)}}>
          <Text style={{fontFamily: 'Lato-Bold', fontSize: 16}}>
            Pune to Delhi:30MT
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 12,
            }}>
            VRL Logistic pvt ldt
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 12,
            }}>
            Pickup On - 9th june 2020
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 20,
              color: '#549CFF',
            }}>
            ₹ 40,500
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: hp(100),
  },
  text: {
    color: 'white',
    fontSize: 38,
    paddingTop: hp(10),
  },
  name: {
    height: hp(20),
    alignItems: 'center',
  },
  box: {
    width: wp(88),
    height: hp(7),
    borderWidth: 1,
    borderColor: '#fff',
    alignSelf: 'center',
    borderRadius: 5,
  },
  iconbox: {
    width: wp(15),
    height: hp(7),
    borderWidth: 1,
    borderRightColor: '#fff',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  header: {
    height: hp(7),
    width: wp(100),
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ScheduleCard;
