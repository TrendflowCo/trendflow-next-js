import { createReducer } from '@reduxjs/toolkit';
import { setLanguage } from '../actions/language';

const initialState = {
    language: 'en',
}; 

export const languageReducer = createReducer(initialState, builder => {
  builder
    .addCase(setLanguage, (state, action) => {
      state.language = action.payload
    })
});