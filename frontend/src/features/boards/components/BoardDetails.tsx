// src/features/boards/components/BoardDetails.tsx

import React, { useEffect } from 'react';
import { useBoards } from '../hooks/useBoards';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';

interface RouteParams {
  id: string;
}

const BoardDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const { selectedBoard, fetchBoardById, loading, error } = useBoards();

  useEffect(() => {
    if (id) {
      fetchBoardById(Number(id));
    }
  }, [id, fetchBoardById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner size="lg" color="text-blue-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  if (!selectedBoard) {
    return <div className="text-center py-10">Board not found.</div>;
  }

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4">{selectedBoard.title}</h2>
        <p className="text-gray-700 mb-4">{selectedBoard.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          Created At: {new Date(selectedBoard.createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Updated At: {new Date(selectedBoard.updatedAt).toLocaleString()}
        </p>
        <div className="flex gap-4">
          <Link
            to={`/boards/edit/${selectedBoard.id}`}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Edit
          </Link>
          <Link
            to="/boards"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Back to List
          </Link>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default BoardDetails;
