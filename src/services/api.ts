import axios from 'axios';
import { ProductFilters } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jewelrocx_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  verifyEmail: (token: string) =>
    api.post(`/auth/verify-email/${token}`),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.put(`/auth/reset-password/${token}`, { password }),
};

export const productsAPI = {
  getProducts: (filters: ProductFilters = {}) =>
    api.get('/products', { params: filters }),
  getProduct: (id: string) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
};

export const ordersAPI = {
  createOrder: (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: object;
    orderNotes?: string;
  }) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`),
};

export default api;
