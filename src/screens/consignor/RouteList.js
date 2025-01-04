import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {withAppToaster} from '../../redux/AppState';
import {T} from 'lodash/fp';
const RouteList = props => {
  const {token, setToast, navigation, route} = props;
  const [loading, setLoading] = useState(true);
  const [transporters, setTransporters] = useState([]);

  useEffect(() => {
    axios
      .get(
        `/alltransporter/routes?user_id=${route?.params?.TransporterData?.userId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then(res => {
        if (!!res.data) {
          setTransporters(res.data);
        }
        setLoading(false);
      })
      .catch(err => {});
  }, [route]);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: '5%',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? '15%' : '0%',
      }}>
      <View>
        <Text
          style={{
            color: '#424242',
            fontFamily: 'Lato-Bold',
            fontSize: 15,
            textTransform: 'uppercase',
            marginVertical: 3,
          }}>
          Company Name : {route?.params?.TransporterData?.companyName}
        </Text>
        <Text
          style={{
            color: '#424242',
            fontFamily: 'Lato-Bold',
            fontSize: 15,
            textTransform: 'uppercase',
            marginVertical: 3,
          }}>
          Name: {route?.params?.TransporterData?.userName}
        </Text>
        <Text
          style={{
            color: '#424242',
            fontFamily: 'Lato-Bold',
            fontSize: 15,
            textTransform: 'uppercase',
            marginVertical: 3,
          }}>
          From: {route?.params?.TransporterData?.address}
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : transporters.length === 0 ? (
        <Text
          style={{
            color: '#424242',
            fontFamily: 'Lato-Bold',
            fontSize: 15,
            textAlign: 'center',
          }}>
          No routes found
        </Text>
      ) : (
        <ScrollView>
          {transporters.map((t, i) => {
            return (
              <View>
                <View
                  style={{
                    paddingHorizontal: '5%',
                    paddingVertical: '3%',
                    borderWidth: 0.9,
                    borderColor: '#ccc',
                    borderRadius: 10,
                    marginVertical: 5,
                  }}>
                  <Text style={{fontSize: 14}}>
                    {t.fromAddress} To {t?.toAddress}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const mapStateToProps = store => ({
  enquiry: store.enquiryReducer.newEnquiry,
  token: store.authReducer.token,
});
export default withAppToaster(connect(mapStateToProps, {})(RouteList));
