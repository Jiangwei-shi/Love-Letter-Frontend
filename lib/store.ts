import { configureStore } from '@reduxjs/toolkit';
import authorizeReducer from '../reducers/authorize-reducer';

export const makeStore = () => configureStore({
        reducer: {
            currentUser: authorizeReducer,
        },
    });

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
