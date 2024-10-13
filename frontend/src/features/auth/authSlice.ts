// src/features/auth/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordPayload,
  VerifyEmailPayload,
  User,
} from './types.ts';
import * as authService from './services/authService';
import { RootState } from '../../store/store';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunks

// Existing Thunks: login, register, logout

// Request Password Reset
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Password reset request failed');
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Password reset failed');
    }
  }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message || 'Email verification failed');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Optional: Additional synchronous actions
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    });
    builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    });
    builder.addCase(register.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    });

    // Handle Request Password Reset
    builder.addCase(requestPasswordReset.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(requestPasswordReset.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      // Optionally, handle any success message
    });
    builder.addCase(requestPasswordReset.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle Reset Password
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      // Optionally, handle any success message
    });
    builder.addCase(resetPassword.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle Verify Email
    builder.addCase(verifyEmail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyEmail.fulfilled, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = null;
      // Optionally, set user as verified
      // e.g., state.user.isVerified = true;
    });
    builder.addCase(verifyEmail.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
export const { setUser, setToken } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
