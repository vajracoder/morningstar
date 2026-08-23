// ============================================================
// MORNINGSTAR — AXIOS API CLIENT
// All API calls go through this client. Never call axios directly in components.
// ============================================================

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios';
import type { ApiError } from '@/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Create the Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ----- Request Interceptor: Attach Auth Token -----
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----- Response Interceptor: Handle Auth Errors -----
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired — clear storage and redirect to login
      localStorage.removeItem('kp_token');
      localStorage.removeItem('kp_user');
      window.location.href = '/login';
    }
    const apiError: ApiError = {
      message:
        (error.response?.data as Record<string, string>)?.message ||
        error.message ||
        'An unexpected error occurred.',
      code: String(error.response?.status || 'NETWORK_ERROR'),
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  }
);

// ----- Generic request helper -----
export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient(config);
  return response.data;
}

export default apiClient;
