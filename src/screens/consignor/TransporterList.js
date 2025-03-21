import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  TextInput,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {withAppToaster} from '../../redux/AppState';
import {Searchbar} from 'react-native-paper';
import {T} from 'lodash/fp';
import { color } from 'react-native-elements/dist/helpers';
const TransporterList = props => {
  const {token, setToast, navigation} = props;
  const [btnLoader, setBtnLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transporters, setTransporters] = useState([]);
  const [sortTransporters, setSortTransporters] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    const filterResult = transporters.filter(val =>
      val.userName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    setSortTransporters(filterResult);
  }, [searchQuery]);
  useEffect(() => {
    axios
      .get(`/transporter/all-transporters`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        if (!!res.data.data) {
          console.log('res.data',res.data)
          setSortTransporters(res.data.data);
          setTransporters(res.data.data);
        }
        setLoading(false);
      })
      .catch(err => {});
  }, []);
  useEffect(() => {
    axios
      .get(`/transporter/selected-transporter-ids`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        const selectedDataApi = [];
        if (!!res.data.Data) {
          res.data.Data.map(d => selectedDataApi.push(d._id));
        }
        setSelected(selectedDataApi);
      })
      .catch(err => {});
  }, []);
  const onItemPress = id => {
    let selectedData;
    if (selected.some(i => i === id))
      selectedData = selected.filter(I => I !== id);
    else selectedData = [...selected, id];
    setSelected(selectedData);
  };
  
  const submit = async () => {
    setBtnLoader(true);
    const data = [];
    selected.map(
      s => transporters.map(t => (s === t._id ? data.push({
        address:t.address,
        companyName:t.companyName,
        userId:t._id,
        userName:t.userName
      
  }) : '')),
      // data.push(transporters.filter(I => I._id === s))
    );
    // const data = {
    //   data_list: selected
    //     .map(s => transporters.find(t => t._id === s))
    //     .filter(t => t) // Remove undefined values
    //     .map(t => ({
    //       userId: t.userId,
    //       userName: t.userName
    //     }))
    // };

    

   
     console.log('data',data)

    const payload = {
      data_list: data,
    };
    axios
      .post('/transporter/update-transporter-list', payload, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
         console.log('res',res)
        setBtnLoader(false);
        setToast({text: 'Updated Successfully', styles: 'success'});
        navigation.goBack();
      })
      .catch(error => {
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
      {/* <Searchbar
        placeholder="Search Transporter"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={{
          marginVertical: 10,
          backgroundColor: '#fff',
        }}
      /> */}

      <View style={{width:"100%",height:45,backgroundColor:"#fff",marginTop:10,borderRadius:10,borderColor:"#ddd",borderWidth:1,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
       <TextInput placeholderTextColor={"#777"} placeholder='Search Transporter' style={{width:"95%",color:"#000"}}  value={searchQuery}  onChangeText={onChangeSearch}/>
      </View>

      {loading ? (
        <ActivityIndicator />
      ) : sortTransporters.length === 0 ? (
        <Text
          style={{
            color: '#424242',
            fontFamily: 'Lato-Bold',
            fontSize: 15,
            textAlign: 'center',
          }}>
          No Transporters found
        </Text>
      ) : (
        <ScrollView>
          {sortTransporters.map((t, i) => {
            const isSelected = selected.find(tr => tr === t._id);
            return (
              <View>
                <View
                  style={{
                    paddingHorizontal: '5%',
                    paddingVertical: '3%',
                    borderWidth: 0.9,
                    borderColor: '#ccc',
                    borderRadius: 10,
                    marginVertical: 10,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('RouteList', {TransporterData: t})
                    }>
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
                      {t.userName} From {t?.address}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onItemPress(t._id)}
                    style={{
                      position: 'absolute',
                      right: 0,
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      backgroundColor: isSelected ? '#549CFF' : '#B0B0B0',
                    }}>
                    <View>
                      {isSelected && (
                        <Icon
                          size={16}
                          name="check"
                          type="entypo"
                          color="#fff"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
      <TouchableOpacity
        disabled={btnLoader}
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
export default withAppToaster(connect(mapStateToProps, {})(TransporterList));
