// src/features/boards/boardsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { Board, CreateBoardPayload, UpdateBoardPayload, FetchBoardsResponse, FetchBoardDetailsResponse } from './types';
import {
  fetchBoards as fetchBoardsService,
  fetchBoardDetails as fetchBoardDetailsService,
  createBoard as createBoardService,
  updateBoard as updateBoardService,
  deleteBoard as deleteBoardService,
} from './services/boardsService';

interface BoardsState {
  boards: Board[];
  selectedBoard: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  selectedBoard: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchAllBoards = createAsyncThunk('boards/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response: FetchBoardsResponse = await fetchBoardsService();
    return response;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchBoardById = createAsyncThunk('boards/fetchById', async (id: number, { rejectWithValue }) => {
  try {
    const response: FetchBoardDetailsResponse = await fetchBoardDetailsService(id);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createNewBoard = createAsyncThunk('boards/create', async (payload: CreateBoardPayload, { rejectWithValue }) => {
  try {
    const response: Board = await createBoardService(payload);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateExistingBoard = createAsyncThunk('boards/update', async (payload: UpdateBoardPayload, { rejectWithValue }) => {
  try {
    const response: Board = await updateBoardService(payload);
    return response;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteExistingBoard = createAsyncThunk('boards/delete', async (id: number, { rejectWithValue }) => {
  try {
    const response = await deleteBoardService(id);
    return { id, message: response.message };
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const boardsSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    clearSelectedBoard(state) {
      state.selectedBoard = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Boards
    builder.addCase(fetchAllBoards.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAllBoards.fulfilled, (state, action: PayloadAction<FetchBoardsResponse>) => {
      state.loading = false;
      state.boards = action.payload.data;
      state.error = null;
    });
    builder.addCase(fetchAllBoards.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch Board By ID
    builder.addCase(fetchBoardById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBoardById.fulfilled, (state, action: PayloadAction<FetchBoardDetailsResponse>) => {
      state.loading = false;
      state.selectedBoard = action.payload.data;
      state.error = null;
    });
    builder.addCase(fetchBoardById.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create New Board
    builder.addCase(createNewBoard.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createNewBoard.fulfilled, (state, action: PayloadAction<Board>) => {
      state.loading = false;
      state.boards.push(action.payload);
      state.selectedBoard = action.payload;
      state.error = null;
    });
    builder.addCase(createNewBoard.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Existing Board
    builder.addCase(updateExistingBoard.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateExistingBoard.fulfilled, (state, action: PayloadAction<Board>) => {
      state.loading = false;
      const index = state.boards.findIndex((board) => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
      state.selectedBoard = action.payload;
      state.error = null;
    });
    builder.addCase(updateExistingBoard.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete Existing Board
    builder.addCase(deleteExistingBoard.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteExistingBoard.fulfilled, (state, action: PayloadAction<{ id: number; message: string }>) => {
      state.loading = false;
      state.boards = state.boards.filter((board) => board.id !== action.payload.id);
      if (state.selectedBoard && state.selectedBoard.id === action.payload.id) {
        state.selectedBoard = null;
      }
      state.error = null;
    });
    builder.addCase(deleteExistingBoard.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
export const { clearSelectedBoard } = boardsSlice.actions;

export const selectBoards = (state: RootState) => state.boards;

export default boardsSlice.reducer;
