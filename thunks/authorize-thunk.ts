import { createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../services/authorize-service';

interface RegisterUserData {
    username: string;
    password: string;
}
export const registerThunk = createAsyncThunk('users/register',
    async (user:RegisterUserData) => userService.registerUser(user));

export const loginThunk = createAsyncThunk('users/login',
    async (credentials:RegisterUserData) => userService.loginUser(credentials));

export const logoutThunk = createAsyncThunk('users/logout', async () => {
    await userService.logout();
});

export const deleteUserThunk = createAsyncThunk('users/deleteUser',
    async (userId:string) => {
        await userService.deleteUser(userId);
        return userId;
    },
);

export const updateUserThunk = createAsyncThunk('users/updateUser',
    // eslint-disable-next-line max-len
    async ({ uid, userData }: { uid: string; userData: any }) => userService.updateUser(uid, userData),
);
