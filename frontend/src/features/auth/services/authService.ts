// src/features/auth/services/authService.ts

import axios from 'axios';
import { LoginCredentials, RegisterCredentials } from '../types';

// Base URL for auth APIs
const API_URL = 'https://your-backend-api.com/api/auth'; // Replace with your actual API URL

// Login
export const login = async (credentials: LoginCredentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

// Register
export const register = async (credentials: RegisterCredentials) => {
  const response = await axios.post(`${API_URL}/register`, credentials);
  return response.data;
};

// Logout
export const logout = async () => {
  const token = localStorage.getItem('token');
  await axios.post(
    `${API_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
