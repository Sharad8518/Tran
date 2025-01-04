import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {Platform} from 'react-native';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import HeaderIcon from '../../assets/svg/HeaderIcon.svg';
import TopRightIcon from '../../assets/topmenu.svg';
import Icon from 'react-native-vector-icons/FontAwesome';

import {logoutUser} from '../redux/auth/actions';
import About from '../screens/consignor/About';
import {useNavigation} from '@react-navigation/native';
const Header = props => {
  const {name, role} = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const logoutUserFunc = async () => {
    await AsyncStorage.multiRemove(['token', 'role', 'fcmToken']);
    dispatch(logoutUser());
  };
  const [showModal, toggleModal] = useState(false);
  if (Platform.OS === 'android') {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              toggleModal(true);
            }}
            style={{}}>
            <HeaderIcon height={25} width={25} />
          </TouchableOpacity>
          <View style={styles.title}>
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                fontSize: 20,
                color: '#424242',
                fontWeight: 'bold',
              }}>
              {name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              role === 'Trans'
                ? navigation.navigate('HomeTrans')
                : role === 'consignee'
                ? navigation.navigate('ConsigneeHome')
                : navigation.navigate('ConsignorHome');
            }}
            style={{marginRight: 10}}>
            <Icon name="home" color="#549CFF" size={25} />
          </TouchableOpacity>
        </View>
        <Modal animationType="slide" visible={showModal}>
          <About
            logout={() => logoutUserFunc()}
            onBackPress={() => toggleModal(false)}
          />
        </Modal>
      </>
    );
  }
  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            toggleModal(true);
          }}
          style={{}}>
          <HeaderIcon height={25} width={25} />
        </TouchableOpacity>
        <View style={styles.title}>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: 20,
              color: '#424242',
              fontWeight: 'bold',
            }}>
            {name}
          </Text>
        </View>
        <TouchableOpacity style={{marginRight: 10}}>
          <TopRightIcon height={20} width={20} />
        </TouchableOpacity>
      </View>
      <Modal animationType="slide" visible={showModal}>
        <About
          logout={() => logoutUserFunc()}
          onBackPress={() => toggleModal(false)}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: hp(7),
    width: wp(100),
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    borderBottomWidth: 0.8,
    borderColor: '#ccc',
  },
});

export default Header;
