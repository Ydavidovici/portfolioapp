// src/features/auth/services/authService.ts

import axios from '../../api/apiClient';

export const login = async (credentials: { email: string; password: string }) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};

