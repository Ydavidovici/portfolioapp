// src/routes/AppRoutes.jsx

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AdminDashboard from '../features/adminDashboard/pages/AdminDashboard';
import DeveloperDashboard from '../features/developerDashboard/pages/DeveloperDashboard';
import ClientDashboard from '../features/clientDashboard/pages/ClientDashboard';
import LoginPage from '../features/auth/pages/LoginPage';
import NotFoundPage from '../features/auth/pages/NotFoundPage'; // Optional: 404 Page
import PrivateRoute from '../components/PrivateRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Private Routes */}
        <Route
          path="/admin-dashboard/*"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/developer-dashboard/*"
          element={
            <PrivateRoute roles={['developer', 'admin']}>
              <DeveloperDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/client-dashboard/*"
          element={
            <PrivateRoute roles={['client']}>
              <ClientDashboard />
            </PrivateRoute>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
