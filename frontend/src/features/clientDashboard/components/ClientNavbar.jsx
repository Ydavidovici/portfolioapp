import React from 'react';
import { Link } from 'react-router-dom';
// import './ClientNavbar.css'; // Optional: For styling

const ClientNavbar = () => {
  return (
    <nav className="navbar">
      <h1>Client Dashboard</h1>
      <div>
        <Link to="/client-dashboard/messages">
          <button>Messages</button>
        </Link>
        <Link to="/client-dashboard/documents">
          <button>Documents</button>
        </Link>
        <Link to="/logout">
          <button>Logout</button>
        </Link>
      </div>
    </nav>
  );
};

export default ClientNavbar;
