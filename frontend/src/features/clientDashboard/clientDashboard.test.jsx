// src/features/clientDashboard/clientDashboard.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientDashboard from './pages/ClientDashboard';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

// Utility function to render components with Router
const renderWithRouter = (ui) => {
  return render(<Router>{ui}</Router>);
};

describe('ClientDashboard Component', () => {
  beforeEach(() => {
    // Mock initial GET requests for all modules
    fetch.mockImplementation((url, options) => {
      if (url.endsWith('/api/payments') && !options) {
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

      if (url.endsWith('/api/messages') && !options) {
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

      if (url.endsWith('/api/invoices') && !options) {
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

      // Add similar mocks for other GET requests as needed

      // Handle POST requests
      if (options && options.method === 'POST') {
        const body = JSON.parse(options.body);
        if (url.endsWith('/api/payments')) {
          // POST /api/payments
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

  test('renders ClientNavbar and ClientSidebar', () => {
    renderWithRouter(<ClientDashboard />);

    // Check for ClientNavbar
    expect(screen.getByText(/client dashboard/i)).toBeInTheDocument();

    // Check for ClientSidebar sections
    expect(screen.getByText(/payments/i)).toBeInTheDocument();
    expect(screen.getByText(/messages/i)).toBeInTheDocument();
    expect(screen.getByText(/invoices/i)).toBeInTheDocument();
    // Add more sidebar sections as needed
  });

  test('renders PaymentList component with fetched data', async () => {
    renderWithRouter(<ClientDashboard />);

    // Wait for payments to be fetched and rendered
    expect(await screen.findByText(/500/i)).toBeInTheDocument();
    expect(screen.getByText(/300/i)).toBeInTheDocument();

    // Check for CRUD buttons
    expect(screen.getByText(/make payment/i)).toBeInTheDocument();
    expect(screen.getAllByText(/delete/i).length).toBeGreaterThanOrEqual(2);
  });

  test('renders MessageList component with fetched data', async () => {
    renderWithRouter(<ClientDashboard />);

    // Wait for messages to be fetched and rendered
    expect(await screen.findByText(/hello!/i)).toBeInTheDocument();
    expect(screen.getByText(/hi there!/i)).toBeInTheDocument();

    // Check for CRUD buttons
    expect(screen.getByText(/send message/i)).toBeInTheDocument();
    // Assuming only sending messages is allowed, not deleting received messages
  });

  test('renders InvoiceList component with fetched data', async () => {
    renderWithRouter(<ClientDashboard />);

    // Wait for invoices to be fetched and rendered
    expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();
    expect(screen.getByText(/invoice #2/i)).toBeInTheDocument();

    // Check for actions
    expect(screen.getAllByText(/view invoice/i).length).toBeGreaterThanOrEqual(
      2
    );
    expect(screen.getAllByText(/sign invoice/i).length).toBeGreaterThanOrEqual(
      1
    );
  });

  test('allows client to make a new Payment', async () => {
    renderWithRouter(<ClientDashboard />);

    // Click on 'Make Payment' button
    fireEvent.click(screen.getByText(/make payment/i));

    // Check if the PaymentForm is rendered
    expect(screen.getByText(/create payment/i)).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '600' },
    });
    fireEvent.change(screen.getByLabelText(/method/i), {
      target: { value: 'PayPal' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/submit/i));

    // Wait for the new payment to appear in the list
    expect(await screen.findByText(/600/i)).toBeInTheDocument();
    expect(screen.getByText(/paypal/i)).toBeInTheDocument();
  });

  test('allows client to send a new Message', async () => {
    renderWithRouter(<ClientDashboard />);

    // Click on 'Send Message' button
    fireEvent.click(screen.getByText(/send message/i));

    // Check if the MessageForm is rendered
    expect(screen.getByText(/send message/i)).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/recipient/i), {
      target: { value: 'Bob Developer' },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: 'Hello Bob!' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/send/i));

    // Wait for the new message to appear in the list
    expect(await screen.findByText(/hello bob!/i)).toBeInTheDocument();
  });

  test('allows client to view an Invoice', async () => {
    renderWithRouter(<ClientDashboard />);

    // Wait for invoices to be rendered
    expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();

    // Click on 'View Invoice' button
    const viewButtons = screen.getAllByText(/view invoice/i);
    fireEvent.click(viewButtons[0]);

    // Check if the InvoiceDetails component is rendered
    expect(screen.getByText(/invoice details/i)).toBeInTheDocument();
    expect(screen.getByText(/amount: 1500/i)).toBeInTheDocument();
    expect(screen.getByText(/status: unpaid/i)).toBeInTheDocument();
  });

  test('allows client to sign an Invoice', async () => {
    renderWithRouter(<ClientDashboard />);

    // Wait for invoices to be rendered
    expect(await screen.findByText(/invoice #1/i)).toBeInTheDocument();

    // Click on 'Sign Invoice' button
    const signButtons = screen.getAllByText(/sign invoice/i);
    fireEvent.click(signButtons[0]);

    // Check if the SignInvoiceForm is rendered
    expect(screen.getByText(/sign invoice/i)).toBeInTheDocument();

    // Submit the form (assuming signing doesn't require additional input)
    fireEvent.click(screen.getByText(/sign/i));

    // Wait for the invoice status to update
    await waitFor(() => {
      expect(screen.getByText(/status: paid/i)).toBeInTheDocument();
    });
  });

  test('allows client to delete a Payment', async () => {
    renderWithRouter(<ClientDashboard />);

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

  // Repeat similar tests for viewing and deleting messages and invoices if applicable
});
