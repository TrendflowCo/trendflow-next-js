import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { authReducer } from './features/reducers/auth';
import { searchReducer } from './features/reducers/search';
import { languageReducer } from './features/reducers/language';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        search: searchReducer,
        language: languageReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })  
});