// src/features/clientDashboard/tests/MessageModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent } from '@testing-library/react';
import ClientDashboard from '../pages/ClientDashboard';
import { mockFetch, resetFetchMocks } from './utils/fetchMocks';

describe('Message Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            messages: {
                GET: [
                    {
                        id: '1',
                        senderId: '1',
                        receiverId: '2',
                        content: 'Hello!',
                        timestamp: '2024-10-21T10:00:00Z',
                    },
                    {
                        id: '2',
                        senderId: '2',
                        receiverId: '1',
                        content: 'Hi there!',
                        timestamp: '2024-10-21T10:05:00Z',
                    },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        resetFetchMocks();
    });

    test('renders MessageList component with fetched data', async () => {
        renderWithRouter(<ClientDashboard />);

        // Wait for messages to be fetched and rendered
        expect(await screen.findByText(/hello!/i)).toBeInTheDocument();
        expect(screen.getByText(/hi there!/i)).toBeInTheDocument();

        // Check for Send Message button
        expect(screen.getByText(/send message/i)).toBeInTheDocument();
    });

    test('allows client to send a new Message', async () => {
        renderWithRouter(<ClientDashboard />);

        // Click on 'Send Message' button
        fireEvent.click(screen.getByText(/send message/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/recipient/i), {
            target: { value: 'Bob Developer' },
        });
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'Hello Bob!' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/send/i));

        // Wait for the new message to appear in the list
        expect(await screen.findByText(/hello bob!/i)).toBeInTheDocument();
    });
});
