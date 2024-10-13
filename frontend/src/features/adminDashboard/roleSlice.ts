// src/features/adminDashboard/roleSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Role } from './types';
import * as adminService from './services/adminService';

// Initial state
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

// Async thunks for Roles
export const getRoles = createAsyncThunk('roles/getRoles', async () => {
  const roles = await adminService.fetchRoles();
  return roles;
});

export const addRole = createAsyncThunk('roles/addRole', async (role: Omit<Role, 'id'>) => {
  const newRole = await adminService.createRole(role);
  return newRole;
});

export const editRole = createAsyncThunk('roles/editRole', async (role: Role) => {
  const updatedRole = await adminService.updateRole(role);
  return updatedRole;
});

export const removeRole = createAsyncThunk('roles/removeRole', async (id: number) => {
  await adminService.deleteRole(id);
  return id;
});

// Slice
const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    // Synchronous actions if any
  },
  extraReducers: (builder) => {
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

export default roleSlice.reducer;
