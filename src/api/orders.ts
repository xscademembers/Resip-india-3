import apiClient from './client';
import type { ApiOrder } from './types';

export interface CreateOrderPayload {
  shippingAddress: Record<string, any>;
  billingAddress?: Record<string, any>;
  couponCode?: string;
  paymentMethod?: string;
  guestEmail?: string;
  carbonPointsToUse?: number;
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    apiClient
      .post<{ success: boolean; order: ApiOrder; accessToken?: string }>('/orders', payload)
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<{ success: boolean; order: ApiOrder }>(`/orders/${id}`).then((r) => r.data.order),

  confirm: (orderId: string, token: string) =>
    apiClient
      .get<{ success: boolean; order: ApiOrder }>(`/orders/confirm/${encodeURIComponent(orderId)}`, {
        params: { token },
      })
      .then((r) => r.data.order),

  cancel: (id: string) =>
    apiClient.put<{ success: boolean; order: ApiOrder }>(`/orders/${id}/cancel`).then((r) => r.data.order),
};

export interface ValidatedCoupon {
  code: string;
  type: string;
  value: number;
  discount: number;
  description?: string;
}

export const couponsApi = {
  validate: (code: string, orderTotal: number) =>
    apiClient
      .post<{ success: boolean; coupon: ValidatedCoupon }>('/coupons/validate', { code, orderTotal })
      .then((r) => ({ discount: r.data.coupon.discount, coupon: r.data.coupon })),
};

export const paymentsApi = {
  initiate: (orderId: string) =>
    apiClient
      .post<{
        success: boolean;
        paymentSessionId: string;
        cfOrderId: string;
        merchantOrderId: string;
        accessToken?: string;
        orderId?: string;
      }>('/payments/initiate', { orderId })
      .then((r) => r.data),

  status: (transactionId: string, token?: string) =>
    apiClient
      .get<{
        success: boolean;
        payment: {
          status: string;
          order?: ApiOrder & { accessToken?: string; isGuest?: boolean };
          transactionId: string;
        };
      }>(`/payments/status/${transactionId}`, {
        params: token ? { token } : undefined,
      })
      .then((r) => r.data),
};
