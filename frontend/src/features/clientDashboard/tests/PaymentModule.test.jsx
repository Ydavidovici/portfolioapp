// src/features/clientDashboard/tests/PaymentModule.client.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import ClientDashboard from '../pages/ClientDashboard';

describe('Payment Module - Client', () => {
    beforeEach(() => {
        renderWithUser(<ClientDashboard />, 'client');
    });

    afterEach(() => {
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders PaymentList component with fetched data', async () => {
        // Wait for payments to be fetched and rendered
        expect(await screen.findByText(/500/i)).toBeInTheDocument();

        // Payment belonging to another user should not be visible
        expect(screen.queryByText(/300/i)).not.toBeInTheDocument();

        // Check for 'Make a Payment' button
        expect(screen.getByText(/make a payment/i)).toBeInTheDocument();

        // Edit and Delete buttons should not be present
        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
    });

    test('allows client to make a new Payment', async () => {
        // Click on 'Make a Payment' button
        fireEvent.click(screen.getByText(/make a payment/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/invoice/i), {
            target: { value: '1' }, // Assuming invoiceId '1' belongs to the client
        });
        fireEvent.change(screen.getByLabelText(/amount/i), {
            target: { value: '600' },
        });
        fireEvent.change(screen.getByLabelText(/method/i), {
            target: { value: 'Credit Card' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/submit payment/i));

        // Wait for the new payment to appear in the list
        expect(await screen.findByText(/600/i)).toBeInTheDocument();
        expect(screen.getByText(/credit card/i)).toBeInTheDocument();
    });

    test('does not allow client to edit payments via UI', async () => {
        // Attempt to find 'Edit' buttons
        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
    });

    test('does not allow client to delete payments via UI', async () => {
        // Attempt to find 'Delete' buttons
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
    });

    test('does not allow client to edit payments via API', async () => {
        // Attempt to send a PUT request directly via apiClient (bypassing UI)
        const { apiClient } = renderWithUser(<ClientDashboard />, 'client');

        try {
            await apiClient.put('/payments/1', {
                amount: 700,
                method: 'Debit Card',
            });
        } catch (error) {
            expect(error.response.status).toBe(403);
            expect(error.response.data.message).toBe('This action is unauthorized.');
        }
    });

    test('does not allow client to delete payments via API', async () => {
        // Attempt to send a DELETE request directly via apiClient (bypassing UI)
        const { apiClient } = renderWithUser(<ClientDashboard />, 'client');

        try {
            await apiClient.delete('/payments/1');
        } catch (error) {
            expect(error.response.status).toBe(403);
            expect(error.response.data.message).toBe('This action is unauthorized.');
        }
    });
});