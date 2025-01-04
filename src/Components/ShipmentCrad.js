import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import axios from 'axios';

const ShipmentCard = props => {
  const {item, nav} = props;

  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 10,
        paddingHorizontal: '5%',
        borderBottomWidth: 0.8,
        borderColor: '#ccc',
        paddingVertical: 10,
      }}>
      <View
        style={{
          flex: 2,
          backgroundColor: '#FFA654',
          height: hp(5),
          width: wp(9),
          justifyContent: 'center',
          borderRadius: 30,
        }}>
        <SimpleLineIcons
          name="direction"
          size={18}
          color="#FFFFFF"
          style={{alignSelf: 'center'}}
        />
      </View>
      <View style={{flex: 8, paddingLeft: 10}}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Lato-Bold',
          }}>
          Enquiry #{item._id}
        </Text>
        <Text style={{marginTop: hp(1), fontWeight: 'bold'}}>
          {item.to.address}
        </Text>
        <Text style={{marginTop: hp(1), fontWeight: 'bold'}}>
          Loading Time:{' '}
          {moment(item.loadingTime).format('Do MMMM YYYY HH:mm A')}
        </Text>
        <TouchableOpacity
          onPress={() => nav.navigate('EnqDetailsConsignor', {details: {item}})}
          style={{
            marginTop: hp(0.8),
          }}>
          <Text style={{color: '#549CFF', fontWeight: 'bold'}}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ShipmentCard;
