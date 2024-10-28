// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // User object
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(null); // Success state for messages

  // Load user from localStorage or API on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    // Optionally, verify token with backend
  }, []);

  // Login function
  const loginUser = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('/api/login', { email, password });
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect based on role
      switch (response.data.user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'developer':
          navigate('/developer-dashboard');
          break;
        case 'client':
          navigate('/client-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      // Do not re-throw the error
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Change Password function
  const changePassword = async ({ currentPassword, newPassword }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post('/api/change-password', {
        currentPassword,
        newPassword,
      });
      setSuccess('Password changed successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password function
  const resetPassword = async ({ token, newPassword }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post('/api/reset-password', { token, newPassword });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  // Verify Email function
  const verifyEmail = async ({ code }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post('/api/verify-email', { code });
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Register User function
  const registerUser = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('/api/register', {
        name,
        email,
        password,
      });
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/login'); // Redirect to login after registration
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
      // Do not re-throw the error
    } finally {
      setLoading(false);
    }
  };

  // Request Password Reset function
  const requestPasswordReset = async ({ email }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post('/api/request-password-reset', { email });
      setSuccess('Password reset link sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            loading,
            error,
            success,
            loginUser,
            logout,
            changePassword,
            resetPassword,
            verifyEmail,
            registerUser,
            requestPasswordReset,
            setUser, // If needed elsewhere
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};
