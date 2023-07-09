import { createAction } from "@reduxjs/toolkit"
export const setCurrentSearch = createAction('search/setCurrentSearch');
export const setWishlist = createAction('search/setWishlist');
export const setTotalFilters = createAction('search/setTotalFilters');
export const setFocusedCard = createAction('search/setFocusedCard');