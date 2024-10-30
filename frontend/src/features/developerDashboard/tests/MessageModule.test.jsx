// src/features/devDashboard/tests/MessagesModule.developer.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DevDashboard from '../pages/DevDashboard';

describe('Messages Module - Developer', () => {
    let apiClient;

    beforeAll(() => {
        const { apiClient: client } = renderWithUser(<DevDashboard />, 'developer');
        apiClient = client;
    });

    afterAll(() => {
        cleanupAuth();
    });

    test('renders MessageList with fetched data', async () => {
        expect(await screen.findByText(/Project kickoff meeting scheduled./i)).toBeInTheDocument();
        expect(screen.getByText(/Please review the latest documentation./i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/Send New Message/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/Delete/i)).toHaveLength(2);
    });

    test('allows developer to send a new Message', async () => {
        fireEvent.click(screen.getByText(/Send New Message/i));

        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: `Dev Message ${Date.now()}` },
        });

        fireEvent.click(screen.getByText(/Send/i));

        const newMessageContent = await screen.findByText(/Dev Message/i);
        expect(newMessageContent).toBeInTheDocument();

        // Cleanup
        const deleteButton = newMessageContent.parentElement.querySelector('button.delete');
        fireEvent.click(deleteButton);

        window.confirm = jest.fn(() => true);
        await waitFor(() => {
            expect(screen.queryByText(/Dev Message/i)).not.toBeInTheDocument();
        });
        window.confirm.mockRestore();
    });

    test('allows developer to edit an existing Message', async () => {
        const editButtons = screen.getAllByText(/Edit/i);
        fireEvent.click(editButtons[0]);

        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: 'Updated Message Content by Developer' },
        });

        fireEvent.click(screen.getByText(/Update/i));

        expect(await screen.findByText(/Updated Message Content by Developer/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Message', async () => {
        const deleteButtons = screen.getAllByText(/Delete/i);
        fireEvent.click(deleteButtons[0]);

        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        await waitFor(() => {
            expect(screen.queryByText(/Updated Message Content by Developer/i)).not.toBeInTheDocument();
        });

        window.confirm.mockRestore();
    });
});
