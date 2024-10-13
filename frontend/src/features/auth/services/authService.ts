// src/features/auth/services/authService.ts

import apiClient from '../../../api/apiClient';
import {
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '../types';

// Login User
export const login = async (credentials: LoginCredentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

// Register User
export const register = async (credentials: RegisterCredentials) => {
  const response = await apiClient.post('/auth/register', credentials);
  return response.data;
};

// Request Password Reset
export const requestPasswordReset = async (email: string) => {
  const response = await apiClient.post('/auth/password-reset', { email });
  return response.data;
};

// Reset Password
export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { token, newPassword } = payload;
  const response = await apiClient.post('/auth/password-reset/confirm', { token, newPassword });
  return response.data;
};

// Verify Email
export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const { token } = payload;
  const response = await apiClient.get(`/auth/verify-email`, { params: { token } });
  return response.data;
};
