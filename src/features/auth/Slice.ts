import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {CollectorWithoutLogo} from '../register/Types';
import {AuthRequestData, AuthResponseData, AuthState} from './Types';

import {AuthSession} from '../../config/Axios';
import {AppDispatch, RootState} from '../../config/Redux';
import {reduxNotifyError} from '../../utils/helpers';
import Session from '../../utils/session';
import {toAuthSession} from '../../utils/session/auth';
import {IDENTIFICATION_DATA_KEY} from '../../utils/storageKeys';
import AuthService from './Service';

const initialState: AuthState = {
  status: 'idle',
  adminAuthDone: false,
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    setAdminAuthDone: (state, action: PayloadAction<boolean>) => {
      state.adminAuthDone = action.payload;
    },
  },
});

export const {changeStatus, setAdminAuthDone} = AuthSlice.actions;

export const doAuth = (password: string) => async (dispatch: AppDispatch) => {
  dispatch(changeStatus('loading'));

  try {
    const identificationData = await Session.get<CollectorWithoutLogo>(
      IDENTIFICATION_DATA_KEY,
    );

    const params: AuthRequestData = {
      password: password,
      code: identificationData?.code || '',
      identifier: identificationData?.identifier || '',
    };

    const {data} = await AuthService.postAuth(params);
    const session: AuthSession = toAuthSession(data as AuthResponseData);

    await Session.set<AuthSession>('auth', session);

    dispatch(setAdminAuthDone(true));
    dispatch(changeStatus('success'));
  } catch (error) {
    dispatch(reduxNotifyError(error));
  } finally {
    dispatch(changeStatus('idle'));
  }
};

const reducer = (state: RootState) => state.auth;
export const statusSelector = (state: RootState) => reducer(state).status;
export const isLoadingSelector = (state: RootState) =>
  reducer(state).status == 'loading';
export const adminAuthDoneSelector = (state: RootState) =>
  reducer(state).adminAuthDone;
