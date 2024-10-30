// src/features/adminDashboard/tests/utils/testUtils.js

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from '../../../../context/UserContext';

/**
 * Mock Users
 */
const mockAdminUser = {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
};

const mockDevUser = {
    id: '2',
    name: 'Dev User',
    email: 'dev@example.com',
    role: 'developer',
};

const mockClientUser = {
    id: '3',
    name: 'Client User',
    email: 'client@example.com',
    role: 'client',
};

/**
 * Utility function to render components with Router and UserContext.
 * @param {React.ReactElement} ui - The component to render.
 * @param {string} role - User role ('admin', 'developer', 'client').
 * @returns {object} - Rendered component utilities.
 */
export const renderWithUser = (ui, role = 'admin') => {
    let user;
    let token;

    switch (role) {
        case 'admin':
            user = mockAdminUser;
            token = 'admin-valid-token';
            break;
        case 'developer':
            user = mockDevUser;
            token = 'dev-valid-token';
            break;
        case 'client':
            user = mockClientUser;
            token = 'client-valid-token';
            break;
        default:
            user = null;
            token = null;
    }

    // Set the authToken in localStorage based on role
    if (token) {
        localStorage.setItem('authToken', token);
    }

    return render(
        <Router>
            <UserContext.Provider value={{ user, loading: false, error: null }}>
                {ui}
            </UserContext.Provider>
        </Router>
    );
};

/**
 * Utility function to clear the authToken from localStorage after tests.
 */
export const cleanupAuth = () => {
    localStorage.removeItem('authToken');
};
