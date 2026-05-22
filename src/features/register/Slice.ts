import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';

import {
  CollectorRequestPayload,
  CollectorWithoutLogo,
  RegisterState,
} from './Types';

import { AppDispatch, RootState } from '../../config/Redux';
import { getAllEmployees } from '../employees';
import { emit } from '../../utils/eventBus';
import { reduxNotifyError } from '../../utils/helpers';
import Session from '../../utils/session';
import {
  ADMIN_PASSWORD_KEY,
  IDENTIFICATION_DATA_KEY,
  PARTNER_LOGO_BASE64_KEY,
} from '../../utils/storageKeys';
import RegisterService from './Service';

const initialState: RegisterState = {
  status: 'idle',
  firstAccessDone: false,
  firstAccessSteps: 0,
};

export const RegisterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    setFirstAccessDone: (state, action: PayloadAction<boolean>) => {
      state.firstAccessDone = action.payload;
    },

    changeFirstAccessSteps: (state, action: PayloadAction<number>) => {
      state.firstAccessSteps = action.payload;
    },
  },
});

export const { changeStatus, setFirstAccessDone } = RegisterSlice.actions;

export const createNewCollector =
  (
    registerData: CollectorRequestPayload,
    adminPassword: string,
    partnerLogo?: string,
  ) =>
    async (dispatch: AppDispatch) => {
      dispatch(changeStatus('loading'));

      const params: CollectorRequestPayload = {
        ...registerData,
        adminPassword,
        partnerLogo,
        active: true,
      };

      try {
        const response = await RegisterService.postNewCollector(params);

        const { data } = response;
        const { partnerLogo, group, employees, ...collectorWithoutLogo } = data;

        if (data?.partnerLogo) {
          await Session.setRaw(PARTNER_LOGO_BASE64_KEY, data?.partnerLogo, {
            useCache: true,
          });
        }

        await Session.setRaw(ADMIN_PASSWORD_KEY, adminPassword, {
          useCache: false,
        });

        await Session.set<CollectorWithoutLogo>(
          IDENTIFICATION_DATA_KEY,
          collectorWithoutLogo,
          {
            useCache: false,
          },
        );

        dispatch(changeStatus('success'));
        dispatch(setFirstAccessDone(true));
        dispatch(getAllEmployees());
      } catch (error) {
        dispatch(reduxNotifyError(error));
      } finally {
        dispatch(changeStatus('idle'));
      }
    };

export const updateCollector =
  (params: Partial<CollectorRequestPayload>) =>
    async (dispatch: AppDispatch) => {
      dispatch(changeStatus('loading'));

      try {
        const identificationData = await Session.get<CollectorWithoutLogo>(
          IDENTIFICATION_DATA_KEY,
        );
        const collectorId = identificationData?.id;
        if (!collectorId)
          throw new Error('Collector ID não encontrado no storage.');

        const response = await RegisterService.updateCollectorData(
          params,
          collectorId,
        );

        const { data } = response;
        const { partnerLogo, group, employees, ...collectorWithoutLogo } = data;

        if (partnerLogo) {
          await Session.setRaw(PARTNER_LOGO_BASE64_KEY, partnerLogo!, {
            useCache: false,
          });
        }
        emit('partnerLogo:updated', partnerLogo!);

        await Session.set<CollectorWithoutLogo>(
          IDENTIFICATION_DATA_KEY,
          collectorWithoutLogo,
          {
            useCache: false,
          },
        );
        emit('identificationData:updated', collectorWithoutLogo);

        dispatch(changeStatus('success'));
      } catch (error) {
        dispatch(reduxNotifyError(error));
        dispatch(changeStatus('idle'));
      }
    };

const reducer = (state: RootState) => state.register;
export const statusSelector = (state: RootState) => reducer(state).status;
export const isLoadingSelector = (state: RootState) =>
  reducer(state).status == 'loading';
export const firstAccessDoneSelector = (state: RootState) =>
  reducer(state).firstAccessDone;
