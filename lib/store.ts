'use client';

import { configureStore } from '@reduxjs/toolkit';
import authorizeReducer from '../reducers/authorize-reducer';
import localStorageMiddleware from './localStorageMiddleware';
import userByIdReducer from '../reducers/website-reducer';

let savedCurrentUser;
if (typeof window !== 'undefined') {
    savedCurrentUser = localStorage.getItem('currentUser');
}
const preloadedState = {
    currentUser: savedCurrentUser ? JSON.parse(savedCurrentUser) : null,
};
export const makeStore = () => configureStore({
        reducer: {
            currentUser: authorizeReducer,
            userById: userByIdReducer,
        },
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
