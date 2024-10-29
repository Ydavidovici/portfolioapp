// src/features/adminDashboard/tests/PaymentModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import {mockFetch, resetFetchMocks} from './utils/fetchMocks';

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
            users: {
                GET: [
                    { id: '1', name: 'Alice Admin' },
                    { id: '2', name: 'Bob Developer' },
                ],
            },
        });
    });

    afterEach(() => {
        fetch.mockClear();
    });

    test('renders PaymentList component with fetched data', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for payments to be fetched and rendered
        expect(await screen.findByText(/500/i)).toBeInTheDocument();
        expect(screen.getByText(/300/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new payment/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new Payment', async () => {
        renderWithRouter(<AdminDashboard />);

        // Click on 'Add New Payment' button
        fireEvent.click(screen.getByText(/add new payment/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/user/i), {
            target: { value: '2' },
        });
        fireEvent.change(screen.getByLabelText(/amount/i), {
            target: { value: '600' },
        });
        fireEvent.change(screen.getByLabelText(/method/i), {
            target: { value: 'Bank Transfer' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new payment to appear in the list
        expect(await screen.findByText(/600/i)).toBeInTheDocument();
        expect(screen.getByText(/bank transfer/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Payment', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for payments to be rendered
        expect(await screen.findByText(/500/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/amount/i), {
            target: { value: '550' },
        });
        fireEvent.change(screen.getByLabelText(/method/i), {
            target: { value: 'Debit Card' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated payment to appear in the list
        expect(await screen.findByText(/550/i)).toBeInTheDocument();
        expect(screen.getByText(/debit card/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Payment', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for payments to be rendered
        expect(await screen.findByText(/500/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the payment to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/500/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
