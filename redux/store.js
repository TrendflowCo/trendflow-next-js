import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { authReducer } from './features/reducers/auth';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
  });