// src/features/developerDashboard/tests/FeedbackModule.test.jsx

import React from 'react';
import { renderWithRouter } from './utils/testUtils';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import { mockFetch, resetFetchMocks } from './utils/fetchMocks';

describe('Feedback Module', () => {
    beforeEach(() => {
        resetFetchMocks();

        mockFetch({
            feedback: {
                GET: [
                    { id: '1', content: 'Great work on the project!' },
                    { id: '2', content: 'Needs improvement in documentation.' },
                ],
                POST: { id: '3' },
            },
        });
    });

    afterEach(() => {
        resetFetchMocks();
    });

    test('renders FeedbackList component with fetched data', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for feedback to be fetched and rendered
        expect(await screen.findByText(/great work on the project!/i)).toBeInTheDocument();
        expect(screen.getByText(/needs improvement in documentation\./i)).toBeInTheDocument();

        // Check for CRUD buttons
        expect(screen.getByText(/add new feedback/i)).toBeInTheDocument();
        expect(screen.getAllByText(/edit/i)).toHaveLength(2);
        expect(screen.getAllByText(/delete/i)).toHaveLength(2);
    });

    test('allows developer to create a new Feedback', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Click on 'Add New Feedback' button
        fireEvent.click(screen.getByText(/add new feedback/i));

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'Excellent team collaboration.' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/create/i));

        // Wait for the new feedback to appear in the list
        expect(await screen.findByText(/excellent team collaboration\./i)).toBeInTheDocument();
    });

    test('allows developer to edit an existing Feedback', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for feedback to be rendered
        expect(await screen.findByText(/great work on the project!/i)).toBeInTheDocument();

        // Find the first Edit button and click it
        fireEvent.click(screen.getAllByText(/edit/i)[0]);

        // Modify the form
        fireEvent.change(screen.getByLabelText(/content/i), {
            target: { value: 'Outstanding project execution!' },
        });

        // Submit the form
        fireEvent.click(screen.getByText(/update/i));

        // Wait for the updated feedback to appear in the list
        expect(await screen.findByText(/outstanding project execution!/i)).toBeInTheDocument();
    });

    test('allows developer to delete a Feedback', async () => {
        renderWithRouter(<DeveloperDashboard />);

        // Wait for feedback to be rendered
        expect(await screen.findByText(/great work on the project!/i)).toBeInTheDocument();

        // Mock window.confirm to always return true
        jest.spyOn(window, 'confirm').mockImplementation(() => true);

        // Find the first Delete button and click it
        fireEvent.click(screen.getAllByText(/delete/i)[0]);

        // Wait for the feedback to be removed from the list
        await waitFor(() => {
            expect(screen.queryByText(/great work on the project!/i)).not.toBeInTheDocument();
        });

        // Restore the original confirm
        window.confirm.mockRestore();
    });
});
