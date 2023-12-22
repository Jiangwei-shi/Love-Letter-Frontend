import { createSlice } from '@reduxjs/toolkit';
import {
    deleteUserThunk,
    loginThunk, logoutThunk,
    registerThunk, updateUserThunk,
} from '@/thunks/authorize-thunk';

const initialState = {
    user: null,
    error: null as unknown,
    isLoading: false,
};

const authorizeSlice = createSlice({
    name: 'authorize',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(logoutThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = initialState.user;
                state.error = initialState.error;
                state.isLoading = initialState.isLoading;
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(registerThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteUserThunk.fulfilled, (state) => {
                state.user = initialState.user;
                state.error = initialState.error;
                state.isLoading = initialState.isLoading;
            })
            .addCase(deleteUserThunk.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to delete user';
                state.isLoading = false;
            })
            .addCase(updateUserThunk.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(updateUserThunk.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserThunk.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    },
});
export default authorizeSlice.reducer;
