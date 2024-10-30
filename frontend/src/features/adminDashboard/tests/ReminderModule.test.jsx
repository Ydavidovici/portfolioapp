// src/features/adminDashboard/tests/ReminderModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from '../../../tests/utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';

describe('Reminder Module - Admin Dashboard', () => {
    beforeEach(() => {
        // Render the AdminDashboard with Admin role
        renderWithUser(<AdminDashboard />, 'admin');
    });

    afterEach(() => {
        // Cleanup authentication and restore mocks
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders ReminderList component with fetched data', async () => {
        // Wait for reminders to be fetched and rendered
        expect(await screen.findByText(/reminder 001/i)).toBeInTheDocument();
        expect(screen.getByText(/reminder 002/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new reminder/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new Reminder', async () => {
        // Click on 'Add New Reminder' button
        fireEvent.click(screen.getByText(/add new reminder/i));

        // Fill out the form fields
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'New Admin Reminder' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'This is a new admin reminder.' },
        });
        fireEvent.change(screen.getByLabelText(/date/i), {
            target: { value: '2024-11-30' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new reminder to appear in the list
        expect(await screen.findByText(/new admin reminder/i)).toBeInTheDocument();
        expect(screen.getByText(/this is a new admin reminder\./i)).toBeInTheDocument();
        expect(screen.getByText(/2024-11-30/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Reminder', async () => {
        // Wait for reminders to be rendered
        expect(await screen.findByText(/reminder 001/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form fields
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Reminder 001 Updated' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Updated description for reminder 001.' },
        });
        fireEvent.change(screen.getByLabelText(/date/i), {
            target: { value: '2025-01-20' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated reminder to appear in the list
        expect(await screen.findByText(/reminder 001 updated/i)).toBeInTheDocument();
        expect(screen.getByText(/updated description for reminder 001\./i)).toBeInTheDocument();
        expect(screen.getByText(/2025-01-20/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Reminder', async () => {
        // Wait for reminders to be rendered
        expect(await screen.findByText(/reminder 002/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the Delete button for Reminder 002 and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        fireEvent.click(deleteButtons[1]); // Assuming the second delete button corresponds to Reminder 002

        // Wait for the reminder to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/reminder 002/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });

    test('displays error message on API failure', async () => {
        // Mock the API client to throw an error when fetching reminders
        jest.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('API Error'));

        // Rerender the AdminDashboard to trigger the API call
        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the error message to appear
        expect(await screen.findByText(/failed to fetch reminders/i)).toBeInTheDocument();
    });
});