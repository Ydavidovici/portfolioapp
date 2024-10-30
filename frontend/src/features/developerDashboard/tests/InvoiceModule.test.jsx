// src/features/developerDashboard/tests/InvoiceModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from '../../../tests/utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DevDashboard from '../pages/DevDashboard';

describe('Invoice Module - Developer Dashboard', () => {
    beforeEach(() => {
        // Render the DevDashboard with Developer role
        renderWithUser(<DevDashboard />, 'developer');
    });

    afterEach(() => {
        // Cleanup authentication and restore mocks
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders InvoiceList component with fetched data', async () => {
        // Wait for invoices to be fetched and rendered
        expect(await screen.findByText(/invoice 001/i)).toBeInTheDocument();
        expect(screen.getByText(/invoice 002/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new invoice/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Invoice', async () => {
        // Click on 'Add New Invoice' button
        fireEvent.click(screen.getByText(/add new invoice/i));

        // Fill out the form fields
        fireEvent.change(screen.getByLabelText(/client name/i), {
            target: { value: 'David Client' },
        });
        fireEvent.change(screen.getByLabelText(/amount/i), {
            target: { value: '1500' },
        });
        fireEvent.change(screen.getByLabelText(/due date/i), {
            target: { value: '2024-12-31' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new invoice to appear in the list
        expect(await screen.findByText(/david client/i)).toBeInTheDocument();
        expect(screen.getByText(/1500/i)).toBeInTheDocument();
        expect(screen.getByText(/2024-12-31/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Invoice', async () => {
        // Wait for invoices to be rendered
        expect(await screen.findByText(/invoice 001/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form fields
        fireEvent.change(screen.getByLabelText(/client name/i), {
            target: { value: 'Alice Updated' },
        });
        fireEvent.change(screen.getByLabelText(/amount/i), {
            target: { value: '2000' },
        });
        fireEvent.change(screen.getByLabelText(/due date/i), {
            target: { value: '2025-01-15' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated invoice to appear in the list
        expect(await screen.findByText(/alice updated/i)).toBeInTheDocument();
        expect(screen.getByText(/2000/i)).toBeInTheDocument();
        expect(screen.getByText(/2025-01-15/i)).toBeInTheDocument();
    });

    test('allows developer to delete an Invoice', async () => {
        // Wait for invoices to be rendered
        expect(await screen.findByText(/invoice 002/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the Delete button for Invoice 002 and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        fireEvent.click(deleteButtons[1]); // Assuming the second delete button corresponds to Invoice 002

        // Wait for the invoice to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/invoice 002/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});