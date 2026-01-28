import axios from 'axios';

// Ensure this matches your backend port (9999)
const api = axios.create({
  baseURL: 'http://localhost:9999/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Token to requests
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

export default api;