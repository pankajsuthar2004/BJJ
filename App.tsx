import React, {useEffect} from 'react';
import {Alert, PermissionsAndroid} from 'react-native';
import {Provider} from 'react-redux';
import AppNavigator from './src/nevigation/AppNevigator';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/store/Store';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  useEffect(() => {
    requestPermissionAndroid();
  }, []);

  const requestPermissionAndroid = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Alert.alert('Notification permission granted');
      getToken();
    } else {
      // Alert.alert('Notification permission denied');
    }
  };

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
