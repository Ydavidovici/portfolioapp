// src/features/auth/pages/PasswordResetConfirmationPage.tsx

import React, { useState, FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { resetPassword } from '../authSlice';
import { RootState } from '../../store/store';
import LoadingSpinner from '../../../commonComponents/LoadingSpinner';
import ErrorBoundary from '../../../commonComponents/ErrorBoundary';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const PasswordResetConfirmationPage: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  const token = query.get('token') || '';

  const auth = useSelector((state: RootState) => state.auth);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!token) {
      // If no token, redirect to password reset page
      history.push('/password-reset');
    }
  }, [token, history]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    dispatch(resetPassword({ token, newPassword }))
      .unwrap()
      .then((res) => {
        setSuccessMessage(res.message); // Assuming backend returns a message
        // Optionally, redirect to login after a delay
        setTimeout(() => {
          history.push('/login');
        }, 3000);
      })
      .catch((err) => {
        // Error is already handled by auth.error
      });
  };

  return (
    <ErrorBoundary>
      <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Set New Password</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {auth.error && <div className="text-red-500">{auth.error}</div>}
            {successMessage && <div className="text-green-500">{successMessage}</div>}
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
              disabled={auth.loading}
            >
              {auth.loading ? <LoadingSpinner size="sm" color="text-white" /> : 'Reset Password'}
            </button>
          </form>
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

export default PasswordResetConfirmationPage;
