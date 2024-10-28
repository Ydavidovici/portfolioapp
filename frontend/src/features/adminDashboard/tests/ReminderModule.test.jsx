// src/features/adminDashboard/tests/ReminderModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import { mockFetch } from './utils/fetchMocks';

describe('Reminder Module', () => {
    beforeEach(() => {
        fetch.resetMocks();

        mockFetch({
            reminders: {
                GET: [
                    { id: '1', message: 'Submit report', date: '2024-11-10' },
                    { id: '2', message: 'Team meeting', date: '2024-11-12' },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        fetch.mockClear();
    });

    test('renders ReminderList component with fetched data', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for reminders to be fetched and rendered
        expect(await screen.findByText(/submit report/i)).toBeInTheDocument();
        expect(screen.getByText(/team meeting/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new reminder/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new Reminder', async () => {
        renderWithRouter(<AdminDashboard />);

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

    test('allows admin to edit an existing Reminder', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for reminders to be rendered
        expect(await screen.findByText(/submit report/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

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

    test('allows admin to delete a Reminder', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for reminders to be rendered
        expect(await screen.findByText(/submit report/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the reminder to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/submit report/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
