import apiClient from './client';
import type { ApiCart } from './types';

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
  setSize?: number;
  fragrance?: string;
  labelType?: string;
}

type CartResponse = { success: boolean; cart: ApiCart };

export const cartApi = {
  get: () => apiClient.get<CartResponse>('/cart').then((r) => r.data.cart),

  add: (payload: AddToCartPayload) =>
    apiClient.post<CartResponse>('/cart', payload).then((r) => r.data.cart),

  update: (itemId: string, quantity: number) =>
    apiClient.put<CartResponse>(`/cart/${itemId}`, { quantity }).then((r) => r.data.cart),

  remove: (itemId: string) =>
    apiClient.delete<CartResponse>(`/cart/${itemId}`).then((r) => r.data.cart),

  clear: () => apiClient.delete('/cart').then((r) => r.data),

  merge: (sessionId: string) =>
    apiClient.post<CartResponse>('/cart/merge', { sessionId }).then((r) => r.data),
};
