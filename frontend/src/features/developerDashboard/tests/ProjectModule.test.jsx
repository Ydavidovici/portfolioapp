// src/features/devDashboard/tests/ProjectModule.developer.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DevDashboard from '../pages/DevDashboard';

describe('Project Module - Developer', () => {
    beforeEach(() => {
        renderWithUser(<DevDashboard />, 'developer');
    });

    afterEach(() => {
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

    test('allows developer to create a new Project', async () => {
        // Click on 'Add New Project' button
        fireEvent.click(screen.getByText(/add new project/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Project Gamma' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Gamma Description' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new project to appear in the list
        expect(await screen.findByText(/project gamma/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Project', async () => {
        renderWithUser(<DevDashboard />, 'developer');

        // Wait for projects to be rendered
        expect(await screen.findByText(/project alpha/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Project Alpha Updated' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Updated Alpha Description' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated project to appear in the list
        expect(await screen.findByText(/project alpha updated/i)).toBeInTheDocument();
        expect(screen.getByText(/updated alpha description/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Project', async () => {
        renderWithUser(<DevDashboard />, 'developer');

        // Wait for projects to be rendered
        expect(await screen.findByText(/project beta/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the Delete button for Project Beta and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        // Assuming the second delete button corresponds to Project Beta
        fireEvent.click(deleteButtons[1]);

        // Wait for the project to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/project beta/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});