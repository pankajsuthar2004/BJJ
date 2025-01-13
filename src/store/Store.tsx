import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userReducer from '../Slices/UserSlice';
import appReducer from '../Slices/AppSlice';
import type {AnyAction} from '@reduxjs/toolkit';
// import {createLogger} from 'redux-logger';

// Persist configuration for user state
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'app'], // Persist only the user slice
};

// Combine reducers
const combinedReducer = combineReducers({
  user: userReducer,
  app: appReducer,
});

// Root reducer with a "logout" action to reset user state
const rootReducer = (
  state: ReturnType<typeof combinedReducer> | undefined,
  action: AnyAction,
) => {
  if (action.type === 'user/logout') {
    // Reset user state on logout, keep app state
    return combinedReducer({app: state?.app}, action);
  }
  return combinedReducer(state, action);
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
// const logger = createLogger({
//   collapsed: true, // Collapses logs for better readability
//   diff: true, // Shows the difference between old and new state
// });
// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Type definitions for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
