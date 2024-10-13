// src/features/checklistItems/checklistItemsSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import checklistItemsService from './services/checklistItemsService';
import { ChecklistItem } from './types';

interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ChecklistItemsState = {
  checklistItems: [],
  loading: false,
  error: null,
};

export const fetchChecklistItems = createAsyncThunk(
  'checklistItems/fetchChecklistItems',
  async () => {
    const response = await checklistItemsService.getAll();
    return response.data;
  }
);

const checklistItemsSlice = createSlice({
  name: 'checklistItems',
  initialState,
  reducers: {
    // Define synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChecklistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChecklistItems.fulfilled, (state, action: PayloadAction<ChecklistItem[]>) => {
        state.loading = false;
        state.checklistItems = action.payload;
      })
      .addCase(fetchChecklistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch checklist items';
      });
  },
});

export default checklistItemsSlice.reducer;
