import { createReducer } from '@reduxjs/toolkit';
import { setLogInFlag } from '../actions/auth';

const initialState = {
  logInFlag: false,
}; 

export const authReducer = createReducer(initialState, builder => {
  builder
    .addCase(setLogInFlag, (state, action) => {
      state.logInFlag = action.payload
    })
});