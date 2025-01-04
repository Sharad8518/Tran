import {LOGOUT_USER, SET_AUTH_LOADER, SET_TOKEN} from './types';

export const setUserLoggedIn = (token, role) => {
  return {
    type: SET_TOKEN,
    payload: {token, role},
  };
};
export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  };
};
export const setUserLoggedOut = () => {
  return {
    type: SET_AUTH_LOADER,
    payload: false,
  };
};
