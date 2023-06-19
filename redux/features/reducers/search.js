import { createReducer } from '@reduxjs/toolkit';
import { setCurrentSearch , setWishlist , setTotalFilters } from '../actions/search';

const initialState = {
  currentSearch: '',
  wishlist: [],
  totalFilters: 0
}; 

export const searchReducer = createReducer(initialState, builder => {
  builder
    .addCase(setCurrentSearch, (state, action) => {
      state.currentSearch = action.payload
    })
    .addCase(setWishlist, (state, action) => {
      state.wishlist = action.payload
    })
    .addCase(setTotalFilters, (state, action) => {
      state.totalFilters = action.payload
    })
});