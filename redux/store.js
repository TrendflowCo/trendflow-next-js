import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { authReducer } from './features/reducers/auth';
import { searchReducer } from './features/reducers/search';
import { regionReducer } from './features/reducers/region';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
        region: regionReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })  
});