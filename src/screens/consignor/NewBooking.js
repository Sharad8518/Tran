import axios from 'axios';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {connect, useDispatch} from 'react-redux';
import {FormInput} from '../../Components/FormInput';
import {FullScreenModalSelect} from '../../Components/FullScreenModalSelect';
import {withAppToaster} from '../../redux/AppState';
import {SET_PICK_AND_DROP} from '../../redux/enquiry/types';
import {setConsigneeList} from '../../redux/user/actions';

const NewBooking = props => {
  const {navigation, consignor, consigneeList, token, setToast} = props;
  const dispatch = useDispatch();
  const [pickupAddressId, setPickupAddressId] = useState(null);
  const [selectedConsignee, setConsignee] = useState(null);
  const consignorAddress = consignor.address.map(a => ({
    ...a,
    label: a.location,
    value: a._id,
  }));
  useEffect(() => {
    axios
      .get('/consignee/list', {headers: {Authorization: `Bearer ${token}`}})
      .then(res => {
        if (Array.isArray(res.data.consignees)) {
          dispatch(
            setConsigneeList(
              res.data.consignees.map(c => ({
                ...c,
                value: c._id,
                label: c.companyName,
              })),
            ),
          );
        } else {
          setToast({
            text: 'No Consignee added/registered. Add Consignee to continue.',
            styles: 'error',
          });
          setTimeout(() => {
            navigation.navigate('NewConsignee');
          }, 3000);
        }
      })
      .catch(error => {
        // console.log('error', error);
      });
  }, []);
  const validate = () => {
    if (!!selectedConsignee && !!pickupAddressId) {
      dispatch({
        type: SET_PICK_AND_DROP,
        payload: {
          consignee: selectedConsignee,
          pickupAddress: pickupAddressId,
        },
      });
      navigation.navigate('NewBooking2');
    } else {
      setToast({text: 'Please select to and from location', styles: 'error'});
    }
  };
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{height: hp(7), width: wp(100), backgroundColor: '#e6e6e6'}}>
        <LottieView
          style={{width: '100%', height: hp(7)}}
          source={require('../../../assets/truckAnimation.json')}
          autoPlay
          loop
        />
      </View>
      <View style={{marginTop: 20, paddingHorizontal: `5%`}}>
        <Text
          style={{
            color: '#424242',
            fontFamily: 'Lato-Bold',
            fontSize: 15,
          }}>
          From
        </Text>
        <FormInput
          disabled={true}
          leftIcon={<SimpleLineIcons name="user" color="#424242" size={15} />}
          name="consignor"
          values={{consignor: consignor?.profile?.adminName}}
        />
        <FullScreenModalSelect
          value={pickupAddressId?.value}
          placeholder="Select Pick up Location"
          leftIcon={
            <Icon
              style={{alignSelf: 'center'}}
              name="map-signs"
              type="font-awesome"
              color="#424242"
              size={15}
            />
          }
          items={consignorAddress}
          masterArr={consignorAddress}
          searchable={false}
          renderCustomComponent={true}
          customComponent={(item, i, onSelect) => (
            <AddressComponent
              key={i}
              onItemSelect={item => {
                setPickupAddressId(item);
                onSelect(item);
              }}
              item={item}
            />
          )}
        />
        {!!pickupAddressId && (
          <Text style={{fontFamily: 'Lato-Regular', color: '#424242'}}>
            Address:{' '}
            {`${pickupAddressId.address}, ${pickupAddressId.district}, ${pickupAddressId.state}, ${pickupAddressId.pincode}`}
          </Text>
        )}
      </View>

      <View style={{marginTop: 20, paddingHorizontal: `5%`}}>
        <Text
          style={{
            color: '#424242',
            fontFamily: 'Lato-Bold',
            fontSize: 15,
          }}>
          Deliver to
        </Text>
        <FullScreenModalSelect
          disabled={consigneeList?.length === 0}
          value={selectedConsignee?.value}
          placeholder="Select Consginee"
          leftIcon={
            <Icon
              style={{alignSelf: 'center'}}
              name="user"
              type="font-awesome"
              color="#424242"
              size={15}
            />
          }
          items={consigneeList}
          masterArr={consigneeList}
          searchable={false}
          renderCustomComponent={true}
          customComponent={(item, i, onSelect) => (
            <ConsigneeComponent
              key={i}
              onItemSelect={item => {
                setConsignee(item);
                onSelect(item);
              }}
              item={item}
            />
          )}
        />
        {!!selectedConsignee && (
          <Text style={{fontFamily: 'Lato-Regular', color: '#424242'}}>
            Address:{' '}
            {`${selectedConsignee.address}, ${selectedConsignee.location},  ${selectedConsignee.pincode}`}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => validate()}
        style={{
          marginVertical: hp(4),
          width: wp(80),
          backgroundColor: '#549CFF',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            fontSize: 15,
            color: 'white',
          }}>
          Next
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const AddressComponent = props => {
  const {item, onItemSelect} = props;
  return (
    <TouchableOpacity
      onPress={() => {
        return onItemSelect(item);
      }}>
      <Text style={{fontFamily: 'Lato-Bold'}}>{item.location}</Text>
      <Text
        style={{
          fontFamily: 'Lato-Regular',
        }}>{`${item.address}, ${item.district}, ${item.state}, ${item.pincode}`}</Text>
    </TouchableOpacity>
  );
};
const ConsigneeComponent = props => {
  const {item, onItemSelect} = props;
  return (
    <TouchableOpacity
      onPress={() => {
        return onItemSelect(item);
      }}>
      <Text style={{fontFamily: 'Lato-Bold'}}>{item.companyName}</Text>
      <Text
        style={{
          fontFamily: 'Lato-Regular',
        }}>{`${item.address}, ${item.location}, ${item.pincode}`}</Text>
    </TouchableOpacity>
  );
};
const mapStateToProps = store => ({
  token: store.authReducer.token,
  consignor: store.userReducer.consignor,
  consigneeList: store.userReducer.consigneeList,
});
export default withAppToaster(connect(mapStateToProps, {})(NewBooking));
