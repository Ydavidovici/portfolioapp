// src/features/adminDashboard/tests/UserModule.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';

describe('User Module', () => {
    beforeEach(() => {
        // Render the AdminDashboard with Admin role
        renderWithUser(<AdminDashboard />, 'admin');
    });

    afterEach(() => {
        // Cleanup authentication and restore mocks
        cleanupAuth();
        jest.restoreAllMocks();
    });

    test('renders UserList component with fetched data', async () => {
        // Wait for users to be fetched and rendered
        expect(await screen.findByText(/alice admin/i)).toBeInTheDocument();
        expect(screen.getByText(/bob developer/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new user/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new User', async () => {
        // Click on 'Add New User' button
        fireEvent.click(screen.getByText(/add new user/i));

        // Fill out the form fields
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Charlie Manager' },
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'charlie@manager.com' },
        });
        fireEvent.change(screen.getByLabelText(/role/i), {
            target: { value: '1' }, // Assuming roleId '1' for Admin
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new user to appear in the list
        expect(await screen.findByText(/charlie manager/i)).toBeInTheDocument();
        expect(screen.getByText(/charlie@manager\.com/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing User', async () => {
        // Wait for users to be rendered
        expect(await screen.findByText(/alice admin/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form fields
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Alice Administrator' },
        });
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'alice@administrator.com' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated user to appear in the list
        expect(await screen.findByText(/alice administrator/i)).toBeInTheDocument();
        expect(screen.getByText(/alice@administrator\.com/i)).toBeInTheDocument();
    });

    test('allows admin to delete a User', async () => {
        // Wait for users to be rendered
        expect(await screen.findByText(/alice admin/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the user to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/alice admin/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});