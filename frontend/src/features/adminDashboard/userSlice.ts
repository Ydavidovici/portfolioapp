// src/features/adminDashboard/userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, User, Role } from './types';
import * as adminService from './services/adminService';

// Initial state
const initialState: AdminState = {
  users: [],
  roles: [],
  loading: false,
  error: null,
};

// Async thunks for Users
export const getUsers = createAsyncThunk('admin/getUsers', async () => {
  const users = await adminService.fetchUsers();
  return users;
});

export const addUser = createAsyncThunk('admin/addUser', async (user: Omit<User, 'id'>) => {
  const newUser = await adminService.createUser(user);
  return newUser;
});

export const editUser = createAsyncThunk('admin/editUser', async (user: User) => {
  const updatedUser = await adminService.updateUser(user);
  return updatedUser;
});

export const removeUser = createAsyncThunk('admin/removeUser', async (id: number) => {
  await adminService.deleteUser(id);
  return id;
});

// Async thunks for Roles
export const getRoles = createAsyncThunk('admin/getRoles', async () => {
  const roles = await adminService.fetchRoles();
  return roles;
});

export const addRole = createAsyncThunk('admin/addRole', async (role: Omit<Role, 'id'>) => {
  const newRole = await adminService.createRole(role);
  return newRole;
});

export const editRole = createAsyncThunk('admin/editRole', async (role: Role) => {
  const updatedRole = await adminService.updateRole(role);
  return updatedRole;
});

export const removeRole = createAsyncThunk('admin/removeRole', async (id: number) => {
  await adminService.deleteRole(id);
  return id;
});

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logout(state) {
      // Clear state on logout
      state.users = [];
      state.roles = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle getUsers
    builder.addCase(getUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch users';
    });

    // Handle addUser
    builder.addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    });

    // Handle editUser
    builder.addCase(editUser.fulfilled, (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    });

    // Handle removeUser
    builder.addCase(removeUser.fulfilled, (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    });

    // Handle getRoles
    builder.addCase(getRoles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
      state.loading = false;
      state.roles = action.payload;
    });
    builder.addCase(getRoles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch roles';
    });

    // Handle addRole
    builder.addCase(addRole.fulfilled, (state, action: PayloadAction<Role>) => {
      state.roles.push(action.payload);
    });

    // Handle editRole
    builder.addCase(editRole.fulfilled, (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex((role) => role.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    });

    // Handle removeRole
    builder.addCase(removeRole.fulfilled, (state, action: PayloadAction<number>) => {
      state.roles = state.roles.filter((role) => role.id !== action.payload);
    });
  },
});

export const { logout } = adminSlice.actions;

export default adminSlice.reducer;
