// src/features/boards/services/boards.test.ts

import axios from 'axios';
import {
  fetchBoards,
  fetchBoardDetails,
  createBoard,
  updateBoard,
  deleteBoard,
} from './services/boardsService.ts';
import { Board, CreateBoardPayload, UpdateBoardPayload, FetchBoardsResponse, FetchBoardDetailsResponse } from './types.ts';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Boards Service', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  // Fetch All Boards
  describe('fetchBoards', () => {
    const API_ENDPOINT = '/boards';

    it('should fetch all boards successfully', async () => {
      const mockBoards: Board[] = [
        {
          id: 1,
          title: 'Board One',
          description: 'Description for Board One',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: 2,
          title: 'Board Two',
          description: 'Description for Board Two',
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-02-01T00:00:00Z',
        },
      ];

      const mockResponse: FetchBoardsResponse = { data: mockBoards };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const data = await fetchBoards();

      expect(mockedAxios.get).toHaveBeenCalledWith(API_ENDPOINT);
      expect(data).toEqual(mockResponse);
    });

    it('should handle fetchBoards failure', async () => {
      const errorMessage = 'Failed to fetch boards';
      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchBoards()).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(API_ENDPOINT);
    });
  });

  // Fetch Board Details
  describe('fetchBoardDetails', () => {
    const API_ENDPOINT = '/boards';

    it('should fetch board details successfully', async () => {
      const boardId = 1;
      const mockBoard: Board = {
        id: boardId,
        title: 'Board One',
        description: 'Description for Board One',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };

      const mockResponse: FetchBoardDetailsResponse = { data: mockBoard };

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

      const data = await fetchBoardDetails(boardId);

      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_ENDPOINT}/${boardId}`);
      expect(data).toEqual(mockResponse);
    });

    it('should handle fetchBoardDetails failure', async () => {
      const boardId = 999; // Non-existent board
      const errorMessage = 'Board not found';

      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchBoardDetails(boardId)).rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_ENDPOINT}/${boardId}`);
    });
  });

  // Create Board
  describe('createBoard', () => {
    const API_ENDPOINT = '/boards';

    it('should create a new board successfully', async () => {
      const newBoardPayload: CreateBoardPayload = {
        title: 'Board Three',
        description: 'Description for Board Three',
      };

      const createdBoard: Board = {
        id: 3,
        ...newBoardPayload,
        createdAt: '2024-03-01T00:00:00Z',
        updatedAt: '2024-03-01T00:00:00Z',
      };

      mockedAxios.post.mockResolvedValueOnce({ data: createdBoard });

      const data = await createBoard(newBoardPayload);

      expect(mockedAxios.post).toHaveBeenCalledWith(API_ENDPOINT, newBoardPayload);
      expect(data).toEqual(createdBoard);
    });

    it('should handle createBoard failure', async () => {
      const newBoardPayload: CreateBoardPayload = {
        title: '', // Invalid payload
        description: 'Description for Board Four',
      };

      const errorMessage = 'Title is required';

      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      await expect(createBoard(newBoardPayload)).rejects.toThrow(errorMessage);
      expect(mockedAxios.post).toHaveBeenCalledWith(API_ENDPOINT, newBoardPayload);
    });
  });

  // Update Board
  describe('updateBoard', () => {
    const API_ENDPOINT = '/boards';

    it('should update an existing board successfully', async () => {
      const updateBoardPayload: UpdateBoardPayload = {
        id: 1,
        title: 'Updated Board One',
        description: 'Updated Description for Board One',
      };

      const updatedBoard: Board = {
        id: updateBoardPayload.id,
        title: updateBoardPayload.title,
        description: updateBoardPayload.description,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-04-01T00:00:00Z',
      };

      mockedAxios.put.mockResolvedValueOnce({ data: updatedBoard });

      const data = await updateBoard(updateBoardPayload);

      expect(mockedAxios.put).toHaveBeenCalledWith(`${API_ENDPOINT}/${updateBoardPayload.id}`, {
        title: updateBoardPayload.title,
        description: updateBoardPayload.description,
      });
      expect(data).toEqual(updatedBoard);
    });

    it('should handle updateBoard failure', async () => {
      const updateBoardPayload: UpdateBoardPayload = {
        id: 999, // Non-existent board
        title: 'Non-existent Board',
        description: 'Description',
      };

      const errorMessage = 'Board not found';

      mockedAxios.put.mockRejectedValueOnce(new Error(errorMessage));

      await expect(updateBoard(updateBoardPayload)).rejects.toThrow(errorMessage);
      expect(mockedAxios.put).toHaveBeenCalledWith(`${API_ENDPOINT}/${updateBoardPayload.id}`, {
        title: updateBoardPayload.title,
        description: updateBoardPayload.description,
      });
    });
  });

  // Delete Board
  describe('deleteBoard', () => {
    const API_ENDPOINT = '/boards';

    it('should delete a board successfully', async () => {
      const boardId = 1;
      const mockResponse = { message: 'Board deleted successfully' };

      mockedAxios.delete.mockResolvedValueOnce({ data: mockResponse });

      const data = await deleteBoard(boardId);

      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_ENDPOINT}/${boardId}`);
      expect(data).toEqual(mockResponse);
    });

    it('should handle deleteBoard failure', async () => {
      const boardId = 999; // Non-existent board
      const errorMessage = 'Board not found';

      mockedAxios.delete.mockRejectedValueOnce(new Error(errorMessage));

      await expect(deleteBoard(boardId)).rejects.toThrow(errorMessage);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${API_ENDPOINT}/${boardId}`);
    });
  });
});
