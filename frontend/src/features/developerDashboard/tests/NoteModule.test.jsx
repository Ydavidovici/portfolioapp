// src/features/developerDashboard/tests/NoteModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import { mockFetch, resetFetchMocks } from './utils/fetchMocks';

describe('Note Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            notes: {
                GET: [
                    { id: '1', content: 'Project kickoff meeting notes.' },
                    { id: '2', content: 'Marketing campaign ideas.' },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        resetFetchMocks();
    });

    test('renders NoteList component with fetched data', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for notes to be fetched and rendered
        expect(await screen.findByText(/project kickoff meeting notes\./i)).toBeInTheDocument();
        expect(screen.getByText(/marketing campaign ideas\./i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new note/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Note', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Click on 'Add New Note' button
        fireEvent.click(screen.getByText(/add new note/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'New project milestones set.' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new note to appear in the list
        expect(await screen.findByText(/new project milestones set\./i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Note', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for notes to be rendered
        expect(await screen.findByText(/project kickoff meeting notes\./i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'Updated project kickoff meeting notes.' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated note to appear in the list
        expect(await screen.findByText(/updated project kickoff meeting notes\./i)).toBeInTheDocument();
    });

    test('allows developer to delete a Note', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for notes to be rendered
        expect(await screen.findByText(/project kickoff meeting notes\./i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the note to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/project kickoff meeting notes\./i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
