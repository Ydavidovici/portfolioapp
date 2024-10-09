// src/store/slices/roleSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/api/apiClient';

interface Role {
  id: string;
  name: string;
  permissions: string[]; // Example: ['create_user', 'delete_user']
}

interface RoleState {
  roles: Role[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  roles: [],
  isLoading: false,
  error: null,
};

// Async Thunks for CRUD Operations
export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (_, thunkAPI) => {
  try {
    const response = await apiClient.get('/roles');
    return response.data.roles;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
  }
});

export const createRole = createAsyncThunk('roles/createRole', async (roleData: Partial<Role>, thunkAPI) => {
  try {
    const response = await apiClient.post('/roles', roleData);
    return response.data.role;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create role');
  }
});

export const updateRole = createAsyncThunk('roles/updateRole', async ({ id, data }: { id: string; data: Partial<Role> }, thunkAPI) => {
  try {
    const response = await apiClient.put(`/roles/${id}`, data);
    return response.data.role;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update role');
  }
});

export const deleteRole = createAsyncThunk('roles/deleteRole', async (id: string, thunkAPI) => {
  try {
    await apiClient.delete(`/roles/${id}`);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete role');
  }
});

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Roles
    builder.addCase(fetchRoles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
      state.isLoading = false;
      state.roles = action.payload;
    });
    builder.addCase(fetchRoles.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Create Role
    builder.addCase(createRole.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createRole.fulfilled, (state, action: PayloadAction<Role>) => {
      state.isLoading = false;
      state.roles.push(action.payload);
    });
    builder.addCase(createRole.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update Role
    builder.addCase(updateRole.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
      state.isLoading = false;
      const index = state.roles.findIndex((role) => role.id === action.payload.id);
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    });
    builder.addCase(updateRole.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Delete Role
    builder.addCase(deleteRole.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteRole.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.roles = state.roles.filter((role) => role.id !== action.payload);
    });
    builder.addCase(deleteRole.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default roleSlice.reducer;
