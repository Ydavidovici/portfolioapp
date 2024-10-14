// src/features/adminDashboard/userSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import adminService from '../services/adminService';

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Async Thunks

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await adminService.getUsers();
  return response.data;
});

export const createUser = createAsyncThunk('users/createUser', async (newUser: Omit<User, 'id'>) => {
  const response = await adminService.createUser(newUser);
  return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser', async (updatedUser: User) => {
  const response = await adminService.updateUser(updatedUser);
  return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string) => {
  await adminService.deleteUser(id);
  return id;
});

// Slice

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchUsers
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch users';
    });

    // createUser
    builder.addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to create user';
    });

    // updateUser
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to update user';
    });

    // deleteUser
    builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to delete user';
    });
  },
});

export default userSlice.reducer;
