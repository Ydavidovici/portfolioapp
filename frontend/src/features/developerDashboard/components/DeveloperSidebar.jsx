import React from 'react';
import { Link } from 'react-router-dom';
import './DeveloperSidebar.css'; // Optional: For styling

const DeveloperSidebar = () => {
  return (
    <aside className="developer-sidebar">
      <ul>
        <li>
          <Link to="/developer-dashboard/projects">Projects</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/messages">Messages</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/boards">Boards</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/calendar-entries">
            Calendar Entries
          </Link>
        </li>
        <li>
          <Link to="/developer-dashboard/checklists">Checklists</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/checklist-items">Checklist Items</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/documents">Documents</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/feedback">Feedback</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/invoices">Invoices</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/notes">Notes</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/payments">Payments</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/quickbooks-tokens">
            QuickBooks Tokens
          </Link>
        </li>
        <li>
          <Link to="/developer-dashboard/reminders">Reminders</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/tasks">Tasks</Link>
        </li>
        <li>
          <Link to="/developer-dashboard/task-lists">Task Lists</Link>
        </li>
        {/* Add more links as needed */}
      </ul>
    </aside>
  );
};

export default DeveloperSidebar;
