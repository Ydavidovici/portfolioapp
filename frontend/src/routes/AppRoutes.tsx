// src/routes/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import AdminDashboard from '@/features/dashboard/admin/pages/AdminDashboard';
import ClientDashboard from '@/features/dashboard/client/pages/ClientDashboard';
import DeveloperDashboard from '@/features/dashboard/developer/pages/DeveloperDashboard';
import ProtectedRoute from '@/components/common/ProtectedRoute';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Add other public routes here */}

            {/* Protected Routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute roles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/client/dashboard"
                element={
                    <ProtectedRoute roles={['client']}>
                        <ClientDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/developer/dashboard"
                element={
                    <ProtectedRoute roles={['developer']}>
                        <DeveloperDashboard />
                    </ProtectedRoute>
                }
            />
            {/* Add other protected routes here */}
        </Routes>
    );
};

export default AppRoutes;
