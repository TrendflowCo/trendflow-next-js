import { createReducer } from '@reduxjs/toolkit';
import { setCurrentSearch } from '../actions/search';

const initialState = {
  currentSearch: '',
}; 

export const searchReducer = createReducer(initialState, builder => {
  builder
    .addCase(setCurrentSearch, (state, action) => {
      state.currentSearch = action.payload
    })
});