import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

const ChatHeader = props => {
  const {navigation} = props;
  const params = props.scene?.route?.params;
  const {details} = params;
  const role = useSelector(store => store.authReducer.role);
  const previous = props.previous.route.name;
  if (Platform.OS === 'android') {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${details?.toUser?.contact}`)}
          style={{}}>
          <Icon name="call" type="ionicon" color="#fff" size={22} />
        </TouchableOpacity>
        <View style={styles.title}>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: 20,
              color: '#fff',
              fontWeight: 'bold',
            }}>
            {details?.toUser?.userName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            role === 'consignee'
              ? navigation.navigate('ShipmentDetailsConsignee', {
                  shipmentId: details.shipmentId,
                })
              : role === 'transporter'
              ? navigation.navigate('ShipmentDetailsTrans', {
                  shipmentId: details.shipmentId,
                })
              : navigation.navigate('ShipmentDetails', {
                  shipmentId: details.shipmentId,
                });
          }}
          style={{marginRight: 10}}>
          <Icon
            name="information-circle-sharp"
            type="ionicon"
            color="#fff"
            size={25}
          />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${details?.toUser?.contact}`)}
          style={{}}>
          <Icon name="call" type="ionicon" color="#fff" size={22} />
        </TouchableOpacity>
        <View style={styles.title}>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: 20,
              color: '#fff',
              fontWeight: 'bold',
            }}>
            {details?.toUser?.userName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            role === 'consignor'
              ? navigation.navigate('ShipmentDetails', {
                  shipmentId: details.shipmentId,
                })
              : role === 'transporter'
              ? navigation.navigate('ShipmentDetailsTrans', {
                  shipmentId: details.shipmentId,
                })
              : navigation.navigate('ShipmentDetailsConsignee', {
                  shipmentId: details.shipmentId,
                });
          }}
          style={{marginRight: 10}}>
          <Icon
            name="information-circle-sharp"
            type="ionicon"
            color="#fff"
            size={25}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: hp(7),
    width: wp(100),
    backgroundColor: '#549CFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    borderBottomWidth: 0.8,
    borderColor: '#ccc',
  },
});

export default ChatHeader;
