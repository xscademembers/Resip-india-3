import apiClient from './client';
import type { ApiUser } from './types';

export interface AuthResponse {
  success: boolean;
  token: string;
  user: ApiUser;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: () => apiClient.post('/auth/logout').then((r) => r.data),

  me: () =>
    apiClient.get<{ success: boolean; user: ApiUser }>('/auth/me').then((r) => r.data),

  verifyEmail: (token: string) =>
    apiClient.get<{ success: boolean; message: string }>(`/auth/verify-email/${token}`).then((r) => r.data),

  forgotPassword: (email: string) =>
    apiClient.post<{ success: boolean; message: string }>('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, password: string) =>
    apiClient.put<AuthResponse>(`/auth/reset-password/${token}`, { password }).then((r) => r.data),
};
