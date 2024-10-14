// src/features/adminDashboard/adminDashboard.test.tsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './adminSlice';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import RoleList from './components/RoleList';
import RoleForm from './components/RoleForm';
import AdminDashboard from './pages/AdminDashboard';
import { BrowserRouter, Route, MemoryRouter } from 'react-router-dom';

// Define the type for renderWithProviders options
interface RenderWithProvidersOptions {
  preloadedState?: any;
  store?: any;
  route?: string;
  path?: string;
}

// Utility function to render components with Redux and Router
const renderWithProviders = (
    ui: React.ReactElement,
    {
      preloadedState = {},
      store = configureStore({
        reducer: { admin: adminReducer },
        preloadedState,
      }),
      route = '/',
      path = '/',
    }: RenderWithProvidersOptions = {}
) => {
  window.history.pushState({}, 'Test page', route);

  return render(
      <Provider store={store}>
        <BrowserRouter>
          <Route path={path}>{ui}</Route>
        </BrowserRouter>
      </Provider>
  );
};

describe('Admin Dashboard Feature - Render and CRUD Tests', () => {
  let newUserId: number | null = null;
  let newRoleId: number | null = null;

  // Render Tests
  it('renders AdminDashboard without errors', () => {
    renderWithProviders(<AdminDashboard />);
    expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
  });

  it('renders UserList without errors', () => {
    renderWithProviders(<UserList />);
    expect(screen.getByText(/Users/i)).toBeInTheDocument();
  });

  it('renders UserForm without errors', () => {
    renderWithProviders(<UserForm />);
    expect(screen.getByText(/Create New User/i)).toBeInTheDocument();
  });

  it('renders RoleList without errors', () => {
    renderWithProviders(<RoleList />);
    expect(screen.getByText(/Roles/i)).toBeInTheDocument();
  });

  it('renders RoleForm without errors', () => {
    renderWithProviders(<RoleForm />);
    expect(screen.getByText(/Create New Role/i)).toBeInTheDocument();
  });

  // User CRUD Operations

  // Create User
  it('creates a new user successfully', async () => {
    renderWithProviders(<UserForm />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'newuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'user' } });
    fireEvent.click(screen.getByText('Create User'));

    // Check creation was successful
    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument();
    });

    const createdUser = screen.getByText('New User');
    // Assuming the user has a data-id attribute
    newUserId = createdUser ? parseInt(createdUser.getAttribute('data-id') || '0') : null;
    expect(newUserId).not.toBeNull();
  });

  // Read Users
  it('displays a list of users', async () => {
    renderWithProviders(<UserList />);
    await waitFor(() => {
      expect(screen.getByText('New User')).toBeInTheDocument();
    });
  });

  // Update User
  it('updates an existing user successfully', async () => {
    if (newUserId === null) {
      throw new Error('No user ID available for update test');
    }

    renderWithProviders(<UserList />);
    const editButton = screen.getByTestId(`edit-button-${newUserId}`);
    fireEvent.click(editButton);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Updated User' } });
    fireEvent.click(screen.getByText('Save Changes'));

    // Verify update
    await waitFor(() => {
      expect(screen.getByText('Updated User')).toBeInTheDocument();
    });
  });

  // Delete User
  it('deletes a user successfully', async () => {
    if (newUserId === null) {
      throw new Error('No user ID available for delete test');
    }

    renderWithProviders(<UserList />);
    const deleteButton = screen.getByTestId(`delete-button-${newUserId}`);
    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByText('Confirm'));

    // Verify deletion
    await waitFor(() => {
      expect(screen.queryByText('Updated User')).not.toBeInTheDocument();
    });
  });

  // Role CRUD Operations

  // Create Role
  it('creates a new role successfully', async () => {
    renderWithProviders(<RoleForm />);
    fireEvent.change(screen.getByLabelText(/Role Name/i), { target: { value: 'editor' } });
    fireEvent.click(screen.getByText('Create Role'));

    // Check creation was successful
    await waitFor(() => {
      expect(screen.getByText('editor')).toBeInTheDocument();
    });

    const createdRole = screen.getByText('editor');
    // Assuming the role has a data-id attribute
    newRoleId = createdRole ? parseInt(createdRole.getAttribute('data-id') || '0') : null;
    expect(newRoleId).not.toBeNull();
  });

  // Read Roles
  it('displays a list of roles', async () => {
    renderWithProviders(<RoleList />);
    await waitFor(() => {
      expect(screen.getByText('editor')).toBeInTheDocument();
    });
  });

  // Update Role
  it('updates an existing role successfully', async () => {
    if (newRoleId === null) {
      throw new Error('No role ID available for update test');
    }

    renderWithProviders(<RoleList />);
    const editButton = screen.getByTestId(`edit-button-${newRoleId}`);
    fireEvent.click(editButton);

    fireEvent.change(screen.getByLabelText(/Role Name/i), { target: { value: 'supereditor' } });
    fireEvent.click(screen.getByText('Save Changes'));

    // Verify update
    await waitFor(() => {
      expect(screen.getByText('supereditor')).toBeInTheDocument();
    });
  });

  // Delete Role
  it('deletes a role successfully', async () => {
    if (newRoleId === null) {
      throw new Error('No role ID available for delete test');
    }

    renderWithProviders(<RoleList />);
    const deleteButton = screen.getByTestId(`delete-button-${newRoleId}`);
    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByText('Confirm'));

    // Verify deletion
    await waitFor(() => {
      expect(screen.queryByText('supereditor')).not.toBeInTheDocument();
    });
  });
});
