import { createSelector } from '@reduxjs/toolkit';

export const selectAuthSelector = (state) => state.auth
export const authSelector = createSelector(selectAuthSelector, state => state)
export const selectSearchSelector = (state) => state.search
export const searchSelector = createSelector(selectSearchSelector, state => state)
export const selectRegionSelector = (state) => state.region
export const regionSelector = createSelector(selectRegionSelector, state => state)


