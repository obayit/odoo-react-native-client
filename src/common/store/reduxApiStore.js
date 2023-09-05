import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer, { configurationReducer } from './authSlice'
import { odooApi } from './reduxApi'
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
  key: 'root',
  blacklist: [odooApi.reducerPath],
  storage: AsyncStorage,
}
const configPersistConfig = {
  // yes we have to create a separate configuration object for each persistReducer call
  key: 'root',
  blacklist: [odooApi.reducerPath],
  storage: AsyncStorage,
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer)
const persistedConfigurationReducer = persistReducer(configPersistConfig, configurationReducer)

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [odooApi.reducerPath]: odooApi.reducer,
    auth: persistedAuthReducer,
    configuration: persistedConfigurationReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(odooApi.middleware),

  devTools: process.env.NODE_ENV !== 'production',
})
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg
setupListeners(store.dispatch)

export const persistor = persistStore(store)
// src/redux/store.js

