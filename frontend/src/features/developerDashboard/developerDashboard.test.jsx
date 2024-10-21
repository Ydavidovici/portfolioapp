// src/features/developerDashboard/developerDashboard.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import DeveloperDashboard from './pages/DeveloperDashboard';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

// Create a mock store
const initialState: { developerDashboard: DeveloperDashboardState; auth: { user: { role: string } | null } } = {
    developerDashboard: {
        // Initialize with empty arrays or mock data as needed
        boards: [],
        calendarEntries: [],
        checklists: [],
        checklistItems: [],
        documents: [],
        feedbacks: [],
        invoices: [],
        messages: [],
        notes: [],
        payments: [],
        quickBooksTokens: [],
        reminders: [],
        tasks: [],
        taskLists: [],
        loading: false,
        error: null,
    },
    auth: {
        user: {
            role: 'developer',
        },
    },
};

describe('DeveloperDashboard Component', () => {
    let store: any;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    test('renders DeveloperNavbar and DeveloperSidebar', () => {
        render(
        );

        // Check for DeveloperNavbar
        expect(screen.getByText(/developer dashboard/i)).toBeInTheDocument();

        // Check for DeveloperSidebar
        expect(screen.getByText(/projects/i)).toBeInTheDocument();
    });

    test('renders ProjectList component', () => {
        render(
        );

        // Assuming ProjectList has a heading or identifiable text
        expect(screen.getByText(/projects/i)).toBeInTheDocument();
    });

    test('renders shared resource components', () => {
        // Update the mock store with some shared resources
        const sharedResourcesState: DeveloperDashboardState = {
            ...initialState.developerDashboard,
            boards: [
                { id: '1', name: 'Development Board', description: 'Board for development tasks', status: 'active' },
            ],
            calendarEntries: [
                { id: '1', title: 'Sprint Planning', description: 'Plan for the next sprint', date: '2024-10-20' },
            ],
            // Add other shared resources as needed
            loading: false,
            error: null,
        };

        store = mockStore({
            developerDashboard: sharedResourcesState,
            auth: { user: { role: 'developer' } },
        });

        render(
        );

        // Check for shared resource components
        expect(screen.getByText(/development board/i)).toBeInTheDocument();
        expect(screen.getByText(/sprint planning/i)).toBeInTheDocument();
    });

    test('does not render developer-specific components for unauthorized roles', () => {
        // Update the mock store with a non-developer user
        store = mockStore({
            developerDashboard: initialState.developerDashboard,
            auth: { user: { role: 'client' } },
        });

        render(
        );

        // Since the user is not a developer, certain components should not be visible
        expect(screen.queryByText(/projects/i)).not.toBeInTheDocument();
    });
});
