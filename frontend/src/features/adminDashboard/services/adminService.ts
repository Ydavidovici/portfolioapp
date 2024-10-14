// src/features/adminDashboard/services/adminService.ts

import axios from '../../../api/apiClient';
import { Role, User } from '../userSlice'; // Adjust import paths as necessary

const adminService = {
  // Roles
  getRoles: () => axios.get<Role[]>('/roles'),
  createRole: (newRole: Omit<Role, 'id'>) => axios.post<Role>('/roles', newRole),
  updateRole: (updatedRole: Role) => axios.put<Role>(`/roles/${updatedRole.id}`, updatedRole),
  deleteRole: (id: string) => axios.delete(`/roles/${id}`),

  // Users
  getUsers: () => axios.get<User[]>('/users'),
  createUser: (newUser: Omit<User, 'id'>) => axios.post<User>('/users', newUser),
  updateUser: (updatedUser: User) => axios.put<User>(`/users/${updatedUser.id}`, updatedUser),
  deleteUser: (id: string) => axios.delete(`/users/${id}`),
};

export default adminService;
