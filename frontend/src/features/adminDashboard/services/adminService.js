// src/features/adminDashboard/services/adminService.js

import axios from '../../../api/apiClient';

const adminService = {
  // Roles
  getRoles: () => axios.get('/roles'),
  createRole: (newRole) => axios.post('/roles', newRole),
  updateRole: (updatedRole) =>
    axios.put(`/roles/${updatedRole.id}`, updatedRole),
  deleteRole: (id) => axios.delete(`/roles/${id}`),

  // Users
  getUsers: () => axios.get('/users'),
  createUser: (newUser) => axios.post('/users', newUser),
  updateUser: (updatedUser) =>
    axios.put(`/users/${updatedUser.id}`, updatedUser),
  deleteUser: (id) => axios.delete(`/users/${id}`),
};

export default adminService;
