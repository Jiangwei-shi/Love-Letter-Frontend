'use client';

import { Middleware } from 'redux';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const localStorageMiddleware:Middleware = (store) => (next) => (action) => {
    const result = next(action);
    // @ts-ignore
    if (result.type === 'users/updateUser/fulfilled') {
        // @ts-ignore
        localStorage.setItem('currentUser', JSON.stringify(result.payload));
    }

    return result;
};
export default localStorageMiddleware;
