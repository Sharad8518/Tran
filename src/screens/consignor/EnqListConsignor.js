import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {ScrollView, View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import ShipmentCardConsignee from '../../Components/ShipmentCardConsignee';
const EnqListConsignor = props => {
  const {navigation, token} = props;
  const [enqList, setEnq] = useState([]);
  console.log('enqList',enqList)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getEnq();
    
  }, []);



  const getEnq = () => {
    axios
      .get('/enquiry/getEnquiries', {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        console.log("enquiry res",res.data)
        if (
          res.data.enquiriesList !== undefined &&
          res.data.enquiriesList.length > 0
        ) {
          const enquiries = res.data.enquiriesList.map((e, i) => {
            return {
              ...e,
              from: res.data.fromEnq[i],
              to: res.data.toEnq[i],
            };
          });
          setEnq(enquiries);
          setLoading(false);
        }
        setLoading(false);
      })
      .catch(error => {
        //  console.log('consignor enquiry', error);
      });
  };


  // const getEnq2 = async () => {
  //   try {
  //     const response = await fetch('https://tran-backend-nodejs-restapi.onrender.com/api/enquiry/getEnquiries', {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  
  //     const res = await response.json();
  //     console.log("enquiry res", res.data.data);
  
  //     if (res.data.data !== undefined && res.data.data.length > 0) {
  //       const enquiries = res.data.data.map((e, i) => ({
  //         ...e,
  //         from: res.data.fromEnq[i],
  //         to: res.data.toEnq[i],
  //       }));
  //       setEnq(enquiries);
  //     }
      
  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error fetching enquiries:', error);
  //     setLoading(false);
  //   }
  // };
  

  const deleteEnq = id => {
    const data = {enquiry_id: id};
    axios
      .post(
        '/enquiry/single/delete',
        {enquiry_id: id},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then(res => {
        getEnq();
      })
      .catch(error => {
        //  console.log('consignor enquiry', error);
      });
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
      ) : (
        <ScrollView
          style={{
            backgroundColor: '#fff',
            flex: 1,
          }}>
          {enqList.length === 0 ? (
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Lato-Bold',
                textAlign: 'center',
              }}>
              No Enquiries founds
            </Text>
          ) : null}
          {enqList.map((enq, i) => {
            return (
              <ShipmentCardConsignee
                item={enq}
                nav={navigation}
                key={enq._id}
                deleteEnq={deleteEnq}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const mapStateToProps = store => ({
  token: store.authReducer.token,
});

export default connect(mapStateToProps, {})(EnqListConsignor);
