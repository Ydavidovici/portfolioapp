// src/features/auth/components/LoginForm.jsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';

const LoginForm = () => {
  const { loginUser, loading, error } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await loginUser({ email, password });
    // Redirection is handled inside AuthContext after successful login
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="text-red-500">{error}</div>}
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="mb-1 font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
