// src/features/adminDashboard/tests/ChecklistItemModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import { mockFetch } from './utils/fetchMocks';

describe('ChecklistItem Module', () => {
    beforeEach(() => {
        fetch.resetMocks();

        mockFetch({
            checklistItems: {
                GET: [
                    { id: '1', task: 'Design UI', checklistId: '1' },
                    { id: '2', task: 'Set up Database', checklistId: '1' },
                ],
                POST: { id: '3' },
            },
            checklists: {
                GET: [
                    { id: '1', name: 'Sprint Checklist', projectId: '1' },
                    { id: '2', name: 'Marketing Checklist', projectId: '2' },
                ],
            },
        });
    });

    afterEach(() => {
        fetch.mockClear();
    });

    test('renders ChecklistItemList component with fetched data', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for checklist items to be fetched and rendered
        expect(await screen.findByText(/design ui/i)).toBeInTheDocument();
        expect(screen.getByText(/set up database/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new checklist item/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new Checklist Item', async () => {
        renderWithRouter(<AdminDashboard />);

        // Click on 'Add New Checklist Item' button
        fireEvent.click(screen.getByText(/add new checklist item/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/task/i), {
            target: { value: 'Implement Authentication' },
        });
        fireEvent.change(screen.getByLabelText(/checklist/i), {
            target: { value: '1' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new checklist item to appear in the list
        expect(await screen.findByText(/implement authentication/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Checklist Item', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for checklist items to be rendered
        expect(await screen.findByText(/design ui/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/task/i), {
            target: { value: 'Design User Interface' },
        });
        fireEvent.change(screen.getByLabelText(/checklist/i), {
            target: { value: '2' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated checklist item to appear in the list
        expect(await screen.findByText(/design user interface/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Checklist Item', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for checklist items to be rendered
        expect(await screen.findByText(/design ui/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the checklist item to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/design ui/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
