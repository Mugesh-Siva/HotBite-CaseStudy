import axiosInstance from './axiosInstance';

// ---- Users ----
export const getAllUsers = () => axiosInstance.get('/api/users/getall');
export const getUserById = (id) => axiosInstance.get(`/api/users/getbyid/${id}`);
export const updateUser = (id, data) => axiosInstance.put(`/api/users/update/${id}`, data);
export const deleteUser = (id) => axiosInstance.delete(`/api/users/deletebyid/${id}`);

// ---- User Addresses ----
export const addUserAddress = (data) => axiosInstance.post('/api/user-addresses/add', data);
export const getAllUserAddresses = () => axiosInstance.get('/api/user-addresses/getall');
