// src/features/adminDashboard/tests/BoardModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import apiClient from '../../../api/apiClient'; // Adjust the import path as needed

describe('Board Module - Admin Dashboard', () => {
    afterEach(() => {
        cleanupAuth();
    });

    /**
     * Helper function to create a new board.
     * @param {string} name - Name of the board.
     * @param {string} description - Description of the board.
     * @returns {object} - Created board data.
     */
    const createBoard = async (name, description) => {
        const response = await apiClient.post('/boards', { name, description });
        return response;
    };

    /**
     * Helper function to delete a board by name.
     * @param {string} name - Name of the board to delete.
     */
    const deleteBoardByName = async (name) => {
        const boards = await apiClient.get('/boards');
        const board = boards.find((b) => b.name === name);
        if (board) {
            await apiClient.delete(`/boards/${board.id}`);
        }
    };

    test('renders BoardList component with fetched data', async () => {
        renderWithUser(<AdminDashboard />, 'admin');

        // Ensure existing boards are displayed
        const boardOne = await screen.findByText(/Development Board/i);
        expect(boardOne).toBeInTheDocument();

        const boardTwo = screen.getByText(/Marketing Board/i);
        expect(boardTwo).toBeInTheDocument();

        // Check for CRUD buttons
        const addButton = screen.getByText(/add new board/i);
        expect(addButton).toBeInTheDocument();

        const editButtons = screen.getAllByText(/edit/i);
        expect(editButtons.length).toBeGreaterThanOrEqual(2);

        const deleteButtons = screen.getAllByText(/delete/i);
        expect(deleteButtons.length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Board', async () => {
        const uniqueBoardName = `New Board ${Date.now()}`;
        renderWithUser(<AdminDashboard />, 'admin');

        // Click on 'Add New Board' button
        fireEvent.click(screen.getByText(/add new board/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: uniqueBoardName },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'New board description' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new board to appear in the list
        const newBoard = await screen.findByText(new RegExp(uniqueBoardName, 'i'));
        expect(newBoard).toBeInTheDocument();

        // Cleanup: Delete the created board
        await deleteBoardByName(uniqueBoardName);
    });

    test('allows admin to edit an existing Board', async () => {
        // First, create a unique board to edit
        const originalName = `Edit Board ${Date.now()}`;
        const updatedName = `${originalName} Updated`;
        const description = 'Board to be edited';

        await createBoard(originalName, description);

        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the newly created board to appear
        const boardToEdit = await screen.findByText(new RegExp(originalName, 'i'));
        expect(boardToEdit).toBeInTheDocument();

        // Find the corresponding Edit button and click it
        const editButtons = screen.getAllByText(/edit/i);
        // Assuming the last edit button corresponds to the latest board
        fireEvent.click(editButtons[editButtons.length - 1]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: updatedName },
        });
        fireEvent.change(screen.getByLabelText(/description/i), {
            target: { value: 'Updated description' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated board to appear in the list
        const updatedBoard = await screen.findByText(new RegExp(updatedName, 'i'));
        expect(updatedBoard).toBeInTheDocument();

        // Cleanup: Delete the updated board
        await deleteBoardByName(updatedName);
    });

    test('allows admin to delete a Board', async () => {
        // First, create a unique board to delete
        const boardName = `Delete Board ${Date.now()}`;
        const description = 'Board to be deleted';

        await createBoard(boardName, description);

        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the newly created board to appear
        const boardToDelete = await screen.findByText(new RegExp(boardName, 'i'));
        expect(boardToDelete).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the corresponding Delete button and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        // Assuming the last delete button corresponds to the latest board
        fireEvent.click(deleteButtons[deleteButtons.length - 1]);

        // Wait for the board to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(new RegExp(boardName, 'i'))).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
