import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import ShipmentCard from '../../Components/ShipmentCrad';

const ViewBidsConsignee = props => {
  const {navigation, token} = props;
  const [enqList, setEnq] = useState([]);
  const [loading, setLoading] = useState(true);
  //   useEffect(() => {
  //     axios
  //       .get('/enquiry', {
  //         headers: {Authorization: `Bearer ${token}`},
  //       })
  //       .then(res => {
  //         const enquiries = res.data.enquiriesList.map((e, i) => {
  //           return {
  //             ...e,
  //             from: res.data.fromEnq[i],
  //             to: res.data.toEnq[i],
  //           };
  //         });
  //         setEnq(enquiries);
  //         setLoading(false);
  //       })
  //       .catch(error => {
  //         console.log('consignor profile', error);
  //       });
  //   }, []);

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
          {enqList.map((enq, i) => {
            return <ShipmentCard item={enq} nav={navigation} key={enq._id} />;
          })}
        </ScrollView>
      )}
    </View>
  );
};

const mapStateToProps = store => ({
  token: store.authReducer.token,
});

export default connect(mapStateToProps, {})(ViewBidsConsignee);
