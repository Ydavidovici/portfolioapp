// src/features/adminDashboard/tests/utils/testUtils.js

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

// Custom render function that includes React Router
export const renderWithRouter = (ui, options) => {
    return render(<Router>{ui}</Router>, options);
};

// Helper function to fill and submit forms
export const fillAndSubmitForm = (fields, submitButtonText = /create|update/i) => {
    fields.forEach(({ labelText, value }) => {
        fireEvent.change(screen.getByLabelText(labelText), {
            target: { value },
        });
    });
    fireEvent.click(screen.getByText(submitButtonText));
};
