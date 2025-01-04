import axios from 'axios';
import {Formik} from 'formik';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, Text, View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {FormInput, FormInputArea} from '../../Components/FormInputBorder';
import * as Yup from 'yup';
import {withAppToaster} from '../../redux/AppState';
import DatePickerComponent from '../../Components/DatePickerComponentTitle';
import {
  checkForAlphabets,
  notMoreThan10AnyNonAlphabeticalCharacter,
  specialCharacterValidator,
} from '../../utils/validators';
import {UnitTypes} from '../../config/variables';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import {Dialog, Portal, Checkbox} from 'react-native-paper';
const BidSchema = Yup.object().shape({
  advance: Yup.string()
    .required('Advance is required')
    .matches(/^[0-9 ]*$/, 'Must contain numbers only'),
  // estimatedDelivery: Yup.string().required('Delivery date is required'),
  // picku: Yup.string().required('Pickup date is required'),
  rate: Yup.string()
    .required('Rate is required')
    .matches(/^[0-9 ]*$/, 'Must contain numbers only'),
  againstBill: Yup.string()
    .required('Against Bill is required')
    .matches(/^[0-9 ]*$/, 'Must contain numbers only'),
  remarks: Yup.string()
    .notRequired()
    .test(
      'special character test',
      'This field cannot contain only special characters or numbers',
      specialCharacterValidator,
    )
    .test(
      'alphabets character test',
      'This field should contain at least one alphabet',
      checkForAlphabets,
    )
    .test(
      'more special chars',
      'Cannot contain more than 10 special characters',
      notMoreThan10AnyNonAlphabeticalCharacter,
    ),
});
const PlaceBid = props => {
  const {navigation, setToast} = props;
  const id = props?.route?.params?.id;
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [bidDetails, setBidDetails] = useState(null);
  const [show, toggleShow] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  useEffect(() => {
    axios
      .get(`/enquiry/single?enquiryId=${id}`)
      .then(res => {
        console.log('res', res);
        const databid = res.data.databid;
        const enq = res.data.enquiry;
        const to = res.data.toAddress;
        const from = res.data.fromAddress;
        setDetails({enq, to, from});
        setBidDetails(databid);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, []);
  const placeBid = data => {
    if (data.estimatedDelivery !== '' && data.bid_rate_type !== '') {
      setBtnLoader(true);
      axios
        .post('/bid', {
          enquiryId: id,
          advance: data.advance,
          againstBill: data.againstBill,
          remarks: data.remarks,
          pickup: data.pickup,
          estimatedDelivery: data.estimatedDelivery,
          bid_rate_type: data.bid_rate_type,
          rate: data.rate,
          loading_included: data.loading_included,
          credit_period_for_balance_payment:
            data.credit_period_for_balance_payment !== ''
              ? data.credit_period_for_balance_payment
              : null,
          total_freight: data.total_freight !== '' ? data.total_freight : null,
        })
        .then(res => {
          if (!res.data.success) {
            setToast({text: res.data.msg, styles: 'error'});
            navigation.navigate('EnqListTran');
          } else {
            setToast({text: res.data.msg, styles: 'success'});
            navigation.navigate('EnqListTran');
          }
          setBtnLoader(false);
        })
        .catch(error => {
          setBtnLoader(false);
          setToast({
            text: error.response.data.message,
            styles: 'error',
          });
        });
    } else {
      alert('Please enter a valid date');
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      ) : !!details ? (
        <ScrollView
          contentContainerStyle={{paddingHorizontal: '5%', paddingBottom: '5%'}}
          style={{flex: 1, backgroundColor: '#fff'}}>
          <View style={{height: hp(35), backgroundColor: '#fff'}}>
            <Image
              source={require('../../../assets/ShipmentSummary.png')}
              style={{height: hp(35), width: wp(80), alignSelf: 'center'}}
            />
          </View>
          <View style={{backgroundColor: '#fff'}}>
            <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>
              Requirement posted by
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#549CFF',
              marginTop: 10,
              borderRadius: 20,
              padding: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 2,
                borderColor: '#fff',
              }}>
              <View style={{flex: 2}}>
                <Image
                  style={{height: 80, width: '100%'}}
                  resizeMode="contain"
                  source={require('../../../assets/enqBox.png')}
                />
              </View>
              <View style={{flex: 8, paddingHorizontal: '3%'}}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 16,
                  }}>
                  {details?.from?.companyName}
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    marginTop: 5,
                  }}>
                  Pick up on{' '}
                  {moment(details?.enq?.loadingTime).format(
                    'Do MMMM YYYY HH:mm A',
                  )}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: '3%',
              }}>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                  }}>
                  Schedule
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    marginTop: 10,
                  }}>
                  Schedule
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                  }}>
                  Weight
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    marginTop: 10,
                  }}>
                  {details?.enq?.weight}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                  }}>
                  Material
                </Text>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    marginTop: 10,
                  }}>
                  {details?.enq?.material}
                </Text>
              </View>
            </View>
          </View>
          <DetailsRow
            label="Pick From"
            value={`${details?.from?.address}, ${details?.from?.district}, ${details?.from?.state}`}
          />
          <DetailsRow
            label="Deliver to"
            value={`${details?.to?.address}, ${details?.to?.district}, ${details?.to?.state}`}
          />
          <View>
            {!show && (
              <Text
                onPress={() => toggleShow(true)}
                style={{
                  textAlign: 'center',
                  color: '#FFA654',
                  fontFamily: 'Lato-Bold',
                  fontSize: 14,
                  marginVertical: 10,
                }}>
                View More Details
              </Text>
            )}
            {show && (
              <>
                {/* <DetailsRow label="Truck Type" value="Airport Rd, Chacka, Thiruvananthapuram, Kerala 695008, INDIA" /> */}
                <DetailsRow
                  label="Pickup Date"
                  value={moment(details?.enq?.loadingTime).format(
                    'Do MMMM YYYY HH:mm A',
                  )}
                />
                <DetailsRow label="Weight" value={`${details?.enq?.weight}`} />
                <DetailsRow
                  label={'Loading \n Expense'}
                  value={`₹ ${details?.enq?.loadingExpense}`}
                />
                <DetailsRow
                  label={'Unloading \n Expense'}
                  value={`₹ ${details?.enq?.unloadingExpense}`}
                />
                {details?.enq?.advance !== null && (
                  <DetailsRow
                    label={'Advance'}
                    value={`₹ ${details?.enq?.advance}`}
                  />
                )}
                {details?.enq?.againstBill !== null && (
                  <DetailsRow
                    label={'Pay Against Delivery'}
                    value={`₹ ${details?.enq?.againstBill}`}
                  />
                )}
              </>
            )}
            {show && (
              <Text
                onPress={() => toggleShow(false)}
                style={{
                  textAlign: 'center',
                  color: '#FFA654',
                  fontFamily: 'Lato-Bold',
                  fontSize: 14,
                  marginVertical: 10,
                }}>
                View Less Details
              </Text>
            )}
          </View>
          <Formik
            validationSchema={BidSchema}
            onSubmit={data => placeBid(data)}
            initialValues={{
              advance:
                bidDetails !== undefined &&
                bidDetails !== null &&
                bidDetails.advance !== undefined
                  ? bidDetails.advance.toString()
                  : '',
              againstBill:
                bidDetails !== undefined &&
                bidDetails !== null &&
                bidDetails.againstBill !== undefined
                  ? bidDetails.againstBill.toString()
                  : '',
              remarks:
                bidDetails !== undefined &&
                bidDetails !== null &&
                bidDetails.remarks !== undefined
                  ? bidDetails.remarks
                  : '',
              estimatedDelivery:
                bidDetails !== undefined &&
                bidDetails !== null &&
                bidDetails.estimatedDelivery !== undefined
                  ? moment(bidDetails.estimatedDelivery).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )
                  : '',
              pickup:
                bidDetails !== undefined &&
                bidDetails !== null &&
                bidDetails.pickup !== undefined
                  ? moment(bidDetails.pickup).format('YYYY-MM-DD HH:mm:ss')
                  : '',
              bid_rate_type:
                bidDetails !== undefined &&
                bidDetails !== null &&
                bidDetails.bid_rate_type !== undefined &&
                bidDetails.bid_rate_type !== null
                  ? bidDetails.bid_rate_type.toString()
                  : 'MT',
              rate:
                bidDetails !== undefined &&
                bidDetails !== null &&
                bidDetails.rate !== undefined &&
                bidDetails.rate !== null
                  ? bidDetails.rate.toString()
                  : '',
              loading_included:
                bidDetails !== undefined &&
                bidDetails !== null &&
                bidDetails.loading_included !== undefined &&
                bidDetails.loading_included !== null
                  ? bidDetails.loading_included
                  : false,
              total_freight:
                bidDetails !== undefined &&
                bidDetails !== null &&
                bidDetails.total_freight !== undefined &&
                bidDetails.total_freight !== null
                  ? bidDetails.total_freight.toString()
                  : '',
              credit_period_for_balance_payment:
                bidDetails !== undefined &&
                bidDetails !== null &&
                bidDetails.credit_period_for_balance_payment !== undefined &&
                bidDetails.credit_period_for_balance_payment !== null
                  ? bidDetails.credit_period_for_balance_payment.toString()
                  : '',
            }}
            component={formikProps => (
              <FormBody
                loadingTime={details?.enq?.loadingTime}
                loading={btnLoader}
                {...formikProps}
              />
            )}
          />
        </ScrollView>
      ) : (
        <Text>Could not fetch</Text>
      )}
    </View>
  );
};
const FormBody = props => {
  const {
    handleChange,
    setFieldValue,
    errors,
    touched,
    values,
    handleSubmit,
    loading,
    loadingTime,
  } = props;
  const [checked, setChecked] = React.useState(values.loading_included);
  return (
    <>
      <DropDownPickerModal
        onSelect={value => {
          setFieldValue('bid_rate_type', value.value);
        }}
        value={values['bid_rate_type']}
        error={errors['bid_rate_type']}
        placeholder="Select Rate type"
      />
      <FormInput
        name="rate"
        errors={errors}
        touched={touched}
        keyboardType="numeric"
        values={values}
        placeholder="Rate"
        leftIcon={
          <Icon
            name="cash"
            type="material-community"
            color="#424242"
            size={20}
          />
        }
        onChangeText={handleChange('rate')}
      />
      <FormInput
        name="advance"
        keyboardType="numeric"
        errors={errors}
        touched={touched}
        values={values}
        placeholder="Advance"
        leftIcon={
          <Icon
            name="cash"
            type="material-community"
            color="#424242"
            size={20}
          />
        }
        onChangeText={handleChange('advance')}
      />
      <FormInput
        name="againstBill"
        errors={errors}
        touched={touched}
        keyboardType="numeric"
        values={values}
        placeholder="Against Bill"
        leftIcon={
          <Icon
            name="cash"
            type="material-community"
            color="#424242"
            size={20}
          />
        }
        onChangeText={handleChange('againstBill')}
      />
      <FormInput
        name="total_freight"
        errors={errors}
        touched={touched}
        keyboardType="numeric"
        values={values}
        placeholder="Total Freight"
        leftIcon={
          <Icon
            name="cash"
            type="material-community"
            color="#424242"
            size={20}
          />
        }
        onChangeText={handleChange('total_freight')}
      />
      <FormInput
        name="credit_period_for_balance_payment"
        errors={errors}
        touched={touched}
        keyboardType="numeric"
        values={values}
        placeholder="Credit period (days)"
        leftIcon={
          <Icon
            name="cash"
            type="material-community"
            color="#424242"
            size={20}
          />
        }
        onChangeText={handleChange('credit_period_for_balance_payment')}
      />
      <DatePickerComponent
        minDate={moment(loadingTime).toDate()}
        format="YYYY-MM-DD HH:mm:ss"
        mode="datetime"
        selectedDate={values.pickup}
        onChange={date => {
          setFieldValue('pickup', date);
        }}
        errors={
          touched?.['pickup'] && errors?.['pickup'] ? errors?.['pickup'] : ''
        }
        placeholderValue="Pickup Date"
      />
      <DatePickerComponent
        format="YYYY-MM-DD HH:mm:ss"
        mode="datetime"
        selectedDate={values.estimatedDelivery}
        onChange={date => {
          setFieldValue('estimatedDelivery', date);
        }}
        minDate={
          values.pickup !== ''
            ? moment(values.pickup).add(1, 'day').toDate()
            : moment(loadingTime).toDate()
        }
        placeholderValue="Estimated Delivery"
        errors={
          touched?.['estimatedDelivery'] && errors?.['estimatedDelivery']
            ? errors?.['estimatedDelivery']
            : ''
        }
      />

      <FormInputArea
        name="remarks"
        errors={errors}
        touched={touched}
        values={values}
        placeholder="Remarks"
        leftIcon={
          <Icon
            name="cash"
            type="material-community"
            color="#424242"
            size={20}
          />
        }
        onChangeText={handleChange('remarks')}
        multiline={true}
        numberOfLines={5}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15,
        }}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          color="#549CFF"
          uncheckedColor={'gray'}
          onPress={() => {
            setFieldValue('loading_included', !checked);
            setChecked(!checked);
          }}
        />
        <Text style={{fontWeight: 'bold'}}>Loading charges included</Text>
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        style={{
          backgroundColor: '#549CFF',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
        }}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontSize: 15,
              color: 'white',
              textAlign: 'center',
            }}>
            Place Bid
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};
const DetailsRow = ({label, value}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 0.8,
        borderColor: '#ccc',
      }}>
      <View style={{flex: 3}}>
        <Text style={{color: '#757575', fontFamily: 'Lato-Bold'}}>{label}</Text>
      </View>
      <View style={{flex: 7}}>
        <Text style={{color: '#757575', fontFamily: 'Lato-Bold'}}>{value}</Text>
      </View>
    </View>
  );
};
export const DropDownPickerModal = ({placeholder, value, onSelect, error}) => {
  const [visible, setVisible] = useState(false);
  const [localValue, setValue] = useState(value);
  useEffect(() => {
    const sel = UnitTypes.find(i => i.value === value);
    setValue(sel);
  }, [value]);
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
        style={{
          height: 50,
          borderWidth: 1,
          borderColor: '#a5a2a2',
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 40,
            borderRightWidth: 1,
            height: 45,
            justifyContent: 'center',
            borderColor: '#a5a2a2',
          }}>
          <Icon2
            name="note"
            style={{alignSelf: 'center'}}
            color="#424242"
            size={15}
          />
        </View>
        <View style={{flex: 8, paddingLeft: 10}}>
          {!!localValue ? (
            <Text
              allowFontScaling={false}
              style={{fontFamily: 'Lato-Regular', color: '#000'}}>
              {localValue.label}
            </Text>
          ) : (
            <Text
              allowFontScaling={false}
              style={{
                color: '#999',
                fontFamily: 'Lato-Regular',
                fontSize: 15,
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
        allowFontScaling={false}
        style={{
          color: 'red',
          fontSize: 12,
          fontFamily: 'Lato-Regular',
          marginTop: 5,
        }}>
        {error}
      </Text>
      <Portal>
        <Dialog
          style={{backgroundColor: '#fff'}}
          dismissable={true}
          onDismiss={() => setVisible(false)}
          visible={visible}>
          <Dialog.Title>
            <Text
              allowFontScaling={false}
              style={{fontFamily: 'Lato-Regular', color: '#000'}}>
              Select rate type
            </Text>
          </Dialog.Title>
          <Dialog.Content>
            {UnitTypes.map((role, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setValue(role);
                    setVisible(false);
                    return onSelect(role);
                  }}
                  style={{marginVertical: 10}}
                  key={index}>
                  <Text
                    allowFontScaling={false}
                    style={{fontFamily: 'Lato-Regular', color: '#000'}}>
                    {role.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </Dialog.Content>
        </Dialog>
      </Portal>
    </>
  );
};
export default withAppToaster(PlaceBid);
