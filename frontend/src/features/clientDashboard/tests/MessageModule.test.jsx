// src/features/clientDashboard/tests/MessagesModule.client.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import ClientDashboard from '../pages/ClientDashboard';

describe('Messages Module - Client', () => {
    let apiClient;

    beforeAll(() => {
        const { apiClient: client } = renderWithUser(<ClientDashboard />, 'client');
        apiClient = client;
    });

    afterAll(() => {
        cleanupAuth();
    });

    test('renders MessageList with own messages', async () => {
        expect(await screen.findByText(/Client-specific message\./i)).toBeInTheDocument();

        // Messages from others should not be visible
        expect(screen.queryByText(/Project kickoff meeting scheduled\./i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Please review the latest documentation\./i)).not.toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/Send New Message/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Edit/i)).toHaveLength(1);
        expect(screen.getAllByText(/Delete/i)).toHaveLength(1);
    });

    test('allows client to send a new Message', async () => {
        fireEvent.click(screen.getByText(/Send New Message/i));

        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: `Client Message ${Date.now()}` },
        });

        fireEvent.click(screen.getByText(/Send/i));

        const newMessageContent = await screen.findByText(/Client Message/i);
        expect(newMessageContent).toBeInTheDocument();

        // Cleanup
        const deleteButton = newMessageContent.parentElement.querySelector('button.delete');
        fireEvent.click(deleteButton);

        window.confirm = jest.fn(() => true);
        await waitFor(() => {
            expect(screen.queryByText(/Client Message/i)).not.toBeInTheDocument();
        });
        window.confirm.mockRestore();
    });

    test('allows client to edit their own Message', async () => {
        const editButtons = screen.getAllByText(/Edit/i);
        fireEvent.click(editButtons[0]);

        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: 'Updated Message Content by Client' },
        });

        fireEvent.click(screen.getByText(/Update/i));

        expect(await screen.findByText(/Updated Message Content by Client/i)).toBeInTheDocument();
    });

    test('allows client to delete their own Message', async () => {
        const deleteButtons = screen.getAllByText(/Delete/i);
        fireEvent.click(deleteButtons[0]);

        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        await waitFor(() => {
            expect(screen.queryByText(/Updated Message Content by Client/i)).not.toBeInTheDocument();
        });

        window.confirm.mockRestore();
    });
});
