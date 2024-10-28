// src/features/auth/pages/RegisterPage.jsx

import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../../../Components/ErrorBoundary';

const RegisterPage = () => {
  return (
      <ErrorBoundary>
        <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
            <RegisterForm />
            <p className="mt-4 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </ErrorBoundary>
  );
};

export default RegisterPage;
