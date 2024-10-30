// src/features/devDashboard/tests/FeedbackModule.developer.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DevDashboard from '../pages/DevDashboard';

describe('Feedback Module - Developer', () => {
    let apiClient;

    beforeAll(() => {
        const { apiClient: client } = renderWithUser(<DevDashboard />, 'developer');
        apiClient = client;
    });

    afterAll(() => {
        cleanupAuth();
    });

    test('renders FeedbackList with fetched data', async () => {
        expect(await screen.findByText(/Great work on the project!/i)).toBeInTheDocument();
        expect(screen.getByText(/Needs improvement in documentation./i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/Add New Feedback/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/Delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Feedback', async () => {
        fireEvent.click(screen.getByText(/Add New Feedback/i));

        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: `Dev Feedback ${Date.now()}` },
        });
        fireEvent.change(screen.getByLabelText(/Rating/i), {
            target: { value: '5' },
        });

        fireEvent.click(screen.getByText(/Create/i));

        const newFeedbackContent = await screen.findByText(/Dev Feedback/i);
        expect(newFeedbackContent).toBeInTheDocument();

        // Cleanup
        const deleteButton = newFeedbackContent.parentElement.querySelector('button.delete');
        fireEvent.click(deleteButton);

        window.confirm = jest.fn(() => true);
        await waitFor(() => {
            expect(screen.queryByText(/Dev Feedback/i)).not.toBeInTheDocument();
        });
        window.confirm.mockRestore();
    });

    test('allows developer to edit an existing Feedback', async () => {
        const editButtons = screen.getAllByText(/Edit/i);
        fireEvent.click(editButtons[0]);

        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: 'Updated Feedback Content by Developer' },
        });
        fireEvent.change(screen.getByLabelText(/Rating/i), {
            target: { value: '4' },
        });

        fireEvent.click(screen.getByText(/Update/i));

        expect(await screen.findByText(/Updated Feedback Content by Developer/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Feedback', async () => {
        const deleteButtons = screen.getAllByText(/Delete/i);
        fireEvent.click(deleteButtons[0]);

        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        await waitFor(() => {
            expect(screen.queryByText(/Updated Feedback Content by Developer/i)).not.toBeInTheDocument();
        });

        window.confirm.mockRestore();
    });
});
