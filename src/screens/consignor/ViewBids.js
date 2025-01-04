import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {ScrollView, Text, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import TransporterBidCard from '../../Components/TransporterBidCard';
import TransporterListCard from '../../Components/TransporterListCard';
const ViewBids = props => {
  const enqId = props?.route?.params?.enqId;
  const [bidList, setBidList] = useState([]);
  const [bidListTransporter, setBidListTransporter] = useState([]);
  const [enq, setEnq] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`/bid/${enqId}`)
      .then(res => {
        if (Array.isArray(res.data.Bids)) {
          const bids = res.data.Bids;
          const companyNames = res.data.companyName;
          const list = bids.map((b, i) => ({
            ...b,
            companyName: companyNames[i],
          }));
          setBidList(list);
          setEnq({enq: res.data.enquiry, from: res.data.from, to: res.data.to});
          setLoading(false);
        } else if (!res?.data?.success) {
          setLoading(false);
        }
        if (Array.isArray(res.data.data_transporter_not_bides)) {
          const data_transporter_bides = res.data.data_transporter_not_bides;
          setBidListTransporter(data_transporter_bides);
          setLoading(false);
        }
        setLoading(false);
      })
      .catch(error => {
        // console.log('error', error);
        setLoading(false);
      });
  }, [enqId]);
  return (
    <ScrollView
      style={{
        borderRadius: 5,
        height: '100%',
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? '5%' : 0,
          backgroundColor: '#fff',
          paddingHorizontal: `5%`,
        }}>
        <View style={{}}>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              marginVertical: 10,
              marginLeft: 25,
              textAlign: 'center',
              fontSize: 16,
            }}>
            Bids from Transporter
          </Text>
        </View>
        {loading ? (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator />
          </View>
        ) : bidList.length > 0 ? (
          <View
            style={{
              borderRadius: 5,
            }}>
            {bidList.map((bid, i) => {
              return (
                <TransporterBidCard enq={enq} bid={bid} key={i} index={i} />
              );
            })}
          </View>
        ) : (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                marginVertical: 10,
                marginLeft: 25,
                textAlign: 'center',
                fontSize: 16,
              }}>
              No Bids received for this enquiry
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? '5%' : 0,
          backgroundColor: '#fff',
          paddingHorizontal: `5%`,
        }}>
        {bidListTransporter.length > 0 && (
          <View style={{}}>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                marginVertical: 10,
                marginLeft: 25,
                textAlign: 'center',
                fontSize: 16,
              }}>
              Transporter list
            </Text>
          </View>
        )}
        {bidListTransporter.length > 0 && (
          <View
            style={{
              borderRadius: 5,
            }}>
            {bidListTransporter.map((tData, i) => {
              console.log(tData);
              return <TransporterListCard tData={tData} key={i} index={i} />;
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ViewBids;
