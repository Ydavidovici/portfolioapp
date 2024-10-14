// src/features/clientDashboard/clientDashboard.test.tsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store';
import { BrowserRouter as Router } from 'react-router-dom';
import { ClientDashboard } from './';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import userEvent from '@testing-library/user-event';

const mock = new MockAdapter(axios);
const API_URL = '/api/client-dashboard';

// Helper to render with Provider and Router
const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <Provider store={store}>
            <Router>{ui}</Router>
        </Provider>
    );
};

describe('ClientDashboard Module', () => {
    beforeEach(() => {
        mock.reset();
    });

    test('renders ClientDashboard and loads messages and documents', async () => {
        const messages = [
            {
                id: '1',
                senderName: 'Admin',
                content: 'Welcome to your dashboard!',
                createdAt: '2024-04-01T10:00:00Z',
            },
            {
                id: '2',
                senderName: 'Support',
                content: 'Your document has been uploaded.',
                createdAt: '2024-04-02T12:30:00Z',
            },
        ];

        const documents = [
            {
                id: '1',
                title: 'User Guide',
                url: 'https://example.com/user-guide.pdf',
                uploadedAt: '2024-04-01T09:00:00Z',
            },
            {
                id: '2',
                title: 'Invoice April',
                url: 'https://example.com/invoice-april.pdf',
                uploadedAt: '2024-04-02T11:15:00Z',
            },
        ];

        mock.onGet(`${API_URL}/messages`).reply(200, messages);
        mock.onGet(`${API_URL}/documents`).reply(200, documents);

        renderWithProviders(<ClientDashboard />);

        expect(screen.getByText(/Client Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Recent Messages/i)).toBeInTheDocument();
        expect(screen.getByText(/Recent Documents/i)).toBeInTheDocument();

        // Wait for messages to load
        await waitFor(() => {
            expect(screen.getByText(/Welcome to your dashboard!/i)).toBeInTheDocument();
            expect(screen.getByText(/Your document has been uploaded./i)).toBeInTheDocument();
        });

        // Wait for documents to load
        await waitFor(() => {
            expect(screen.getByText(/User Guide/i)).toBeInTheDocument();
            expect(screen.getByText(/Invoice April/i)).toBeInTheDocument();
        });
    });

    test('handles loading state and errors', async () => {
        mock.onGet(`${API_URL}/messages`).reply(500);
        mock.onGet(`${API_URL}/documents`).reply(500);

        renderWithProviders(<ClientDashboard />);

        expect(screen.getByText(/Loading messages.../i)).toBeInTheDocument();
        expect(screen.getByText(/Loading documents.../i)).toBeInTheDocument();

        // Wait for error messages
        await waitFor(() => {
            expect(screen.getByText(/Error: Failed to fetch messages/i)).toBeInTheDocument();
            expect(screen.getByText(/Error: Failed to fetch documents/i)).toBeInTheDocument();
        });
    });

    test('displays no messages or documents when none are available', async () => {
        mock.onGet(`${API_URL}/messages`).reply(200, []);
        mock.onGet(`${API_URL}/documents`).reply(200, []);

        renderWithProviders(<ClientDashboard />);

        // Wait for messages to load
        await waitFor(() => {
            expect(screen.getByText(/No messages found./i)).toBeInTheDocument();
        });

        // Wait for documents to load
        await waitFor(() => {
            expect(screen.getByText(/No documents found./i)).toBeInTheDocument();
        });
    });
});
