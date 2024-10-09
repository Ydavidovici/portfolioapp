// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor to add the token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
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
    if (error.response && error.response.status === 401) {
      // For example, dispatch a logout action or redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
