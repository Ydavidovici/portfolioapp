// src/features/adminDashboard/tests/ChecklistItemModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import apiClient from '../../../api/apiClient'; // Adjust the import path as needed

describe('ChecklistItem Module - Admin Dashboard', () => {
    afterEach(() => {
        cleanupAuth();
    });

    /**
     * Helper function to create a new checklist item.
     * @param {string} task - Task description.
     * @param {string} checklistId - ID of the checklist it belongs to.
     * @returns {object} - Created checklist item data.
     */
    const createChecklistItem = async (task, checklistId) => {
        const response = await apiClient.post('/checklist-items', { task, checklist_id: checklistId });
        return response;
    };

    /**
     * Helper function to delete a checklist item by task.
     * @param {string} task - Task description of the checklist item to delete.
     */
    const deleteChecklistItemByTask = async (task) => {
        const items = await apiClient.get('/checklist-items');
        const item = items.find((i) => i.task === task);
        if (item) {
            await apiClient.delete(`/checklist-items/${item.id}`);
        }
    };

    test('renders ChecklistItemList component with fetched data', async () => {
        renderWithUser(<AdminDashboard />, 'admin');

        // Ensure existing checklist items are displayed
        const itemOne = await screen.findByText(/Design UI/i);
        expect(itemOne).toBeInTheDocument();

        const itemTwo = screen.getByText(/Set up Database/i);
        expect(itemTwo).toBeInTheDocument();

        // Check for CRUD buttons
        const addButton = screen.getByText(/add new checklist item/i);
        expect(addButton).toBeInTheDocument();

        const editButtons = screen.getAllByText(/edit/i);
        expect(editButtons.length).toBeGreaterThanOrEqual(2);

        const deleteButtons = screen.getAllByText(/delete/i);
        expect(deleteButtons.length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Checklist Item', async () => {
        const uniqueTask = `Implement Authentication ${Date.now()}`;
        const checklistName = 'Sprint Checklist';

        // Fetch checklists to get the checklist ID
        const checklists = await apiClient.get('/checklists');
        const sprintChecklist = checklists.find((c) => c.name === checklistName);
        expect(sprintChecklist).toBeTruthy();

        renderWithUser(<AdminDashboard />, 'admin');

        // Click on 'Add New Checklist Item' button
        fireEvent.click(screen.getByText(/add new checklist item/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/task/i), {
            target: { value: uniqueTask },
        });
        fireEvent.change(screen.getByLabelText(/checklist/i), {
            target: { value: sprintChecklist.id }, // Assuming it's a select dropdown with checklist IDs as values
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new checklist item to appear in the list
        const newItem = await screen.findByText(new RegExp(uniqueTask, 'i'));
        expect(newItem).toBeInTheDocument();

        // Cleanup: Delete the created checklist item
        await deleteChecklistItemByTask(uniqueTask);
    });

    test('allows admin to edit an existing Checklist Item', async () => {
        // First, create a unique checklist item to edit
        const originalTask = `Design UI ${Date.now()}`;
        const updatedTask = `${originalTask} Updated`;
        const checklistName = 'Sprint Checklist';

        // Fetch checklists to get the checklist ID
        const checklists = await apiClient.get('/checklists');
        const sprintChecklist = checklists.find((c) => c.name === checklistName);
        expect(sprintChecklist).toBeTruthy();

        await createChecklistItem(originalTask, sprintChecklist.id);

        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the newly created checklist item to appear
        const itemToEdit = await screen.findByText(new RegExp(originalTask, 'i'));
        expect(itemToEdit).toBeInTheDocument();

        // Find the corresponding Edit button and click it
        const editButtons = screen.getAllByText(/edit/i);
        // Assuming the last edit button corresponds to the latest item
        fireEvent.click(editButtons[editButtons.length - 1]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/task/i), {
            target: { value: updatedTask },
        });
        fireEvent.change(screen.getByLabelText(/checklist/i), {
            target: { value: sprintChecklist.id }, // Keep the same checklist
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated checklist item to appear in the list
        const updatedItem = await screen.findByText(new RegExp(updatedTask, 'i'));
        expect(updatedItem).toBeInTheDocument();

        // Cleanup: Delete the updated checklist item
        await deleteChecklistItemByTask(updatedTask);
    });

    test('allows admin to delete a Checklist Item', async () => {
        // First, create a unique checklist item to delete
        const checklistItemName = `Design UI ${Date.now()}`;
        const checklistName = 'Sprint Checklist';

        // Fetch checklists to get the checklist ID
        const checklists = await apiClient.get('/checklists');
        const sprintChecklist = checklists.find((c) => c.name === checklistName);
        expect(sprintChecklist).toBeTruthy();

        await createChecklistItem(checklistItemName, sprintChecklist.id);

        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the newly created checklist item to appear
        const itemToDelete = await screen.findByText(new RegExp(checklistItemName, 'i'));
        expect(itemToDelete).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the corresponding Delete button and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        // Assuming the last delete button corresponds to the latest item
        fireEvent.click(deleteButtons[deleteButtons.length - 1]);

        // Wait for the checklist item to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(new RegExp(checklistItemName, 'i'))).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
