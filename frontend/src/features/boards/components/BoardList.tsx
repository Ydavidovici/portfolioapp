// src/features/boards/components/BoardList.tsx

import React, { useEffect } from 'react';
import { useBoards } from '../hooks/useBoards';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';
import ConfirmationPrompt from '../../../commonComponents/ConfirmationPrompt';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';

const BoardList: React.FC = () => {
  const { boards, loadAllBoards, loading, error, removeBoard } = useBoards();

  useEffect(() => {
    loadAllBoards();
  }, [loadAllBoards]);

  const [pendingDeleteId, setPendingDeleteId] = React.useState<number | null>(null);

  const handleDelete = (id: number) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = () => {
    if (pendingDeleteId !== null) {
      removeBoard(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setPendingDeleteId(null);
  };

  return (
    <ErrorBoundary>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <LoadingSpinner size="lg" color="text-blue-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : (
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Created At</th>
              <th className="py-2 px-4 border-b">Updated At</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
            </thead>
            <tbody>
            {boards.map((board) => (
              <tr key={board.id} className="text-center">
                <td className="py-2 px-4 border-b">{board.id}</td>
                <td className="py-2 px-4 border-b">{board.title}</td>
                <td className="py-2 px-4 border-b">{board.description}</td>
                <td className="py-2 px-4 border-b">{new Date(board.createdAt).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{new Date(board.updatedAt).toLocaleString()}</td>
                <td className="py-2 px-4 border-b flex justify-center gap-2">
                  <Link
                    to={`/boards/${board.id}`}
                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    View
                  </Link>
                  <Link
                    to={`/boards/edit/${board.id}`}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(board.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}

        {/* Confirmation Prompt */}
        {pendingDeleteId !== null && (
          <ConfirmationPrompt
            message="Are you sure you want to delete this board?"
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default BoardList;
