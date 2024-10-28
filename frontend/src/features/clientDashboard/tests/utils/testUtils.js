// src/features/clientDashboard/tests/utils/testUtils.js

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

/**
 * Utility function to render components with Router
 * @param {React.ReactElement} ui - The component to render
 */
export const renderWithRouter = (ui) => {
    return render(<Router>{ui}</Router>);
};
