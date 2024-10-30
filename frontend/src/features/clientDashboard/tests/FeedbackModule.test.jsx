// src/features/clientDashboard/tests/FeedbackModule.client.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import ClientDashboard from '../pages/ClientDashboard';

describe('Feedback Module - Client', () => {
    let apiClient;

    beforeAll(() => {
        const { apiClient: client } = renderWithUser(<ClientDashboard />, 'client');
        apiClient = client;
    });

    afterAll(() => {
        cleanupAuth();
    });

    test('renders FeedbackList with own feedback', async () => {
        expect(await screen.findByText(/Excellent team collaboration./i)).toBeInTheDocument();

        // Feedback from others should not be visible
        expect(screen.queryByText(/Great work on the project!/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Needs improvement in documentation./i)).not.toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/Add New Feedback/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Edit/i)).toHaveLength(1);
        expect(screen.getAllByText(/Delete/i)).toHaveLength(1);
    });

    test('allows client to create a new Feedback', async () => {
        fireEvent.click(screen.getByText(/Add New Feedback/i));

        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: `Client Feedback ${Date.now()}` },
        });
        fireEvent.change(screen.getByLabelText(/Rating/i), {
            target: { value: '5' },
        });

        fireEvent.click(screen.getByText(/Create/i));

        const newFeedbackContent = await screen.findByText(/Client Feedback/i);
        expect(newFeedbackContent).toBeInTheDocument();

        // Cleanup
        const deleteButton = newFeedbackContent.parentElement.querySelector('button.delete');
        fireEvent.click(deleteButton);

        window.confirm = jest.fn(() => true);
        await waitFor(() => {
            expect(screen.queryByText(/Client Feedback/i)).not.toBeInTheDocument();
        });
        window.confirm.mockRestore();
    });

    test('allows client to edit their own Feedback', async () => {
        const editButtons = screen.getAllByText(/Edit/i);
        fireEvent.click(editButtons[0]);

        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: 'Updated Feedback Content by Client' },
        });
        fireEvent.change(screen.getByLabelText(/Rating/i), {
            target: { value: '4' },
        });

        fireEvent.click(screen.getByText(/Update/i));

        expect(await screen.findByText(/Updated Feedback Content by Client/i)).toBeInTheDocument();
    });

    test('allows client to delete their own Feedback', async () => {
        const deleteButtons = screen.getAllByText(/Delete/i);
        fireEvent.click(deleteButtons[0]);

        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        await waitFor(() => {
            expect(screen.queryByText(/Updated Feedback Content by Client/i)).not.toBeInTheDocument();
        });

        window.confirm.mockRestore();
    });
});
