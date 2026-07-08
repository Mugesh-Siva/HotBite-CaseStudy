import axiosInstance from './axiosInstance';

export const getAllRoles = () => axiosInstance.get('/api/roles/getall');
