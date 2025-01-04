import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import Header from '../../Components/Header';

const BookingSuccess = props => {
  const {navigation, name} = props;

  return (
    <View style={{}}>
      <Header />
      <ScrollView style={{backgroundColor: '#fff'}}>
        <View>
          <Image
            source={require('../../../assets/NewBooking.png')}
            style={{height: hp(35), width: wp(85), alignSelf: 'center'}}
          />
        </View>
        <Text
          style={{
            marginVertical: hp(1),
            fontWeight: 'bold',
            alignSelf: 'center',
            fontFamily: 'poppins',
          }}>
          Requirement Posted Successfully
        </Text>

        <View
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
            borderRadius: 15,
            marginHorizontal: wp(5),
            // marginBottom : hp(10)
          }}>
          <View style={{borderRadius: 15, backgroundColor: '#549CFF'}}>
            <View
              style={{flexDirection: 'row', borderRadius: 15, height: hp(12)}}>
              <View style={{flex: 3.5, borderRadius: 15}}></View>
              <View style={{flex: 6.5, borderRadius: 15}}>
                <Text
                  style={{
                    color: '#fff',
                    marginTop: hp(3),
                    fontWeight: 'bold',
                    fontFamily: 'poppins',
                  }}>
                  VRL Logistics pvt ldt
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    marginTop: hp(1),
                    fontWeight: 'bold',
                    fontFamily: 'poppins',
                  }}>
                  Pick up on 02- 06- 2020
                </Text>
              </View>
            </View>
            <View
              style={{
                borderWidth: 0.3,
                borderColor: '#fff',
                marginTop: hp(1),
                width: wp(70),
                alignSelf: 'center',
              }}></View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginHorizontal: wp(4),
                marginBottom: hp(2),
              }}>
              <View style={{marginTop: hp(1), alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    marginTop: hp(1),
                    fontWeight: 'bold',
                    fontFamily: 'poppins',
                  }}>
                  Schedule
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    marginTop: hp(1),
                    fontFamily: 'poppins',
                    fontWeight: 'bold',
                  }}>
                  Immeadiate
                </Text>
              </View>
              <View style={{marginTop: hp(1), alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    marginTop: hp(1),
                    fontWeight: 'bold',
                    fontFamily: 'poppins',
                  }}>
                  Weight
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    marginTop: hp(1),
                    fontFamily: 'poppins',
                    fontWeight: 'bold',
                  }}>
                  15 tonnes
                </Text>
              </View>
              <View style={{marginTop: hp(1), alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    marginTop: hp(1),
                    fontWeight: 'bold',
                    fontFamily: 'poppins',
                  }}>
                  Meterial
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 13,
                    marginTop: hp(1),
                    fontFamily: 'poppins',
                    fontWeight: 'bold',
                  }}>
                  Coal in bags
                </Text>
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: hp(1)}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  marginLeft: wp(4),
                }}>
                Pickup From
              </Text>
            </View>
            <View style={{flex: 6.5, paddingLeft: wp(3)}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  lineHeight: 20,
                }}>
                Pickup From Pickup From Pickup From, Pickup From,Pickup
                FromPickup FromPickup From
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.2,
              borderColor: '#424242',
              marginTop: hp(1.5),
              width: wp(75),
              alignSelf: 'center',
            }}></View>

          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  marginLeft: wp(4),
                }}>
                Deliver To
              </Text>
            </View>
            <View style={{flex: 6.5, paddingLeft: wp(3)}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}>
                Pickup From Pickup From Pickup From, Pickup From,Pickup
                FromPickup FromPickup From
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.2,
              borderColor: '#424242',
              marginTop: hp(1.5),
              width: wp(75),
              alignSelf: 'center',
            }}></View>

          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  marginLeft: wp(4),
                }}>
                Packaging To
              </Text>
            </View>
            <View style={{flex: 6.5, paddingLeft: wp(3)}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                }}>
                Jombo bags
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.2,
              borderColor: '#424242',
              marginTop: hp(1.5),
              width: wp(75),
              alignSelf: 'center',
            }}></View>

          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  marginLeft: wp(4),
                }}>
                Truck type
              </Text>
            </View>
            <View style={{flex: 6.5, paddingLeft: wp(3)}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                }}>
                18 WHL
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.2,
              borderColor: '#424242',
              marginTop: hp(1.5),
              width: wp(75),
              alignSelf: 'center',
            }}></View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  marginLeft: wp(4),
                }}>
                Pickup Date
              </Text>
            </View>
            <View style={{flex: 6.5, paddingLeft: wp(3)}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                }}>
                Jombo bags
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.2,
              borderColor: '#424242',
              marginTop: hp(1.5),
              width: wp(75),
              alignSelf: 'center',
            }}></View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  marginLeft: wp(4),
                }}>
                Pickup Time
              </Text>
            </View>
            <View style={{flex: 6.5, paddingLeft: wp(3)}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                }}>
                12:00pm
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.2,
              borderColor: '#424242',
              marginTop: hp(1.5),
              width: wp(75),
              alignSelf: 'center',
            }}></View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  marginLeft: wp(4),
                }}>
                Weight
              </Text>
            </View>
            <View style={{flex: 6.5, paddingLeft: wp(3)}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                }}>
                10 Metric Tone
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.2,
              borderColor: '#424242',
              marginTop: hp(1.5),
              width: wp(75),
              alignSelf: 'center',
            }}></View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  //   lineHeight : 12,
                  marginLeft: wp(4),
                }}>
                Loading Expense
              </Text>
            </View>
            <View style={{flex: 6.5, paddingLeft: wp(3)}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                }}>
                9000/truck{' '}
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.2,
              borderColor: '#424242',
              marginTop: hp(1.5),
              width: wp(75),
              alignSelf: 'center',
            }}></View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  marginLeft: wp(4),
                }}>
                Unloading Expense
              </Text>
            </View>
            <View style={{flex: 6.5, paddingLeft: wp(3)}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                }}>
                500/truck
              </Text>
            </View>
          </View>
          <View
            style={{
              borderWidth: 0.2,
              borderColor: '#424242',
              marginTop: hp(1.5),
              width: wp(75),
              alignSelf: 'center',
            }}></View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 3.5}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                  marginLeft: wp(4),
                }}>
                Payment Estimate
              </Text>
            </View>
            <View style={{flex: 6.5, paddingLeft: wp(3)}}>
              <Text
                style={{
                  fontSize: 13,
                  marginTop: hp(1),
                  fontFamily: 'poppins',
                  fontWeight: 'bold',
                }}>
                ₹ 52,000
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 20,
              marginVertical: hp(3),
              alignSelf: 'center',
              color: '#FFA654',
              fontWeight: 'bold',
              fontFamily: 'poppins',
            }}>
            Total :₹70,000
          </Text>
          {/* <View
            style={{
              borderWidth: 0.2,
              borderColor: '#424242',
              marginTop: hp(1.5),
              width: wp(75),
              alignSelf: 'center',
            }}></View> */}
        </View>
        <TouchableOpacity
          style={{
            height: hp(7),
            width: wp(80),
            backgroundColor: '#549CFF',
            borderRadius: 15,
            alignSelf: 'center',
            marginTop: hp(3),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'poppins',
              color: '#fff',
              alignSelf: 'center',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Submit
          </Text>
        </TouchableOpacity>
        <View style={{marginBottom: hp(10)}}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default BookingSuccess;
