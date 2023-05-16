import { createSelector } from '@reduxjs/toolkit';

export const selectAuthSelector = (state) => state.auth
export const authSelector = createSelector(selectAuthSelector, state => state)
