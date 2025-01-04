import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';

const TransHeader = props => {
  const {navigation, name} = props;

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity
          //   onPress={() => navigation.openDrawer()}
          style={{marginLeft: 20}}>
          <Entypo name="menu" size={30} color="#549CFF" />
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
          //   onPress={() => navigation.openDrawer()}
          style={{marginRight: 20}}>
          <Entypo name="dots-two-vertical" size={30} color="#549CFF" />
        </TouchableOpacity>

        {/* <TouchableOpacity
        //   onPress={() => navigation.openDrawer()}
        style={{marginRight: 20}}>
        <Entypo name="menu" size={30} color="#549CFF" />
      </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: hp(100),
  },
  text: {
    color: 'white',
    fontSize: 38,
    paddingTop: hp(10),
  },
  name: {
    height: hp(20),
    alignItems: 'center',
  },
  box: {
    width: wp(88),
    height: hp(7),
    borderWidth: 1,
    borderColor: '#fff',
    alignSelf: 'center',
    borderRadius: 5,
  },
  iconbox: {
    width: wp(15),
    height: hp(7),
    borderWidth: 1,
    borderRightColor: '#fff',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  header: {
    height: hp(7),
    width: wp(100),
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default TransHeader;
