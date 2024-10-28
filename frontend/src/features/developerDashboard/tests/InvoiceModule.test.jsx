// src/features/developerDashboard/tests/InvoiceModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import { mockFetch, resetFetchMocks } from './utils/fetchMocks';

describe('Invoice Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            invoices: {
                GET: [
                    { id: '1', clientId: '1', amount: 1500, status: 'unpaid' },
                    { id: '2', clientId: '2', amount: 750, status: 'paid' },
                ],
                POST: { id: '3' },
            },
            clients: {
                GET: [
                    { id: '1', name: 'Client A' },
                    { id: '2', name: 'Client B' },
                ],
            },
        });
    });

    afterEach(() => {
        resetFetchMocks();
    });

    test('renders InvoiceList component with fetched data', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for invoices to be fetched and rendered
        expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();
        expect(screen.getByText(/invoice #2/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new invoice/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Invoice', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Click on 'Add New Invoice' button
        fireEvent.click(screen.getByText(/add new invoice/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/client/i), {
            target: { value: '1' }, // Assuming clientId '1'
        });
        fireEvent.change(screen.getByLabelText(/amount/i), {
            target: { value: '2000' },
        });
        fireEvent.change(screen.getByLabelText(/status/i), {
            target: { value: 'unpaid' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new invoice to appear in the list
        expect(await screen.findByText(/invoice #3/i)).toBeInTheDocument();
        expect(screen.getByText(/\$2000/i)).toBeInTheDocument();
        expect(screen.getByText(/unpaid/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Invoice', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for invoices to be rendered
        expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/amount/i), {
            target: { value: '1600' },
        });
        fireEvent.change(screen.getByLabelText(/status/i), {
            target: { value: 'paid' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated invoice to appear in the list
        expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();
        expect(screen.getByText(/\$1600/i)).toBeInTheDocument();
        expect(screen.getByText(/paid/i)).toBeInTheDocument();
    });

    test('allows developer to delete an Invoice', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for invoices to be rendered
        expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the invoice to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/invoice #1/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
