// src/features/developerDashboard/tests/MessageModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperDashboard from '../pages/DeveloperDashboard';
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
            users: {
                GET: [
                    { id: '1', name: 'Alice' },
                    { id: '2', name: 'Bob' },
                ],
            },
        });
    });

    afterEach(() => {
        resetFetchMocks();
    });

    test('renders MessageList component with fetched data', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for messages to be fetched and rendered
        expect(await screen.findByText(/hello!/i)).toBeInTheDocument();
        expect(screen.getByText(/hi there!/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new message/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Message', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Click on 'Add New Message' button
        fireEvent.click(screen.getByText(/add new message/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/sender/i), {
            target: { value: '1' }, // Assuming senderId '1'
        });
        fireEvent.change(screen.getByLabelText(/receiver/i), {
            target: { value: '2' }, // Assuming receiverId '2'
        });
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'Project update available.' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new message to appear in the list
        expect(await screen.findByText(/project update available\./i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Message', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for messages to be rendered
        expect(await screen.findByText(/hello!/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'Updated Hello!' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated message to appear in the list
        expect(await screen.findByText(/updated hello!/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Message', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for messages to be rendered
        expect(await screen.findByText(/hello!/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the message to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/hello!/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
