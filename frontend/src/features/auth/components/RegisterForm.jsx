// src/features/auth/components/RegisterForm.tsx

import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../authSlice';
import { RootState } from '../../store/store';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    dispatch(register({ name, email, password, confirmPassword }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {auth.error && <div className="text-red-500">{auth.error}</div>}
      <div className="flex flex-col">
        <label htmlFor="name" className="mb-1 font-medium">Name</label>
        <input
          type="text"
          id="name"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-medium">Email</label>
        <input
          type="email"
          id="email"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="confirmPassword" className="mb-1 font-medium">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        disabled={auth.loading}
      >
        {auth.loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
