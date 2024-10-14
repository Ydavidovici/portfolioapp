// src/features/auth/auth.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PasswordResetPage from './pages/PasswordResetPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import { BrowserRouter, Route, MemoryRouter } from 'react-router-dom';

// Define utility type for render options
interface RenderWithProvidersOptions {
  preloadedState?: any;
  store?: any;
  route?: string;
  path?: string;
}

// Utility function to render components with Redux and Router
const renderWithProviders = (
    ui: React.ReactElement,
    {
      preloadedState = {},
      store = configureStore({
        reducer: { auth: authReducer },
        preloadedState,
      }),
      route = '/',
      path = '/',
    }: RenderWithProvidersOptions = {}
) => {
  window.history.pushState({}, 'Test page', route);

  return render(
      <Provider store={store}>
        <BrowserRouter>
          <Route path={path}>{ui}</Route>
        </BrowserRouter>
      </Provider>
  );
};

describe('Auth Feature - Render and CRUD Tests', () => {

  // Ensure each page renders without errors
  it('renders LoginPage without errors', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('renders RegisterPage without errors', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  it('renders PasswordResetPage without errors', () => {
    renderWithProviders(<PasswordResetPage />);
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
  });

  it('renders ChangePasswordPage without errors', () => {
    renderWithProviders(<ChangePasswordPage />);
    expect(screen.getByText(/Change Password/i)).toBeInTheDocument();
  });

  it('renders EmailVerificationPage without errors', () => {
    renderWithProviders(<EmailVerificationPage />);
    expect(screen.getByText(/Verify Email/i)).toBeInTheDocument();
  });

  // Authentication Actions (Login, Register, etc.)

  describe('Login Functionality', () => {
    it('should login successfully with valid credentials', async () => {
      renderWithProviders(<LoginPage />);
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Login'));

      // Verify login success response
      await waitFor(() => {
        expect(screen.getByText(/Welcome back!/i)).toBeInTheDocument();
      });
    });

    it('should display error message on login failure', async () => {
      renderWithProviders(<LoginPage />);
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
      fireEvent.click(screen.getByText('Login'));

      // Verify error response
      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Register Functionality', () => {
    it('should successfully register a new user', async () => {
      renderWithProviders(<RegisterPage />);
      fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New User' } });
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'newuser@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Register'));

      // Verify registration success response
      await waitFor(() => {
        expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
      });
    });

    it('should display error message on registration failure', async () => {
      renderWithProviders(<RegisterPage />);
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'existinguser@example.com' } });
      fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Register'));

      // Verify error response
      await waitFor(() => {
        expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Reset Functionality', () => {
    it('should successfully request password reset', async () => {
      renderWithProviders(<PasswordResetPage />);
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
      fireEvent.click(screen.getByText(/Request Password Reset/i));

      // Verify request success response
      await waitFor(() => {
        expect(screen.getByText(/Password reset link sent/i)).toBeInTheDocument();
      });
    });

    it('should display error message on password reset request failure', async () => {
      renderWithProviders(<PasswordResetPage />);
      fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'nonexistent@example.com' } });
      fireEvent.click(screen.getByText(/Request Password Reset/i));

      // Verify error response
      await waitFor(() => {
        expect(screen.getByText(/Email not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Change Password Functionality', () => {
    it('should successfully change the password', async () => {
      renderWithProviders(<ChangePasswordPage />);
      fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'newpassword456' } });
      fireEvent.click(screen.getByText(/Change Password/i));

      // Verify change password success response
      await waitFor(() => {
        expect(screen.getByText(/Password changed successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Email Verification Functionality', () => {
    it('should successfully verify email', async () => {
      renderWithProviders(<EmailVerificationPage />, { route: '/auth/verify-email?token=validtoken123' });

      // Verify email verification success response
      await waitFor(() => {
        expect(screen.getByText(/Email verified successfully/i)).toBeInTheDocument();
      });
    });

    it('should display error message on email verification failure', async () => {
      renderWithProviders(<EmailVerificationPage />, { route: '/auth/verify-email?token=invalidtoken' });

      // Verify error response
      await waitFor(() => {
        expect(screen.getByText(/Invalid or expired verification token/i)).toBeInTheDocument();
      });
    });
  });
});
