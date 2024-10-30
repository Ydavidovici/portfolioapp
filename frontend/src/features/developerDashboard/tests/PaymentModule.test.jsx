// src/features/devDashboard/tests/PaymentModule.developer.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperDashboard from '../pages/DeveloperDashboard';

describe('Payment Module - Developer', () => {
    beforeEach(() => {
        renderWithUser(<DeveloperDashboard />, 'developer');
    });

    afterEach(() => {
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders PaymentList component with fetched data', async () => {
        // Wait for payments to be fetched and rendered
        expect(await screen.findByText(/500/i)).toBeInTheDocument();
        expect(screen.getByText(/300/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/Add New Payment/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/Delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Payment', async () => {
        // Click on 'Add New Payment' button
        fireEvent.click(screen.getByText(/Add New Payment/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/User/i), {
            target: { value: '2' }, // Assuming userId '2' exists
        });
        fireEvent.change(screen.getByLabelText(/Amount/i), {
            target: { value: '700' },
        });
        fireEvent.change(screen.getByLabelText(/Method/i), {
            target: { value: 'PayPal' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/Create/i));

        // Wait for the new payment to appear in the list
        expect(await screen.findByText(/700/i)).toBeInTheDocument();
        expect(screen.getByText(/PayPal/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Payment', async () => {
        // Wait for payments to be rendered
        expect(await screen.findByText(/500/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        const editButtons = screen.getAllByText(/Edit/i);
        fireEvent.click(editButtons[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/Amount/i), {
            target: { value: '650' },
        });
        fireEvent.change(screen.getByLabelText(/Method/i), {
            target: { value: 'Debit Card' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/Update/i));

        // Wait for the updated payment to appear in the list
        expect(await screen.findByText(/650/i)).toBeInTheDocument();
        expect(screen.getByText(/Debit Card/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Payment', async () => {
        // Wait for payments to be rendered
        expect(await screen.findByText(/500/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        const deleteButtons = screen.getAllByText(/Delete/i);
        fireEvent.click(deleteButtons[0]);

        // Wait for the payment to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/500/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});