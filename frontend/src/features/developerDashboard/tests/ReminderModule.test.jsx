// src/features/devDashboard/tests/ReminderModule.developer.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperDashboard from '../pages/DeveloperDashboard';

describe('Reminder Module - Developer', () => {
    beforeEach(() => {
        renderWithUser(<DeveloperDashboard />, 'developer');
    });

    afterEach(() => {
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders ReminderList component with fetched data', async () => {
        // Wait for reminders to be fetched and rendered
        expect(await screen.findByText(/submit report/i)).toBeInTheDocument();
        expect(screen.getByText(/team meeting/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new reminder/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Reminder', async () => {
        // Click on 'Add New Reminder' button
        fireEvent.click(screen.getByText(/add new reminder/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/message/i), {
            target: { value: 'Prepare quarterly report' },
        });
        fireEvent.change(screen.getByLabelText(/date/i), {
            target: { value: '2024-11-20' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new reminder to appear in the list
        expect(await screen.findByText(/prepare quarterly report/i)).toBeInTheDocument();
        expect(screen.getByText(/2024-11-20/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Reminder', async () => {
        // Wait for reminders to be rendered
        expect(await screen.findByText(/submit report/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        const editButtons = screen.getAllByText(/edit/i);
        fireEvent.click(editButtons[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/message/i), {
            target: { value: 'Submit annual report' },
        });
        fireEvent.change(screen.getByLabelText(/date/i), {
            target: { value: '2024-11-15' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated reminder to appear in the list
        expect(await screen.findByText(/submit annual report/i)).toBeInTheDocument();
        expect(screen.getByText(/2024-11-15/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Reminder', async () => {
        // Wait for reminders to be rendered
        expect(await screen.findByText(/team meeting/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the Delete button for 'team meeting' and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        // Assuming the second delete button corresponds to 'team meeting'
        fireEvent.click(deleteButtons[1]);

        // Wait for the reminder to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/team meeting/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});