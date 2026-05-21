if (__DEV__) {
  require('../ReactotronConfig');
}

import React, {
  useEffect,
  useState,
} from 'react';

import { CollectorWithoutLogo } from './features/register/Types';

import { firstAccessDoneSelector, setFirstAccessDone } from './features/register/Slice';

import { ToastProvider } from './components/custom-toast/ToastProvider';
import Loader from './components/loader';
import NavigationWithTheme from './components/navigation-with-theme';
import AppStackNavigator from './config/navigation/AppStack';
import AutoSyncService from './features/sync/AutoSyncService';
import FaceModelSyncService from './features/sync/FaceModelSyncService';
import { useAppDispatch, useAppSelector } from './hooks/Redux';
import { initApiBaseURLFromIdentificationData } from './utils/apiBaseUrl';
import Session from './utils/session';
import { IDENTIFICATION_DATA_KEY } from './utils/storageKeys';

const AppInitializer = () => {
  const dispatch = useAppDispatch();
  const firstAccessDone = useAppSelector(firstAccessDoneSelector);

  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      let isFirstAccessDone = false;
      try {
        const storedData = await Session.get<CollectorWithoutLogo>(
          IDENTIFICATION_DATA_KEY,
        );
        isFirstAccessDone = storedData != null;
        dispatch(setFirstAccessDone(isFirstAccessDone));

        if (!__DEV__) await initApiBaseURLFromIdentificationData();

        // Iniciar sincronização automática se já está configurado
        if (isFirstAccessDone) {
          AutoSyncService.getInstance().start();
        }
      } finally {
        setIsInitializing(false);
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    if (firstAccessDone) {
      FaceModelSyncService.getInstance().setDispatch(dispatch);
      FaceModelSyncService.getInstance().start();
    }
  }, [firstAccessDone, dispatch]);

  useEffect(() => {
    // Cleanup quando o app é fechado
    return () => {
      AutoSyncService.getInstance().stop();
      FaceModelSyncService.getInstance().stop();
    };
  }, []);

  return (
    <NavigationWithTheme>
      <ToastProvider>
        {isInitializing ? <Loader /> : <AppStackNavigator />}
      </ToastProvider>
    </NavigationWithTheme>
  );
};

export default AppInitializer;
