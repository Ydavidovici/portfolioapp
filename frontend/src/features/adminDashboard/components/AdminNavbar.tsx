// src/features/adminDashboard/commonComponents/AdminNavbar.tsx

import React from 'react';
import Header from '../../../commonComponents/common/Header';
import { useDispatch } from 'react-redux';
import { logout } from '../userSlice'; // Ensure you have a logout action defined

const AdminNavbar: React.FC = () => {
  const dispatch = useDispatch();

  const adminNavLinks = [
    { text: 'Dashboard', href: '/admin/dashboard' },
    { text: 'Users', href: '/admin/users' },
    { text: 'Roles', href: '/admin/roles' },
    { text: 'Settings', href: '/admin/settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    // Additional logout logic (e.g., redirecting to login page)
  };

  return (
    <Header
      title="Admin Dashboard"
      logoSrc="/path-to-admin-logo.svg" // Optional: Admin-specific logo
      navLinks={adminNavLinks}
      buttonText="Logout"
      onButtonClick={handleLogout}
      variant="admin"
    />
  );
};

export default AdminNavbar;
