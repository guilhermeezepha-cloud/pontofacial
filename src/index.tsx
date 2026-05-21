import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as ReduxProvider} from 'react-redux';

import AppInitializer from './AppInitializer';
import Axios from './config/Axios';
import {store} from './config/Redux';

Axios.injectStore(store);
const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <ReduxProvider store={store}>
          <AppInitializer />
        </ReduxProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
