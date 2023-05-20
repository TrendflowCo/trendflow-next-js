import { createSelector } from '@reduxjs/toolkit';

export const selectAuthSelector = (state) => state.auth
export const authSelector = createSelector(selectAuthSelector, state => state)
export const selectSearchSelector = (state) => state.search
export const searchSelector = createSelector(selectSearchSelector, state => state)
export const selectLanguageSelector = (state) => state.language
export const languageSelector = createSelector(selectLanguageSelector, state => state)


