// src/features/clientdashboard/clientDashboard.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClientDashboard from './pages/ClientDashboard';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClientDashboardState } from './types';
import '@testing-library/jest-dom/extend-expect';

// Create a mock store
const mockStore = configureStore([]);
const initialState: { clientdashboard: ClientDashboardState; auth: { user: { role: string } | null } } = {
    clientdashboard: {
        messages: [],
        documents: [],
        loading: false,
        error: null,
    },
    auth: {
        user: {
            role: 'client',
        },
    },
};

describe('ClientDashboard Component', () => {
    let store: any;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    test('renders ClientNavbar and ClientSidebar', () => {
        render(
          <Provider store={store}>
              <Router>
                  <ClientDashboard />
              </Router>
          </Provider>
        );

        // Check for ClientNavbar
        expect(screen.getByText(/client dashboard/i)).toBeInTheDocument();

        // Check for ClientSidebar
        expect(screen.getByText(/messages/i)).toBeInTheDocument();
        expect(screen.getByText(/documents/i)).toBeInTheDocument();
    });

    test('renders MessageList component', () => {
        render(
          <Provider store={store}>
              <Router>
                  <ClientDashboard />
              </Router>
          </Provider>
        );

        // Assuming MessageList has a heading
        expect(screen.getByText(/your messages/i)).toBeInTheDocument();
    });

    test('renders DocumentList component', () => {
        render(
          <Provider store={store}>
              <Router>
                  <ClientDashboard />
              </Router>
          </Provider>
        );

        // Assuming DocumentList has a heading
        expect(screen.getByText(/your documents/i)).toBeInTheDocument();
    });

    test('does not render client-specific components for unauthorized roles', () => {
        // Update the mock store with a non-client user
        store = mockStore({
            clientdashboard: initialState.clientdashboard,
            auth: { user: { role: 'developer' } },
        });

        render(
          <Provider store={store}>
              <Router>
                  <ClientDashboard />
              </Router>
          </Provider>
        );

        // Since the user is not a client, components should not be visible
        expect(screen.queryByText(/your messages/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/your documents/i)).not.toBeInTheDocument();
    });

    test('displays error message when there is an error', () => {
        // Update the mock store with an error
        const errorState: ClientDashboardState = {
            ...initialState.clientdashboard,
            error: 'Failed to fetch data',
        };

        store = mockStore({
            clientdashboard: errorState,
            auth: { user: { role: 'client' } },
        });

        render(
          <Provider store={store}>
              <Router>
                  <ClientDashboard />
              </Router>
          </Provider>
        );

        expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
    });

    test('renders loading state when data is being fetched', () => {
        // Update the mock store with loading state
        const loadingState: ClientDashboardState = {
            ...initialState.clientdashboard,
            loading: true,
        };

        store = mockStore({
            clientdashboard: loadingState,
            auth: { user: { role: 'client' } },
        });

        render(
          <Provider store={store}>
              <Router>
                  <ClientDashboard />
              </Router>
          </Provider>
        );

        expect(screen.getByText(/loading messages/i)).toBeInTheDocument();
        expect(screen.getByText(/loading documents/i)).toBeInTheDocument();
    });
});
