import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import TransHeader from '../../Components/TransHeader';
import ScheduleCard from '../../Components/ScheduleCard';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const Schedule = props => {
  const {navigation, name} = props;

  return (
    <View>
      <TransHeader name="Schedules" />
      {/* <Text> Go</Text> */}
      <View style={{backgroundColor: 'white'}}>
        <Text
          style={{
            fontFamily: 'Lato-Bold',
            marginVertical: hp(2),
            marginLeft: wp(4),
          }}>
          Keep track of your schedule deliveries
        </Text>
      </View>
      <View style={{backgroundColor: '#fff', marginBottom: 30}}>
        <ScrollView
          style={{
            backgroundColor: '#fff',
            marginBottom: hp(8),
            width: wp(85),
            alignSelf: 'center',
            borderRadius: 5,

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,

            elevation: 6,
          }}>
          <ScheduleCard />
          <ScheduleCard />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Schedule;
