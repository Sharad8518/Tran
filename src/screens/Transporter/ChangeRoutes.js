import {FieldArray, Formik} from 'formik';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {connect, useDispatch} from 'react-redux';
import store from '../../redux/store';
import {RouteSelection} from '../Auth/TransporterForm';
import * as Yup from 'yup';
import axios from 'axios';
import {setTransporterProfile} from '../../redux/user/actions';
import {withAppToaster} from '../../redux/AppState';
import {ScrollView} from 'react-native';
const RoutesSchema = Yup.object().shape({
  routes: Yup.array().of(
    Yup.object().shape({
      from: Yup.string().required('Please select from district'),
      to: Yup.string()
        .required('Please select to district')
        .when('from', (value, schema) => {
          return schema.test('', 'From and To District cannot be same', to => {
            return value !== to;
          });
        }),
    }),
  ),
});
const ChangeRoutes = props => {
  const {routes, token, setToast, navigation} = props;
  const [loading, setLoading] = useState(false);
  const citiesData = store.getState()?.userReducer?.CityList;

  const dispatch = useDispatch();
  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: '5%', backgroundColor: '#fff'}}>
      <Formik
        onSubmit={data => {
          setLoading(true);
          const transporterRoutes = data.routes.map(t => ({
            toAddress: t.to,
            fromAddress: t.from,
          }));
          axios
            .post(
              '/transporter/routes/update',
              {transporterRoutes},
              {headers: {Authorization: `Bearer ${token}`}},
            )
            .then(resp => {
              setLoading(false);
              dispatch(setTransporterProfile());
              setToast({text: resp.data.msg, styles: 'success'});
              navigation.navigate('HomeTrans');
            })
            .catch(error => {
              // console.log('error', error);
              setLoading(false);
              setToast({
                text: 'Something went wrong. Please try again.',
                styles: 'error',
              });
            });
        }}
        validationSchema={RoutesSchema}
        enableReinitialize={true}
        initialValues={{
          routes: routes.map(r => ({from: r.fromAddress, to: r.toAddress})),
        }}
        component={formikProps => (
          <>
            <FieldArray
              name="routes"
              render={arrayHelpers => (
                <RouteSelection
                  citiesData={citiesData}
                  {...formikProps}
                  {...arrayHelpers}
                />
              )}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={formikProps.handleSubmit}
              style={{
                height: 40,
                backgroundColor: '#549CFF',
                marginVertical: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
              }}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    fontFamily: 'Roboto',
                    fontSize: 15,
                    color: 'white',
                  }}>
                  Update
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      />
    </ScrollView>
  );
};
const mapStateToProps = store => ({
  token: store.authReducer.token,
  routes: store.userReducer.transporter.routes,
});
export default withAppToaster(connect(mapStateToProps, {})(ChangeRoutes));
