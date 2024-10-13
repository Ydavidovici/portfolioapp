// src/features/adminDashboard/services/adminService.test.ts

import axios from 'axios';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
} from './adminService';
import { User, Role } from '../types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Admin Service', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  // Users API Tests
  describe('Users API', () => {
    const API_URL = 'https://api.yourdomain.com/admin/users';

    it('fetchUsers should fetch all users successfully', async () => {
      const users: User[] = [
        { id: 1, name: 'User One', email: 'user1@example.com', role: 'admin' },
        { id: 2, name: 'User Two', email: 'user2@example.com', role: 'user' },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: users });

      const result = await fetchUsers();

      expect(mockedAxios.get).toHaveBeenCalledWith(API_URL);
      expect(result).toEqual(users);
    });

    it('fetchUsers should handle errors', async () => {
      const errorMessage = 'Failed to fetch users';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchUsers()).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(API_URL);
    });

    it('createUser should create a new user successfully', async () => {
      const newUser: Omit<User, 'id'> = { name: 'New User', email: 'newuser@example.com', role: 'user' };
      const createdUser: User = { id: 3, ...newUser };

      mockedAxios.post.mockResolvedValueOnce({ data: createdUser });

      const result = await createUser(newUser);

      expect(mockedAxios.post).toHaveBeenCalledWith(API_URL, newUser);
      expect(result).toEqual(createdUser);
    });

    it('createUser should handle errors', async () => {
      const newUser: Omit<User, 'id'> = { name: 'New User', email: 'existinguser@example.com', role: 'user' };
      const errorMessage = 'Email already exists';

      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(createUser(newUser)).rejects.toThrow(errorMessage);
      expect(mockedAxios.post).toHaveBeenCalledWith(API_URL, newUser);
    });

    it('updateUser should update an existing user successfully', async () => {
      const updatedUser: User = { id: 1, name: 'Updated User', email: 'updateduser@example.com', role: 'admin' };

      mockedAxios.put.mockResolvedValueOnce({ data: updatedUser });

      const result = await updateUser(updatedUser);

      expect(mockedAxios.put).toHaveBeenCalledWith(`${API_URL}/1`, updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('updateUser should handle errors', async () => {
      const updatedUser: User = { id: 999, name: 'Non-existent User', email: 'nonexistent@example.com', role: 'user' };
      const errorMessage = 'User not found';

      mockedAxios.put.mockRejectedValueOnce(new Error(errorMessage));

      await expect(updateUser(updatedUser)).rejects.toThrow(errorMessage);
      expect(mockedAxios.put).toHaveBeenCalledWith(`${API_URL}/999`, updatedUser);
    });

    it('deleteUser should delete a user successfully', async () => {
      const userId = 1;

      mockedAxios.delete.mockResolvedValueOnce({});

      await expect(deleteUser(userId)).resolves.toBeUndefined();
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_URL}/1`);
    });

    it('deleteUser should handle errors', async () => {
      const userId = 999;
      const errorMessage = 'User not found';

      mockedAxios.delete.mockRejectedValueOnce(new Error(errorMessage));

      await expect(deleteUser(userId)).rejects.toThrow(errorMessage);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_URL}/999`);
    });
  });

  // Roles API Tests
  describe('Roles API', () => {
    const ROLES_API_URL = 'https://api.yourdomain.com/admin/roles';

    it('fetchRoles should fetch all roles successfully', async () => {
      const roles: Role[] = [
        { id: 1, name: 'admin' },
        { id: 2, name: 'user' },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: roles });

      const result = await fetchRoles();

      expect(mockedAxios.get).toHaveBeenCalledWith(ROLES_API_URL);
      expect(result).toEqual(roles);
    });

    it('fetchRoles should handle errors', async () => {
      const errorMessage = 'Failed to fetch roles';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchRoles()).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(ROLES_API_URL);
    });

    it('createRole should create a new role successfully', async () => {
      const newRole: Omit<Role, 'id'> = { name: 'editor' };
      const createdRole: Role = { id: 3, ...newRole };

      mockedAxios.post.mockResolvedValueOnce({ data: createdRole });

      const result = await createRole(newRole);

      expect(mockedAxios.post).toHaveBeenCalledWith(ROLES_API_URL, newRole);
      expect(result).toEqual(createdRole);
    });

    it('createRole should handle errors', async () => {
      const newRole: Omit<Role, 'id'> = { name: 'existingrole' };
      const errorMessage = 'Role already exists';

      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(createRole(newRole)).rejects.toThrow(errorMessage);
      expect(mockedAxios.post).toHaveBeenCalledWith(ROLES_API_URL, newRole);
    });

    it('updateRole should update an existing role successfully', async () => {
      const updatedRole: Role = { id: 1, name: 'superadmin' };

      mockedAxios.put.mockResolvedValueOnce({ data: updatedRole });

      const result = await updateRole(updatedRole);

      expect(mockedAxios.put).toHaveBeenCalledWith(`${ROLES_API_URL}/1`, updatedRole);
      expect(result).toEqual(updatedRole);
    });

    it('updateRole should handle errors', async () => {
      const updatedRole: Role = { id: 999, name: 'nonexistentrole' };
      const errorMessage = 'Role not found';

      mockedAxios.put.mockRejectedValueOnce(new Error(errorMessage));

      await expect(updateRole(updatedRole)).rejects.toThrow(errorMessage);
      expect(mockedAxios.put).toHaveBeenCalledWith(`${ROLES_API_URL}/999`, updatedRole);
    });

    it('deleteRole should delete a role successfully', async () => {
      const roleId = 1;

      mockedAxios.delete.mockResolvedValueOnce({});

      await expect(deleteRole(roleId)).resolves.toBeUndefined();
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${ROLES_API_URL}/1`);
    });

    it('deleteRole should handle errors', async () => {
      const roleId = 999;
      const errorMessage = 'Role not found';

      mockedAxios.delete.mockRejectedValueOnce(new Error(errorMessage));

      await expect(deleteRole(roleId)).rejects.toThrow(errorMessage);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${ROLES_API_URL}/999`);
    });
  });
});
