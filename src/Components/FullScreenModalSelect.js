import React, {useEffect, useState} from 'react';
import {Modal, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';

export const FullScreenModalSelect = ({
  value,
  onSelectItem,
  items = [],
  masterArr = [],
  placeholder,
  leftIcon,
  error,
  disabled,
  renderCustomComponent = false,
  customComponent,
  searchable = true,
  addNew = false,
  keyboardType = 'default',
  minLength = 1,
}) => {
  const [visible, setVisible] = useState(false);
  const [localValue, setValue] = useState(null);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    setData(items);
  }, [items]);

  useEffect(() => {
    if (!!value) {
      const sel = items.find(i => i.value === value);
      setValue(sel);
    }
  }, [value]);
  const onSelect = item => {
    setValue(item);
    setVisible(false);
  };
  return (
    <>
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.8}
        onPress={() => {
          disabled ? {} : setVisible(true);
        }}
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: '#a5a2a2',
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          backgroundColor: disabled ? '#eee' : 'transparent',
        }}>
        <View
          style={{
            width: 40,
            borderRightWidth: 1,
            height: 45,
            justifyContent: 'center',
          }}>
          {leftIcon}
        </View>
        <View style={{flex: 8, paddingLeft: 10}}>
          {!!localValue ? (
            <Text
              style={{
                fontFamily: 'Lato-Regular',
                color: '#000',
                width: '60%',
              }}>
              {localValue?.label}
            </Text>
          ) : (
            <Text
              style={{
                color: '#999',
                fontFamily: 'Lato-Regular',
              }}>
              {placeholder}
            </Text>
          )}
        </View>
        <View style={{flex: 1}}>
          <Icon2
            style={{alignSelf: 'center'}}
            name="arrow-down"
            color="#424242"
            size={15}
          />
        </View>
      </TouchableOpacity>
      <Text
        style={{
          color: 'red',
          fontSize: 12,
          fontFamily: 'Lato-Regular',
          marginTop: 5,
        }}>
        {error}
      </Text>
      <Modal visible={visible} onRequestClose={() => setVisible(false)}>
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: '3%',
            }}>
            <Icon
              onPress={() => setVisible(false)}
              size={26}
              name="chevron-left"
            />
            {searchable && (
              <Input
                keyboardType={keyboardType}
                onChangeText={text => {
                  setSearchText(text);
                  if (text.length >= minLength) {
                    const filter = masterArr.filter(i =>
                      i.label.includes(text),
                    );
                    setData(filter);
                  } else {
                    setData(items);
                  }
                }}
                placeholder="Search"
                inputContainerStyle={{
                  borderWidth: 0,
                  paddingBottom: 0,
                  marginBottom: 0,
                }}
                containerStyle={{
                  borderWidth: 0,
                  paddingBottom: 0,
                  marginBottom: 0,
                  flex: 1,
                  height: 45,
                }}
              />
            )}
          </View>
          <ScrollView
            contentContainerStyle={{paddingBottom: '10%'}}
            style={{padding: `${5}%`}}>
            {data.length > 0 ? (
              data.map((item, i) => {
                return !renderCustomComponent ? (
                  <TouchableOpacity
                    onPress={() => {
                      setValue(item);
                      setVisible(false);
                      return onSelectItem(item);
                    }}
                    key={i}
                    activeOpacity={0.8}>
                    <Text
                      style={{
                        marginVertical: 5,
                        fontFamily: 'Lato-Regular',
                      }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  customComponent(item, i, onSelect)
                );
              })
            ) : addNew ? (
              <TouchableOpacity
                onPress={() => {
                  setData([...items, {label: searchText, value: searchText}]);
                  setValue({label: searchText, value: searchText});
                  // setVisible(false);
                  return onSelectItem({label: searchText, value: searchText});
                }}>
                <Text
                  style={{
                    marginVertical: 5,
                    fontFamily: 'Lato-Regular',
                    fontSize: 18,
                  }}>
                  No results found. Continue with{' '}
                  <Text style={{marginVertical: 5, fontFamily: 'Lato-Bold'}}>
                    {searchText}
                  </Text>
                </Text>
              </TouchableOpacity>
            ) : (
              <Text>No results found</Text>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};
