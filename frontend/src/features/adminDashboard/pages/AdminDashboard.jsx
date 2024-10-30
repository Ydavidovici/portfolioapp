// src/features/adminDashboard/pages/AdminDashboard.jsx

import React from 'react';
import AdminNavbar from '../components/AdminNavbar';
import {
  BoardList,
  CalendarEntryList,
  ChecklistList,
  ChecklistItemList,
  DocumentList,
  FeedbackList,
  InvoiceList,
  MessageList,
  NoteList,
  PaymentList,
  QuickBooksTokenList,
  ReminderList,
  TaskList,
  TaskListList,
} from '../../../components/resources';
import DataTable from '../components/DataTable';
// import './AdminDashboard.css'; // Optional: For layout styling

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="admin-container">
        <main className="admin-main">
          <h1>Admin Dashboard</h1>

          {/* User and Role Management */}
          <section>
            <h2>User Management</h2>
            <DataTable /> {/* Assuming DataTable handles users */}
          </section>

          {/* Shared Resource Components */}
          <section>
            <BoardList />
            <CalendarEntryList />
            <ChecklistList />
            <ChecklistItemList />
            <DocumentList />
            <FeedbackList />
            <InvoiceList />
            <MessageList />
            <NoteList />
            <PaymentList />
            <QuickBooksTokenList />
            <ReminderList />
            <TaskList />
            <TaskListList />
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
