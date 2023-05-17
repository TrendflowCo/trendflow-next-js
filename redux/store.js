import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { authReducer } from './features/reducers/auth';
import { searchReducer } from './features/reducers/search';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
    },
  });