// src/features/adminDashboard/services/adminService.ts

import axios from 'axios';
import { User, Role } from '../types';

// Base URL for API endpoints
const API_URL = 'https://api.yourdomain.com/admin'; // Replace with your actual API URL

// Users API
export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
};

export const updateUser = async (user: User): Promise<User> => {
  const response = await axios.put(`${API_URL}/users/${user.id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/users/${id}`);
};

// Roles API
export const fetchRoles = async (): Promise<Role[]> => {
  const response = await axios.get(`${API_URL}/roles`);
  return response.data;
};

export const createRole = async (role: Omit<Role, 'id'>): Promise<Role> => {
  const response = await axios.post(`${API_URL}/roles`, role);
  return response.data;
};

export const updateRole = async (role: Role): Promise<Role> => {
  const response = await axios.put(`${API_URL}/roles/${role.id}`, role);
  return response.data;
};

export const deleteRole = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/roles/${id}`);
};
