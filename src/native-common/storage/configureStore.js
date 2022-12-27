import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { rootReducer as odooReducer } from '../../common/store';
import AsyncStorage from '@react-native-async-storage/async-storage';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const rootReducer = combineReducers({
    odoo: odooReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);


export default () => {
  let store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false  // why this? see: https://stackoverflow.com/a/63244831/3557761
    }),
    devTools: true,
  })

  let persistor = persistStore(store);
  return { store, persistor }
}
