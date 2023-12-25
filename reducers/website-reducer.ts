import { createSlice } from '@reduxjs/toolkit';
import {
    findUserByIdThunk,
} from '@/thunks/website-thunk';

const websiteSlice = createSlice({
    name: 'userById',
    initialState: { user: null, loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(findUserByIdThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(findUserByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // 更新 state.user
            })
            .addCase(findUserByIdThunk.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default websiteSlice.reducer;
