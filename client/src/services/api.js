// ============================================================
// Axios API Service - Centralized HTTP client
// ============================================================
import axios from 'axios';

let baseUrl = import.meta.env.VITE_API_URL || 'https://shopsphere-full-stack-mern-e-commerce.onrender.com/api';
if (baseUrl && !baseUrl.endsWith('/api') && !baseUrl.endsWith('/api/')) {
  baseUrl = baseUrl.replace(/\/$/, '') + '/api';
}
const API_URL = baseUrl;

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach JWT token ─────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: handle auth errors ─────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────
export const authAPI = {
  register: (data)    => api.post('/auth/register', data),
  login:    (data)    => api.post('/auth/login', data),
  getProfile: ()      => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ─── Products API ─────────────────────────────────────────
export const productsAPI = {
  getAll:      (params) => api.get('/products', { params }),
  getFeatured: ()       => api.get('/products/featured'),
  getById:     (id)     => api.get(`/products/${id}`),
  getCategories: ()     => api.get('/products/categories'),
};

// ─── Cart API ─────────────────────────────────────────────
export const cartAPI = {
  getCart:     ()             => api.get('/cart'),
  addToCart:   (data)         => api.post('/cart/add', data),
  updateItem:  (data)         => api.put('/cart/update', data),
  removeItem:  (productId)    => api.delete(`/cart/remove/${productId}`),
  clearCart:   ()             => api.delete('/cart/clear'),
};

// ─── Orders API ───────────────────────────────────────────
export const ordersAPI = {
  create:       (data) => api.post('/orders', data),
  getMyOrders:  ()     => api.get('/orders/my-orders'),
  getById:      (id)   => api.get(`/orders/${id}`),
};

// ─── Admin API ────────────────────────────────────────────
export const adminAPI = {
  // Stats
  getStats:          () => api.get('/admin/stats'),

  // Product Management
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Order Management
  getAllOrders:      () => api.get('/orders'),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}`, { status }),
  deleteOrder:       (id) => api.delete(`/orders/${id}`),

  // User Management
  getAllUsers:       () => api.get('/users'),
  deleteUser:        (id) => api.delete(`/users/${id}`),
};

export default api;
