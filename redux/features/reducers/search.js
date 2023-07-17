import { createReducer } from '@reduxjs/toolkit';
import { setCurrentSearch , setWishlist , setTotalFilters , setFocusedCard , setSearchPage } from '../actions/search';

const initialState = {
  currentSearch: '',
  wishlist: [],
  totalFilters: 0,
  focusedCard: {},
  searchPage: 0,
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
    .addCase(setFocusedCard, (state, action) => {
      state.focusedCard = action.payload
    })
    .addCase(setSearchPage, (state, action) => {
      state.searchPage = action.payload
    })

});