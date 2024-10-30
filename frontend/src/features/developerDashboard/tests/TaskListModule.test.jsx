// src/features/devDashboard/tests/TaskListModule.developer.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DevDashboard from '../pages/DevDashboard';

describe('TaskList Module - Developer', () => {
    beforeEach(() => {
        renderWithUser(<DevDashboard />, 'developer');
    });

    afterEach(() => {
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders TaskList component with fetched data', async () => {
        // Wait for task lists to be fetched and rendered
        expect(await screen.findByText(/sprint 1/i)).toBeInTheDocument();
        expect(screen.getByText(/sprint 2/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new task list/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Task List', async () => {
        // Click on 'Add New Task List' button
        fireEvent.click(screen.getByText(/add new task list/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Sprint 3' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new task list to appear in the list
        expect(await screen.findByText(/sprint 3/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Task List', async () => {
        // Wait for task lists to be rendered
        expect(await screen.findByText(/sprint 1/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Sprint 1 Updated' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated task list to appear in the list
        expect(await screen.findByText(/sprint 1 updated/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Task List', async () => {
        // Wait for task lists to be rendered
        expect(await screen.findByText(/sprint 2/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the Delete button for Sprint 2 and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        fireEvent.click(deleteButtons[1]); // Assuming the second delete button corresponds to Sprint 2

        // Wait for the task list to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/sprint 2/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});