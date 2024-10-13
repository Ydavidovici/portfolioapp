// src/features/auth/services/authService.test.ts

import apiClient from '../../../api/apiClient';
import {
  login,
  register,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from './authService';
import {
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '../types';

// Mock the apiClient
jest.mock('../../../api/apiClient');

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('Auth Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const credentials: LoginCredentials = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { user: { id: 1, name: 'Test User', email: 'test@example.com' }, token: 'abcd1234' };

      mockedApiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const data = await login(credentials);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(data).toEqual(mockResponse);
    });

    it('should handle login failure', async () => {
      const credentials: LoginCredentials = { email: 'test@example.com', password: 'wrongpassword' };
      const mockError = { response: { data: { message: 'Invalid credentials' } } };

      mockedApiClient.post.mockRejectedValueOnce(mockError);

      await expect(login(credentials)).rejects.toEqual(mockError.response.data);
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const credentials: RegisterCredentials = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const mockResponse = { user: { id: 2, name: 'New User', email: 'newuser@example.com' }, token: 'efgh5678' };

      mockedApiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const data = await register(credentials);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/register', credentials);
      expect(data).toEqual(mockResponse);
    });

    it('should handle registration failure', async () => {
      const credentials: RegisterCredentials = {
        name: 'New User',
        email: 'existinguser@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };
      const mockError = { response: { data: { message: 'Email already exists' } } };

      mockedApiClient.post.mockRejectedValueOnce(mockError);

      await expect(register(credentials)).rejects.toEqual(mockError.response.data);
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/register', credentials);
    });
  });

  describe('requestPasswordReset', () => {
    it('should successfully request a password reset', async () => {
      const email = 'test@example.com';
      const mockResponse = { message: 'Password reset link sent to email' };

      mockedApiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const data = await requestPasswordReset(email);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/password-reset', { email });
      expect(data).toEqual(mockResponse);
    });

    it('should handle password reset request failure', async () => {
      const email = 'nonexistent@example.com';
      const mockError = { response: { data: { message: 'Email not found' } } };

      mockedApiClient.post.mockRejectedValueOnce(mockError);

      await expect(requestPasswordReset(email)).rejects.toEqual(mockError.response.data);
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/password-reset', { email });
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset the password', async () => {
      const payload: ResetPasswordPayload = { token: 'validtoken123', newPassword: 'newpassword456' };
      const mockResponse = { message: 'Password has been reset successfully' };

      mockedApiClient.post.mockResolvedValueOnce({ data: mockResponse });

      const data = await resetPassword(payload);

      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/password-reset/confirm', payload);
      expect(data).toEqual(mockResponse);
    });

    it('should handle password reset failure', async () => {
      const payload: ResetPasswordPayload = { token: 'invalidtoken', newPassword: 'newpassword456' };
      const mockError = { response: { data: { message: 'Invalid or expired token' } } };

      mockedApiClient.post.mockRejectedValueOnce(mockError);

      await expect(resetPassword(payload)).rejects.toEqual(mockError.response.data);
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/password-reset/confirm', payload);
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email', async () => {
      const payload: VerifyEmailPayload = { token: 'validemailtoken123' };
      const mockResponse = { message: 'Email verified successfully' };

      mockedApiClient.get.mockResolvedValueOnce({ data: mockResponse });

      const data = await verifyEmail(payload);

      expect(mockedApiClient.get).toHaveBeenCalledWith('/auth/verify-email', { params: { token: payload.token } });
      expect(data).toEqual(mockResponse);
    });

    it('should handle email verification failure', async () => {
      const payload: VerifyEmailPayload = { token: 'invalidemailtoken' };
      const mockError = { response: { data: { message: 'Invalid or expired verification token' } } };

      mockedApiClient.get.mockRejectedValueOnce(mockError);

      await expect(verifyEmail(payload)).rejects.toEqual(mockError.response.data);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/auth/verify-email', { params: { token: payload.token } });
    });
  });
});
