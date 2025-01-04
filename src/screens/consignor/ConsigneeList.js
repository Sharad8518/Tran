import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {connect, useDispatch} from 'react-redux';
import {withAppToaster} from '../../redux/AppState';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native';
import {setConsigneeList} from '../../redux/user/actions';
import {FlatList} from 'react-native';
import {Platform} from 'react-native';
import {Icon} from 'react-native-elements';

const ConsigneeList = props => {
  const {token, setToast, consigneeList, navigation} = props;
  const [loader, setLoader] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get('/consignee/list', {headers: {Authorization: `Bearer ${token}`}})
      .then(res => {
        const consignee = res.data.consignees ?? [];
        dispatch(setConsigneeList(consignee));
        setLoader(false);
      })
      .catch(error => {
        // console.log('error', error);
        setLoader(false);
      });
  }, []);
  const renderItem = ({item}) => (
    <View
      style={{borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 10}}>
      <View style={{flexDirection: 'row'}}>
        <View style={{flex: 9}}>
          <Text style={{fontFamily: 'Lato-Bold'}}>
            Company Name: {item.companyName}
          </Text>
          <Text style={{fontFamily: 'Lato-Regular'}}>
            Address: {item.address}, {item.location}, {item.pincode}
          </Text>
        </View>
        {item.addByConsignor === 1 && (
          <Icon
            name="edit"
            size={16}
            onPress={() =>
              navigation.navigate('NewConsignee', {
                edit: true,
                consignee: {
                  ...item,
                  contact: item.contact.toString(),
                  managerName: item.adminName,
                },
              })
            }
          />
        )}
      </View>
    </View>
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: '5%',
      }}>
      {loader ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator style={{alignSelf: 'center'}} size={30} />
        </View>
      ) : (
        <FlatList
          ListEmptyComponent={
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  textAlign: 'center',
                }}>
                No Consignee registered or added
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('NewConsignee')}
                style={{
                  width: wp(80),
                  backgroundColor: '#549CFF',
                  height: 50,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontSize: 15,
                    color: 'white',
                  }}>
                  Add Consignee
                </Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={{
            backgroundColor: '#fff',
            paddingHorizontal: '5%',
            paddingTop: Platform.OS === 'ios' ? '15%' : 0,
          }}
          data={consigneeList}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      )}
      {!loader && consigneeList?.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('NewConsignee')}
          style={{
            backgroundColor: '#549CFF',
            height: 50,
            justifyContent: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 15,
              color: 'white',
              textAlign: 'center',
            }}>
            Add Consignee
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const mapStateToProps = store => ({
  token: store.authReducer.token,
  consigneeList: store.userReducer.consigneeList,
});
export default withAppToaster(connect(mapStateToProps, {})(ConsigneeList));
