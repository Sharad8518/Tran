import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DetailsRow} from '../Transporter/EnqDetailsTran';
const EnqDetailsConsignor = props => {
  const {navigation} = props;
  const [details, setDetails] = useState(null);
  const {item} = props.route.params.details;
  const [loading, setLoading] = useState(true);
  const [show, toggleShow] = useState(false);
  useEffect(() => {
    axios
      .get(`/enquiry/single?enquiryId=${item._id}`)
      .then(res => {
        const enq = res.data.enquiry;
        const to = res.data.toAddress;
        const from = res.data.fromAddress;
        setDetails({enq, to, from});
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        // console.log('error', error);
      });
  }, []);
  return (
    <SafeAreaView style={{flex: 1}} edges={['bottom']}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#fff',
          paddingTop: Platform.OS === 'ios' ? '15%' : 0,
        }}>
        <View style={{height: hp(35), backgroundColor: '#fff'}}>
          <Image
            source={require('../../../assets/ShipmentSummary.png')}
            style={{height: hp(35), width: wp(80), alignSelf: 'center'}}
          />
        </View>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}>
            <ActivityIndicator color="#549CFF" />
          </View>
        ) : (
          <View style={{backgroundColor: '#fff'}}>
            <View
              style={{
                marginHorizontal: wp(5),
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingBottom: 10,
              }}>
              <View
                style={{
                  backgroundColor: '#549CFF',
                  borderRadius: 15,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                    marginTop: hp(2),
                  }}>
                  To {details?.to.companyName}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14,
                    marginTop: hp(0.4),
                  }}>
                  Enquiry Number
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginTop: hp(0.4),
                  }}>
                  #{details.enq._id}
                </Text>
                <View
                  style={{
                    borderWidth: 0.3,
                    borderColor: '#fff',
                    width: wp(70),
                    marginVertical: hp(2),
                  }}></View>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 12,
                    marginTop: hp(0.4),
                  }}>
                  Enquiry Scheduled for
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginVertical: hp(0.4),
                    marginBottom: hp(1),
                  }}>
                  {moment(details.enq.loadingTime).format(
                    'Do MMMM YYYY HH:mm A',
                  )}
                </Text>
              </View>
              <DetailsRow
                labelColor={'#111'}
                value={`${details.from.address}, ${details.from.location}, ${details.from.district},  ${details.from.state}`}
                label="Pick up From"
              />
              <DetailsRow
                labelColor={'#111'}
                value={`${details.to.address}, ${details.to.location}`}
                label="Delivery to"
              />
              {!show && (
                <Text
                  onPress={() => toggleShow(true)}
                  style={{
                    textAlign: 'center',
                    color: '#FFA654',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    marginVertical: 10,
                  }}>
                  View More Details
                </Text>
              )}
              {show && (
                <>
                  {/* <DetailsRow label="Truck Type" value="Airport Rd, Chacka, Thiruvananthapuram, Kerala 695008, INDIA" /> */}
                  <DetailsRow
                    labelColor={'#111'}
                    label="Pickup Date"
                    value={moment(details?.enq?.loadingTime).format(
                      'Do MMMM YYYY HH:mm A',
                    )}
                  />
                  <DetailsRow
                    labelColor={'#111'}
                    label="Weight"
                    value={`${details?.enq?.weight}`}
                  />
                  <DetailsRow
                    labelColor={'#111'}
                    label={'Loading \n Expense'}
                    value={`₹ ${details?.enq?.loadingExpense}`}
                  />
                  <DetailsRow
                    labelColor={'#111'}
                    label={'Unloading \n Expense'}
                    value={`₹ ${details?.enq?.unloadingExpense}`}
                  />
                  {details?.enq?.advance !== null && (
                    <DetailsRow
                      labelColor={'#111'}
                      label={'Advance'}
                      value={`₹ ${details?.enq?.advance}`}
                    />
                  )}
                  {details?.enq?.againstBill !== null && (
                    <DetailsRow
                      labelColor={'#111'}
                      label={'Pay Against Delivery'}
                      value={`₹ ${details?.enq?.againstBill}`}
                    />
                  )}
                </>
              )}
              {show &&
                details?.enq?.againstBill !== null &&
                details?.enq?.advance !== null && (
                  <Text
                    onPress={() => toggleShow(false)}
                    style={{
                      textAlign: 'center',
                      color: '#FFA654',
                      fontFamily: 'Lato-Bold',
                      fontSize: 14,
                      marginVertical: 10,
                    }}>
                    View Less Details
                  </Text>
                )}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ViewBids', {enqId: item._id})
                }
                style={{
                  backgroundColor: '#549CFF',
                  height: 50,
                  borderRadius: 10,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontSize: 15,
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  View Bids
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EnqDetailsConsignor;
