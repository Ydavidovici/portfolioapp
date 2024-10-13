// src/features/calendarEntries/calendarEntriesSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import calendarEntriesService from './services/calendarEntriesService';
import { CalendarEntry } from './types';

interface CalendarEntriesState {
  calendarEntries: CalendarEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: CalendarEntriesState = {
  calendarEntries: [],
  loading: false,
  error: null,
};

export const fetchCalendarEntries = createAsyncThunk(
  'calendarEntries/fetchCalendarEntries',
  async () => {
    const response = await calendarEntriesService.getAll();
    return response.data;
  }
);

const calendarEntriesSlice = createSlice({
  name: 'calendarEntries',
  initialState,
  reducers: {
    // Define synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendarEntries.fulfilled, (state, action: PayloadAction<CalendarEntry[]>) => {
        state.loading = false;
        state.calendarEntries = action.payload;
      })
      .addCase(fetchCalendarEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch calendar entries';
      });
  },
});

export default calendarEntriesSlice.reducer;
