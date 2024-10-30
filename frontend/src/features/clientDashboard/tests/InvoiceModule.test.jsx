// src/features/clientDashboard/tests/InvoiceModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from '../../../tests/utils/testUtils';
import { screen, waitFor } from '@testing-library/react';
import ClientDashboard from '../pages/ClientDashboard';

describe('Invoice Module - Client Dashboard', () => {
    beforeEach(() => {
        // Render the ClientDashboard with Client role
        renderWithUser(<ClientDashboard />, 'client');
    });

    afterEach(() => {
        // Cleanup authentication and restore mocks
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders InvoiceList component with fetched invoices', async () => {
        // Wait for invoices to be fetched and rendered
        expect(await screen.findByText(/invoice 001/i)).toBeInTheDocument();
        expect(screen.getByText(/invoice 002/i)).toBeInTheDocument();

        // Check that CRUD buttons are not present, as clients should only view invoices
        expect(screen.queryByText(/add new invoice/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/delete/i)).not.toBeInTheDocument();
    });

    test('allows client to view invoice details', async () => {
        // Wait for invoices to be rendered
        const invoiceItem = await screen.findByText(/invoice 001/i);
        expect(invoiceItem).toBeInTheDocument();

        // Assume clicking on the invoice opens a detail view/modal
        fireEvent.click(invoiceItem);

        // Verify that invoice details are displayed
        expect(await screen.findByText(/invoice details/i)).toBeInTheDocument();
        expect(screen.getByText(/client name: alice client/i)).toBeInTheDocument();
        expect(screen.getByText(/amount: \$1000/i)).toBeInTheDocument();
        expect(screen.getByText(/due date: 2024-12-31/i)).toBeInTheDocument();
    });

    test('handles no invoices gracefully', async () => {
        // Mock API response to return no invoices for the client
        // This requires adjusting the backend or ensuring the client has no invoices in the test database

        // For demonstration, assume the client has no invoices
        // Wait for the UI to update accordingly
        await waitFor(() => {
            expect(screen.getByText(/no invoices found/i)).toBeInTheDocument();
        });
    });

    test('displays error message on API failure', async () => {
        // Mock the API client to return an error
        jest.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('API Error'));

        // Rerender the ClientDashboard to trigger the API call
        renderWithUser(<ClientDashboard />, 'client');

        // Wait for the error message to appear
        expect(await screen.findByText(/failed to fetch invoices/i)).toBeInTheDocument();
    });
});