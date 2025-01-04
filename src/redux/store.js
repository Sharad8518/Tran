
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import {thunk} from 'redux-thunk'
import authReducer from "./auth/reducer";
import userReducer from "./user/reducer";
import enquiryReducer from "./enquiry/reducer";
import chatsReducer from "./chat/reducer"
import { AppStateReducer } from "./AppState"
const appReducer = combineReducers({
    authReducer,
    userReducer,
    enquiryReducer,
    chatsReducer,
    appStateReducer: AppStateReducer,
});

export const USER_LOGOUT = 'USER_LOGOUT';

const rootReducer = (state, action) => {
    if (action.type === USER_LOGOUT) {
        // state = undefined;
    }

    return appReducer(state, action);
};
export default createStore(
    rootReducer,
    {},
    composeWithDevTools(applyMiddleware(thunk)),
);
