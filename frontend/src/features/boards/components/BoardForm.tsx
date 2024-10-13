// src/features/boards/components/BoardForm.tsx

import React, { useState, FormEvent, useEffect } from 'react';
import { useBoards } from '../hooks/useBoards';
import { CreateBoardPayload, UpdateBoardPayload, Board } from '../types';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';
import { useHistory } from 'react-router-dom';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';

interface BoardFormProps {
  existingBoard?: Board;
}

const BoardForm: React.FC<BoardFormProps> = ({ existingBoard }) => {
  const isEditMode = !!existingBoard;
  const dispatch = useBoards();
  const history = useHistory();

  const [title, setTitle] = useState(existingBoard?.title || '');
  const [description, setDescription] = useState(existingBoard?.description || '');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (existingBoard) {
      setTitle(existingBoard.title);
      setDescription(existingBoard.description);
    }
  }, [existingBoard]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMessage('Title and Description are required.');
      return;
    }

    if (isEditMode && existingBoard) {
      dispatch
        .modifyBoard({
          id: existingBoard.id,
          title,
          description,
        })
        .then(() => {
          history.push('/boards');
        })
        .catch((err: any) => {
          setErrorMessage(err || 'Failed to update board.');
        });
    } else {
      dispatch
        .addNewBoard({
          title,
          description,
        })
        .then(() => {
          history.push('/boards');
        })
        .catch((err: any) => {
          setErrorMessage(err || 'Failed to create board.');
        });
    }
  };

  return (
    <ErrorBoundary>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-1 font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description" className="mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className={`flex items-center justify-center px-4 py-2 ${
            isEditMode ? 'bg-yellow-600' : 'bg-green-600'
          } text-white rounded-md hover:bg-opacity-80 transition`}
          disabled={dispatch.loading}
        >
          {dispatch.loading ? <LoadingSpinner size="sm" color="text-white" /> : isEditMode ? 'Update Board' : 'Create Board'}
        </button>
      </form>
    </ErrorBoundary>
  );
};

export default BoardForm;
