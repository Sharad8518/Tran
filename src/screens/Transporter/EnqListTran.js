import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {FlatList, Text, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {connect, useDispatch} from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import {Platform} from 'react-native';
import {SET_TRANS_BID_ENQ_IDS} from '../../redux/enquiry/types';
const EnqListTran = props => {
  const {navigation, token} = props;
  const dispatch = useDispatch();
  const [Enq, setEnq] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get('/transporter/enquiry/all', {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        const enquiries = res.data.enqInfo.map((e, i) => {
          return {
            ...e,
            from: res.data.pickupLocationInfo[i],
            to: res.data.dropLocationInfo[i],
          };
        });
        setEnq(enquiries);
        setLoading(false);
      })
      .catch(error => {
        // console.log('consignor profile', error);
        setLoading(false);
      });
  }, []);
  const getBids = id => {
    axios
      .get('/bid/transporter/enquiryid', {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(resp => {
        setTimeout(() => {
          navigation.navigate('EnqDetailsTran', {id: id});
        }, 100);
        const ids = resp.data.map(e => e.enquiryId);
        dispatch({type: SET_TRANS_BID_ENQ_IDS, payload: ids});
      })
      .catch(err => {});
  };
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
        <View style={{flex: 8, paddingHorizontal: '5%'}}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Lato-Bold',
            }}>
            Enquiry # {item._id}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Lato-Regular',
            }}>
            From: {item.from.location}
            {`\n`}
            To: {item.to.address}
          </Text>
          {item.advance !== null && (
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Lato-Regular',
              }}>
              Advance : ₹ {item.advance}
            </Text>
          )}
          {item.againstBill !== null && (
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Lato-Regular',
              }}>
              Against Bill : ₹ {item.againstBill}
            </Text>
          )}
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Lato-Regular',
            }}>
            Loading Expense : ₹ {item.loadingExpense} Per MT
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Lato-Regular',
            }}>
            Loading time :{' '}
            {moment(item.loadingTime).format('Do MMMM YYYY HH:mm A')}
          </Text>
          <TouchableOpacity
            onPress={() => getBids(item._id)}
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
      ) : Array.isArray(Enq) && Enq.length > 0 ? (
        <FlatList
          ListEmptyComponent={
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Lato-Bold',
                  textAlign: 'center',
                }}>
                No Enquiries founds
              </Text>
            </View>
          }
          contentContainerStyle={{
            backgroundColor: '#fff',
            paddingTop: Platform.OS === 'ios' ? '15%' : 0,
          }}
          data={Enq}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      ) : (
        <View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'Lato-Bold',
              textAlign: 'center',
            }}>
            No Enquiries found
          </Text>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = store => ({
  token: store.authReducer.token,
});
export default connect(mapStateToProps, {})(EnqListTran);
