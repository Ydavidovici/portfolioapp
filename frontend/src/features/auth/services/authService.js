// src/features/auth/services/authService.js

import apiClient from '../../../api/apiClient';

// Login User
export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

// Register User
export const register = async (credentials) => {
  const response = await apiClient.post('/auth/register', credentials);
  return response.data;
};

// Request Password Reset
export const requestPasswordReset = async (email) => {
  const response = await apiClient.post('/auth/password-reset', { email });
  return response.data;
};

// Reset Password
export const resetPassword = async (payload) => {
  const { token, newPassword } = payload;
  const response = await apiClient.post('/auth/password-reset/confirm', {
    token,
    newPassword,
  });
  return response.data;
};

// Verify Email
export const verifyEmail = async (payload) => {
  const { token } = payload;
  const response = await apiClient.get(`/auth/verify-email`, {
    params: { token },
  });
  return response.data;
};
