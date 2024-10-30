// src/features/devDashboard/tests/TaskModule.developer.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DevDashboard from '../pages/DevDashboard';

describe('Task Module - Developer', () => {
    beforeEach(() => {
        renderWithUser(<DevDashboard />, 'developer');
    });

    afterEach(() => {
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders TaskList component with fetched data', async () => {
        // Wait for tasks to be fetched and rendered
        expect(await screen.findByText(/develop feature x/i)).toBeInTheDocument();
        expect(screen.getByText(/test feature y/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new task/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Task', async () => {
        // Click on 'Add New Task' button
        fireEvent.click(screen.getByText(/add new task/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'New Task' },
        });
        fireEvent.change(screen.getByLabelText(/task list/i), {
            target: { value: '1' }, // Assuming taskListId '1' exists
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new task to appear in the list
        expect(await screen.findByText(/new task/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Task', async () => {
        // Wait for tasks to be rendered
        expect(await screen.findByText(/develop feature x/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Develop Feature X Updated' },
        });
        fireEvent.change(screen.getByLabelText(/task list/i), {
            target: { value: '2' }, // Changing to taskListId '2'
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated task to appear in the list
        expect(await screen.findByText(/develop feature x updated/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Task', async () => {
        // Wait for tasks to be rendered
        expect(await screen.findByText(/develop feature x/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        fireEvent.click(deleteButtons[0]);

        // Wait for the task to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/develop feature x/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});