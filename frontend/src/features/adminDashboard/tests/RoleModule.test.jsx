// src/features/adminDashboard/tests/RoleModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import {mockFetch, resetFetchMocks} from './utils/fetchMocks';

describe('Role Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            roles: {
                GET: [
                    {
                        id: '1',
                        name: 'Admin',
                        permissions: ['manage_users', 'manage_roles', 'manage_projects'],
                    },
                    {
                        id: '2',
                        name: 'Developer',
                        permissions: ['manage_projects'],
                    },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        fetch.mockClear();
    });

    test('renders RoleList component with fetched data', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for roles to be fetched and rendered
        expect(await screen.findByText(/admin/i)).toBeInTheDocument();
        expect(screen.getByText(/developer/i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new role/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows admin to create a new Role', async () => {
        renderWithRouter(<AdminDashboard />);

        // Click on 'Add New Role' button
        fireEvent.click(screen.getByText(/add new role/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Tester' },
        });
        fireEvent.change(screen.getByLabelText(/permissions/i), {
            target: { value: 'manage_tests, view_reports' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new role to appear in the list
        expect(await screen.findByText(/tester/i)).toBeInTheDocument();
        expect(screen.getByText(/manage_tests, view_reports/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Role', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for roles to be rendered
        expect(await screen.findByText(/admin/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/name/i), {
            target: { value: 'Super Admin' },
        });
        fireEvent.change(screen.getByLabelText(/permissions/i), {
            target: { value: 'manage_all' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated role to appear in the list
        expect(await screen.findByText(/super admin/i)).toBeInTheDocument();
        expect(screen.getByText(/manage_all/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Role', async () => {
        renderWithRouter(<AdminDashboard />);

        // Wait for roles to be rendered
        expect(await screen.findByText(/developer/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the Delete button for the 'Developer' role and click it
        const deleteButtons = screen.getAllByText(/delete/i);
        // Assuming the second delete button corresponds to 'Developer'
        fireEvent.click(deleteButtons[1]);

        // Wait for the role to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/developer/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
