import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TransporterBidCard = props => {
  const {bid, enq} = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('BidsDetailsConsignor', {
          bidId: bid._id,
          bidDetails: bid,
        })
      }
      style={{
        flexDirection: 'row',
        marginVertical: 5,
        borderBottomWidth: 0.8,
        borderColor: '#ccc',
      }}>
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
      {props?.index !== undefined && props?.index !== null && (
        <View style={{position: 'absolute', right: 20}}>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 18,
              color: 'green',
            }}>
            L{props?.index + 1}
          </Text>
        </View>
      )}
      <View style={{marginLeft: wp(4)}}>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 16,
            textTransform: 'capitalize',
          }}>
          {bid.companyName}
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 12,
            textTransform: 'capitalize',
          }}>
          {`${enq.from.location} to ${enq.to.location}`}
        </Text>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 12,
          }}>
          Pickup On -{' '}
          {moment(enq.enq.loadingTime).format('Do MMMM YYYY HH:mm A')}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Lato-Bold',
            textTransform: 'capitalize',
          }}>
          Status:
          {bid.status}
        </Text>
        {bid.againstBill !== null && bid.advance !== null && (
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 18,
              color: '#549CFF',
            }}>
            ₹ {bid.advance + bid.againstBill}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default TransporterBidCard;
