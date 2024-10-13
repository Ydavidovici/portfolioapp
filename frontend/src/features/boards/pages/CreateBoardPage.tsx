// src/features/boards/pages/CreateBoardPage.tsx

import React from 'react';
import BoardForm from '../components/BoardForm';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';

const CreateBoardPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Create New Board</h2>
          <BoardForm />
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

export default CreateBoardPage;
