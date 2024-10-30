// src/features/adminDashboard/tests/TaskModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from '../../../tests/utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';

describe('Task Module - Admin Dashboard', () => {
    beforeEach(() => {
        // Render the AdminDashboard with Admin role
        renderWithUser(<AdminDashboard />, 'admin');
    });

    afterEach(() => {
        // Cleanup authentication and restore mocks
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders TaskList component with fetched data', async () => {
        // Wait for tasks to be fetched and rendered
        expect(await screen.findByText(/task 001/i)).toBeInTheDocument();
        expect(screen.getByText(/task 002/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new task/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new Task', async () => {
        // Click on 'Add New Task' button
        fireEvent.click(screen.getByText(/add new task/i));

        // Fill out the form fields
        fireEvent.change(screen.getByLabelText(/task name/i), {
            target: { value: 'New Admin Task' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Description for new admin task.' },
        });
        fireEvent.change(screen.getByLabelText(/assigned to/i), {
            target: { value: '2' }, // Assuming user ID '2' for assignment
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new task to appear in the list
        expect(await screen.findByText(/new admin task/i)).toBeInTheDocument();
        expect(screen.getByText(/description for new admin task\./i)).toBeInTheDocument();
        expect(screen.getByText(/bob developer/i)).toBeInTheDocument(); // Assuming user ID '2' is Bob Developer
    });

    test('allows admin to edit an existing Task', async () => {
        // Wait for tasks to be rendered
        expect(await screen.findByText(/task 001/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form fields
        fireEvent.change(screen.getByLabelText(/task name/i), {
            target: { value: 'Task 001 Updated' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Updated description for task 001.' },
        });
        fireEvent.change(screen.getByLabelText(/assigned to/i), {
            target: { value: '3' }, // Assuming user ID '3' for assignment
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated task to appear in the list
        expect(await screen.findByText(/task 001 updated/i)).toBeInTheDocument();
        expect(screen.getByText(/updated description for task 001\./i)).toBeInTheDocument();
        expect(screen.getByText(/charlie client/i)).toBeInTheDocument(); // Assuming user ID '3' is Charlie Client
    });

    test('allows admin to delete a Task', async () => {
        // Wait for tasks to be rendered
        expect(await screen.findByText(/task 002/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the Delete button for Task 002 and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        fireEvent.click(deleteButtons[1]); // Assuming the second delete button corresponds to Task 002

        // Wait for the task to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/task 002/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });

    test('displays error message on API failure', async () => {
        // Mock the API client to throw an error when fetching tasks
        jest.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('API Error'));

        // Rerender the AdminDashboard to trigger the API call
        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the error message to appear
        expect(await screen.findByText(/failed to fetch tasks/i)).toBeInTheDocument();
    });
});