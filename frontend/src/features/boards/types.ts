// src/features/boards/types.ts

export interface Board {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardPayload {
  title: string;
  description: string;
}

export interface UpdateBoardPayload {
  id: number;
  title: string;
  description: string;
}

export interface FetchBoardsResponse {
  boards: Board[];
}

export interface FetchBoardDetailsResponse {
  board: Board;
}
