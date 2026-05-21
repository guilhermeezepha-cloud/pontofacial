import {ReduxNotifyPayload} from '../types/Types';

export const reduxNotifyError = (payload: ReduxNotifyPayload | unknown) => ({
  type: '@@APP_GLOBAL_ERROR',
  payload,
});

export const reduxNotifyInfo = (payload: ReduxNotifyPayload) => ({
  type: '@@APP_GLOBAL_INFO',
  payload,
});

export const reduxNotifySuccess = (payload: ReduxNotifyPayload) => ({
  type: '@@APP_GLOBAL_SUCCESS',
  payload,
});

export const debug = (value: any, ...rest: any[]) => {
  if (__DEV__) {
    console.debug(value, ...rest);
  }
};
