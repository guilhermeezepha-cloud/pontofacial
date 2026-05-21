import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {SettingsState} from './Types';

import {RootState} from '../../config/Redux';

const initialState: SettingsState = {
  status: 'idle',
  lastSyncDate: '',
};

export const SettingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    changeLastSyncDate: (state, action: PayloadAction<string>) => {
      state.lastSyncDate = action.payload;
    },
  },
});

export const {changeStatus, changeLastSyncDate} = SettingsSlice.actions;

const reducer = (state: RootState) => state.settings;
export const isLoadingSelector = (state: RootState) =>
  reducer(state).status == 'loading';

export const lastSyncDateSelector = (state: RootState) =>
  reducer(state).lastSyncDate;
