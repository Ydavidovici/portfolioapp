// src/features/auth/pages/ChangePasswordPage.jsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import LoadingSpinner from '../../../Components/LoadingSpinner';
import ErrorBoundary from '../../../Components/ErrorBoundary';
import { useNavigate } from 'react-router-dom';

const ChangePasswordPage = () => {
  const { changePassword, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    await changePassword({ currentPassword, newPassword });
    // Optionally, handle success message or redirect
    // For example, navigate to a success page:
    // navigate('/password-change-success');
  };

  return (
      <ErrorBoundary>
        <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Change Password
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && <div className="text-red-500">{error}</div>}
              <div className="flex flex-col">
                <label htmlFor="currentPassword" className="mb-1 font-medium">
                  Current Password
                </label>
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
                <label htmlFor="newPassword" className="mb-1 font-medium">
                  New Password
                </label>
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
                <label htmlFor="confirmPassword" className="mb-1 font-medium">
                  Confirm New Password
                </label>
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
                  disabled={loading}
              >
                {loading ? (
                    <LoadingSpinner size="sm" color="text-white" />
                ) : (
                    'Change Password'
                )}
              </button>
            </form>
          </div>
        </div>
      </ErrorBoundary>
  );
};

export default ChangePasswordPage;
