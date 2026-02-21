import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data)
};

export const taskAPI = {
  getAll: (params) => api.get('/api/tasks', { params }),
  getOne: (id) => api.get(`/api/tasks/${id}`),
  create: (data) => api.post('/api/tasks', data),
  update: (id, data) => api.put(`/api/tasks/${id}`, data),
  delete: (id) => api.delete(`/api/tasks/${id}`)
};

export const userAPI = {
  getProfile: () => api.get('/api/users/me'),
  updateProfile: (data) => api.put('/api/users/me', data)
};

export const healthAPI = {
  check: () => api.get('/health')
};

export default api;
