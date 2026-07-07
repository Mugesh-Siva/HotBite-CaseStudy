// Auth API - register, login, get current user
import axiosInstance from './axiosInstance';

// POST /api/auth/register - Register new user, returns JWT + user info
export const registerUser = (data) => axiosInstance.post('/api/auth/register', data);

// POST /api/auth/login - Login, returns JWT + user info
export const loginUser = (data) => axiosInstance.post('/api/auth/login', data);

// GET /api/auth/me - Get currently logged-in user details
export const getCurrentUser = () => axiosInstance.get('/api/auth/me');
