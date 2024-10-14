// src/features/adminDashboard/roleSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import adminService from '../services/adminService';

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface RoleState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  error: null,
};

// Async Thunks

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
  const response = await adminService.getRoles();
  return response.data;
});

export const createRole = createAsyncThunk('roles/createRole', async (newRole: Omit<Role, 'id'>) => {
  const response = await adminService.createRole(newRole);
  return response.data;
});

export const updateRole = createAsyncThunk('roles/updateRole', async (updatedRole: Role) => {
  const response = await adminService.updateRole(updatedRole);
  return response.data;
});

export const deleteRole = createAsyncThunk('roles/deleteRole', async (id: string) => {
  await adminService.deleteRole(id);
  return id;
});

// Slice

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchRoles
    builder.addCase(fetchRoles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
      state.loading = false;
      state.roles = action.payload;
    });
    builder.addCase(fetchRoles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch roles';
    });

    // createRole
    builder.addCase(createRole.fulfilled, (state, action: PayloadAction<Role>) => {
      state.roles.push(action.payload);
    });
    builder.addCase(createRole.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to create role';
    });

    // updateRole
    builder.addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex((role) => role.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    });
    builder.addCase(updateRole.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to update role';
    });

    // deleteRole
    builder.addCase(deleteRole.fulfilled, (state, action: PayloadAction<string>) => {
      state.roles = state.roles.filter((role) => role.id !== action.payload);
    });
    builder.addCase(deleteRole.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to delete role';
    });
  },
});

export default roleSlice.reducer;
