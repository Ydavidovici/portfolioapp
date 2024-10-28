// src/features/adminDashboard/adminDashboard.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from './pages/AdminDashboard';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

// Utility function to render components with Router
const renderWithRouter = (ui) => {
  return render(<Router>{ui}</Router>);
};

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    // Mock initial GET requests for all modules
    fetch.mockImplementation((url, options) => {
      // Handle GET requests
      if (
        url.endsWith('/api/boards') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/boards
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: '1',
                name: 'Development Board',
                description: 'Board for development tasks',
                status: 'active',
              },
              {
                id: '2',
                name: 'Marketing Board',
                description: 'Board for marketing tasks',
                status: 'active',
              },
            ]),
        });
      }

      if (
        url.endsWith('/api/checklists') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/checklists
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', name: 'Sprint Checklist', projectId: '1' },
              { id: '2', name: 'Marketing Checklist', projectId: '2' },
            ]),
        });
      }

      if (
        url.endsWith('/api/checklistItems') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/checklistItems
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', task: 'Design UI', checklistId: '1' },
              { id: '2', task: 'Set up Database', checklistId: '1' },
            ]),
        });
      }

      if (
        url.endsWith('/api/calendarEntries') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/calendarEntries
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', title: 'Sprint Planning', date: '2024-11-01' },
              { id: '2', title: 'Marketing Meeting', date: '2024-11-05' },
            ]),
        });
      }

      if (
        url.endsWith('/api/documents') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/documents
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
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
            ]),
        });
      }

      if (
        url.endsWith('/api/feedback') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/feedback
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', content: 'Great work on the project!' },
              { id: '2', content: 'Needs improvement in documentation.' },
            ]),
        });
      }

      if (
        url.endsWith('/api/invoices') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/invoices
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', clientId: '1', amount: 1500, status: 'unpaid' },
              { id: '2', clientId: '1', amount: 750, status: 'paid' },
            ]),
        });
      }

      if (
        url.endsWith('/api/messages') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/messages
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: '1',
                senderId: '1',
                receiverId: '2',
                content: 'Hello!',
                timestamp: '2024-10-21T10:00:00Z',
              },
              {
                id: '2',
                senderId: '2',
                receiverId: '1',
                content: 'Hi there!',
                timestamp: '2024-10-21T10:05:00Z',
              },
            ]),
        });
      }

      if (
        url.endsWith('/api/notes') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/notes
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', content: 'Project kickoff meeting notes.' },
              { id: '2', content: 'Marketing campaign ideas.' },
            ]),
        });
      }

      if (
        url.endsWith('/api/payments') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/payments
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', userId: '2', amount: 500, method: 'Credit Card' },
              { id: '2', userId: '2', amount: 300, method: 'PayPal' },
            ]),
        });
      }

      if (
        url.endsWith('/api/quickBooksTokens') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/quickBooksTokens
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', token: 'Bearer abc123' },
              { id: '2', token: 'Bearer def456' },
            ]),
        });
      }

      if (
        url.endsWith('/api/projects') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/projects
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: '1',
                name: 'Project Alpha',
                description: 'Alpha Description',
              },
              {
                id: '2',
                name: 'Project Beta',
                description: 'Beta Description',
              },
            ]),
        });
      }

      if (
        url.endsWith('/api/reminders') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/reminders
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', message: 'Submit report', date: '2024-11-10' },
              { id: '2', message: 'Team meeting', date: '2024-11-12' },
            ]),
        });
      }

      if (
        url.endsWith('/api/tasks') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/tasks
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', name: 'Develop Feature X', taskListId: '1' },
              { id: '2', name: 'Test Feature Y', taskListId: '1' },
            ]),
        });
      }

      if (
        url.endsWith('/api/taskLists') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/taskLists
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', name: 'Sprint 1' },
              { id: '2', name: 'Sprint 2' },
            ]),
        });
      }

      if (
        url.endsWith('/api/users') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/users
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: '1',
                name: 'Alice Admin',
                email: 'alice@admin.com',
                roleId: '1',
              },
              {
                id: '2',
                name: 'Bob Developer',
                email: 'bob@dev.com',
                roleId: '2',
              },
            ]),
        });
      }

      if (
        url.endsWith('/api/roles') &&
        (!options || options.method === 'GET')
      ) {
        // GET /api/roles
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: '1',
                name: 'Admin',
                permissions: [
                  'manage_users',
                  'manage_roles',
                  'manage_projects',
                ],
              },
              { id: '2', name: 'Developer', permissions: ['manage_projects'] },
            ]),
        });
      }

      // Handle POST requests
      if (options && options.method === 'POST') {
        const body = JSON.parse(options.body);
        if (url.endsWith('/api/boards')) {
          // POST /api/boards
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/checklists')) {
          // POST /api/checklists
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/checklistItems')) {
          // POST /api/checklistItems
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/calendarEntries')) {
          // POST /api/calendarEntries
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/documents')) {
          // POST /api/documents
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/feedback')) {
          // POST /api/feedback
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/invoices')) {
          // POST /api/invoices
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/messages')) {
          // POST /api/messages
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/notes')) {
          // POST /api/notes
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/payments')) {
          // POST /api/payments
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/quickBooksTokens')) {
          // POST /api/quickBooksTokens
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/projects')) {
          // POST /api/projects
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/reminders')) {
          // POST /api/reminders
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/tasks')) {
          // POST /api/tasks
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/taskLists')) {
          // POST /api/taskLists
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/users')) {
          // POST /api/users
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        if (url.endsWith('/api/roles')) {
          // POST /api/roles
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: '3', ...body }),
          });
        }

        // Add similar mocks for other POST requests as needed
      }

      // Handle PUT requests
      if (options && options.method === 'PUT') {
        const body = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(body),
        });
      }

      // Handle DELETE requests
      if (options && options.method === 'DELETE') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }

      // Default mock response
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: 'Not Found' }),
      });
    });
  });

  afterEach(() => {
    fetch.mockClear();
  });

  /*** BOARD MODULE TESTS ***/
  describe('Board Module', () => {
    test('renders BoardList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for boards to be fetched and rendered
      expect(await screen.findByText(/development board/i)).toBeInTheDocument();
      expect(screen.getByText(/marketing board/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new board/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Board', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Board' button
      fireEvent.click(screen.getByText(/add new board/i));

      // Check if the BoardForm is rendered
      expect(screen.getByText(/create board/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'New Board' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'New board description' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new board to appear in the list
      expect(await screen.findByText(/new board/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Board', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for boards to be rendered
      expect(await screen.findByText(/development board/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the BoardForm is rendered with existing data
      expect(screen.getByText(/edit board/i)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(/development board/i)
      ).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Updated Board' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Updated description' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated board to appear in the list
      expect(await screen.findByText(/updated board/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Board', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for boards to be rendered
      expect(await screen.findByText(/development board/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the board to be removed from the list
      await waitFor(() => {
        expect(
          screen.queryByText(/development board/i)
        ).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** CHECKLIST MODULE TESTS ***/
  describe('Checklist Module', () => {
    test('renders ChecklistList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for checklists to be fetched and rendered
      expect(await screen.findByText(/sprint checklist/i)).toBeInTheDocument();
      expect(screen.getByText(/marketing checklist/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new checklist/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Checklist', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Checklist' button
      fireEvent.click(screen.getByText(/add new checklist/i));

      // Check if the ChecklistForm is rendered
      expect(screen.getByText(/create checklist/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'New Checklist' },
      });
      fireEvent.change(screen.getByLabelText(/project/i), {
        target: { value: '1' },
      }); // Assuming projectId '1'

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new checklist to appear in the list
      expect(await screen.findByText(/new checklist/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Checklist', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for checklists to be rendered
      expect(await screen.findByText(/sprint checklist/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the ChecklistForm is rendered with existing data
      expect(screen.getByText(/edit checklist/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/sprint checklist/i)).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Updated Checklist' },
      });
      fireEvent.change(screen.getByLabelText(/project/i), {
        target: { value: '2' },
      }); // Changing projectId '2'

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated checklist to appear in the list
      expect(await screen.findByText(/updated checklist/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Checklist', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for checklists to be rendered
      expect(await screen.findByText(/sprint checklist/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the checklist to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/sprint checklist/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** CHECKLISTITEM MODULE TESTS ***/
  describe('ChecklistItem Module', () => {
    test('renders ChecklistItemList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for checklist items to be fetched and rendered
      expect(await screen.findByText(/design ui/i)).toBeInTheDocument();
      expect(screen.getByText(/set up database/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new checklist item/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Checklist Item', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Checklist Item' button
      fireEvent.click(screen.getByText(/add new checklist item/i));

      // Check if the ChecklistItemForm is rendered
      expect(screen.getByText(/create checklist item/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/task/i), {
        target: { value: 'Implement Authentication' },
      });
      fireEvent.change(screen.getByLabelText(/checklist/i), {
        target: { value: '1' },
      }); // Assuming checklistId '1'
      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new checklist item to appear in the list
      expect(
        await screen.findByText(/implement authentication/i)
      ).toBeInTheDocument();
    });

    test('allows admin to edit an existing Checklist Item', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for checklist items to be rendered
      expect(await screen.findByText(/design ui/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the ChecklistItemForm is rendered with existing data
      expect(screen.getByText(/edit checklist item/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/design ui/i)).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/task/i), {
        target: { value: 'Design User Interface' },
      });
      fireEvent.change(screen.getByLabelText(/checklist/i), {
        target: { value: '2' },
      }); // Changing checklistId '2'

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated checklist item to appear in the list
      expect(
        await screen.findByText(/design user interface/i)
      ).toBeInTheDocument();
    });

    test('allows admin to delete a Checklist Item', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for checklist items to be rendered
      expect(await screen.findByText(/design ui/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the checklist item to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/design ui/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** CALENDARENTRY MODULE TESTS ***/
  describe('CalendarEntry Module', () => {
    test('renders CalendarEntryList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for calendar entries to be fetched and rendered
      expect(await screen.findByText(/sprint planning/i)).toBeInTheDocument();
      expect(screen.getByText(/marketing meeting/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new calendar entry/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Calendar Entry', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Calendar Entry' button
      fireEvent.click(screen.getByText(/add new calendar entry/i));

      // Check if the CalendarEntryForm is rendered
      expect(screen.getByText(/create calendar entry/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'Client Meeting' },
      });
      fireEvent.change(screen.getByLabelText(/date/i), {
        target: { value: '2024-11-15' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new calendar entry to appear in the list
      expect(await screen.findByText(/client meeting/i)).toBeInTheDocument();
      expect(screen.getByText(/2024-11-15/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Calendar Entry', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for calendar entries to be rendered
      expect(await screen.findByText(/sprint planning/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the CalendarEntryForm is rendered with existing data
      expect(screen.getByText(/edit calendar entry/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/sprint planning/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/2024-11-01/i)).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'Sprint Planning Updated' },
      });
      fireEvent.change(screen.getByLabelText(/date/i), {
        target: { value: '2024-11-02' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated calendar entry to appear in the list
      expect(
        await screen.findByText(/sprint planning updated/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/2024-11-02/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Calendar Entry', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for calendar entries to be rendered
      expect(await screen.findByText(/sprint planning/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the calendar entry to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/sprint planning/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** DOCUMENT MODULE TESTS ***/
  describe('Document Module', () => {
    test('renders DocumentList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for documents to be fetched and rendered
      expect(await screen.findByText(/project plan/i)).toBeInTheDocument();
      expect(screen.getByText(/marketing strategy/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new document/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Document', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Document' button
      fireEvent.click(screen.getByText(/add new document/i));

      // Check if the DocumentForm is rendered
      expect(screen.getByText(/create document/i)).toBeInTheDocument();

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
      expect(
        screen.getByText(/http:\/\/example.com\/new-document\.pdf/i)
      ).toBeInTheDocument();
    });

    test('allows admin to edit an existing Document', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for documents to be rendered
      expect(await screen.findByText(/project plan/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the DocumentForm is rendered with existing data
      expect(screen.getByText(/edit document/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/project plan/i)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(/http:\/\/example.com\/project-plan\.pdf/i)
      ).toBeInTheDocument();

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
      expect(
        await screen.findByText(/updated project plan/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/http:\/\/example.com\/updated-project-plan\.pdf/i)
      ).toBeInTheDocument();
    });

    test('allows admin to delete a Document', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for documents to be rendered
      expect(await screen.findByText(/project plan/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the document to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/project plan/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** FEEDBACK MODULE TESTS ***/
  describe('Feedback Module', () => {
    test('renders FeedbackList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for feedback to be fetched and rendered
      expect(
        await screen.findByText(/great work on the project!/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/needs improvement in documentation./i)
      ).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new feedback/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Feedback', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Feedback' button
      fireEvent.click(screen.getByText(/add new feedback/i));

      // Check if the FeedbackForm is rendered
      expect(screen.getByText(/create feedback/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/content/i), {
        target: { value: 'Excellent team collaboration.' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new feedback to appear in the list
      expect(
        await screen.findByText(/excellent team collaboration./i)
      ).toBeInTheDocument();
    });

    test('allows admin to edit an existing Feedback', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for feedback to be rendered
      expect(
        await screen.findByText(/great work on the project!/i)
      ).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the FeedbackForm is rendered with existing data
      expect(screen.getByText(/edit feedback/i)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(/great work on the project!/i)
      ).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/content/i), {
        target: { value: 'Outstanding project execution!' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated feedback to appear in the list
      expect(
        await screen.findByText(/outstanding project execution!/i)
      ).toBeInTheDocument();
    });

    test('allows admin to delete a Feedback', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for feedback to be rendered
      expect(
        await screen.findByText(/great work on the project!/i)
      ).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the feedback to be removed from the list
      await waitFor(() => {
        expect(
          screen.queryByText(/great work on the project!/i)
        ).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** INVOICE MODULE TESTS ***/
  describe('Invoice Module', () => {
    test('renders InvoiceList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for invoices to be fetched and rendered
      expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();
      expect(screen.getByText(/invoice #2/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new invoice/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Invoice', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Invoice' button
      fireEvent.click(screen.getByText(/add new invoice/i));

      // Check if the InvoiceForm is rendered
      expect(screen.getByText(/create invoice/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/client/i), {
        target: { value: '1' },
      }); // Assuming clientId '1'
      fireEvent.change(screen.getByLabelText(/amount/i), {
        target: { value: '2000' },
      });
      fireEvent.change(screen.getByLabelText(/status/i), {
        target: { value: 'unpaid' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new invoice to appear in the list
      expect(await screen.findByText(/invoice #3/i)).toBeInTheDocument();
      expect(screen.getByText(/2000/i)).toBeInTheDocument();
      expect(screen.getByText(/unpaid/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Invoice', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for invoices to be rendered
      expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the InvoiceForm is rendered with existing data
      expect(screen.getByText(/edit invoice/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/1500/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/unpaid/i)).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/amount/i), {
        target: { value: '1600' },
      });
      fireEvent.change(screen.getByLabelText(/status/i), {
        target: { value: 'paid' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated invoice to appear in the list
      expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();
      expect(screen.getByText(/1600/i)).toBeInTheDocument();
      expect(screen.getByText(/paid/i)).toBeInTheDocument();
    });

    test('allows admin to delete an Invoice', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for invoices to be rendered
      expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the invoice to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/invoice #1/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** MESSAGE MODULE TESTS ***/
  describe('Message Module', () => {
    test('renders MessageList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for messages to be fetched and rendered
      expect(await screen.findByText(/hello!/i)).toBeInTheDocument();
      expect(screen.getByText(/hi there!/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new message/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Message', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Message' button
      fireEvent.click(screen.getByText(/add new message/i));

      // Check if the MessageForm is rendered
      expect(screen.getByText(/create message/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/sender/i), {
        target: { value: '1' },
      }); // Assuming senderId '1'
      fireEvent.change(screen.getByLabelText(/receiver/i), {
        target: { value: '2' },
      }); // Assuming receiverId '2'
      fireEvent.change(screen.getByLabelText(/content/i), {
        target: { value: 'Project update available.' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new message to appear in the list
      expect(
        await screen.findByText(/project update available./i)
      ).toBeInTheDocument();
    });

    test('allows admin to edit an existing Message', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for messages to be rendered
      expect(await screen.findByText(/hello!/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the MessageForm is rendered with existing data
      expect(screen.getByText(/edit message/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/hello!/i)).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/content/i), {
        target: { value: 'Updated Hello!' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated message to appear in the list
      expect(await screen.findByText(/updated hello!/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Message', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for messages to be rendered
      expect(await screen.findByText(/hello!/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the message to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/hello!/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** NOTE MODULE TESTS ***/
  describe('Note Module', () => {
    test('renders NoteList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for notes to be fetched and rendered
      expect(
        await screen.findByText(/project kickoff meeting notes./i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/marketing campaign ideas./i)
      ).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new note/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Note', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Note' button
      fireEvent.click(screen.getByText(/add new note/i));

      // Check if the NoteForm is rendered
      expect(screen.getByText(/create note/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/content/i), {
        target: { value: 'New project milestones set.' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new note to appear in the list
      expect(
        await screen.findByText(/new project milestones set./i)
      ).toBeInTheDocument();
    });

    test('allows admin to edit an existing Note', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for notes to be rendered
      expect(
        await screen.findByText(/project kickoff meeting notes./i)
      ).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the NoteForm is rendered with existing data
      expect(screen.getByText(/edit note/i)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(/project kickoff meeting notes\./i)
      ).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/content/i), {
        target: { value: 'Updated project kickoff meeting notes.' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated note to appear in the list
      expect(
        await screen.findByText(/updated project kickoff meeting notes./i)
      ).toBeInTheDocument();
    });

    test('allows admin to delete a Note', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for notes to be rendered
      expect(
        await screen.findByText(/project kickoff meeting notes./i)
      ).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the note to be removed from the list
      await waitFor(() => {
        expect(
          screen.queryByText(/project kickoff meeting notes./i)
        ).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** PAYMENT MODULE TESTS ***/
  describe('Payment Module', () => {
    test('renders PaymentList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for payments to be fetched and rendered
      expect(await screen.findByText(/500/i)).toBeInTheDocument();
      expect(screen.getByText(/300/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new payment/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Payment', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Payment' button
      fireEvent.click(screen.getByText(/add new payment/i));

      // Check if the PaymentForm is rendered
      expect(screen.getByText(/create payment/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/user/i), {
        target: { value: '2' },
      }); // Assuming userId '2'
      fireEvent.change(screen.getByLabelText(/amount/i), {
        target: { value: '600' },
      });
      fireEvent.change(screen.getByLabelText(/method/i), {
        target: { value: 'Bank Transfer' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new payment to appear in the list
      expect(await screen.findByText(/600/i)).toBeInTheDocument();
      expect(screen.getByText(/bank transfer/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Payment', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for payments to be rendered
      expect(await screen.findByText(/500/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the PaymentForm is rendered with existing data
      expect(screen.getByText(/edit payment/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/500/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/credit card/i)).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/amount/i), {
        target: { value: '550' },
      });
      fireEvent.change(screen.getByLabelText(/method/i), {
        target: { value: 'Debit Card' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated payment to appear in the list
      expect(await screen.findByText(/550/i)).toBeInTheDocument();
      expect(screen.getByText(/debit card/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Payment', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for payments to be rendered
      expect(await screen.findByText(/500/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the payment to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/500/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** PROJECT MODULE TESTS ***/
  describe('Project Module', () => {
    test('renders ProjectList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for projects to be fetched and rendered
      expect(await screen.findByText(/project alpha/i)).toBeInTheDocument();
      expect(screen.getByText(/project beta/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new project/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Project', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Project' button
      fireEvent.click(screen.getByText(/add new project/i));

      // Check if the ProjectForm is rendered
      expect(screen.getByText(/create project/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Project Gamma' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Gamma Description' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new project to appear in the list
      expect(await screen.findByText(/project gamma/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Project', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for projects to be rendered
      expect(await screen.findByText(/project alpha/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the ProjectForm is rendered with existing data
      expect(screen.getByText(/edit project/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/project alpha/i)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(/alpha description/i)
      ).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Project Alpha Updated' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'Updated Alpha Description' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated project to appear in the list
      expect(
        await screen.findByText(/project alpha updated/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/updated alpha description/i)
      ).toBeInTheDocument();
    });

    test('allows admin to delete a Project', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for projects to be rendered
      expect(await screen.findByText(/project beta/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[1]); // Assuming deleting Project Beta

      // Wait for the project to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/project beta/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** QUICKBOOKSTOKEN MODULE TESTS ***/
  describe('QuickBooksToken Module', () => {
    test('renders QuickBooksTokenList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for QuickBooks tokens to be fetched and rendered
      expect(await screen.findByText(/bearer abc123/i)).toBeInTheDocument();
      expect(screen.getByText(/bearer def456/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new token/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new QuickBooks Token', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Token' button
      fireEvent.click(screen.getByText(/add new token/i));

      // Check if the QuickBooksTokenForm is rendered
      expect(screen.getByText(/create quickbookstoken/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/token/i), {
        target: { value: 'Bearer ghi789' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new token to appear in the list
      expect(await screen.findByText(/bearer ghi789/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing QuickBooks Token', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for QuickBooks tokens to be rendered
      expect(await screen.findByText(/bearer abc123/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the QuickBooksTokenForm is rendered with existing data
      expect(screen.getByText(/edit quickbookstoken/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/bearer abc123/i)).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/token/i), {
        target: { value: 'Bearer xyz999' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated token to appear in the list
      expect(await screen.findByText(/bearer xyz999/i)).toBeInTheDocument();
    });

    test('allows admin to delete a QuickBooks Token', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for QuickBooks tokens to be rendered
      expect(await screen.findByText(/bearer abc123/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the token to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/bearer abc123/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** REMINDER MODULE TESTS ***/
  describe('Reminder Module', () => {
    test('renders ReminderList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for reminders to be fetched and rendered
      expect(await screen.findByText(/submit report/i)).toBeInTheDocument();
      expect(screen.getByText(/team meeting/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new reminder/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Reminder', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Reminder' button
      fireEvent.click(screen.getByText(/add new reminder/i));

      // Check if the ReminderForm is rendered
      expect(screen.getByText(/create reminder/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: 'Prepare quarterly report' },
      });
      fireEvent.change(screen.getByLabelText(/date/i), {
        target: { value: '2024-11-20' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new reminder to appear in the list
      expect(
        await screen.findByText(/prepare quarterly report/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/2024-11-20/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Reminder', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for reminders to be rendered
      expect(await screen.findByText(/submit report/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the ReminderForm is rendered with existing data
      expect(screen.getByText(/edit reminder/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/submit report/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/2024-11-10/i)).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: 'Submit annual report' },
      });
      fireEvent.change(screen.getByLabelText(/date/i), {
        target: { value: '2024-11-15' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated reminder to appear in the list
      expect(
        await screen.findByText(/submit annual report/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/2024-11-15/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Reminder', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for reminders to be rendered
      expect(await screen.findByText(/submit report/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the reminder to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/submit report/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** TASK MODULE TESTS ***/
  describe('Task Module', () => {
    test('renders TaskList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for tasks to be fetched and rendered
      expect(await screen.findByText(/develop feature x/i)).toBeInTheDocument();
      expect(screen.getByText(/test feature y/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new task/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Task', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Task' button
      fireEvent.click(screen.getByText(/add new task/i));

      // Check if the TaskForm is rendered
      expect(screen.getByText(/create task/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'New Task' },
      });
      fireEvent.change(screen.getByLabelText(/task list/i), {
        target: { value: '1' },
      }); // Assuming taskListId '1'

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new task to appear in the list
      expect(await screen.findByText(/new task/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Task', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for tasks to be rendered
      expect(await screen.findByText(/develop feature x/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the TaskForm is rendered with existing data
      expect(screen.getByText(/edit task/i)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(/develop feature x/i)
      ).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Develop Feature X Updated' },
      });
      fireEvent.change(screen.getByLabelText(/task list/i), {
        target: { value: '2' },
      }); // Changing taskListId '2'

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated task to appear in the list
      expect(
        await screen.findByText(/develop feature x updated/i)
      ).toBeInTheDocument();
    });

    test('allows admin to delete a Task', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for tasks to be rendered
      expect(await screen.findByText(/develop feature x/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the task to be removed from the list
      await waitFor(() => {
        expect(
          screen.queryByText(/develop feature x/i)
        ).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** TASKLIST MODULE TESTS ***/
  describe('TaskList Module', () => {
    test('renders TaskList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for task lists to be fetched and rendered
      expect(await screen.findByText(/sprint 1/i)).toBeInTheDocument();
      expect(screen.getByText(/sprint 2/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new task list/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Task List', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Task List' button
      fireEvent.click(screen.getByText(/add new task list/i));

      // Check if the TaskListForm is rendered
      expect(screen.getByText(/create task list/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Sprint 3' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new task list to appear in the list
      expect(await screen.findByText(/sprint 3/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing Task List', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for task lists to be rendered
      expect(await screen.findByText(/sprint 1/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the TaskListForm is rendered with existing data
      expect(screen.getByText(/edit task list/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/sprint 1/i)).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Sprint 1 Updated' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated task list to appear in the list
      expect(await screen.findByText(/sprint 1 updated/i)).toBeInTheDocument();
    });

    test('allows admin to delete a Task List', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for task lists to be rendered
      expect(await screen.findByText(/sprint 2/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the second Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[1]); // Assuming deleting Sprint 2

      // Wait for the task list to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/sprint 2/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** USER MODULE TESTS ***/
  describe('User Module', () => {
    test('renders UserList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for users to be fetched and rendered
      expect(await screen.findByText(/alice admin/i)).toBeInTheDocument();
      expect(screen.getByText(/bob developer/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new user/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new User', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New User' button
      fireEvent.click(screen.getByText(/add new user/i));

      // Check if the UserForm is rendered
      expect(screen.getByText(/create user/i)).toBeInTheDocument();

      // Fill out the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Charlie Manager' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'charlie@manager.com' },
      });
      fireEvent.change(screen.getByLabelText(/role/i), {
        target: { value: '1' },
      }); // Assuming roleId '1' for Admin

      // Submit the form
      fireEvent.click(screen.getByText(/create/i));

      // Wait for the new user to appear in the list
      expect(await screen.findByText(/charlie manager/i)).toBeInTheDocument();
      expect(screen.getByText(/charlie@manager\.com/i)).toBeInTheDocument();
    });

    test('allows admin to edit an existing User', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for users to be rendered
      expect(await screen.findByText(/alice admin/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the UserForm is rendered with existing data
      expect(screen.getByText(/edit user/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/alice admin/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/alice@admin\.com/i)).toBeInTheDocument();

      // Modify the form
      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Alice Administrator' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'alice@administra.tor.com' },
      });

      // Submit the form
      fireEvent.click(screen.getByText(/update/i));

      // Wait for the updated user to appear in the list
      expect(
        await screen.findByText(/alice administrator/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/alice@administrator\.com/i)).toBeInTheDocument();
    });

    test('allows admin to delete a User', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for users to be rendered
      expect(await screen.findByText(/alice admin/i)).toBeInTheDocument();

      // Mock window.confirm to always return true
      window.confirm = jest.fn(() => true);

      // Find the first Delete button and click it
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);

      // Wait for the user to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/alice admin/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });

  /*** ROLE MODULE TESTS ***/
  describe('Role Module', () => {
    test('renders RoleList component with fetched data', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for roles to be fetched and rendered
      expect(await screen.findByText(/admin/i)).toBeInTheDocument();
      expect(screen.getByText(/developer/i)).toBeInTheDocument();

      // Check for CRUD buttons
      expect(screen.getByText(/add new role/i)).toBeInTheDocument();
      expect(screen.getAllByText(/edit/i).length).toBeGreaterThanOrEqual(2);
      expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
    });

    test('allows admin to create a new Role', async () => {
      renderWithRouter(<AdminDashboard />);

      // Click on 'Add New Role' button
      fireEvent.click(screen.getByText(/add new role/i));

      // Check if the RoleForm is rendered
      expect(screen.getByText(/create role/i)).toBeInTheDocument();

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
      expect(
        screen.getByText(/manage_tests, view_reports/i)
      ).toBeInTheDocument();
    });

    test('allows admin to edit an existing Role', async () => {
      renderWithRouter(<AdminDashboard />);

      // Wait for roles to be rendered
      expect(await screen.findByText(/admin/i)).toBeInTheDocument();

      // Find the first Edit button and click it
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);

      // Check if the RoleForm is rendered with existing data
      expect(screen.getByText(/edit role/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/admin/i)).toBeInTheDocument();
      expect(
        screen.getByDisplayValue(/manage_users, manage_roles, manage_projects/i)
      ).toBeInTheDocument();

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
      window.confirm = jest.fn(() => true);

      // Find the second Delete button and click it (assuming deleting 'Developer' role)
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[1]);

      // Wait for the role to be removed from the list
      await waitFor(() => {
        expect(screen.queryByText(/developer/i)).not.toBeInTheDocument();
      });

      // Restore the original confirm
      window.confirm.mockRestore();
    });
  });
});
