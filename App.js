import axios from 'axios';
import React, {useEffect} from 'react';
import {Alert, Text, TextInput, View, ToastAndroid} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';
import {connect, Provider} from 'react-redux';
import {setToast} from './src/redux/AppState';
import store from './src/redux/store';
import AppContainer from './src/screens/AppContainer';
import NotifService from './src/services/NotificationService';
console.disableYellowBox = true;
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.style = {fontFamily: 'Lato-Regular'};
Text.defaultProps.style = {fontFamily: 'Lato-Regular'};
axios.defaults.baseURL = 'https://traninnovation.com/api';
const App = () => {
  const [toast, setAppToast] = React.useState(null);
  const notif = new NotifService(onRegister, onNotif);
  useEffect(() => {
    const unSubscribe = store.subscribe(() => {
      setAppToast(store.getState()?.appStateReducer?.toastState);
    });
    notifPermission();
    return () => {
      unSubscribe();
    };
  }, []);
  const notifPermission = () => {
    notif.requestPermissions();
  };
  const onRegister = token => {
    // console.log('token', token);
  };

  const onNotif = notif => {
    Alert.alert(notif.title, notif.message);
  };
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      // ...DefaultTheme.colors,
      primary: '#FFF',
      accent: '#FFF',
    },
  };
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <AppContainer />
        <ToastProvider toast={toast} />
      </PaperProvider>
    </Provider>
  );
};

export default App;
// const ToastProviderComponent = props => {
//   useEffect(() => {
//     if (!!props.toast) {
//       Snackbar.show({
//         text: props.toast.text,
//         duration: Snackbar.LENGTH_LONG,
//         backgroundColor:
//           props.toast.styles === 'success'
//             ? '#28a845'
//             : props.toast.styles === 'error'
//             ? '#DD3545'
//             : '#6C767D',
//         fontFamily: 'Lato-Regular',
//       });
//     }
//   }, [props]);
//   return <View id="RootApp" />;
// };
const ToastProviderComponent = props => {
  useEffect(() => {
    if (!!props.toast) {
      ToastAndroid.showWithGravity(
        props.toast.text,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  }, [props]);
  return <View id="RootApp" />;
};

const ToastProvider = connect(null, dispatch => ({
  setToast: payload => dispatch(setToast(payload)),
}))(ToastProviderComponent);
