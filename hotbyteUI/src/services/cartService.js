// Cart API - carts and cart items
import axiosInstance from './axiosInstance';

// ---- Cart ----
export const createCart = (data) => axiosInstance.post('/api/carts/add', data);
export const getCartById = (id) => axiosInstance.get(`/api/carts/getbyid/${id}`);
export const getAllCarts = () => axiosInstance.get('/api/carts/getall');

// ---- Cart Items ----
export const addCartItem = (data) => axiosInstance.post('/api/cart-items/add', data);
export const getAllCartItems = () => axiosInstance.get('/api/cart-items/getall');
export const updateCartItem = (id, data) => axiosInstance.put(`/api/cart-items/update/${id}`, data);
export const deleteCartItem = (id) => axiosInstance.delete(`/api/cart-items/deletebyid/${id}`);
