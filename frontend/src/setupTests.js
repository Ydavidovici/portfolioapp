// src/setupTests.ts

import '@testing-library/jest-dom';

// Mock import.meta.env
Object.defineProperty(global, 'import.meta', {
  value: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:4000', // Replace with your test API base URL
      // Add other environment variables as needed
    },
  },
});
