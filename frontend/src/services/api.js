import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Products API
export const productAPI = {
  getAll: () => api.get('/products'),
  getFeatured: () => api.get('/products/featured'),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getByCategory: (categorySlug) => api.get(`/categories/${categorySlug}/products`),
};

// Categories API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// Promotions API
export const promotionAPI = {
  getActive: () => api.get('/promotions'),
};

export default api;