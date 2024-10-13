// src/features/checklists/checklistsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import checklistService from './services/checklistService';
import { Checklist } from './types';

interface ChecklistsState {
  checklists: Checklist[];
  loading: boolean;
  error: string | null;
}

const initialState: ChecklistsState = {
  checklists: [],
  loading: false,
  error: null,
};

export const fetchChecklists = createAsyncThunk(
  'checklists/fetchChecklists',
  async () => {
    const response = await checklistService.getAll();
    return response.data;
  }
);

const checklistsSlice = createSlice({
  name: 'checklists',
  initialState,
  reducers: {
    // Define synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChecklists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChecklists.fulfilled, (state, action: PayloadAction<Checklist[]>) => {
        state.loading = false;
        state.checklists = action.payload;
      })
      .addCase(fetchChecklists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch checklists';
      });
  },
});

export default checklistsSlice.reducer;
