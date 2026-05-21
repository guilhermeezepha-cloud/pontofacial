import {adminAuthDoneSelector} from '../features/auth/Slice';

import {useAppSelector} from './Redux';
import {useAppNavigation} from './useAppNavigation';

export const useGoToSettings = () => {
  const navigation = useAppNavigation();
  const adminAuthDone = useAppSelector(adminAuthDoneSelector);

  return () => {
    if (adminAuthDone) {
      navigation.navigate('SettingsMain');
    } else {
      navigation.navigate('AdminAuth');
    }
  };
};
