// src/store/slices/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
    // Add other reducers here
});
