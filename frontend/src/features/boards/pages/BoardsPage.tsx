// src/features/boards/pages/BoardsPage.tsx

import React from 'react';
import BoardList from '../components/BoardList';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';

const BoardsPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Boards</h1>
          <Link
            to="/boards/create"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Create New Board
          </Link>
        </div>
        <BoardList />
      </div>
    </ErrorBoundary>
  );
};

export default BoardsPage;
