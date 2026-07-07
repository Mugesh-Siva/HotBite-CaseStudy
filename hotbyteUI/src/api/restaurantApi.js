// Restaurant & User API
import axiosInstance from './axiosInstance';

// ---- Restaurants ----
export const getAllRestaurants = () => axiosInstance.get('/api/restaurants/getall');
export const getRestaurantById = (id) => axiosInstance.get(`/api/restaurants/getbyid/${id}`);
export const createRestaurant = (data) => axiosInstance.post('/api/restaurants/add', data);
export const updateRestaurant = (id, data) => axiosInstance.put(`/api/restaurants/update/${id}`, data);
export const deleteRestaurant = (id) => axiosInstance.delete(`/api/restaurants/deletebyid/${id}`);

