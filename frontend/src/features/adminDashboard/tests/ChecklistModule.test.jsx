// src/features/adminDashboard/tests/ChecklistModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import {mockFetch, resetFetchMocks} from './utils/fetchMocks';

describe('Checklist Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            checklists: {
                GET: [
                    { id: '1', name: 'Sprint Checklist', projectId: '1' },
                    { id: '2', name: 'Marketing Checklist', projectId: '2' },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        fetch.mockClear();
    });

    test('renders ChecklistList component with fetched data', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for checklists to be fetched and rendered
        expect(await screen.findByText(/sprint checklist/i)).toBeInTheDocument();
        expect(screen.getByText(/marketing checklist/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new checklist/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new Checklist', async () => {
        renderWithRouter(<AdminDashboard />);

        // Click on 'Add New Checklist' button
        fireEvent.click(screen.getByText(/add new checklist/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'New Checklist' },
        });
        fireEvent.change(screen.getByLabelText(/project/i), {
            target: { value: '1' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new checklist to appear in the list
        expect(await screen.findByText(/new checklist/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Checklist', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for checklists to be rendered
        expect(await screen.findByText(/sprint checklist/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Updated Checklist' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated checklist to appear in the list
        expect(await screen.findByText(/updated checklist/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Checklist', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for checklists to be rendered
        expect(await screen.findByText(/sprint checklist/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the checklist to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/sprint checklist/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
