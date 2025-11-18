import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getFeaturedProducts = () => api.get('/products/featured');
export const getProductBySlug = (slug) => api.get(`/products/${slug}`);
export const getRelatedProducts = (slug) => api.get(`/products/${slug}/related`);

// Categories
export const getCategories = () => api.get('/categories');
export const getCategoryBySlug = (slug) => api.get(`/categories/${slug}`);

// Orders
export const createOrder = (data) => api.post('/orders', data);
export const getOrderById = (id) => api.get(`/orders/${id}`);

// Posts
export const getPosts = (params) => api.get('/posts', { params });
export const getPostBySlug = (slug) => api.get(`/posts/${slug}`);

// Other
export const getPromotions = () => api.get('/promotions');
export const getJobPostings = () => api.get('/jobs');
export const submitContactMessage = (data) => api.post('/contact', data);

// Product Images
export const getProductImages = (productId) => api.get(`/products/${productId}/images`);
export const adminAddProductImage = (productId, data) => api.post(`/admin/products/${productId}/images`, data);
export const adminUpdateProductImage = (imageId, data) => api.put(`/admin/products/images/${imageId}`, data);
export const adminDeleteProductImage = (imageId) => api.delete(`/admin/products/images/${imageId}`);

// Admin APIs
export const adminCreateProduct = (data, images) => {
  const formData = new FormData();

  // Add form data
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  // Add images
  if (images && images.length > 0) {
    images.forEach((image, index) => {
      formData.append('images', image);
    });
  }

  return api.post('/admin/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const adminUpdateProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const adminGetOrders = (params) => api.get('/admin/orders', { params });
export const adminUpdateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status });
export const adminGetPosts = (params) => api.get('/admin/posts', { params });
export const adminCreatePost = (data) => api.post('/admin/posts', data);
export const adminUpdatePost = (id, data) => api.put(`/admin/posts/${id}`, data);
export const adminDeletePost = (id) => api.delete(`/admin/posts/${id}`);
export const adminGetContactMessages = (params) => api.get('/admin/contact-messages', { params });

export default api;
