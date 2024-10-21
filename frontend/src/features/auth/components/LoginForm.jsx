// src/features/auth/components/LoginForm.tsx

import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../authSlice';
import { RootState } from '../../../store/store';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {auth.error && <div className="text-red-500">{auth.error}</div>}
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-medium">Email</label>
        <input
          type="email"
          id="email"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="mb-1 font-medium">Password</label>
        <input
          type="password"
          id="password"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        disabled={auth.loading}
      >
        {auth.loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
