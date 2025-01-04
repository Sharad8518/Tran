import fp from 'lodash/fp';
import { connect } from 'react-redux';
import { withToaster } from '../HOC/withToaster';
export const SET_TOAST_STATE = 'SET_TOAST_STATE';
export const setToast = payload => ({
    type: SET_TOAST_STATE,
    payload,
});
const initialState = {
    toastState: null,
};
export const AppStateReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOAST_STATE:
            return {
                ...state,
                toastState: action.payload,
            };
        default:
            return state;
    }
};

export const withAppToaster = fp.compose(
    connect(
        null,
        dispatch => ({
            setToast: payload => dispatch(setToast(payload)),
        }),
    ),
    withToaster,
);
