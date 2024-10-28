// src/features/developerDashboard/tests/utils/fetchMocks.js

export const mockFetch = (responses) => {
    global.fetch = jest.fn((url, options = {}) => {
        const method = options.method || 'GET';
        const endpointMatch = url.match(/\/api\/([^?]*)/);
        const endpoint = endpointMatch ? endpointMatch[1] : '';
        const body = options.body ? JSON.parse(options.body) : null;

        if (responses[endpoint] && responses[endpoint][method]) {
            let responseData = responses[endpoint][method];

            if (method === 'POST') {
                responseData = { id: 'new-id', ...body };
            } else if (method === 'PUT') {
                responseData = body;
            } else if (method === 'DELETE') {
                responseData = {};
            }

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(responseData),
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

export const resetFetchMocks = () => {
    if (fetch.mockClear) {
        fetch.mockClear();
    }
};
