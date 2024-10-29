// jest.setup.js

import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

// Optionally, you can reset mocks after each test automatically
beforeEach(() => {
    fetchMock.resetMocks();
});
