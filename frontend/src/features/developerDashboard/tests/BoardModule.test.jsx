// src/features/developerDashboard/tests/BoardModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import { mockFetch, resetFetchMocks } from './utils/fetchMocks';

describe('Board Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            boards: {
                GET: [
                    {
                        id: '1',
                        name: 'Development Board',
                        description: 'Board for development tasks',
                        status: 'active',
                    },
                    {
                        id: '2',
                        name: 'Marketing Board',
                        description: 'Board for marketing tasks',
                        status: 'active',
                    },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        resetFetchMocks();
    });

    test('renders BoardList component with fetched data', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for boards to be fetched and rendered
        expect(await screen.findByText(/development board/i)).toBeInTheDocument();
        expect(screen.getByText(/marketing board/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new board/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Board', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Click on 'Add New Board' button
        fireEvent.click(screen.getByText(/add new board/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'New Board' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'New board description' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new board to appear in the list
        expect(await screen.findByText(/new board/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Board', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for boards to be rendered
        expect(await screen.findByText(/development board/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Updated Board' },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Updated description' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated board to appear in the list
        expect(await screen.findByText(/updated board/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Board', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for boards to be rendered
        expect(await screen.findByText(/development board/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the board to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/development board/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
