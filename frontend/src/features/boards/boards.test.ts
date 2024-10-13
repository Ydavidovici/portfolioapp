// src/features/boards/boards.test.js

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './boardsSlice';
import BoardList from './components/BoardList';
import BoardForm from './components/BoardForm';
import BoardDetails from './components/BoardDetails';
import BoardsPage from './pages/BoardsPage';
import CreateBoardPage from './pages/CreateBoardPage';
import EditBoardPage from './pages/EditBoardPage';
import { BrowserRouter, Route, MemoryRouter } from 'react-router-dom';

// Utility function to render components with Redux and Router
const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { boards: boardsReducer },
      preloadedState,
    }),
    route = '/',
    path = '/',
  } = {}
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

describe('Boards Feature - Render and CRUD Tests', () => {
  let newBoardId;

  // Check that each page renders without errors
  it('renders BoardsPage without errors', () => {
    renderWithProviders(<BoardsPage />);
    expect(screen.getByText(/Boards/i)).toBeInTheDocument();
  });

  it('renders CreateBoardPage without errors', () => {
    renderWithProviders(<CreateBoardPage />);
    expect(screen.getByText(/Create New Board/i)).toBeInTheDocument();
  });

  it('renders EditBoardPage without errors', async () => {
    renderWithProviders(<EditBoardPage />, { route: '/boards/edit/1', path: '/boards/edit/:id' });
    await waitFor(() => expect(screen.getByText(/Edit Board/i)).toBeInTheDocument());
  });

  // Test CRUD Operations

  // Create
  it('creates a new board successfully', async () => {
    renderWithProviders(<BoardForm />);
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Board' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Description of Test Board' } });
    fireEvent.click(screen.getByText('Create Board'));

    // Check creation was successful
    await waitFor(() => {
      expect(screen.getByText('Test Board')).toBeInTheDocument();
    });

    const createdBoard = screen.getByText('Test Board');
    newBoardId = createdBoard ? parseInt(createdBoard.getAttribute('data-id')) : null;
    expect(newBoardId).not.toBeNull();
  });

  // Read
  it('displays a list of boards', async () => {
    renderWithProviders(<BoardList />);
    await waitFor(() => {
      expect(screen.getByText('Test Board')).toBeInTheDocument();
    });
  });

  // Update
  it('updates an existing board successfully', async () => {
    renderWithProviders(<BoardDetails />, { route: `/boards/${newBoardId}`, path: '/boards/:id' });
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Test Board' } });
    fireEvent.click(screen.getByText('Save Changes'));

    // Verify update
    await waitFor(() => {
      expect(screen.getByText('Updated Test Board')).toBeInTheDocument();
    });
  });

  // Delete
  it('deletes a board successfully', async () => {
    renderWithProviders(<BoardList />);
    const deleteButton = screen.getByTestId(`delete-button-${newBoardId}`);
    fireEvent.click(deleteButton);
    fireEvent.click(screen.getByText('Confirm'));

    // Verify deletion
    await waitFor(() => {
      expect(screen.queryByText('Updated Test Board')).not.toBeInTheDocument();
    });
  });
});
