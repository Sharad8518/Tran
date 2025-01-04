import axios from 'axios';
import {
  SET_CONSIGNEE_LIST,
  SET_CONSIGNEE_PROFILE,
  SET_CONSIGNOR_ADDRESS,
  SET_CONSIGNOR_PROFILE,
  SET_TRANSPORTER_PROFILE,
  SET_SUPERVISOR_LIST,
  SET_CITY_LIST,
} from './types';
export const setConsignorProfile = data => {
  return {
    type: SET_CONSIGNOR_PROFILE,
    payload: data,
  };
};
export const setConsignorAddress = data => {
  return {
    type: SET_CONSIGNOR_ADDRESS,
    payload: data,
  };
};
export const setSuperVisorList = list => {
  return {
    type: SET_SUPERVISOR_LIST,
    payload: list,
  };
};
export const setCityList = list => {
  return {
    type: SET_CITY_LIST,
    payload: list,
  };
};
export const setConsigneeList = list => {
  return {
    type: SET_CONSIGNEE_LIST,
    payload: list,
  };
};
export const setTransporterProfile = () => {
  return (dispatch, getState) => {
    const store = getState();
    const token = store.authReducer.token;
    axios
      .get('/transporter/account')
      .then(res => {
        dispatch({
          type: SET_TRANSPORTER_PROFILE,
          payload: {routes: res.data.routes, profile: res.data.transporter[0]},
        });
      })
      .catch(error => {
        // console.log('trans profile error', error);
      });
  };
};
export const getConsignorDetails = () => {
  return (dispatch, getState) => {
    const store = getState();
    const token = store.authReducer.token;
    axios
      .get('/consignor/account')
      .then(res => {
        const profile = res.data[0];
        dispatch({
          type: SET_CONSIGNOR_PROFILE,
          payload: profile,
        });
        axios
          .get('/consignor/address')
          .then(resp => {
            const address = resp.data;
            dispatch({
              type: SET_CONSIGNOR_ADDRESS,
              payload: address,
            });
          })
          .catch(error => {
            // console.log('get address error', error);
          });
      })
      .catch(error => {
        // console.log('get profile error', error);
      });
  };
};
export const getConsigneeProfile = () => {
  return (dispatch, getState) => {
    const store = getState();
    const token = store.authReducer.token;
    axios
      .get('/consignee/account')
      .then(res => {
        dispatch({
          type: SET_CONSIGNEE_PROFILE,
          payload: res.data.result,
        });
      })
      .catch(error => {
        // console.log('consignee profile', error);
      });
  };
};
