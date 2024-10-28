// src/features/auth/auth.test.jsx

import React, { useState } from 'react';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import renderWithRouter from '../../utils/renderWithRouter';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PasswordResetPage from './pages/PasswordResetPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import { AuthContext } from '../../context/AuthContext';
import { mockAuthContextValue } from '../../utils/mockAuthContext';
import axios from 'axios';

// Mock axios to prevent actual API calls during tests
jest.mock('axios');

describe('Auth Feature - Render and CRUD Tests', () => {
  // Ensure each page renders without errors
  it('renders LoginPage without errors', () => {
    renderWithRouter(<LoginPage />);
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
  });

  it('renders RegisterPage without errors', () => {
    renderWithRouter(<RegisterPage />);
    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
  });

  it('renders PasswordResetPage without errors', () => {
    renderWithRouter(<PasswordResetPage />);
    expect(
        screen.getByRole('heading', { name: /Reset Your Password/i })
    ).toBeInTheDocument();
  });

  it('renders ChangePasswordPage without errors', () => {
    renderWithRouter(<ChangePasswordPage />);
    expect(
        screen.getByRole('heading', { name: /Change Password/i })
    ).toBeInTheDocument();
  });

  it('renders EmailVerificationPage without errors', () => {
    renderWithRouter(<EmailVerificationPage />);
    expect(
        screen.getByRole('heading', { name: /Email Verification/i })
    ).toBeInTheDocument();
  });

  // Authentication Actions (Login, Register, etc.)

  describe('Login Functionality', () => {
    it('should login successfully with valid credentials', async () => {
      // Mock the axios post request for login
      axios.post.mockResolvedValueOnce({
        data: {
          user: { id: 1, role: 'client', name: 'Test User' },
        },
      });

      const authContextValue = {
        ...mockAuthContextValue,
        loginUser: jest.fn(async ({ email, password }) => {
          // Simulate successful login
          authContextValue.user = { id: 1, role: 'client', name: 'Test User' };
        }),
        user: null,
      };

      renderWithRouter(<LoginPage />, { authContextValue });

      // Adjusted label matchers to account for optional colons
      fireEvent.change(screen.getByLabelText(/^Email:?$/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^Password:?$/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Login/i }));

      // Verify loginUser was called with correct arguments
      expect(authContextValue.loginUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should display error message on login failure', async () => {
      const errorMessage = 'Invalid credentials';

      const TestAuthProvider = ({ children }) => {
        const [error, setError] = useState(null);

        const authContextValue = {
          ...mockAuthContextValue,
          error,
          loginUser: jest.fn(async () => {
            setError(errorMessage);
          }),
        };

        return (
            <AuthContext.Provider value={authContextValue}>
              {children}
            </AuthContext.Provider>
        );
      };

      renderWithRouter(
          <TestAuthProvider>
            <LoginPage />
          </TestAuthProvider>
      );

      await act(async () => {
        fireEvent.change(screen.getByLabelText(/^Email:?$/i), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/^Password:?$/i), {
          target: { value: 'wrongpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
      });
    });
  }); // Close Login Functionality describe block

  describe('Register Functionality', () => {
    it('should successfully register a new user', async () => {
      // Mock the axios post request for registration
      axios.post.mockResolvedValueOnce({
        data: {
          user: { id: 2, role: 'client', name: 'New User' },
        },
      });

      const authContextValue = {
        ...mockAuthContextValue,
        registerUser: jest.fn(async ({ name, email, password }) => {
          // Simulate successful registration
          authContextValue.user = { id: 2, role: 'client', name: 'New User' };
        }),
        user: null,
      };

      renderWithRouter(<RegisterPage />, { authContextValue });

      // Adjusted label matchers to account for optional colons
      fireEvent.change(screen.getByLabelText(/^Name:?$/i), {
        target: { value: 'New User' },
      });
      fireEvent.change(screen.getByLabelText(/^Email:?$/i), {
        target: { value: 'newuser@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/^Password:?$/i), {
        target: { value: 'password123' },
      });
      fireEvent.change(screen.getByLabelText(/^Confirm Password:?$/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Register/i }));

      // Verify registerUser was called with correct arguments
      expect(authContextValue.registerUser).toHaveBeenCalledWith({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      });
    });

    it('should display error message on registration failure', async () => {
      const errorMessage = 'Email already exists';

      const TestAuthProvider = ({ children }) => {
        const [error, setError] = useState(null);

        const authContextValue = {
          ...mockAuthContextValue,
          error,
          registerUser: jest.fn(async () => {
            setError(errorMessage);
          }),
        };

        return (
            <AuthContext.Provider value={authContextValue}>
              {children}
            </AuthContext.Provider>
        );
      };

      renderWithRouter(
          <TestAuthProvider>
            <RegisterPage />
          </TestAuthProvider>
      );

      await act(async () => {
        fireEvent.change(screen.getByLabelText(/^Name:?$/i), {
          target: { value: 'Existing User' },
        });
        fireEvent.change(screen.getByLabelText(/^Email:?$/i), {
          target: { value: 'existinguser@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/^Password:?$/i), {
          target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText(/^Confirm Password:?$/i), {
          target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
      });
    });
  }); // Close Register Functionality describe block

  describe('Password Reset Functionality', () => {
    it('should successfully request password reset', async () => {
      // Mock the axios post request for password reset
      axios.post.mockResolvedValueOnce({
        data: { message: 'Password reset link sent' },
      });

      const authContextValue = {
        ...mockAuthContextValue,
        requestPasswordReset: jest.fn(async ({ email }) => {
          // Simulate successful password reset request
          authContextValue.success = 'Password reset link sent';
        }),
        success: null,
      };

      renderWithRouter(<PasswordResetPage />, { authContextValue });

      // Wrap state updates in act()
      await act(async () => {
        fireEvent.change(screen.getByLabelText(/^Registered Email:?$/i), {
          target: { value: 'test@example.com' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
      });

      // Verify requestPasswordReset was called with correct arguments
      expect(authContextValue.requestPasswordReset).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should display error message on password reset request failure', async () => {
      const errorMessage = 'Email not found';

      const TestAuthProvider = ({ children }) => {
        const [error, setError] = useState(null);

        const authContextValue = {
          ...mockAuthContextValue,
          error,
          requestPasswordReset: jest.fn(async () => {
            setError(errorMessage);
          }),
        };

        return (
            <AuthContext.Provider value={authContextValue}>
              {children}
            </AuthContext.Provider>
        );
      };

      renderWithRouter(
          <TestAuthProvider>
            <PasswordResetPage />
          </TestAuthProvider>
      );

      await act(async () => {
        fireEvent.change(screen.getByLabelText(/^Registered Email:?$/i), {
          target: { value: 'nonexistent@example.com' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
      });
    });
  }); // Close Password Reset Functionality describe block

  describe('Email Verification Functionality', () => {
    it('should display error message on email verification failure', async () => {
      const errorMessage = 'Invalid or expired verification token';

      const TestAuthProvider = ({ children }) => {
        const [error, setError] = useState(null);

        const authContextValue = {
          ...mockAuthContextValue,
          error,
          verifyEmail: jest.fn(async () => {
            setError(errorMessage);
          }),
        };

        return (
            <AuthContext.Provider value={authContextValue}>
              {children}
            </AuthContext.Provider>
        );
      };

      renderWithRouter(
          <TestAuthProvider>
            <EmailVerificationPage />
          </TestAuthProvider>
      );

      await act(async () => {
        fireEvent.change(screen.getByLabelText(/^Verification Code:?$/i), {
          target: { value: 'invalidcode' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Verify Email/i }));
      });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
      });
    });
  }); // Close Email Verification Functionality describe block
}); // Close Auth Feature describe block
