// src/features/developerDashboard/tests/DocumentModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import { mockFetch, resetFetchMocks } from './utils/fetchMocks';

describe('Document Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            documents: {
                GET: [
                    {
                        id: '1',
                        title: 'Project Plan',
                        url: 'http://example.com/project-plan.pdf',
                    },
                    {
                        id: '2',
                        title: 'Marketing Strategy',
                        url: 'http://example.com/marketing-strategy.pdf',
                    },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        resetFetchMocks();
    });

    test('renders DocumentList component with fetched data', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for documents to be fetched and rendered
        expect(await screen.findByText(/project plan/i)).toBeInTheDocument();
        expect(screen.getByText(/marketing strategy/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new document/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Document', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Click on 'Add New Document' button
        fireEvent.click(screen.getByText(/add new document/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'New Document' },
        });
        fireEvent.change(screen.getByLabelText(/url/i), {
            target: { value: 'http://example.com/new-document.pdf' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new document to appear in the list
        expect(await screen.findByText(/new document/i)).toBeInTheDocument();
        expect(screen.getByText(/http:\/\/example\.com\/new-document\.pdf/i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Document', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for documents to be rendered
        expect(await screen.findByText(/project plan/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: 'Updated Project Plan' },
        });
        fireEvent.change(screen.getByLabelText(/url/i), {
            target: { value: 'http://example.com/updated-project-plan.pdf' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated document to appear in the list
        expect(await screen.findByText(/updated project plan/i)).toBeInTheDocument();
        expect(screen.getByText(/http:\/\/example\.com\/updated-project-plan\.pdf/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Document', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for documents to be rendered
        expect(await screen.findByText(/project plan/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the document to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/project plan/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
