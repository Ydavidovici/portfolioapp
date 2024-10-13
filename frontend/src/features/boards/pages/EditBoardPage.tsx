// src/features/boards/pages/EditBoardPage.tsx

import React, { useEffect } from 'react';
import BoardForm from '../components/BoardForm';
import { useParams, Link } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';

interface RouteParams {
  id: string;
}

const EditBoardPage: React.FC = () => {
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
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Edit Board</h2>
          <BoardForm existingBoard={selectedBoard} />
          <div className="mt-4 text-center">
            <Link to="/boards" className="text-blue-500 hover:underline">
              Back to Boards
            </Link>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default EditBoardPage;
