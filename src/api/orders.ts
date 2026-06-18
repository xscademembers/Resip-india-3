import apiClient from './client';
import type { ApiOrder } from './types';

export interface CreateOrderPayload {
  shippingAddress: Record<string, any>;
  billingAddress?: Record<string, any>;
  couponCode?: string;
  paymentMethod?: string;
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    apiClient.post<{ success: boolean; order: ApiOrder }>('/orders', payload).then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ success: boolean; order: ApiOrder }>(`/orders/${id}`).then((r) => r.data.order),

  cancel: (id: string) =>
    apiClient.put<{ success: boolean; order: ApiOrder }>(`/orders/${id}/cancel`).then((r) => r.data.order),
};

export const couponsApi = {
  validate: (code: string) =>
    apiClient.post<{ success: boolean; discount: number; coupon: any }>('/coupons/validate', { code }).then((r) => r.data),
};

export const paymentsApi = {
  initiate: (orderId: string) =>
    apiClient.post<{ success: boolean; redirectUrl: string }>('/payments/initiate', { orderId }).then((r) => r.data),

  status: (transactionId: string) =>
    apiClient.get<{ success: boolean; status: string; order?: ApiOrder }>(`/payments/status/${transactionId}`).then((r) => r.data),
};
