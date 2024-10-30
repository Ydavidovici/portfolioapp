// src/features/adminDashboard/tests/ProjectModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from '../../../tests/utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';

describe('Project Module - Admin Dashboard', () => {
    beforeEach(() => {
        // Render the AdminDashboard with Admin role
        renderWithUser(<AdminDashboard />, 'admin');
    });

    afterEach(() => {
        // Cleanup authentication and restore mocks
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders ProjectList component with fetched data', async () => {
        // Wait for projects to be fetched and rendered
        expect(await screen.findByText(/project alpha/i)).toBeInTheDocument();
        expect(screen.getByText(/project beta/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new project/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new Project', async () => {
        // Click on 'Add New Project' button
        fireEvent.click(screen.getByText(/add new project/i));

        // Fill out the form fields
        fireEvent.change(screen.getByLabelText(/project name/i), {
            target: { value: 'Project Gamma' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Description for Project Gamma.' },
        });
        fireEvent.change(screen.getByLabelText(/status/i), {
            target: { value: 'Active' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new project to appear in the list
        expect(await screen.findByText(/project gamma/i)).toBeInTheDocument();
        expect(screen.getByText(/description for project gamma\./i)).toBeInTheDocument();
        expect(screen.getByText(/active/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Project', async () => {
        // Wait for projects to be rendered
        expect(await screen.findByText(/project alpha/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form fields
        fireEvent.change(screen.getByLabelText(/project name/i), {
            target: { value: 'Project Alpha Updated' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Updated description for Project Alpha.' },
        });
        fireEvent.change(screen.getByLabelText(/status/i), {
            target: { value: 'Completed' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated project to appear in the list
        expect(await screen.findByText(/project alpha updated/i)).toBeInTheDocument();
        expect(screen.getByText(/updated description for project alpha\./i)).toBeInTheDocument();
        expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Project', async () => {
        // Wait for projects to be rendered
        expect(await screen.findByText(/project beta/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the Delete button for Project Beta and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        fireEvent.click(deleteButtons[1]); // Assuming the second delete button corresponds to Project Beta

        // Wait for the project to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/project beta/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });

    test('displays error message on API failure', async () => {
        // Mock the API client to throw an error when fetching projects
        jest.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('API Error'));

        // Rerender the AdminDashboard to trigger the API call
        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the error message to appear
        expect(await screen.findByText(/failed to fetch projects/i)).toBeInTheDocument();
    });
});