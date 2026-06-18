import apiClient from './client';
import type { ApiProduct, ApiReview, Pagination } from './types';

export interface ProductQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export const productsApi = {
  list: (params: ProductQuery = {}) =>
    apiClient
      .get<{ success: boolean; products: ApiProduct[]; pagination: Pagination }>('/products', { params })
      .then((r) => r.data),

  featured: (limit = 8) =>
    apiClient
      .get<{ success: boolean; products: ApiProduct[] }>('/products/featured', { params: { limit } })
      .then((r) => r.data),

  trending: (limit = 8) =>
    apiClient
      .get<{ success: boolean; products: ApiProduct[] }>('/products/trending', { params: { limit } })
      .then((r) => r.data),

  get: (slugOrId: string) =>
    apiClient
      .get<{ success: boolean; product: ApiProduct }>(`/products/${slugOrId}`)
      .then((r) => r.data),

  reviews: (id: string, page = 1) =>
    apiClient
      .get<{ success: boolean; reviews: ApiReview[]; pagination: Pagination }>(`/products/${id}/reviews`, {
        params: { page },
      })
      .then((r) => r.data),

  addReview: (id: string, data: { rating: number; title?: string; comment?: string; images?: string[] }) =>
    apiClient.post(`/products/${id}/reviews`, data).then((r) => r.data),
};

export const categoriesApi = {
  list: () =>
    apiClient.get<{ success: boolean; categories: any[] }>('/categories').then((r) => r.data),
};
