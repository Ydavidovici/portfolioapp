// src/features/developerDashboard/developerDashboard.test.tsx

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store';
import { BrowserRouter as Router } from 'react-router-dom';
import { DeveloperDashboard } from './';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import userEvent from '@testing-library/user-event';

const mock = new MockAdapter(axios);
const API_URL = '/api/developer-dashboard';

/**
 * Helper to render components with Redux Provider and Router.
 */
const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <Provider store={store}>
            <Router>{ui}</Router>
        </Provider>
    );
};

describe('DeveloperDashboard Module', () => {
    beforeEach(() => {
        mock.reset();
    });

    test('renders DeveloperDashboard and loads projects, tasks, and messages', async () => {
        const projects = [
            {
                id: '1',
                name: 'Website Redesign',
                description: 'Redesign the corporate website',
                status: 'active',
                client: {
                    id: 'c1',
                    name: 'Acme Corp',
                    email: 'contact@acme.com',
                },
                tasks: [
                    {
                        id: 't1',
                        projectId: '1',
                        title: 'Create wireframes',
                        description: 'Initial wireframes for the homepage',
                        completed: false,
                        dueDate: '2024-05-01',
                        createdAt: '2024-04-01T10:00:00Z',
                        updatedAt: '2024-04-01T10:00:00Z',
                    },
                ],
                feedback: [
                    {
                        id: 'f1',
                        projectId: '1',
                        comment: 'Great progress so far!',
                        rating: 5,
                        createdAt: '2024-04-02T12:00:00Z',
                        updatedAt: '2024-04-02T12:00:00Z',
                    },
                ],
                createdAt: '2024-04-01T09:00:00Z',
                updatedAt: '2024-04-02T12:00:00Z',
            },
        ];

        const tasks = [
            {
                id: 't1',
                projectId: '1',
                title: 'Create wireframes',
                description: 'Initial wireframes for the homepage',
                completed: false,
                dueDate: '2024-05-01',
                createdAt: '2024-04-01T10:00:00Z',
                updatedAt: '2024-04-01T10:00:00Z',
            },
        ];

        const boards = [
            {
                id: 'b1',
                name: 'Sprint 1',
                description: 'Initial sprint tasks',
                createdAt: '2024-04-01T08:00:00Z',
                updatedAt: '2024-04-01T08:00:00Z',
            },
        ];

        const messages = [
            {
                id: 'm1',
                senderName: 'Admin',
                content: 'Welcome to your dashboard!',
                createdAt: '2024-04-01T10:00:00Z',
            },
            {
                id: 'm2',
                senderName: 'Support',
                content: 'Your project has been updated.',
                createdAt: '2024-04-02T14:30:00Z',
            },
        ];

        mock.onGet(`${API_URL}/projects`).reply(200, projects);
        mock.onGet(`${API_URL}/tasks`).reply(200, tasks);
        mock.onGet(`${API_URL}/boards`).reply(200, boards);
        mock.onGet(`${API_URL}/messages`).reply(200, messages);

        renderWithProviders(<DeveloperDashboard />);

        // Check for main headings
        expect(screen.getByText(/Developer Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Projects/i)).toBeInTheDocument();
        expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
        expect(screen.getByText(/Messages/i)).toBeInTheDocument();

        // Wait for projects to load
        await waitFor(() => {
            expect(screen.getByText(/Website Redesign/i)).toBeInTheDocument();
            expect(screen.getByText(/Redesign the corporate website/i)).toBeInTheDocument();
            expect(screen.getByText(/Acme Corp/i)).toBeInTheDocument();
        });

        // Wait for tasks to load
        await waitFor(() => {
            expect(screen.getByText(/Create wireframes/i)).toBeInTheDocument();
            expect(screen.getByText(/Initial wireframes for the homepage/i)).toBeInTheDocument();
        });

        // Wait for boards to load (if displayed)
        // Add assertions for boards if displayed

        // Wait for messages to load
        await waitFor(() => {
            expect(screen.getByText(/Welcome to your dashboard!/i)).toBeInTheDocument();
            expect(screen.getByText(/Your project has been updated./i)).toBeInTheDocument();
        });
    });

    test('handles loading states and errors', async () => {
        mock.onGet(`${API_URL}/projects`).reply(500);
        mock.onGet(`${API_URL}/tasks`).reply(500);
        mock.onGet(`${API_URL}/boards`).reply(500);
        mock.onGet(`${API_URL}/messages`).reply(500);

        renderWithProviders(<DeveloperDashboard />);

        expect(screen.getByText(/Loading projects.../i)).toBeInTheDocument();
        expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();
        expect(screen.getByText(/Loading boards.../i)).toBeInTheDocument();
        expect(screen.getByText(/Loading messages.../i)).toBeInTheDocument();

        // Wait for error messages
        await waitFor(() => {
            expect(screen.getByText(/Error: Failed to fetch projects/i)).toBeInTheDocument();
            expect(screen.getByText(/Error: Failed to fetch tasks/i)).toBeInTheDocument();
            expect(screen.getByText(/Error: Failed to fetch boards/i)).toBeInTheDocument();
            expect(screen.getByText(/Error: Failed to fetch messages/i)).toBeInTheDocument();
        });
    });

    test('creates a new project', async () => {
        const projects = [];
        mock.onGet(`${API_URL}/projects`).reply(200, projects);
        mock.onGet(`${API_URL}/tasks`).reply(200, []);
        mock.onGet(`${API_URL}/boards`).reply(200, []);
        mock.onGet(`${API_URL}/messages`).reply(200, []);

        const newProject = {
            id: '2',
            name: 'Mobile App Development',
            description: 'Develop a mobile application for clients',
            status: 'active',
            client: {
                id: 'c2',
                name: 'Beta Corp',
                email: 'contact@beta.com',
            },
            tasks: [],
            feedback: [],
            createdAt: '2024-04-10T10:00:00Z',
            updatedAt: '2024-04-10T10:00:00Z',
        };

        mock.onPost(`${API_URL}/projects`).reply(201, newProject);

        renderWithProviders(<DeveloperDashboard />);

        // Navigate to Create Project
        fireEvent.click(screen.getByText(/Add New Project/i));

        // Fill out the form
        userEvent.type(screen.getByLabelText(/Name:/i), 'Mobile App Development');
        userEvent.type(screen.getByLabelText(/Description \(optional\):/i), 'Develop a mobile application for clients');
        userEvent.selectOptions(screen.getByLabelText(/Status:/i), 'active');
        userEvent.type(screen.getByLabelText(/Client ID:/i), 'c2');

        // Submit the form
        fireEvent.click(screen.getByText(/Save/i));

        // Wait for the new project to appear in the list
        await waitFor(() => {
            expect(screen.getByText(/Mobile App Development/i)).toBeInTheDocument();
            expect(screen.getByText(/Develop a mobile application for clients/i)).toBeInTheDocument();
            expect(screen.getByText(/Beta Corp/i)).toBeInTheDocument();
        });
    });

    test('edits an existing project', async () => {
        const projects = [
            {
                id: '1',
                name: 'Website Redesign',
                description: 'Redesign the corporate website',
                status: 'active',
                client: {
                    id: 'c1',
                    name: 'Acme Corp',
                    email: 'contact@acme.com',
                },
                tasks: [],
                feedback: [],
                createdAt: '2024-04-01T09:00:00Z',
                updatedAt: '2024-04-01T09:00:00Z',
            },
        ];

        mock.onGet(`${API_URL}/projects`).reply(200, projects);
        mock.onGet(`${API_URL}/tasks`).reply(200, []);
        mock.onGet(`${API_URL}/boards`).reply(200, []);
        mock.onGet(`${API_URL}/messages`).reply(200, []);

        const updatedProject = {
            ...projects[0],
            name: 'Website Overhaul',
            description: 'Completely overhaul the corporate website',
            updatedAt: '2024-04-15T10:00:00Z',
        };

        mock.onPut(`${API_URL}/projects/1`).reply(200, updatedProject);

        renderWithProviders(<DeveloperDashboard />);

        // Wait for projects to load
        await waitFor(() => {
            expect(screen.getByText(/Website Redesign/i)).toBeInTheDocument();
        });

        // Navigate to Edit Project
        fireEvent.click(screen.getByText(/Edit/i));

        // Update the form
        userEvent.clear(screen.getByLabelText(/Name:/i));
        userEvent.type(screen.getByLabelText(/Name:/i), 'Website Overhaul');
        userEvent.clear(screen.getByLabelText(/Description \(optional\):/i));
        userEvent.type(screen.getByLabelText(/Description \(optional\):/i), 'Completely overhaul the corporate website');

        // Submit the form
        fireEvent.click(screen.getByText(/Save/i));

        // Wait for the updated project to appear
        await waitFor(() => {
            expect(screen.getByText(/Website Overhaul/i)).toBeInTheDocument();
            expect(screen.queryByText(/Website Redesign/i)).not.toBeInTheDocument();
            expect(screen.getByText(/Completely overhaul the corporate website/i)).toBeInTheDocument();
        });
    });

    test('deletes a project', async () => {
        const projects = [
            {
                id: '1',
                name: 'Website Redesign',
                description: 'Redesign the corporate website',
                status: 'active',
                client: {
                    id: 'c1',
                    name: 'Acme Corp',
                    email: 'contact@acme.com',
                },
                tasks: [],
                feedback: [],
                createdAt: '2024-04-01T09:00:00Z',
                updatedAt: '2024-04-01T09:00:00Z',
            },
        ];

        mock.onGet(`${API_URL}/projects`).reply(200, projects);
        mock.onGet(`${API_URL}/tasks`).reply(200, []);
        mock.onGet(`${API_URL}/boards`).reply(200, []);
        mock.onGet(`${API_URL}/messages`).reply(200, []);

        mock.onDelete(`${API_URL}/projects/1`).reply(200);

        // Mock window.confirm
        window.confirm = jest.fn().mockImplementation(() => true);

        renderWithProviders(<DeveloperDashboard />);

        // Wait for projects to load
        await waitFor(() => {
            expect(screen.getByText(/Website Redesign/i)).toBeInTheDocument();
        });

        // Click on Delete button
        fireEvent.click(screen.getByText(/Delete/i));

        // Wait for the project to be removed
        await waitFor(() => {
            expect(screen.queryByText(/Website Redesign/i)).not.toBeInTheDocument();
        });
    });

    test('creates a new task', async () => {
        const projects = [
            {
                id: '1',
                name: 'Website Redesign',
                description: 'Redesign the corporate website',
                status: 'active',
                client: {
                    id: 'c1',
                    name: 'Acme Corp',
                    email: 'contact@acme.com',
                },
                tasks: [],
                feedback: [],
                createdAt: '2024-04-01T09:00:00Z',
                updatedAt: '2024-04-01T09:00:00Z',
            },
        ];

        const tasks = [];

        mock.onGet(`${API_URL}/projects`).reply(200, projects);
        mock.onGet(`${API_URL}/tasks`).reply(200, tasks);
        mock.onGet(`${API_URL}/boards`).reply(200, []);
        mock.onGet(`${API_URL}/messages`).reply(200, []);

        const newTask = {
            id: 't1',
            projectId: '1',
            title: 'Design Homepage',
            description: 'Create initial design mockups for the homepage',
            completed: false,
            dueDate: '2024-05-01',
            createdAt: '2024-04-10T10:00:00Z',
            updatedAt: '2024-04-10T10:00:00Z',
        };

        mock.onPost(`${API_URL}/tasks`).reply(201, newTask);

        renderWithProviders(<DeveloperDashboard />);

        // Navigate to Create Task
        fireEvent.click(screen.getByText(/Add New Task/i));

        // Fill out the form
        userEvent.selectOptions(screen.getByLabelText(/Project:/i), '1');
        userEvent.type(screen.getByLabelText(/Title:/i), 'Design Homepage');
        userEvent.type(screen.getByLabelText(/Description \(optional\):/i), 'Create initial design mockups for the homepage');
        userEvent.selectOptions(screen.getByLabelText(/Completed:/i), 'false'); // Assuming checkbox; adjust if needed
        userEvent.type(screen.getByLabelText(/Due Date \(optional\):/i), '2024-05-01');

        // Submit the form
        fireEvent.click(screen.getByText(/Save/i));

        // Wait for the new task to appear in the list
        await waitFor(() => {
            expect(screen.getByText(/Design Homepage/i)).toBeInTheDocument();
            expect(screen.getByText(/Create initial design mockups for the homepage/i)).toBeInTheDocument();
        });
    });

    // Additional tests for editing and deleting tasks can be added similarly
});
