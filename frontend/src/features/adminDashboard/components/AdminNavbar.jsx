import React from 'react';
import Header from '../../../Components/Header';
// import './AdminNavbar.css'; // Optional: For styling

const AdminNavbar = ({ handleLogout }) => {
  const adminNavLinks = [
    { text: 'Dashboard', href: '/admin/dashboard' },
    { text: 'Users', href: '/admin/users' },
    { text: 'Roles', href: '/admin/roles' },
    { text: 'Settings', href: '/admin/settings' },
  ];

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
