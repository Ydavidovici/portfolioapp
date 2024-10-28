// src/features/adminDashboard/tests/utils/fetchMocks.js

export const mockFetch = (responses) => {
    fetch.mockImplementation((url, options) => {
        const method = (options && options.method) || 'GET';
        const endpoint = url.split('/api/')[1];

        const response = responses[endpoint] && responses[endpoint][method];

        if (response) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(response),
            });
        }

        // Default mock response for unmatched requests
        return Promise.resolve({
            ok: false,
            status: 404,
            json: () => Promise.resolve({ message: 'Not Found' }),
        });
    });
};
