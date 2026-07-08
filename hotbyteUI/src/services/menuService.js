// Menu API - menu items and categories
import axiosInstance from './axiosInstance';

// ---- Menu Items ----
export const getAllMenuItems = () => axiosInstance.get('/api/menu-items/getall');
export const getMenuItemById = (id) => axiosInstance.get(`/api/menu-items/getbyid/${id}`);
export const createMenuItem = (data) => axiosInstance.post('/api/menu-items/add', data);
export const updateMenuItem = (id, data) => axiosInstance.put(`/api/menu-items/update/${id}`, data);
export const deleteMenuItem = (id) => axiosInstance.delete(`/api/menu-items/deletebyid/${id}`);

export const uploadMenuImages = async (id, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return await axiosInstance.post(`/api/menu-items/${id}/images`, formData);
};

export const deleteMenuImage = (imageId) => axiosInstance.delete(`/api/menu-items/images/${imageId}`);

// ---- Categories ----
export const getAllCategories = () => axiosInstance.get('/api/categories/getall');
export const createCategory = (data) => axiosInstance.post('/api/categories/add', data);
