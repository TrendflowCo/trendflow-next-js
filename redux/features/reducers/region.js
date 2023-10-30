import { createReducer } from '@reduxjs/toolkit';
import { setLanguage , setTranslations , setCountry } from '../actions/region';

const initialState = {
    language: '',
    country: '',
    translations: {},
}; 

export const regionReducer = createReducer(initialState, builder => {
  builder
    .addCase(setLanguage, (state, action) => {
      state.language = action.payload
    })
    .addCase(setCountry, (state, action) => {
      state.country = action.payload
    })
    .addCase(setTranslations, (state, action) => {
      state.translations = action.payload
    })

});