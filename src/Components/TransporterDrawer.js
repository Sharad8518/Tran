// import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';
// import {connect} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const TrasporterDrawer = props => {
  //   const {navigation} = props;

  const signout = async () => {
    // await AsyncStorage.removeItem('token');
    // navigation.navigate('SignIn')
  };

  const translateX = Animated.interpolate(props.progress, {
    inputRange: [0, 0],
    outputRange: [0, 0],
    useNativeDriver: true,
  });
  return (
    <Animated.View style={{transform: [{translateX}], flex: 1, marginTop: -5}}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: 10,
            alignItems: 'center',
            height: 120,
            backgroundColor: '#3F51B5',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: hp(11),
              width: wp(20),
              borderWidth: 1,
              borderRadius: 35,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#EFECE8',
            }}>
            <FontAwesome5 name="user-alt" size={40} color="#C6C3BD" />
          </View>
        </View>
        <TouchableOpacity>
          <DrawerItem
            label={() => (
              <TouchableOpacity
                onPress={() => {
                  //   navigation.navigate('Home');
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#6e6e6e',
                    fontFamily: 'Lato-Regular',
                  }}>
                  Profile
                </Text>
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <DrawerItem
            label={() => (
              <TouchableOpacity
                onPress={() => {
                  //   navigation.navigate('Enquiries');
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#6e6e6e',
                    fontFamily: 'Lato-Regular',
                  }}>
                  All Enquiries
                </Text>
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <DrawerItem
            label={() => (
              <TouchableOpacity
                onPress={() => {
                  //   navigation.navigate('Shipment');
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#6e6e6e',
                    fontFamily: 'Lato-Regular',
                  }}>
                  All Shipments
                </Text>
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
      </DrawerContentScrollView>
      <Text style={{marginLeft: 20, color: '#9e9e9e'}}>v0.0.01</Text>
      <DrawerItem
        style={{}}
        label={() => (
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              borderTopColor: 'black',
              borderTopWidth: 0.5,
              height: 40,
              width: 250,
            }}
            onPress={() => {
              signout();
            }}>
            <Text
              style={{
                // padding: 10,
                marginLeft: 10,
                fontSize: 19,
                color: '#6e6e6e',
                fontFamily: 'Lato-Bold',
              }}>
              Sign Out
            </Text>
          </TouchableOpacity>
        )}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  profileimage2: {
    height: 60,
    width: 60,
    borderRadius: 30,
    marginLeft: wp(3),
  },
  sheets: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.7,
  },
});

// const mapPropsToStore = store => ({
//   store,
// });

// export default connect(
//   mapPropsToStore,
//   {},
// )(CustomDrawerContent);
export default TrasporterDrawer;
