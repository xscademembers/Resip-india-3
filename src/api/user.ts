import apiClient from './client';
import type { ApiAddress, ApiOrder, ApiProduct, ApiUser } from './types';

export const userApi = {
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) =>
    apiClient.put<{ success: boolean; user: ApiUser }>('/users/profile', data).then((r) => r.data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.put<{ success: boolean; message: string }>('/users/password', data).then((r) => r.data),

  getAddresses: () =>
    apiClient.get<{ success: boolean; addresses: ApiAddress[] }>('/users/addresses').then((r) => r.data.addresses),

  addAddress: (data: Partial<ApiAddress>) =>
    apiClient.post<{ success: boolean; address: ApiAddress }>('/users/addresses', data).then((r) => r.data.address),

  updateAddress: (id: string, data: Partial<ApiAddress>) =>
    apiClient.put<{ success: boolean; address: ApiAddress }>(`/users/addresses/${id}`, data).then((r) => r.data.address),

  deleteAddress: (id: string) =>
    apiClient.delete(`/users/addresses/${id}`).then((r) => r.data),

  setDefaultAddress: (id: string) =>
    apiClient.put(`/users/addresses/${id}/default`).then((r) => r.data),

  getWishlist: () =>
    apiClient.get<{ success: boolean; products: ApiProduct[] }>('/users/wishlist').then((r) => r.data.products),

  toggleWishlist: (productId: string) =>
    apiClient.post<{ success: boolean; inWishlist: boolean }>(`/users/wishlist/${productId}`).then((r) => r.data),

  getOrders: () =>
    apiClient.get<{ success: boolean; orders: ApiOrder[] }>('/users/orders').then((r) => r.data.orders),
};
