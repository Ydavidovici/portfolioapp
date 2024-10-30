// src/features/devDashboard/tests/CalendarEntryModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from '../adminDashboard/tests/utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DevDashboard from '../pages/DevDashboard';
import apiClient from '../../../api/apiClient'; // Adjust the import path as needed

describe('CalendarEntry Module - Dev Dashboard', () => {
    afterEach(() => {
        cleanupAuth();
    });

    /**
     * Helper function to create a new calendar entry.
     * @param {string} title - Title of the calendar entry.
     * @param {string} date - Date of the entry in YYYY-MM-DD format.
     * @returns {object} - Created calendar entry data.
     */
    const createCalendarEntry = async (title, date, start_time = '09:00', end_time = '10:00') => {
        const response = await apiClient.post('/calendar-entries', { title, date, start_time, end_time, user_id: '2' }); // user_id '2' for Dev User
        return response;
    };

    /**
     * Helper function to delete a calendar entry by title.
     * @param {string} title - Title of the calendar entry to delete.
     */
    const deleteCalendarEntryByTitle = async (title) => {
        const entries = await apiClient.get('/calendar-entries');
        const entry = entries.find((e) => e.title === title);
        if (entry) {
            await apiClient.delete(`/calendar-entries/${entry.id}`);
        }
    };

    test('renders CalendarEntryList component with fetched data', async () => {
        renderWithUser(<DevDashboard />, 'developer');

        // Ensure existing calendar entries are displayed
        const entryOne = await screen.findByText(/Sprint Planning/i);
        expect(entryOne).toBeInTheDocument();

        const entryTwo = screen.getByText(/Marketing Meeting/i);
        expect(entryTwo).toBeInTheDocument();

        // Check for CRUD buttons
        const addButton = screen.getByText(/add new calendar entry/i);
        expect(addButton).toBeInTheDocument();

        const editButtons = screen.getAllByText(/edit/i);
        expect(editButtons.length).toBeGreaterThanOrEqual(2);

        const deleteButtons = screen.getAllByText(/delete/i);
        expect(deleteButtons.length).toBeGreaterThanOrEqual(2);
    });

    test('allows developer to create a new Calendar Entry', async () => {
        const uniqueTitle = `Dev Client Meeting ${Date.now()}`;
        const uniqueDate = `2024-11-${Math.floor(Math.random() * 28) + 1}`; // Random date in November

        renderWithUser(<DevDashboard />, 'developer');

        // Click on 'Add New Calendar Entry' button
        fireEvent.click(screen.getByText(/add new calendar entry/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: uniqueTitle },
        });
        fireEvent.change(screen.getByLabelText(/date/i), {
            target: { value: uniqueDate },
        });
        fireEvent.change(screen.getByLabelText(/start time/i), {
            target: { value: '11:00' },
        });
        fireEvent.change(screen.getByLabelText(/end time/i), {
            target: { value: '12:00' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new calendar entry to appear in the list
        const newEntry = await screen.findByText(new RegExp(uniqueTitle, 'i'));
        expect(newEntry).toBeInTheDocument();

        const newDate = screen.getByText(new RegExp(uniqueDate, 'i'));
        expect(newDate).toBeInTheDocument();

        // Cleanup: Delete the created calendar entry
        await deleteCalendarEntryByTitle(uniqueTitle);
    });

    test('allows developer to edit an existing Calendar Entry', async () => {
        // First, create a unique calendar entry to edit
        const originalTitle = `Dev Sprint Planning ${Date.now()}`;
        const updatedTitle = `${originalTitle} Updated`;
        const originalDate = '2024-11-01';
        const updatedDate = '2024-11-02';

        await createCalendarEntry(originalTitle, originalDate);

        renderWithUser(<DevDashboard />, 'developer');

        // Wait for the newly created calendar entry to appear
        const entryToEdit = await screen.findByText(new RegExp(originalTitle, 'i'));
        expect(entryToEdit).toBeInTheDocument();

        // Find the corresponding Edit button and click it
        const editButtons = screen.getAllByText(/edit/i);
        fireEvent.click(editButtons[editButtons.length - 1]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: updatedTitle },
        });
        fireEvent.change(screen.getByLabelText(/date/i), {
            target: { value: updatedDate },
        });
        fireEvent.change(screen.getByLabelText(/start time/i), {
            target: { value: '10:30' },
        });
        fireEvent.change(screen.getByLabelText(/end time/i), {
            target: { value: '11:30' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated calendar entry to appear in the list
        const updatedEntry = await screen.findByText(new RegExp(updatedTitle, 'i'));
        expect(updatedEntry).toBeInTheDocument();

        const updatedEntryDate = screen.getByText(new RegExp(updatedDate, 'i'));
        expect(updatedEntryDate).toBeInTheDocument();

        // Cleanup: Delete the updated calendar entry
        await deleteCalendarEntryByTitle(updatedTitle);
    });

    test('allows developer to delete a Calendar Entry', async () => {
        // First, create a unique calendar entry to delete
        const calendarEntryName = `Dev Sprint Planning ${Date.now()}`;
        const date = '2024-11-01';

        await createCalendarEntry(calendarEntryName, date);

        renderWithUser(<DevDashboard />, 'developer');

        // Wait for the newly created calendar entry to appear
        const entryToDelete = await screen.findByText(new RegExp(calendarEntryName, 'i'));
        expect(entryToDelete).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the corresponding Delete button and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        fireEvent.click(deleteButtons[deleteButtons.length - 1]);

        // Wait for the calendar entry to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(new RegExp(calendarEntryName, 'i'))).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
