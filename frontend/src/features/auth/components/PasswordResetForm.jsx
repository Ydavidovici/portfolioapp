// src/features/auth/components/PasswordResetForm.tsx

import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestPasswordReset } from '../authSlice';
import { RootState } from '../../store/store';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';
import ConfirmationPrompt from '../../../commonComponents/ConfirmationPrompt'; // If using custom confirmation

const PasswordResetForm: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    dispatch(requestPasswordReset(email))
      .unwrap()
      .then((res) => {
        setSuccessMessage(res.message); // Assuming backend returns a message
      })
      .catch((err) => {
        // Error is already handled by auth.error
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {auth.error && <div className="text-red-500">{auth.error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-1 font-medium">
          Registered Email
        </label>
        <input
          type="email"
          id="email"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        disabled={auth.loading}
      >
        {auth.loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Reset Password'}
      </button>
    </form>
  );
};

export default PasswordResetForm;
