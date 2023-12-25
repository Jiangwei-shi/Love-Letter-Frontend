'use client';

import { Middleware } from 'redux';

const localStorageMiddleware:Middleware = (store) => (next) => (action) => {
    const result = next(action);

    const nextState = store.getState();
    const { currentUser } = nextState;
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }

    return result;
};
export default localStorageMiddleware;
