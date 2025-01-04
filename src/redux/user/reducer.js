import {
  SET_CONSIGNEE_LIST,
  SET_CONSIGNOR_ADDRESS,
  SET_CONSIGNOR_PROFILE,
  SET_TRANSPORTER_PROFILE,
  SET_CONSIGNEE_PROFILE,
  SET_SUPERVISOR_LIST,
  SET_CITY_LIST,
} from './types';

const initialState = {
  consignor: {
    profile: null,
    address: [],
  },
  consigneeList: [],
  supervisorList: [],
  CityList: [],
  transporter: null,
  consigneeProfile: null,
  loading: true,
  firebaseUid: null,
  userName: '',
  consignee: {
    profile: null,
  },
};
export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_CONSIGNOR_PROFILE:
      return {
        ...state,
        consignor: {
          ...state.consignor,
          profile: payload,
        },
        userName: payload.userName,
        firebaseUid: payload.firebaseUid,
      };
    case SET_CONSIGNOR_ADDRESS:
      return {
        ...state,
        consignor: {
          ...state.consignor,
          address: payload,
        },
        loading: false,
      };
    case SET_CONSIGNEE_LIST:
      return {
        ...state,
        consigneeList: payload,
      };
    case SET_SUPERVISOR_LIST:
      return {
        ...state,
        supervisorList: payload,
      };
    case SET_TRANSPORTER_PROFILE:
      return {
        ...state,
        transporter: {
          profile: payload.profile,
          routes: payload.routes,
        },
        userName: payload.profile.userName,
        firebaseUid: payload.profile.firebaseUid,
        loading: false,
      };
    case SET_CONSIGNEE_PROFILE:
      return {
        ...state,
        consignee: {
          profile: payload,
        },
        firebaseUid: payload.firebaseUid,
        loading: false,
      };
    case SET_CITY_LIST:
      return {
        ...state,
        CityList: payload,
      };
    default:
      return {...state};
  }
};
