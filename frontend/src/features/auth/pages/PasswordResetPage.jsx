// src/features/auth/pages/PasswordResetPage.jsx

import React from 'react';
import PasswordResetForm from '../components/PasswordResetForm';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../../../Components/ErrorBoundary';

const PasswordResetPage = () => {
  return (
      <ErrorBoundary>
        <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Reset Your Password
            </h2>
            <PasswordResetForm />
            <p className="mt-4 text-center">
              Remembered your password?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </ErrorBoundary>
  );
};

export default PasswordResetPage;
