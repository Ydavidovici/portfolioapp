// src/features/adminDashboard/adminDashboard.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import AdminDashboard from './pages/AdminDashboard';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { AdminDashboardState } from './types';
import '@testing-library/jest-dom/extend-expect';

// Create a mock store
const mockStore = configureStore([]);
const initialState: { adminDashboard: AdminDashboardState; auth: { user: { role: string } | null } } = {
  adminDashboard: {
    // Initialize with empty arrays or mock data as needed
    boards: [],
    calendarEntries: [],
    checklists: [],
    checklistItems: [],
    documents: [],
    feedbacks: [],
    invoices: [],
    messages: [],
    notes: [],
    payments: [],
    quickBooksTokens: [],
    reminders: [],
    tasks: [],
    taskLists: [],
    loading: false,
    error: null,
  },
  auth: {
    user: {
      role: 'admin',
    },
  },
};

describe('AdminDashboard Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  test('renders AdminNavbar and AdminSidebar', () => {
    render(
      <Provider store={store}>
        <Router>
          <AdminDashboard />
        </Router>
      </Provider>
    );

    // Check for AdminNavbar
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();

    // Check for AdminSidebar
    expect(screen.getByText(/user management/i)).toBeInTheDocument();
  });

  test('renders DataTable component', () => {
    render(
      <Provider store={store}>
        <Router>
          <AdminDashboard />
        </Router>
      </Provider>
    );

    // Assuming DataTable has a heading or identifiable text
    expect(screen.getByText(/user management/i)).toBeInTheDocument();
  });

  test('renders RoleList component', () => {
    // Update the mock store with some roles
    const rolesState: AdminDashboardState = {
      ...initialState.adminDashboard,
      roles: [
        { id: '1', name: 'Admin', permissions: ['manage_users', 'manage_roles'] },
        { id: '2', name: 'Developer', permissions: ['view_projects'] },
      ],
      loading: false,
      error: null,
    };

    store = mockStore({
      adminDashboard: rolesState,
      auth: { user: { role: 'admin' } },
    });

    render(
      <Provider store={store}>
        <Router>
          <AdminDashboard />
        </Router>
      </Provider>
    );

    // Check for RoleList heading or specific role names
    expect(screen.getByText(/roles/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByText(/developer/i)).toBeInTheDocument();
  });

  test('renders UserList component', () => {
    // Update the mock store with some users
    const usersState: AdminDashboardState = {
      ...initialState.adminDashboard,
      users: [
        { id: '1', name: 'John Doe', email: 'john@example.com', roleId: '1' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', roleId: '2' },
      ],
      loading: false,
      error: null,
    };

    store = mockStore({
      adminDashboard: usersState,
      auth: { user: { role: 'admin' } },
    });

    render(
      <Provider store={store}>
        <Router>
          <AdminDashboard />
        </Router>
      </Provider>
    );

    // Check for UserList heading or specific user names
    expect(screen.getByText(/users/i)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
  });

  test('does not render admin-specific components for non-admin users', () => {
    // Update the mock store with a non-admin user
    store = mockStore({
      adminDashboard: initialState.adminDashboard,
      auth: { user: { role: 'developer' } },
    });

    render(
      <Provider store={store}>
        <Router>
          <AdminDashboard />
        </Router>
      </Provider>
    );

    // Since the user is not admin, certain components should not be visible
    // Adjust based on actual component behavior
    expect(screen.queryByText(/user management/i)).not.toBeInTheDocument();
  });
});
