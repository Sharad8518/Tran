import {LOGOUT_USER, SET_AUTH_LOADER, SET_TOKEN} from './types';

const initialState = {
  token: null,
  isLoggedIn: false,
  loading: true,
  role: '',
};
export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SET_TOKEN:
      return {
        ...state,
        token: payload.token,
        role: payload.role,
        isLoggedIn: true,
        loading: false,
      };
    case SET_AUTH_LOADER:
      return {
        ...state,
        loading: payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        token: null,
        role: '',
        isLoggedIn: false,
      };
    default:
      return {...state};
  }
};
