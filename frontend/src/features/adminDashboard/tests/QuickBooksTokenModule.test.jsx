// src/features/adminDashboard/tests/QuickBooksTokenModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import {mockFetch, resetFetchMocks} from './utils/fetchMocks';

describe('QuickBooksToken Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            quickBooksTokens: {
                GET: [
                    { id: '1', token: 'Bearer abc123' },
                    { id: '2', token: 'Bearer def456' },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        fetch.mockClear();
    });

    test('renders QuickBooksTokenList component with fetched data', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for QuickBooks tokens to be fetched and rendered
        expect(await screen.findByText(/bearer abc123/i)).toBeInTheDocument();
        expect(screen.getByText(/bearer def456/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new token/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new QuickBooks Token', async () => {
        renderWithRouter(<AdminDashboard />);

        // Click on 'Add New Token' button
        fireEvent.click(screen.getByText(/add new token/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/token/i), {
            target: { value: 'Bearer ghi789' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new token to appear in the list
        expect(await screen.findByText(/bearer ghi789/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing QuickBooks Token', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for tokens to be rendered
        expect(await screen.findByText(/bearer abc123/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/token/i), {
            target: { value: 'Bearer xyz999' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated token to appear in the list
        expect(await screen.findByText(/bearer xyz999/i)).toBeInTheDocument();
    });

    test('allows admin to delete a QuickBooks Token', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for tokens to be rendered
        expect(await screen.findByText(/bearer abc123/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the token to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/bearer abc123/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
