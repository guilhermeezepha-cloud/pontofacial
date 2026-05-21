import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {MenuState} from './Types';

import {RootState} from '../../config/Redux';

const initialState: MenuState = {
  status: 'idle',
};

export const MenuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    changeStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
  },
});

export const {changeStatus} = MenuSlice.actions;

const reducer = (state: RootState) => state.menu;
export const isLoadingSelector = (state: RootState) =>
  reducer(state).status == 'loading';
