// src/features/adminDashboard/tests/AdminDocumentModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import apiClient from '../../../api/apiClient'; // Ensure the path is correct

describe('Document Module - Admin Dashboard', () => {
    afterEach(() => {
        cleanupAuth();
    });

    /**
     * Helper function to create a new document via API.
     * @param {string} title - Title of the document.
     * @param {string} url - URL of the document.
     * @param {string} project_id - Associated project ID.
     * @param {string} uploaded_by - User ID who uploads the document.
     * @returns {object} - Created document data.
     */
    const createDocumentAPI = async (title, url, project_id, uploaded_by) => {
        const response = await apiClient.post('/documents', { title, url, project_id, uploaded_by });
        return response.data;
    };

    /**
     * Helper function to delete a document via API.
     * @param {string} id - ID of the document to delete.
     */
    const deleteDocumentAPI = async (id) => {
        await apiClient.delete(`/documents/${id}`);
    };

    test('renders DocumentList component with fetched data', async () => {
        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for documents to be fetched and rendered
        expect(await screen.findByText(/project plan/i)).toBeInTheDocument();
        expect(screen.getByText(/marketing strategy/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new document/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
        expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Document', async () => {
        renderWithUser(<AdminDashboard />, 'admin');

        // Click on 'Add New Document' button
        fireEvent.click(screen.getByText(/add new document/i));

        // Fill out the form
        const uniqueTitle = `New Document ${Date.now()}`;
        const uniqueURL = `http://example.com/new-document-${Date.now()}.pdf`;
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: uniqueTitle },
        });
        fireEvent.change(screen.getByLabelText(/url/i), {
            target: { value: uniqueURL },
        });
        fireEvent.change(screen.getByLabelText(/project/i), {
            target: { value: '1' }, // Assuming project_id '1' exists
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new document to appear in the list
        const newDocument = await screen.findByText(new RegExp(uniqueTitle, 'i'));
        expect(newDocument).toBeInTheDocument();
        expect(screen.getByText(new RegExp(uniqueURL, 'i'))).toBeInTheDocument();

        // Cleanup: Delete the created document via API
        const document = await apiClient.get('/documents');
        const created = document.data.find((d) => d.title === uniqueTitle);
        if (created) {
            await deleteDocumentAPI(created.id);
        }
    });

    test('allows admin to edit an existing Document', async () => {
        // First, create a unique document via API to edit
        const originalTitle = `Edit Document ${Date.now()}`;
        const originalURL = `http://example.com/edit-document-${Date.now()}.pdf`;
        const projectId = '1'; // Assuming project_id '1' exists
        const uploadedBy = '1'; // Assuming user_id '1' is Admin
        const createdDocument = await createDocumentAPI(originalTitle, originalURL, projectId, uploadedBy);

        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the newly created document to appear
        const documentToEdit = await screen.findByText(new RegExp(originalTitle, 'i'));
        expect(documentToEdit).toBeInTheDocument();

        // Find the corresponding Edit button and click it
        const editButtons = screen.getAllByText(/edit/i);
        const editButton = editButtons.find((button) =>
            button.closest('tr').textContent.includes(originalTitle)
        );
        fireEvent.click(editButton);

        // Modify the form
        const updatedTitle = `${originalTitle} Updated`;
        const updatedURL = `http://example.com/updated-document-${Date.now()}.pdf`;
        fireEvent.change(screen.getByLabelText(/title/i), {
            target: { value: updatedTitle },
        });
        fireEvent.change(screen.getByLabelText(/url/i), {
            target: { value: updatedURL },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated document to appear in the list
        const updatedDocument = await screen.findByText(new RegExp(updatedTitle, 'i'));
        expect(updatedDocument).toBeInTheDocument();
        expect(screen.getByText(new RegExp(updatedURL, 'i'))).toBeInTheDocument();

        // Cleanup: Delete the updated document via API
        const document = await apiClient.get('/documents');
        const updated = document.data.find((d) => d.title === updatedTitle);
        if (updated) {
            await deleteDocumentAPI(updated.id);
        }
    });

    test('allows admin to delete a Document', async () => {
        // First, create a unique document via API to delete
        const documentName = `Delete Document ${Date.now()}`;
        const documentURL = `http://example.com/delete-document-${Date.now()}.pdf`;
        const projectId = '1'; // Assuming project_id '1' exists
        const uploadedBy = '1'; // Assuming user_id '1' is Admin
        const createdDocument = await createDocumentAPI(documentName, documentURL, projectId, uploadedBy);

        renderWithUser(<AdminDashboard />, 'admin');

        // Wait for the newly created document to appear
        const documentToDelete = await screen.findByText(new RegExp(documentName, 'i'));
        expect(documentToDelete).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the corresponding Delete button and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        const deleteButton = deleteButtons.find((button) =>
            button.closest('tr').textContent.includes(documentName)
        );
        fireEvent.click(deleteButton);

        // Wait for the document to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(new RegExp(documentName, 'i'))).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
