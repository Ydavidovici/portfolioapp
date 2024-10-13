// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/features/home/pages/HomePage';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import AdminDashboard from '@/features/admin/pages/AdminDashboard';
import UserForm from '@/features/admin/commonComponents/UserForm';
import RoleForm from '@/features/admin/commonComponents/RoleForm';
import ProtectedRoute from '@/commonComponents/common/ProtectedRoute';

// Import other dashboard commonComponents
import ClientDashboard from '@/features/client/pages/ClientDashboard';
import DeveloperDashboard from '@/features/developer/pages/DeveloperDashboard';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Redirect unknown routes to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/create"
        element={
          <ProtectedRoute roles={['admin']}>
            <UserForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/edit/:id"
        element={
          <ProtectedRoute roles={['admin']}>
            <UserForm existingUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/roles/create"
        element={
          <ProtectedRoute roles={['admin']}>
            <RoleForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/roles/edit/:id"
        element={
          <ProtectedRoute roles={['admin']}>
            <RoleForm existingRole />
          </ProtectedRoute>
        }
      />

      {/* Client Dashboard */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute roles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      {/* Developer Dashboard */}
      <Route
        path="/developer/dashboard"
        element={
          <ProtectedRoute roles={['developer']}>
            <DeveloperDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
