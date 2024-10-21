// src/features/auth/pages/ChangePasswordPage.tsx

import React, { useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../authSlice'; // Implement changePassword thunk
import { RootState } from '../../store/store';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';

const ChangePasswordPage: React.FC = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    dispatch(changePassword({ currentPassword, newPassword }));
  };

  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Change Password</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {auth.error && <div className="text-red-500">{auth.error}</div>}
            <div className="flex flex-col">
              <label htmlFor="currentPassword" className="mb-1 font-medium">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="newPassword" className="mb-1 font-medium">New Password</label>
              <input
                type="password"
                id="newPassword"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="mb-1 font-medium">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
              disabled={auth.loading}
            >
              {auth.loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ChangePasswordPage;
