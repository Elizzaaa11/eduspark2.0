import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eduspark_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler — auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('eduspark_token');
      localStorage.removeItem('eduspark_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
