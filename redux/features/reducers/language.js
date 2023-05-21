import { createReducer } from '@reduxjs/toolkit';
import { setLanguage , setTranslations } from '../actions/language';

const initialState = {
    language: 'en',
    translations: {},
}; 

export const languageReducer = createReducer(initialState, builder => {
  builder
    .addCase(setLanguage, (state, action) => {
      state.language = action.payload
    })
    .addCase(setTranslations, (state, action) => {
      state.translations = action.payload
    })

});