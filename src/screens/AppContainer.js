import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {
  AuthStackNavigator,
  ConsigneeNavigator,
  ConsignerNavigator,
  TransporterNavigator,
} from '../config/routes';
import {Splash} from './Splash';
import database, {firebase} from '@react-native-firebase/database';
import {databaseRefs} from '../config/variables';
import {setChatIds, setUnreadCount} from '../redux/chat/actions';
import {objToArray} from '../utils/objToArray';

const AppContainer = props => {
  const {
    loading,
    isLoggedIn,
    token,
    role,
    firebaseUid,
    setChats,
    setUnreadCount,
  } = props;
  useEffect(() => {
    if (!!firebaseUid) addListenerToUser(firebaseUid);
  }, [firebaseUid]);

  const getUnreadCount = chats => {
    chats.map(c => {
      database()
        .ref(databaseRefs.lastSeen)
        .child(`${firebaseUid}/${c.key}`)
        .on('value', snap => {
          const lastSeen = snap.val();
          if (lastSeen) {
            const currentTimeStamp = new Date().getTime();
            database()
              .ref(`${databaseRefs.messages}/${c.key}`)
              .orderByChild('timestamp')
              .startAt(lastSeen.lastSeen)
              .endAt(currentTimeStamp)
              .on('value', snap => {
                const unreadCount = snap.numChildren();
                setUnreadCount(c.key, unreadCount, lastSeen.lastSeen);
              });
          } else {
            database()
              .ref(`${databaseRefs.messages}/${c.key}`)
              .once('value', snap => {
                const unreadCount = snap.numChildren();
                setUnreadCount(c.key, unreadCount);
              });
          }
        });
    });
  };

  const addListenerToUser = firebaseUid => {
    // set user status to online
    const presenceRef = database()
      .ref(databaseRefs.users)
      .child(firebaseUid)
      .child('presence');

    database()
      .ref('.info/connected')
      .on('value', snap => {
        presenceRef.set(snap.val());
      });

    // fetch user chats
    database()
      .ref(databaseRefs.users)
      .child(`${firebaseUid}/chats`)
      .on('value', snap => {
        const chats = snap.val();
        const keys = objToArray(chats);
        setChats(keys);
        getUnreadCount(keys);
      });

    // set offline on disconnect

    return () => presenceRef.onDisconnect().set(false);
  };

  return (
    <NavigationContainer>
      <SafeAreaProvider style={{flex: 1}}>
        {loading ? (
          <Splash />
        ) : isLoggedIn && !!token ? (
          role === 'transporter' ? (
            <TransporterNavigator />
          ) : role === 'consignor' ? (
            <ConsignerNavigator />
          ) : role === 'consignee' ? (
            <ConsigneeNavigator />
          ) : role === 'supervisor' ? (
            <ConsignerNavigator />
          ) : (
            <AuthStackNavigator />
          )
        ) : (
          <AuthStackNavigator />
        )}
      </SafeAreaProvider>
    </NavigationContainer>
  );
};
const mapStateToProps = state => ({
  role: state.authReducer.role,
  token: state.authReducer.token,
  loading: state.authReducer.loading,
  isLoggedIn: state.authReducer.isLoggedIn,
  firebaseUid: state.userReducer.firebaseUid,
});
const mapDispatchToProps = dispatch => {
  return {
    setChats: chats => dispatch(setChatIds(chats)),
    setUnreadCount: (chatId, count, lastSeen) =>
      dispatch(setUnreadCount(chatId, count, lastSeen)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
