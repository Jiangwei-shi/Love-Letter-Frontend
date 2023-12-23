'use client';

import { configureStore } from '@reduxjs/toolkit';
import authorizeReducer from '../reducers/authorize-reducer';
import localStorageMiddleware from './localStorageMiddleware';

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
        },
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
