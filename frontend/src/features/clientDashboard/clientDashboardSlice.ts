// src/features/clientDashboard/clientDashboardSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchMessages, fetchDocuments } from './services/clientService';
import { Message, Document, ClientDashboardState } from './types';

const initialState: ClientDashboardState = {
    messages: [],
    documents: [],
    loading: false,
    error: null,
};

// Async Thunks
export const getMessages = createAsyncThunk('clientDashboard/getMessages', async () => {
    const data = await fetchMessages();
    return data;
});

export const getDocuments = createAsyncThunk('clientDashboard/getDocuments', async () => {
    const data = await fetchDocuments();
    return data;
});

// Slice
const clientDashboardSlice = createSlice({
    name: 'clientDashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Get Messages
        builder.addCase(getMessages.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
            state.loading = false;
            state.messages = action.payload;
        });
        builder.addCase(getMessages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch messages';
        });

        // Get Documents
        builder.addCase(getDocuments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getDocuments.fulfilled, (state, action: PayloadAction<Document[]>) => {
            state.loading = false;
            state.documents = action.payload;
        });
        builder.addCase(getDocuments.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch documents';
        });
    },
});

export default clientDashboardSlice.reducer;
