// src/features/developerDashboard/tests/QuickBooksTokenModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from '../../../tests/utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperDashboard from '../pages/DeveloperDashboard';

describe('QuickBooks Token Module - Developer Dashboard', () => {
    beforeEach(() => {
        // Render the DevDashboard with Developer role
        renderWithUser(<DeveloperDashboard />, 'developer');
    });

    afterEach(() => {
        // Cleanup authentication and restore mocks
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders QuickBooksTokenList component with fetched data', async () => {
        // Wait for tokens to be fetched and rendered
        expect(await screen.findByText(/token 001/i)).toBeInTheDocument();
        expect(screen.getByText(/token 002/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new token/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new QuickBooks Token', async () => {
        // Click on 'Add New Token' button
        fireEvent.click(screen.getByText(/add new token/i));

        // Fill out the form fields
        fireEvent.change(screen.getByLabelText(/token name/i), {
            target: { value: 'Token 003' },
        });
        fireEvent.change(screen.getByLabelText(/token value/i), {
            target: { value: 'abcd1234efgh5678' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new token to appear in the list
        expect(await screen.findByText(/token 003/i)).toBeInTheDocument();
        expect(screen.getByText(/abcd1234efgh5678/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing QuickBooks Token', async () => {
        // Wait for tokens to be rendered
        expect(await screen.findByText(/token 001/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form fields
        fireEvent.change(screen.getByLabelText(/token name/i), {
            target: { value: 'Token 001 Updated' },
        });
        fireEvent.change(screen.getByLabelText(/token value/i), {
            target: { value: 'updatedtokenvalue1234' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated token to appear in the list
        expect(await screen.findByText(/token 001 updated/i)).toBeInTheDocument();
        expect(screen.getByText(/updatedtokenvalue1234/i)).toBeInTheDocument();
    });

    test('allows developer to delete a QuickBooks Token', async () => {
        // Wait for tokens to be rendered
        expect(await screen.findByText(/token 002/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the Delete button for Token 002 and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        fireEvent.click(deleteButtons[1]); // Assuming the second delete button corresponds to Token 002

        // Wait for the token to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/token 002/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});