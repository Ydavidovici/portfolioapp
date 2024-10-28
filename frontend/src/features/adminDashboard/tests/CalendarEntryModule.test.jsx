// src/features/adminDashboard/tests/CalendarEntryModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import { mockFetch } from './utils/fetchMocks';

describe('CalendarEntry Module', () => {
    beforeEach(() => {
        fetch.resetMocks();

        mockFetch({
            calendarEntries: {
                GET: [
                    { id: '1', title: 'Sprint Planning', date: '2024-11-01' },
                    { id: '2', title: 'Marketing Meeting', date: '2024-11-05' },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        fetch.mockClear();
    });

    test('renders CalendarEntryList component with fetched data', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for calendar entries to be fetched and rendered
        expect(await screen.findByText(/sprint planning/i)).toBeInTheDocument();
        expect(screen.getByText(/marketing meeting/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new calendar entry/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new Calendar Entry', async () => {
        renderWithRouter(<AdminDashboard />);

        // Click on 'Add New Calendar Entry' button
        fireEvent.click(screen.getByText(/add new calendar entry/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Client Meeting' },
        });
        fireEvent.change(screen.getByLabelText(/date/i), {
            target: { value: '2024-11-15' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new calendar entry to appear in the list
        expect(await screen.findByText(/client meeting/i)).toBeInTheDocument();
        expect(screen.getByText(/2024-11-15/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Calendar Entry', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for calendar entries to be rendered
        expect(await screen.findByText(/sprint planning/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Sprint Planning Updated' },
        });
        fireEvent.change(screen.getByLabelText(/date/i), {
            target: { value: '2024-11-02' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated calendar entry to appear in the list
        expect(await screen.findByText(/sprint planning updated/i)).toBeInTheDocument();
        expect(screen.getByText(/2024-11-02/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Calendar Entry', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for calendar entries to be rendered
        expect(await screen.findByText(/sprint planning/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the calendar entry to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/sprint planning/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
