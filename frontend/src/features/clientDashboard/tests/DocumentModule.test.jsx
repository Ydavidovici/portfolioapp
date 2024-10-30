// src/features/clientDashboard/tests/DocumentModule.client.test.jsx

import React from 'react';
import { renderWithUser, cleanupAuth } from './utils/testUtils';
import { screen } from '@testing-library/react';
import ClientDashboard from '../pages/ClientDashboard';

describe('Document Module - Client', () => {
    beforeAll(() => {
        renderWithUser(<ClientDashboard />, 'client');
    });

    afterAll(() => {
        cleanupAuth();
    });

    test('renders DocumentList with accessible data', async () => {
        // Clients can view all documents but cannot manage them
        expect(await screen.findByText(/Project Plan/i)).toBeInTheDocument();
        expect(screen.getByText(/Marketing Strategy/i)).toBeInTheDocument();

        // CRUD buttons should not be present
        expect(screen.queryByText(/Add New Document/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Edit/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Delete/i)).not.toBeInTheDocument();
    });
});
