import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {ScrollView, View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {FlatList} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

const ViewEnquiries = props => {
  const {navigation, token} = props;
  const [loading, setLoading] = useState(true);
  const [Enq, setEnq] = useState([]);

  useEffect(() => {
    axios
      .get('/consignee/enquiry/details', {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        const enquiries = res.data.enquiries.map((e, i) => {
          return {
            ...e,
            addr: res.data.consignorAddressList[i],
            enq: res.data.enquiries[i],
          };
        });
        setEnq(enquiries);
        setLoading(false);
      })
      .catch(error => {
        // console.log('consignor profile', error);
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
            Enquiry: #{item.enq._id}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Lato-Regular',
              marginVertical: 2,
            }}>
            Address: {item.addr.address}
          </Text>
          <Text
            style={{
              marginVertical: 2,
              fontSize: 14,
              fontFamily: 'Lato-Regular',
              textTransform: 'capitalize',
            }}>
            Loading Time:{'  '}
            {moment(item.enq.loadingTime).format('Do MMMM YYYY HH:mm A')}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('EnquiryDetailsConsignee', {
                enqId: item._id,
                item: item,
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
    <View
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? '15%' : 0,
      }}>
      {loading ? (
        <View
          style={{flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>
          <ActivityIndicator color="#549CFF" />
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
                No Shipments founds
              </Text>
            </View>
          }
          contentContainerStyle={{
            backgroundColor: '#fff',
            paddingTop: '15%',
          }}
          data={Enq}
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
            No Enquiries founds
          </Text>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = store => ({
  token: store.authReducer.token,
});

export default connect(mapStateToProps, {})(ViewEnquiries);
