import axios, { type AxiosError, type AxiosInstance } from 'axios';

/**
 * Base axios instance for the ReSip India API.
 *
 * - In development, requests hit `/api` and Vite proxies them to the
 *   Express server (see `vite.config.ts`).
 * - In production, the API is served from the same origin as the SPA.
 * - `VITE_API_URL` can override the base URL (e.g. a separate API domain).
 */
const baseURL = (import.meta.env.VITE_API_URL as string | undefined) || '/api';

const TOKEN_KEY = 'resip_token';
const CART_SESSION_KEY = 'resip_cart_session';
const GUEST_CART_KEY = 'resip_guest_cart';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const cartSessionStore = {
  get: () => localStorage.getItem(CART_SESSION_KEY),
  set: (id: string) => localStorage.setItem(CART_SESSION_KEY, id),
  clear: () => localStorage.removeItem(CART_SESSION_KEY),
};

/** Persists guest cart items locally so they survive refresh and signup. */
export const guestCartStore = {
  get: (): string | null => localStorage.getItem(GUEST_CART_KEY),
  set: (cartJson: string) => localStorage.setItem(GUEST_CART_KEY, cartJson),
  clear: () => localStorage.removeItem(GUEST_CART_KEY),
};

const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT + guest cart session to every request.
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const cartSession = cartSessionStore.get();
  if (cartSession) {
    config.headers['x-cart-session'] = cartSession;
  }
  return config;
});

/** Normalised error shape surfaced to the UI. */
export interface ApiErrorShape {
  message: string;
  status?: number;
  errors?: Array<{ field?: string; message: string }>;
}

apiClient.interceptors.response.use(
  (response) => {
    const sessionId = response.headers['x-cart-session'];
    if (typeof sessionId === 'string' && sessionId) {
      cartSessionStore.set(sessionId);
    }
    return response;
  },
  (error: AxiosError<{ message?: string; errors?: any[] }>) => {
    // Clear a stale JWT so guests can keep browsing. Do NOT hard-redirect to
    // /login — that yanked visitors off the homepage whenever /auth/me failed.
    // ProtectedRoute still sends users to login only when they open account pages.
    if (error.response?.status === 401 && tokenStore.get()) {
      tokenStore.clear();
    }
    const normalised: ApiErrorShape = {
      message:
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.',
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };
    return Promise.reject(normalised);
  }
);

export default apiClient;
