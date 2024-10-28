// src/features/clientDashboard/tests/PaymentModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import ClientDashboard from '../pages/ClientDashboard';
import { mockFetch, resetFetchMocks } from './utils/fetchMocks';

describe('Payment Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            payments: {
                GET: [
                    { id: '1', userId: '2', amount: 500, method: 'Credit Card' },
                    { id: '2', userId: '2', amount: 300, method: 'PayPal' },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        resetFetchMocks();
    });

    test('renders PaymentList component with fetched data', async () => {
        renderWithRouter(<ClientDashboard />);

        // Wait for payments to be fetched and rendered
        expect(await screen.findByText(/\$500/i)).toBeInTheDocument();
        expect(screen.getByText(/\$300/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/make payment/i)).toBeInTheDocument();
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows client to make a new Payment', async () => {
        renderWithRouter(<ClientDashboard />);

        // Click on 'Make Payment' button
        fireEvent.click(screen.getByText(/make payment/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/amount/i), {
            target: { value: '600' },
        });
        fireEvent.change(screen.getByLabelText(/method/i), {
            target: { value: 'PayPal' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/submit/i));

        // Wait for the new payment to appear in the list
        expect(await screen.findByText(/\$600/i)).toBeInTheDocument();
        expect(screen.getByText(/paypal/i)).toBeInTheDocument();
    });

    test('allows client to delete a Payment', async () => {
        renderWithRouter(<ClientDashboard />);

        // Wait for payments to be rendered
        expect(await screen.findByText(/\$500/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the payment to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/\$500/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
