// src/features/devDashboard/tests/DocumentModule.developer.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DevDashboard from '../pages/DevDashboard';

describe('Document Module - Developer', () => {
    let apiClient;

    beforeAll(() => {
        const { apiClient: client } = renderWithUser(<DevDashboard />, 'developer');
        apiClient = client;
    });

    afterAll(() => {
        cleanupAuth();
    });

    test('renders DocumentList with fetched data', async () => {
        expect(await screen.findByText(/Project Plan/i)).toBeInTheDocument();
        expect(screen.getByText(/Marketing Strategy/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/Add New Document/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/Delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Document', async () => {
        fireEvent.click(screen.getByText(/Add New Document/i));

        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: `Dev Document ${Date.now()}` },
        });
        fireEvent.change(screen.getByLabelText(/URL/i), {
            target: { value: 'http://example.com/dev-document.pdf' },
        });

        fireEvent.click(screen.getByText(/Create/i));

        const newDocumentTitle = await screen.findByText(/Dev Document/i);
        expect(newDocumentTitle).toBeInTheDocument();
        expect(screen.getByText(/http:\/\/example\.com\/dev-document\.pdf/i)).toBeInTheDocument();

        // Cleanup
        const deleteButton = newDocumentTitle.parentElement.querySelector('button.delete');
        fireEvent.click(deleteButton);

        window.confirm = jest.fn(() => true);
        await waitFor(() => {
            expect(screen.queryByText(/Dev Document/i)).not.toBeInTheDocument();
        });
        window.confirm.mockRestore();
    });

    test('allows developer to edit an existing Document', async () => {
        const editButtons = screen.getAllByText(/Edit/i);
        fireEvent.click(editButtons[0]);

        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: 'Updated Project Plan by Dev' },
        });
        fireEvent.change(screen.getByLabelText(/URL/i), {
            target: { value: 'http://example.com/updated-project-plan-dev.pdf' },
        });

        fireEvent.click(screen.getByText(/Update/i));

        expect(await screen.findByText(/Updated Project Plan by Dev/i)).toBeInTheDocument();
        expect(screen.getByText(/http:\/\/example\.com\/updated-project-plan-dev\.pdf/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Document', async () => {
        const deleteButtons = screen.getAllByText(/Delete/i);
        fireEvent.click(deleteButtons[0]);

        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        await waitFor(() => {
            expect(screen.queryByText(/Updated Project Plan by Dev/i)).not.toBeInTheDocument();
        });

        window.confirm.mockRestore();
    });
});
