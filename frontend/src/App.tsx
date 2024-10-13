// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import PasswordResetPage from './features/auth/pages/PasswordResetPage';
import PasswordResetConfirmationPage from './features/auth/pages/PasswordResetConfirmationPage';
import EmailVerificationPage from './features/auth/pages/EmailVerificationPage';
import ChangePasswordPage from './features/auth/pages/ChangePasswordPage';
import AdminDashboard from './features/adminDashboard/pages/AdminDashboard';
import PrivateRoute from './commonComponents/PrivateRoute';
import ErrorBoundary from './commonComponents/ErrorBoundary';
import Footer from './commonComponents/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Switch>
          {/* Public Routes */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/password-reset" component={PasswordResetPage} />
          <Route path="/password-reset-confirm" component={PasswordResetConfirmationPage} />
          <Route path="/verify-email" component={EmailVerificationPage} />

          {/* Protected Routes */}
          <PrivateRoute path="/admin" component={AdminDashboard} requiredRole="admin" />

          {/* Fallback Route */}
          <Route path="*">
            <div className="flex items-center justify-center min-h-screen">
              <h2 className="text-2xl">404 - Page Not Found</h2>
            </div>
          </Route>
        </Switch>
        { <Footer />}
      </ErrorBoundary>
    </Router>
  );
};

export default App;
