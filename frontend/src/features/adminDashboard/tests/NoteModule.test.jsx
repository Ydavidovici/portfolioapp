// src/features/adminDashboard/tests/NoteModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from '../../../tests/utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';

describe('Note Module - Admin Dashboard', () => {
    beforeEach(() => {
        // Render the AdminDashboard with Admin role
        renderWithUser(<AdminDashboard />, 'admin');
    });

    afterEach(() => {
        // Cleanup authentication and restore mocks
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders NoteList component with fetched data', async () => {
        // Wait for notes to be fetched and rendered
        expect(await screen.findByText(/note 1/i)).toBeInTheDocument();
        expect(screen.getByText(/note 2/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new note/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new Note', async () => {
        // Click on 'Add New Note' button
        fireEvent.click(screen.getByText(/add new note/i));

        // Fill out the form fields
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'New Admin Note' },
        });
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'This is a new admin note content.' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new note to appear in the list
        expect(await screen.findByText(/new admin note/i)).toBeInTheDocument();
        expect(screen.getByText(/this is a new admin note content\./i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Note', async () => {
        // Wait for notes to be rendered
        expect(await screen.findByText(/note 1/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form fields
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Note 1 Updated' },
        });
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'Updated content for note 1.' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated note to appear in the list
        expect(await screen.findByText(/note 1 updated/i)).toBeInTheDocument();
        expect(screen.getByText(/updated content for note 1\./i)).toBeInTheDocument();
    });

    test('allows admin to delete a Note', async () => {
        // Wait for notes to be rendered
        expect(await screen.findByText(/note 2/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the Delete button for Note 2 and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        fireEvent.click(deleteButtons[1]); // Assuming the second delete button corresponds to Note 2

        // Wait for the note to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/note 2/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });

    test('displays error message on API failure', async () => {
        // Mock the API client to throw an error when fetching notes
        jest.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('API Error'));

        // Rerender the AdminDashboard to trigger the API call
        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the error message to appear
        expect(await screen.findByText(/failed to fetch notes/i)).toBeInTheDocument();
    });
});