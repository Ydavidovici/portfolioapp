// src/features/boards/services/boardsService.ts

import apiClient from '../../../api/apiClient';
import {
  CreateBoardPayload,
  UpdateBoardPayload,
  Board,
  FetchBoardsResponse,
  FetchBoardDetailsResponse,
} from '../types';

// Fetch All Boards
export const fetchBoards = async (): Promise<FetchBoardsResponse> => {
  const response = await apiClient.get<FetchBoardsResponse>('/boards');
  return response.data;
};

// Fetch Board Details
export const fetchBoardDetails = async (id: number): Promise<FetchBoardDetailsResponse> => {
  const response = await apiClient.get<FetchBoardDetailsResponse>(`/boards/${id}`);
  return response.data;
};

// Create a New Board
export const createBoard = async (payload: CreateBoardPayload): Promise<Board> => {
  const response = await apiClient.post<Board>('/boards', payload);
  return response.data;
};

// Update an Existing Board
export const updateBoard = async (payload: UpdateBoardPayload): Promise<Board> => {
  const { id, ...data } = payload;
  const response = await apiClient.put<Board>(`/boards/${id}`, data);
  return response.data;
};

// Delete a Board
export const deleteBoard = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/boards/${id}`);
  return response.data;
};
