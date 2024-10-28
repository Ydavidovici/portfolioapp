// src/features/developerDashboard/tests/TaskModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import { mockFetch, resetFetchMocks } from './utils/fetchMocks';

describe('Task Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            tasks: {
                GET: [
                    { id: '1', name: 'Develop Feature X', taskListId: '1' },
                    { id: '2', name: 'Test Feature Y', taskListId: '1' },
                ],
                POST: { id: '3' },
            },
            taskLists: {
                GET: [
                    { id: '1', name: 'Sprint 1' },
                    { id: '2', name: 'Sprint 2' },
                ],
            },
        });
    });

    afterEach(() => {
        resetFetchMocks();
    });

    test('renders TaskList component with fetched data', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for tasks to be fetched and rendered
        expect(await screen.findByText(/develop feature x/i)).toBeInTheDocument();
        expect(screen.getByText(/test feature y/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new task/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Task', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Click on 'Add New Task' button
        fireEvent.click(screen.getByText(/add new task/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Implement Authentication' },
        });
        fireEvent.change(screen.getByLabelText(/task list/i), {
            target: { value: '2' }, // Assuming taskListId '2'
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new task to appear in the list
        expect(await screen.findByText(/implement authentication/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Task', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for tasks to be rendered
        expect(await screen.findByText(/develop feature x/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Develop Feature X Updated' },
        });
        fireEvent.change(screen.getByLabelText(/task list/i), {
            target: { value: '1' },
        }); // Changing taskListId to '1'

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated task to appear in the list
        expect(await screen.findByText(/develop feature x updated/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Task', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for tasks to be rendered
        expect(await screen.findByText(/test feature y/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the second Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[1]);

        // Wait for the task to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/test feature y/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
