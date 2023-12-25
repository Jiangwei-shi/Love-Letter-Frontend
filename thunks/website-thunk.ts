import { createAsyncThunk } from '@reduxjs/toolkit';
import * as websiteService from '../services/website-service';

export const findUserByIdThunk = createAsyncThunk('users/findUserById',
    async (user) => websiteService.findUserById(user));
