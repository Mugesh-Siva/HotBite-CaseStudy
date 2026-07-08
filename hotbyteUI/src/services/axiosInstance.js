// Central Axios instance - all API calls go through here
// Automatically attaches JWT token from localStorage to every request
// Redirects to /login on 401 Unauthorized

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

// Request interceptor - attach JWT token if present
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hotbyte_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[Axios Request] URL: ${config.url}`);
    console.log(`[Axios Request] Auth Header: ${config.headers.Authorization || 'NONE'}`);
    console.log(`[Axios Request] Token Length: ${token ? token.length : 0}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only redirect if it's not the login API itself returning 401 (invalid credentials)
      if (error.config && error.config.url !== '/api/auth/login') {
        // Clear stored auth data and redirect to login
        localStorage.removeItem('hotbyte_token');
        localStorage.removeItem('hotbyte_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
