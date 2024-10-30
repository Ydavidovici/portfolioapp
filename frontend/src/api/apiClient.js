// src/api/apiClient.js
import axios from 'axios';

// Create an Axios instance with the base URL from environment variables
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Request interceptor to add the token to headers
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle global errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle specific status codes if needed
        if (error.response) {
            const { status } = error.response;
            if (status === 401) {
                // Example: Redirect to login or dispatch a logout action
                // window.location.href = '/login';
                console.error('Unauthorized! Redirecting to login.');
            } else if (status === 403) {
                console.error('Forbidden! You do not have access to this resource.');
            } else if (status >= 500) {
                console.error('Server error! Please try again later.');
            }
        } else if (error.request) {
            console.error('No response received from the server.');
        } else {
            console.error('Error setting up the request:', error.message);
        }
        return Promise.reject(error);
    }
);

// Helper methods for common API interactions

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {object} [config] - Optional Axios config
 * @returns {Promise<any>} - Response data
 */
export const get = async (endpoint, config = {}) => {
    try {
        const response = await apiClient.get(endpoint, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {object} payload - Data to send in the body
 * @param {object} [config] - Optional Axios config
 * @returns {Promise<any>} - Response data
 */
export const post = async (endpoint, payload, config = {}) => {
    try {
        const response = await apiClient.post(endpoint, payload, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} payload - Data to update
 * @param {object} [config] - Optional Axios config
 * @returns {Promise<any>} - Response data
 */
export const put = async (endpoint, payload, config = {}) => {
    try {
        const response = await apiClient.put(endpoint, payload, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @param {object} [config] - Optional Axios config
 * @returns {Promise<any>} - Response data
 */
export const del = async (endpoint, config = {}) => {
    try {
        const response = await apiClient.delete(endpoint, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Export the Axios instance for direct use if needed
export default apiClient;
