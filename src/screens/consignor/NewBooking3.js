import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {withAppToaster} from '../../redux/AppState';
const NewBooking3 = props => {
  const {enquiry, token, setToast, navigation} = props;
  const [btnLoader, setBtnLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transporters, setTransporters] = useState([]);
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    axios
      .get(
        `/transporter/list/${enquiry?.selectedConsignee?.location}/${enquiry?.pickupAddress?.location}`,
        {headers: {Authorization: `Bearer ${token}`}},
      )
      .then(res => {
        if (!!res.data) {
          const list = res.data.map(t => t[0]);
          setTransporters(list);
        }
        setLoading(false);
      });
  }, [enquiry]);
  const onItemPress = id => {
    let selectedData;
    if (selected.some(i => i === id))
      selectedData = selected.filter(I => I !== id);
    else selectedData = [...selected, id];
    setSelected(selectedData);
  };
  const submit = () => {
    setBtnLoader(true);
    const payload = {
      toConsigneeId: enquiry.selectedConsignee._id,
      pickupAddresssId: enquiry.pickupAddress._id,
      weight: enquiry.weight,
      truckType: enquiry.truckType,
      material: enquiry.material,
      unloadingExpense: enquiry.unloadingExpense,
      loadingExpense: enquiry.loadingExpense,
      loadingTime: enquiry.loadingTime,
      advance: enquiry.advance === '' ? null : enquiry.advance,
      againstBill: enquiry.againstbill === '' ? null : enquiry.againstbill,
      remarks: enquiry.remarks,
      selectedTransporters: selected.map(s => s.toString()),
    };
    axios
      .post('/enquiry', payload, {headers: {Authorization: `Bearer ${token}`}})
      .then(res => {
        setBtnLoader(false);
        setToast({text: 'Enquiry created successfully!', styles: 'success'});
        navigation.navigate('EnqListConsignor');
      })
      .catch(error => {
        // console.log('error,', error);
        setToast({
          text: 'Something went wrong. Please try again!',
          styles: 'error',
        });
        setBtnLoader(false);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: '5%',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? '15%' : '0%',
      }}>
      <View style={{}}>
        <Text
          style={{
            color: '#424242',
            fontFamily: 'Lato-Bold',
            fontSize: 15,
          }}>
          Select Transporter
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
          No Transporters found for {enquiry?.pickupAddress?.location} to{' '}
          {enquiry?.selectedConsignee?.location}
        </Text>
      ) : (
        <ScrollView>
          {transporters.map((t, i) => {
            const isSelected = selected.find(tr => tr === t._id);
            return (
              <TouchableOpacity
                style={{backgroundColor: 'transparent'}}
                onPress={() => onItemPress(t._id)}
                activeOpacity={0.8}
                key={i}>
                <View
                  style={{
                    position: 'absolute',
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    backgroundColor: isSelected ? '#549CFF' : '#B0B0B0',
                    top: 5,
                    right: 0,
                    zIndex: 1000,
                    justifyContent: 'center',
                  }}>
                  {isSelected && (
                    <Icon size={16} name="check" type="entypo" color="#fff" />
                  )}
                </View>
                <View
                  style={{
                    paddingHorizontal: '5%',
                    paddingVertical: '3%',
                    borderWidth: 0.9,
                    borderColor: '#ccc',
                    borderRadius: 10,
                    marginVertical: 10,
                    zIndex: -1000,
                  }}>
                  <Text
                    style={{
                      color: '#424242',
                      fontFamily: 'Lato-Bold',
                      fontSize: 15,
                      textTransform: 'uppercase',
                    }}>
                    {t.companyName}
                  </Text>
                  <Text style={{fontFamily: 'Lato-Regular'}}>
                    {enquiry?.pickupAddress?.location} to{' '}
                    {enquiry?.selectedConsignee?.location}: {enquiry?.weight}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={() => (selected.length > 0 ? submit() : {})}
        style={{
          marginVertical: hp(4),
          backgroundColor: selected.length > 0 ? '#549CFF' : '#B0B0B0',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {btnLoader ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 15,
              color: 'white',
            }}>
            Submit
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = store => ({
  enquiry: store.enquiryReducer.newEnquiry,
  token: store.authReducer.token,
});
export default withAppToaster(connect(mapStateToProps, {})(NewBooking3));
