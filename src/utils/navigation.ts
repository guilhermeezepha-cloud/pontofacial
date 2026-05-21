import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

import {AppStackParamList} from '../config/navigation/Types';

export const navigationRef = createNavigationContainerRef<AppStackParamList>();

type ResetTo = <Name extends keyof AppStackParamList>(
  name: Name,
  params?: AppStackParamList[Name],
) => void;

export const resetTo: ResetTo = (name, params) => {
  if (!navigationRef.isReady()) return;
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name, params}],
    }),
  );
};
