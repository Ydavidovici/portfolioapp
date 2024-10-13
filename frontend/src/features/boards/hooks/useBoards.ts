// src/features/boards/hooks/useBoards.ts

import { useSelector, useDispatch } from 'react-redux';
import { selectBoards, clearSelectedBoard } from '../boardsSlice';
import {
  fetchAllBoards,
  fetchBoardById,
  createNewBoard,
  updateExistingBoard,
  deleteExistingBoard,
} from '../boardsSlice';
import { RootState, AppDispatch } from '../../store/store';
import { Board, CreateBoardPayload, UpdateBoardPayload } from '../types';

export const useBoards = () => {
  const dispatch: AppDispatch = useDispatch();
  const boardsState = useSelector(selectBoards);

  const loadAllBoards = () => {
    dispatch(fetchAllBoards());
  };

  const loadBoardById = (id: number) => {
    dispatch(fetchBoardById(id));
  };

  const addNewBoard = (payload: CreateBoardPayload) => {
    dispatch(createNewBoard(payload));
  };

  const modifyBoard = (payload: UpdateBoardPayload) => {
    dispatch(updateExistingBoard(payload));
  };

  const removeBoard = (id: number) => {
    dispatch(deleteExistingBoard(id));
  };

  const clearSelection = () => {
    dispatch(clearSelectedBoard());
  };

  return {
    ...boardsState,
    loadAllBoards,
    loadBoardById,
    addNewBoard,
    modifyBoard,
    removeBoard,
    clearSelection,
  };
};
