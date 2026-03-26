import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export const api: AxiosInstance = axios.create({
  baseURL: `${BASE}/api`,
  withCredentials: true,
});

// Attach access token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
let refreshing = false;
let waitQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }
    if (refreshing) {
      return new Promise((resolve) => {
        waitQueue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    original._retry = true;
    refreshing = true;

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const { data } = await axios.post(`${BASE}/api/auth/refresh`, { refreshToken }, { withCredentials: true });
      const newAccess = data.data.accessToken;
      localStorage.setItem('accessToken',  newAccess);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      waitQueue.forEach((cb) => cb(newAccess));
      waitQueue = [];
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return Promise.reject(error);
    } finally {
      refreshing = false;
    }
  },
);
