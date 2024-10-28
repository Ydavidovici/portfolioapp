// src/App.jsx

import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import PasswordResetPage from './features/auth/pages/PasswordResetPage';
import PasswordResetConfirmationPage from './features/auth/pages/PasswordResetConfirmationPage';
import EmailVerificationPage from './features/auth/pages/EmailVerificationPage';
import ChangePasswordPage from './features/auth/pages/ChangePasswordPage';
import AdminDashboard from './features/adminDashboard/pages/AdminDashboard';
import DeveloperDashboard from './features/developerDashboard/pages/DeveloperDashboard';
import PrivateRoute from './Components/PrivateRoute';
import ErrorBoundary from './Components/ErrorBoundary';
import Footer from './Components/Footer';
import { UserProvider } from './context/UserContext'; // Note: 'context' directory

const App = () => {
  return (
    <UserProvider>
      {' '}
      {/* Wrap the entire app with UserProvider */}
      <Router>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            <Route
              path="/password-reset-confirm"
              element={<PasswordResetConfirmationPage />}
            />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute requiredRole="admin" />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
            <Route element={<PrivateRoute requiredRole="developer" />}>
              <Route
                path="/developer-dashboard/*"
                element={<DeveloperDashboard />}
              />
            </Route>

            {/* Fallback Route */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center min-h-screen">
                  <h2 className="text-2xl">404 - Page Not Found</h2>
                </div>
              }
            />
          </Routes>
          <Footer />
        </ErrorBoundary>
      </Router>
    </UserProvider>
  );
};

export default App;
