import axios from 'axios';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {DetailsRow} from '../Transporter/EnqDetailsTran';
const EnquiryDetailsConsignee = props => {
  const {navigation} = props;
  const [details, setDetails] = useState(null);
  const {enqId} = props.route.params;
  const [loading, setLoading] = useState(true);
  const [show, toggleShow] = useState(false);
  useEffect(() => {
    axios
      .get(`/enquiry/single?enquiryId=${enqId}`)
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
          style={{flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>
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
                From
                {details.from.companyName}
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 14,
                  marginTop: hp(0.4),
                }}>
                Shipment Number
              </Text>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 20,
                  marginTop: hp(0.4),
                }}>
                #{enqId}
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
                {moment(details.enq.loadingTime).format('Do MMMM YYYY HH:mm A')}
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
                  value={`${props?.route?.params?.item?.weight}`}
                />
                <DetailsRow
                  labelColor={'#111'}
                  label={'Loading \n Expense'}
                  value={`₹ ${props?.route?.params?.item?.loadingExpense}`}
                />
                <DetailsRow
                  labelColor={'#111'}
                  label={'Unloading \n Expense'}
                  value={`₹ ${props?.route?.params?.item?.unloadingExpense}`}
                />
                {details?.enq?.advance !== null && (
                  <DetailsRow
                    labelColor={'#111'}
                    label={'Advance'}
                    value={`₹ ${details?.enq?.advance}`}
                  />
                )}
                {details?.enq?.againstBill && (
                  <DetailsRow
                    labelColor={'#111'}
                    label={'Pay Against Delivery'}
                    value={`₹ ${details?.enq?.againstBill}`}
                  />
                )}
              </>
            )}
            {show &&
              details?.enq?.advance !== null &&
              details?.enq?.againstBill && (
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
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default EnquiryDetailsConsignee;
