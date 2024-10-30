// src/features/adminDashboard/tests/AdminChecklistModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import apiClient from '../../../api/apiClient'; // Ensure the path is correct

describe('Checklist Module - Admin Dashboard', () => {
    afterEach(() => {
        cleanupAuth();
    });

    /**
     * Helper function to create a new checklist via API.
     * @param {string} name - Name of the checklist.
     * @param {string} task_id - Associated task ID.
     * @returns {object} - Created checklist data.
     */
    const createChecklistAPI = async (name, task_id) => {
        const response = await apiClient.post('/checklists', { name, task_id });
        return response.data;
    };

    /**
     * Helper function to delete a checklist via API.
     * @param {string} id - ID of the checklist to delete.
     */
    const deleteChecklistAPI = async (id) => {
        await apiClient.delete(`/checklists/${id}`);
    };

    test('renders ChecklistList component with fetched data', async () => {
        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for checklists to be fetched and rendered
        expect(await screen.findByText(/sprint checklist/i)).toBeInTheDocument();
        expect(screen.getByText(/marketing checklist/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new checklist/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
        expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Checklist', async () => {
        renderWithUser(<AdminDashboard />, 'admin');

        // Click on 'Add New Checklist' button
        fireEvent.click(screen.getByText(/add new checklist/i));

        // Fill out the form
        const uniqueName = `New Checklist ${Date.now()}`;
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: uniqueName },
        });
        fireEvent.change(screen.getByLabelText(/task/i), {
            target: { value: '1' }, // Assuming task_id '1' exists
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new checklist to appear in the list
        const newChecklist = await screen.findByText(new RegExp(uniqueName, 'i'));
        expect(newChecklist).toBeInTheDocument();

        // Cleanup: Delete the created checklist via API
        const checklist = await apiClient.get('/checklists');
        const created = checklist.data.find((c) => c.name === uniqueName);
        if (created) {
            await deleteChecklistAPI(created.id);
        }
    });

    test('allows admin to edit an existing Checklist', async () => {
        // First, create a unique checklist via API to edit
        const originalName = `Edit Checklist ${Date.now()}`;
        const taskId = '1'; // Assuming task_id '1' exists
        const createdChecklist = await createChecklistAPI(originalName, taskId);

        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the newly created checklist to appear
        const checklistToEdit = await screen.findByText(new RegExp(originalName, 'i'));
        expect(checklistToEdit).toBeInTheDocument();

        // Find the corresponding Edit button and click it
        const editButtons = screen.getAllByText(/edit/i);
        const editButton = editButtons.find((button) =>
            button.closest('tr').textContent.includes(originalName)
        );
        fireEvent.click(editButton);

        // Modify the form
        const updatedName = `${originalName} Updated`;
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: updatedName },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated checklist to appear in the list
        const updatedChecklist = await screen.findByText(new RegExp(updatedName, 'i'));
        expect(updatedChecklist).toBeInTheDocument();

        // Cleanup: Delete the updated checklist via API
        const checklist = await apiClient.get('/checklists');
        const updated = checklist.data.find((c) => c.name === updatedName);
        if (updated) {
            await deleteChecklistAPI(updated.id);
        }
    });

    test('allows admin to delete a Checklist', async () => {
        // First, create a unique checklist via API to delete
        const checklistName = `Delete Checklist ${Date.now()}`;
        const taskId = '1'; // Assuming task_id '1' exists
        const createdChecklist = await createChecklistAPI(checklistName, taskId);

        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the newly created checklist to appear
        const checklistToDelete = await screen.findByText(new RegExp(checklistName, 'i'));
        expect(checklistToDelete).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the corresponding Delete button and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        const deleteButton = deleteButtons.find((button) =>
            button.closest('tr').textContent.includes(checklistName)
        );
        fireEvent.click(deleteButton);

        // Wait for the checklist to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(new RegExp(checklistName, 'i'))).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
