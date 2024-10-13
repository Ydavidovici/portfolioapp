// src/features/auth/pages/LoginPage.tsx

import React from 'react';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';

const LoginPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
          <LoginForm />
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LoginPage;
