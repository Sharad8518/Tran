import moment from 'moment';
import React from 'react';
import {Text, View} from 'react-native';
import DestinationIcon from '../../assets/svg/destination.svg';
import DispatchedIcon from '../../assets/svg/dispatched.svg';
import TransitIcon from '../../assets/svg/in-transit.svg';

export const Tracker = ({
  from,
  to,
  currentStatus,
  lastUpdate,
  //   isDelivered = true,
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <DispatchedIcon height={40} width={40} />
        <TransitIcon height={40} width={40} />
        <DestinationIcon height={40} width={40} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 10,
            backgroundColor: '#549CFF',
            marginLeft: 5,
          }}
        />
        <View style={{height: 3, backgroundColor: '#549CFF', flex: 1}} />
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 10,
            backgroundColor: '#549CFF',
          }}
        />
        <View
          style={{
            height: 3,
            backgroundColor:
              currentStatus === 'Delivered' ? '#549CFF' : '#F99746',
            flex: 1,
          }}
        />
        {!currentStatus ? (
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              marginRight: 5,
              borderWidth: 2,
              borderColor:
                currentStatus === 'Delivered' ? '#549CFF' : '#F99746',
              backgroundColor: '#fff',
              justifyContent: 'center',
            }}>
            <View
              style={{
                height: 10,
                width: 10,
                backgroundColor:
                  currentStatus === 'Delivered' ? '#549CFF' : '#F99746',
                borderRadius: 5,
                alignSelf: 'center',
              }}
            />
          </View>
        ) : (
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              backgroundColor: '#549CFF',
              marginRight: 5,
            }}
          />
        )}
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{width: '25%'}}>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: 14,
              color: '#757575',
            }}>
            {`Dispatched from ${from}`}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Lato-Regular',
            fontSize: 14,
            color: '#757575',
          }}>
          {currentStatus}
        </Text>
        <View style={{width: '25%'}}>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: 14,
              color: '#757575',
              textAlign: 'center',
            }}>
            {`Destination ${to}`}
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontFamily: 'Lato-Regular',
          fontSize: 14,
          color: '#757575',
          textAlign: 'center',
          marginVertical: 10,
        }}>
        Last Updated: {moment(lastUpdate).format('Do MMMM YYYY hh:mm A')}
      </Text>
    </View>
  );
};
