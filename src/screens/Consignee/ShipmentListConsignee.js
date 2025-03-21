import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {connect} from 'react-redux';
import {withAppToaster} from '../../redux/AppState';

const ShipmentListConsignee = props => {
  const {token, navigation} = props;
  const [loading, setLoading] = useState(true);
  const [Ship, setShip] = useState([]);
  useEffect(() => {
    axios
      .get('/shipment/list', {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        console.log("list ship",res.data)
        setShip(res.data.shipments);
        setLoading(false);
      })
      .catch(error => {
        // console.log('error', error);
      });
  }, []);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{
          borderBottomWidth: 0.7,
          paddingHorizontal: '5%',
          paddingVertical: 10,
          borderColor: '#CCCCCC',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 2,
            backgroundColor: '#FFA654',
            height: hp(5),
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
        <View style={{flex: 8, paddingHorizontal: '5%'}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Lato-Bold',
            }}>
            Shipment: #{item._id}
          </Text>
          <Text
            style={{
              marginVertical: 5,
              fontSize: 14,
              fontFamily: 'Lato-Regular',
              textTransform: 'capitalize',
            }}>
            To: {item.toAddress},{item.toLocation}
          </Text>
          <Text
            style={{
              marginVertical: 5,
              fontSize: 14,
              fontFamily: 'Lato-Regular',
              textTransform: 'capitalize',
            }}>
            From: {item.fromAddress},{item.fromDistrict}, {item.fromState}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ShipmentDetailsConsignee', {
                shipmentId: item._id,
              })
            }
            style={{
              marginTop: hp(0.8),
            }}>
            <Text style={{color: '#549CFF', fontWeight: 'bold'}}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : Array.isArray(Ship) && Ship.length > 0 ? (
        <FlatList
          ListEmptyComponent={
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                  textAlign: 'center',
                }}>
                No Shipments founds
              </Text>
            </View>
          }
          contentContainerStyle={{
            backgroundColor: '#fff',
            paddingTop: Platform.OS === 'ios' ? '15%' : 0,
          }}
          data={Ship}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${index}`}
        />
      ) : (
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Lato-Bold',
              textAlign: 'center',
            }}>
            No Shipments founds
          </Text>
        </View>
      )}
    </View>
  );
};
const mapStateToProps = store => ({
  token: store.authReducer.token,
});
export default withAppToaster(
  connect(mapStateToProps, {})(ShipmentListConsignee),
);
