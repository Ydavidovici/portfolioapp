// src/utils/mockAuthContext.js

import React from 'react';
import { AuthContext } from '../context/AuthContext';

export const mockAuthContextValue = {
    user: null,
    loginUser: jest.fn(),
    logout: jest.fn(),
    registerUser: jest.fn(),
    requestPasswordReset: jest.fn(),
    changePassword: jest.fn(),
    resetPassword: jest.fn(),
    verifyEmail: jest.fn(),
    loading: false,
    error: null,
    success: null,
    setUser: jest.fn(),
};
