// src/features/clientDashboard/tests/InvoiceModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import ClientDashboard from '../pages/ClientDashboard';
import { mockFetch, resetFetchMocks } from './utils/fetchMocks';

describe('Invoice Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            invoices: {
                GET: [
                    { id: '1', clientId: '1', amount: 1500, status: 'unpaid' },
                    { id: '2', clientId: '1', amount: 750, status: 'paid' },
                ],
                PUT: {},
            },
        });
    });

    afterEach(() => {
        resetFetchMocks();
    });

    test('renders InvoiceList component with fetched data', async () => {
        renderWithRouter(<ClientDashboard />);

        // Wait for invoices to be fetched and rendered
        expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();
        expect(screen.getByText(/invoice #2/i)).toBeInTheDocument();

        // Check for actions
        expect(screen.getAllByText(/view invoice/i)).toHaveLength(2);
        expect(screen.getAllByText(/sign invoice/i)).toHaveLength(1); // Assuming only unpaid invoices can be signed
    });

    test('allows client to view an Invoice', async () => {
        renderWithRouter(<ClientDashboard />);

        // Wait for invoices to be rendered
        expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();

        // Click on 'View Invoice' button
        fireEvent.click(screen.getAllByText(/view invoice/i)[0]);

        // Check if the InvoiceDetails component is rendered
        expect(await screen.findByText(/invoice details/i)).toBeInTheDocument();
        expect(screen.getByText(/amount: \$1500/i)).toBeInTheDocument();
        expect(screen.getByText(/status: unpaid/i)).toBeInTheDocument();
    });

    test('allows client to sign an Invoice', async () => {
        renderWithRouter(<ClientDashboard />);

        // Wait for invoices to be rendered
        expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();

        // Click on 'Sign Invoice' button
        fireEvent.click(screen.getAllByText(/sign invoice/i)[0]);

        // Confirm signing
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Wait for the invoice status to update
        await waitFor(() => {
            expect(screen.getByText(/status: paid/i)).toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
