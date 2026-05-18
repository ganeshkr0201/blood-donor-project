import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

// ── Donors ────────────────────────────────────────────────────────────────────
export const donorAPI = {
  getAll: () => api.get('/api/donors'),
  register: (data) => api.post('/api/donors', data),
  update: (id, data) => api.put(`/api/donors/${id}`, data),
  delete: (id) => api.delete(`/api/donors/${id}`),
  search: (params) => api.get('/api/donors/search', { params }),
};

// ── Emergency Requests ────────────────────────────────────────────────────────
export const requestAPI = {
  getActive: () => api.get('/api/requests'),
  create: (data) => api.post('/api/requests', data),
  update: (id, data) => api.put(`/api/requests/${id}`, data),
  delete: (id) => api.delete(`/api/requests/${id}`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers: () => api.get('/api/admin/users'),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  toggleBlock: (id) => api.put(`/api/admin/users/${id}/toggle-block`),
  getAllRequests: () => api.get('/api/admin/requests'),
};

export default api;
