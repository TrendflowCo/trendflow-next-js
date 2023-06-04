import { createReducer } from '@reduxjs/toolkit';
import { setCurrentSearch , setWishlist } from '../actions/search';

const initialState = {
  currentSearch: '',
  wishlist: [],
}; 

export const searchReducer = createReducer(initialState, builder => {
  builder
    .addCase(setCurrentSearch, (state, action) => {
      state.currentSearch = action.payload
    })
    .addCase(setWishlist, (state, action) => {
      state.wishlist = action.payload
    })

});