import React from 'react';
import { Link } from 'react-router-dom';
// import './DeveloperNavbar.css'; // Optional: For styling

const DeveloperNavbar = () => {
  return (
    <nav className="developer-navbar">
      <h1>Developer Dashboard</h1>
      <ul>
        <li>
          <Link to="/developer-dashboard">Home</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/projects">Projects</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/boards">Boards</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/messages">Messages</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default DeveloperNavbar;
