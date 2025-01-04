import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {connect} from 'react-redux';
import axios from 'axios';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
const EnqDetailsTran = props => {
  const {navigation, submittedEnqIds} = props;
  const id = props?.route?.params?.id;
  const [loading, setLoading] = useState(true);
  const [bidDetails, setBidDetails] = useState('');
  const [details, setDetails] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    axios
      .get(`/enquiry/single?enquiryId=${id}`)
      .then(res => {
        const enq = res.data.enquiry;
        const to = res.data.toAddress;
        const from = res.data.fromAddress;
        setDetails({enq, to, from});
        setLoading(false);
        setBidDetails(res.data);
      })
      .catch(error => {
        setLoading(false);
        // console.log('error', error);
      });
  }, [isFocused]);

  const isBidSubmitted = useMemo(() => submittedEnqIds.includes(id), [id]);
  return (
    <View style={{flex: 1}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : !!details ? (
        <ScrollView
          contentContainerStyle={{paddingHorizontal: '5%', paddingBottom: '5%'}}
          style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{height: hp(35), backgroundColor: '#fff'}}>
            <Image
              source={require('../../../assets/ShipmentSummary.png')}
              style={{height: hp(35), width: wp(80), alignSelf: 'center'}}
            />
          </View>
          <View style={{backgroundColor: '#fff'}}>
            <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>
              Requirement posted by {details.to.companyName}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#549CFF',
              marginTop: 10,
              borderRadius: 20,
              padding: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 2,
                borderColor: '#fff',
              }}>
              <View style={{flex: 2}}>
                <Image
                  style={{height: 80, width: '100%'}}
                  resizeMode="contain"
                  source={require('../../../assets/enqBox.png')}
                />
              </View>
              <View style={{flex: 8, paddingHorizontal: '3%'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                  }}>
                  {details.to.companyName}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    position: 'absolute',
                    right: 10,
                  }}>
                  {bidDetails.bid_rank !== undefined
                    ? 'L' + bidDetails.bid_rank.sn
                    : ''}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 16,
                    marginTop: 5,
                  }}>
                  Pick up on{' '}
                  {moment(details.enq.loadingTime).format(
                    'Do MMMM YYYY HH:mm A',
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '3%',
              }}>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                  }}>
                  Truck Type
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    marginTop: 10,
                  }}>
                  {details?.enq?.truckType}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                  }}>
                  Weight
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    marginTop: 10,
                  }}>
                  {details?.enq?.weight}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                  }}>
                  Material
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    marginTop: 10,
                  }}>
                  {details?.enq?.material}
                </Text>
              </View>
            </View>
          </View>
          <DetailsRow label="Pick From" value={`${details?.from?.address}`} />
          <DetailsRow label="Deliver to" value={`${details?.to?.address}`} />
          <DetailsRow
            label="Pickup Date"
            value={moment(details?.enq?.loadingTime).format(
              'Do MMMM YYYY HH:mm A',
            )}
          />
          <DetailsRow label="Weight" value={`${details?.enq?.weight}`} />
          <DetailsRow
            label={'Loading \n Expense'}
            value={`₹ ${details?.enq?.loadingExpense} per MT`}
          />
          <DetailsRow
            label={'Unloading \n Expense'}
            value={`₹ ${details?.enq?.unloadingExpense} per MT`}
          />
          {details?.enq?.advance !== null && (
            <DetailsRow
              label={'Advance'}
              value={`₹ ${details?.enq?.advance}`}
            />
          )}
          {details?.enq?.againstBill !== null && (
            <DetailsRow
              label={'Pay Against Delivery'}
              value={`₹ ${details?.enq?.againstBill}`}
            />
          )}
          {details?.enq?.againstBill !== null &&
            details?.enq?.advance !== null && (
              <Text
                style={{
                  textAlign: 'center',
                  color: '#FFA654',
                  fontFamily: 'Lato-Bold',
                  fontSize: 18,
                  marginVertical: 10,
                }}>
                Total: ₹{' '}
                {parseFloat(details?.enq?.loadingExpense) +
                  parseFloat(details?.enq?.unloadingExpense) +
                  parseFloat(details?.enq?.againstBill)}
              </Text>
            )}

          <TouchableOpacity
            // activeOpacity={isBidSubmitted ? 1 : 0.8}
            disabled={
              bidDetails.databid !== undefined &&
              bidDetails.databid.status === 'accepted'
            }
            onPress={() => {
              bidDetails.databid !== undefined &&
              bidDetails.databid.status === 'accepted'
                ? {}
                : bidDetails.databid !== undefined &&
                  bidDetails.databid.status === 'rejected'
                ? {}
                : navigation.navigate('PlaceBid', {
                    id: id,
                  });
            }}
            style={{
              marginVertical: hp(4),
              backgroundColor: '#549CFF',
              height: 50,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontSize: 15,
                color: 'white',
              }}>
              {bidDetails.databid !== undefined &&
              bidDetails.databid.status === 'accepted'
                ? 'Bid accepted'
                : bidDetails.databid !== undefined &&
                  bidDetails.databid.status === 'rejected'
                ? 'Bid rejected'
                : isBidSubmitted
                ? 'Update bid'
                : 'Place Bid'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <Text>Could not fetch</Text>
      )}
    </View>
  );
};
export const DetailsRow = ({
  label,
  value,
  labelColor = '#757575',
  containerStyle = {},
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 0.8,
        borderColor: '#ccc',
        ...containerStyle,
        flex: 1,
      }}>
      <View style={{flex: 3.5}}>
        <Text
          style={{
            color: labelColor,
            fontFamily: 'Lato-Bold',
            marginLeft: wp(2),
          }}>
          {label}
        </Text>
      </View>
      <View style={{flex: 6.5}}>
        <Text
          style={{
            color: '#757575',
            fontFamily: 'Lato-Bold',
            marginLeft: wp(2),
          }}>
          {value}
        </Text>
      </View>
    </View>
  );
};
const mapStateToProps = store => ({
  token: store.authReducer.token,
  submittedEnqIds: store.enquiryReducer.transporterBidEnquiryIds,
});
export default connect(mapStateToProps, {})(EnqDetailsTran);
