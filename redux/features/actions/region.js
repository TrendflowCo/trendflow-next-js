// import { createAction } from "@reduxjs/toolkit"
// export const setLanguage = createAction('region/setLanguage')
// export const setCountry = createAction('region/setCountry')
// export const setTranslations = createAction('region/setTranslations')
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  country: 'us',
  language: 'en',
  translations: {},
}

const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    setCountry: (state, action) => {
      state.country = 'us'
    },
    setLanguage: (state, action) => {
      state.language = 'en'
    },
    setTranslations: (state, action) => {
      state.translations = action.payload
    },
  },
})

export const { setCountry, setLanguage, setTranslations } = regionSlice.actions

export default regionSlice.reducer