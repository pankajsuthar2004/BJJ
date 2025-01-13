import React from 'react';
import {Provider} from 'react-redux';
import AppNavigator from './src/nevigation/AppNevigator';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './src/store/Store';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
