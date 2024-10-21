// src/routes/AppRoutes.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import AdminDashboard from '../features/adminDashboard/pages/AdminDashboard';
import DeveloperDashboard from '../features/developerDashboard/pages/DeveloperDashboard';
import ClientDashboard from '../features/clientdashboard/pages/ClientDashboard';
import LoginPage from '../features/auth/pages/LoginPage';
import NotFoundPage from '../features/auth/pages/NotFoundPage'; // Optional: 404 Page
import PrivateRoute from '../components/PrivateRoute';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Switch>
        {/* Public Routes */}
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/" component={LoginPage} /> {/* Redirect root to Login */}

        {/* Private Routes */}
        <PrivateRoute
          path="/admin-dashboard"
          component={AdminDashboard}
          roles={['admin']}
        />
        <PrivateRoute
          path="/developer-dashboard"
          component={DeveloperDashboard}
          roles={['developer', 'admin']}
        />
        <PrivateRoute
          path="/client-dashboard"
          component={ClientDashboard}
          roles={['client']}
        />

        {/* 404 Not Found */}
        <Route component={NotFoundPage} />

        {/* Redirect any unknown routes to Login */}
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
};

export default AppRoutes;
