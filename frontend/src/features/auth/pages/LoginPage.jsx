// src/features/auth/pages/LoginPage.jsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../../Components/ErrorBoundary';
import LoadingSpinner from '../../../Components/LoadingSpinner';

const LoginPage = () => {
  const { user, loginUser, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser({ email, password });
    // Redirection is handled in AuthContext after successful login
  };

  if (user) {
    // If already logged in, redirect based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" />;
      case 'developer':
        return <Navigate to="/developer-dashboard" />;
      case 'client':
        return <Navigate to="/client-dashboard" />;
      default:
        return <Navigate to="/" />;
    }
  }

  return (
      <ErrorBoundary>
        <div className="login-page flex items-center justify-center min-h-screen bg-gray-200 p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
            {error && (
                <p className="text-red-500 mb-4" role="alert">
                  {error}
                </p>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email:
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-1 font-medium">
                  Password:
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter your password"
                />
              </div>
              <div className="mb-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
                >
                  {loading ? (
                      <LoadingSpinner size="sm" color="text-white" />
                  ) : (
                      'Login'
                  )}
                </button>
              </div>
            </form>
            <p className="text-center">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-500 hover:underline">
                Register here
              </a>
            </p>
          </div>
        </div>
      </ErrorBoundary>
  );
};

export default LoginPage;
