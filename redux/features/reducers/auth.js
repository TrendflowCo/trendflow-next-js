import { createReducer } from '@reduxjs/toolkit';
import { setLogInFlag , setUser } from '../actions/auth';

const initialState = {
  logInFlag: false,
  user: {},
}; 

export const authReducer = createReducer(initialState, builder => {
  builder
    .addCase(setLogInFlag, (state, action) => {
      state.logInFlag = action.payload
    })
    .addCase(setUser, (state, action) => {
      state.user = action.payload
    })

});