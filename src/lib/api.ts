import axios from 'axios';

const baseURL = import.meta.env.DEV ? 'http://localhost:4000/api' : '/api';
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  let token: string | null = null;
  try {
    const stored = localStorage.getItem('eventa-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      token = parsed?.state?.token || null;
    }
  } catch {}
  if (!token) {
    token = localStorage.getItem('eventa-token');
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('eventa-storage');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
