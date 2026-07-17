import apiClient from './client';
import type { Pagination } from './types';

export interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  monthlyRevenue: Array<{ _id: any; total: number; count?: number }>;
  topProducts: any[];
  lowStockProducts: any[];
  ordersByStatus: Record<string, number>;
}

type Paged<K extends string> = { success: boolean; pagination: Pagination } & {
  [P in K]: any[];
};

export const adminApi = {
  dashboard: () =>
    apiClient.get<{ success: boolean; dashboard: DashboardData }>('/admin/dashboard').then((r) => r.data.dashboard),

  // Products
  products: (params: Record<string, any> = {}) =>
    apiClient.get<Paged<'products'>>('/admin/products', { params }).then((r) => r.data),
  createProduct: (data: any) =>
    apiClient.post('/admin/products', data).then((r) => r.data),
  updateProduct: (id: string, data: any) =>
    apiClient.put(`/admin/products/${id}`, data).then((r) => r.data),
  deleteProduct: (id: string) =>
    apiClient.delete(`/admin/products/${id}`).then((r) => r.data),
  uploadProductImages: (id: string, files: FormData) =>
    apiClient
      .post(`/admin/products/${id}/images`, files, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),

  // Categories
  createCategory: (data: any) => apiClient.post('/admin/categories', data).then((r) => r.data),
  updateCategory: (id: string, data: any) => apiClient.put(`/admin/categories/${id}`, data).then((r) => r.data),
  deleteCategory: (id: string) => apiClient.delete(`/admin/categories/${id}`).then((r) => r.data),

  // Orders
  orders: (params: Record<string, any> = {}) =>
    apiClient.get<Paged<'orders'>>('/admin/orders', { params }).then((r) => r.data),
  orderDetail: (id: string) =>
    apiClient.get<{ success: boolean; order: any }>(`/admin/orders/${id}`).then((r) => r.data.order),
  updateOrderStatus: (id: string, data: { status: string; trackingNumber?: string; note?: string }) =>
    apiClient.put(`/admin/orders/${id}/status`, data).then((r) => r.data),
  delhiveryPickupLocations: () =>
    apiClient
      .get<{ success: boolean; locations: string[]; default: string }>('/admin/delhivery/pickup-locations')
      .then((r) => r.data),
  shipWithDelhivery: (id: string, pickupLocation?: string) =>
    apiClient.post<{ success: boolean; message: string; order: any; delhivery: { waybill: string; trackingUrl: string } }>(
      `/admin/orders/${id}/ship-delhivery`,
      pickupLocation ? { pickupLocation } : {}
    ).then((r) => r.data),

  // Customers
  customers: (params: Record<string, any> = {}) =>
    apiClient.get<Paged<'customers'>>('/admin/customers', { params }).then((r) => r.data),
  customerDetail: (id: string) =>
    apiClient.get<{ success: boolean; customer: any; orders: any[] }>(`/admin/customers/${id}`).then((r) => r.data),

  // Coupons
  coupons: () => apiClient.get<{ success: boolean; coupons: any[] }>('/admin/coupons').then((r) => r.data.coupons),
  createCoupon: (data: any) => apiClient.post('/admin/coupons', data).then((r) => r.data),
  updateCoupon: (id: string, data: any) => apiClient.put(`/admin/coupons/${id}`, data).then((r) => r.data),
  deleteCoupon: (id: string) => apiClient.delete(`/admin/coupons/${id}`).then((r) => r.data),

  // Inventory
  inventory: () => apiClient.get<{ success: boolean; inventory: any[] }>('/admin/inventory').then((r) => r.data.inventory),
  updateInventory: (productId: string, data: { stock: number; lowStockThreshold?: number }) =>
    apiClient.put(`/admin/inventory/${productId}`, data).then((r) => r.data),

  // Reviews
  reviews: (params: Record<string, any> = {}) =>
    apiClient.get<Paged<'reviews'>>('/admin/reviews', { params }).then((r) => r.data),
  updateReview: (id: string, data: { isApproved: boolean }) =>
    apiClient.put(`/admin/reviews/${id}`, data).then((r) => r.data),
  deleteReview: (id: string) => apiClient.delete(`/admin/reviews/${id}`).then((r) => r.data),

  // Banners
  banners: () => apiClient.get<{ success: boolean; banners: any[] }>('/admin/banners').then((r) => r.data.banners),
  createBanner: (data: any) => apiClient.post('/admin/banners', data).then((r) => r.data),
  updateBanner: (id: string, data: any) => apiClient.put(`/admin/banners/${id}`, data).then((r) => r.data),
  deleteBanner: (id: string) => apiClient.delete(`/admin/banners/${id}`).then((r) => r.data),

  // Settings
  settings: () => apiClient.get<{ success: boolean; settings: any }>('/admin/settings').then((r) => r.data.settings),
  updateSettings: (data: any) =>
    apiClient.put<{ success: boolean; settings: any }>('/admin/settings', data).then((r) => r.data.settings),

  // Payments
  payments: (params: Record<string, any> = {}) =>
    apiClient.get<Paged<'payments'>>('/admin/payments', { params }).then((r) => r.data),
};
