// Order API - orders and order items
import axiosInstance from './axiosInstance';

// ---- Orders ----
export const createOrder = (data) => axiosInstance.post('/api/orders/add', data);
export const getAllOrders = () => axiosInstance.get('/api/orders/getall');
export const getOrderById = (id) => axiosInstance.get(`/api/orders/getbyid/${id}`);
export const updateOrder = (id, data) => axiosInstance.put(`/api/orders/update/${id}`, data);

// ---- Order Items ----
export const addOrderItem = (data) => axiosInstance.post('/api/order-items/add', data);
export const getAllOrderItems = () => axiosInstance.get('/api/order-items/getall');

// ---- Order Tracking ----
export const getAllOrderTracking = () => axiosInstance.get('/api/order-tracking/getall');
