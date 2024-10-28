// src/tests/utils/renderWithRouter.js

import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { mockAuthContextValue } from './mockAuthContext';

const renderWithRouter = (
    ui,
    {
        route = '/',
        path = '/',
        authContextValue = mockAuthContextValue,
        ...renderOptions
    } = {}
) => {
    window.history.pushState({}, 'Test page', route);

    return render(
        <AuthContext.Provider value={authContextValue}>
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    <Route path={path} element={ui} />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>,
        renderOptions
    );
};

export default renderWithRouter;
