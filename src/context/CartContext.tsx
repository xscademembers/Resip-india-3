import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { cartApi, type AddToCartPayload } from '../api/cart';
import { cartSessionStore } from '../api/client';
import type { ApiCart } from '../api/types';
import { useAuth } from './AuthContext';

/** Pricing rules mirror the backend order controller. */
export const TAX_PERCENT = 18;
export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_CHARGE = 99;

interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  totalItems: number;
}

interface CartContextValue extends CartTotals {
  cart: ApiCart;
  loading: boolean;
  addItem: (payload: AddToCartPayload) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

const emptyCart: ApiCart = { items: [] };

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ApiCart>(emptyCart);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await cartApi.get();
      setCart(next || emptyCart);
    } catch {
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload the cart whenever the auth state changes (login/logout). On login we
  // also try to merge any known guest session into the user's cart.
  useEffect(() => {
    const sync = async () => {
      if (isAuthenticated) {
        const guestSession = cartSessionStore.get();
        if (guestSession) {
          try {
            await cartApi.merge(guestSession);
          } catch {
            /* best effort */
          }
          cartSessionStore.clear();
        }
      }
      await refresh();
    };
    sync();
  }, [isAuthenticated, refresh]);

  const addItem = useCallback(async (payload: AddToCartPayload) => {
    const next = await cartApi.add(payload);
    setCart(next || emptyCart);
  }, []);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    const next = await cartApi.update(itemId, quantity);
    setCart(next || emptyCart);
  }, []);

  const removeItem = useCallback(async (itemId: string) => {
    const next = await cartApi.remove(itemId);
    setCart(next || emptyCart);
  }, []);

  const clear = useCallback(async () => {
    await cartApi.clear();
    setCart(emptyCart);
  }, []);

  const totals = useMemo<CartTotals>(() => {
    const items = cart.items || [];
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const tax = Math.round((subtotal * TAX_PERCENT) / 100);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const total = subtotal + tax + shipping;
    return { subtotal, tax, shipping, total, totalItems };
  }, [cart]);

  const value: CartContextValue = {
    cart,
    loading,
    addItem,
    updateItem,
    removeItem,
    clear,
    refresh,
    ...totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
