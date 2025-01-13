import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AppSliceState {}

const initialState: AppSliceState = {};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    clearAppSlice: () => initialState,
  },
});

export const {clearAppSlice} = appSlice.actions;
export default appSlice.reducer;
