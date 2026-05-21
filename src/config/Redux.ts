import {configureStore} from '@reduxjs/toolkit';

import {globalToastMiddleware} from '../features/toast-notification/globalToastMiddleware';
import reducers from './Reducers';

let enhancers: any[] = [];

if (__DEV__) {
  const reactotron = require('../../ReactotronConfig').default;
  enhancers.push(reactotron.createEnhancer());
}

export const store = configureStore({
  reducer: reducers(),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(globalToastMiddleware), // 👈 adiciona aqui
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(enhancers),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
