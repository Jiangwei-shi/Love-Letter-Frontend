import { createSlice } from '@reduxjs/toolkit';
import {
    deleteUserThunk,
    loginThunk, logoutThunk,
    registerThunk, updateUserThunk,
} from '@/thunks/authorize-thunk';

const authorizeSlice = createSlice({
    name: 'authorize',
    initialState: null,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerThunk.fulfilled, (state, action) => {
            })
            .addCase(registerThunk.rejected, (state, action) => {
            })
            .addCase(registerThunk.pending, (state) => {
            })
            .addCase(loginThunk.pending, (state) => {
            })
            .addCase(loginThunk.fulfilled, (state, action) => ({ ...action.payload }))
            .addCase(loginThunk.rejected, (state, action) => {

            })
            .addCase(logoutThunk.pending, (state) => {
                // state.isLoading = true;
                // state.error = null;
            })
            .addCase(logoutThunk.fulfilled, (state, action) => null)
            .addCase(logoutThunk.rejected, (state, action) => {
                // state.error = action.payload;
                // state.isLoading = false;
            })
            .addCase(deleteUserThunk.fulfilled, (state) => null)
            .addCase(deleteUserThunk.rejected, (state, action) => {
                console.error('Delete user failed:', action.error);
            })
            .addCase(updateUserThunk.fulfilled, (state, action) => {
                // state.user = action.payload;
                // state.error = null;
            })
            .addCase(updateUserThunk.pending, (state) => {
                // state.isLoading = true;
            })
            .addCase(updateUserThunk.rejected, (state, action) => {
                // state.error = action.payload;
                // state.isLoading = false;
            });
    },
});
export default authorizeSlice.reducer;
