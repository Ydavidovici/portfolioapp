// src/features/clientdashboard/clientdashboardSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import clientService from './services/clientService';
import { Message, Document } from './types';

interface ClientDashboardState {
    messages: Message[];
    documents: Document[];
    loading: boolean;
    error: string | null;
}

const initialState: ClientDashboardState = {
    messages: [],
    documents: [],
    loading: false,
    error: null,
};

// Async Thunks

// Messages
export const getMessages = createAsyncThunk('clientdashboard/getMessages', async () => {
    const response = await clientService.getMessages();
    return response.data;
});

export const addMessage = createAsyncThunk('clientdashboard/addMessage', async (newMessage: Omit<Message, 'id' | 'created_at'>) => {
    const response = await clientService.createMessage(newMessage);
    return response.data;
});

export const editMessage = createAsyncThunk('clientdashboard/editMessage', async (updatedMessage: Message) => {
    const response = await clientService.updateMessage(updatedMessage);
    return response.data;
});

export const removeMessage = createAsyncThunk('clientdashboard/removeMessage', async (id: string) => {
    await clientService.deleteMessage(id);
    return id;
});

// Documents
export const getDocuments = createAsyncThunk('clientdashboard/getDocuments', async () => {
    const response = await clientService.getDocuments();
    return response.data;
});

export const addDocument = createAsyncThunk('clientdashboard/addDocument', async (newDocument: Omit<Document, 'id' | 'created_at'>) => {
    const response = await clientService.createDocument(newDocument);
    return response.data;
});

export const editDocument = createAsyncThunk('clientdashboard/editDocument', async (updatedDocument: Document) => {
    const response = await clientService.updateDocument(updatedDocument);
    return response.data;
});

export const removeDocument = createAsyncThunk('clientdashboard/removeDocument', async (id: string) => {
    await clientService.deleteDocument(id);
    return id;
});

// Slice

const clientDashboardSlice = createSlice({
    name: 'clientdashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Messages
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

        builder.addCase(addMessage.fulfilled, (state, action: PayloadAction<Message>) => {
            state.messages.unshift(action.payload); // Add to the beginning
        });
        builder.addCase(addMessage.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to add message';
        });

        builder.addCase(editMessage.fulfilled, (state, action: PayloadAction<Message>) => {
            const index = state.messages.findIndex((msg) => msg.id === action.payload.id);
            if (index !== -1) {
                state.messages[index] = action.payload;
            }
        });
        builder.addCase(editMessage.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to update message';
        });

        builder.addCase(removeMessage.fulfilled, (state, action: PayloadAction<string>) => {
            state.messages = state.messages.filter((msg) => msg.id !== action.payload);
        });
        builder.addCase(removeMessage.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to delete message';
        });

        // Documents
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

        builder.addCase(addDocument.fulfilled, (state, action: PayloadAction<Document>) => {
            state.documents.unshift(action.payload); // Add to the beginning
        });
        builder.addCase(addDocument.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to add document';
        });

        builder.addCase(editDocument.fulfilled, (state, action: PayloadAction<Document>) => {
            const index = state.documents.findIndex((doc) => doc.id === action.payload.id);
            if (index !== -1) {
                state.documents[index] = action.payload;
            }
        });
        builder.addCase(editDocument.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to update document';
        });

        builder.addCase(removeDocument.fulfilled, (state, action: PayloadAction<string>) => {
            state.documents = state.documents.filter((doc) => doc.id !== action.payload);
        });
        builder.addCase(removeDocument.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to delete document';
        });
    },
});

export default clientDashboardSlice.reducer;
