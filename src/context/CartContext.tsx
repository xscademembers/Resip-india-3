import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { cartApi, type AddToCartPayload } from '../api/cart';
import { settingsApi } from '../api/settings';
import { cartSessionStore } from '../api/client';
import type { ApiCart } from '../api/types';
import { useAuth } from './AuthContext';

/** Default pricing rules — overridden by admin Settings once they load. */
export const DEFAULT_TAX_PERCENT = 18;
export const DEFAULT_FREE_SHIPPING_THRESHOLD = 999;
export const DEFAULT_SHIPPING_CHARGE = 99;

interface PricingConfig {
  taxPercent: number;
  freeShippingThreshold: number;
  shippingCharge: number;
}

interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  totalItems: number;
}

/** A fully computed breakdown for a given discount, matching backend math. */
export interface TotalsBreakdown {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

interface CartContextValue extends CartTotals {
  cart: ApiCart;
  loading: boolean;
  taxPercent: number;
  /** Compute totals for an applied discount (mirrors the server order math). */
  getTotals: (discount?: number) => TotalsBreakdown;
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
  const [pricing, setPricing] = useState<PricingConfig>({
    taxPercent: DEFAULT_TAX_PERCENT,
    freeShippingThreshold: DEFAULT_FREE_SHIPPING_THRESHOLD,
    shippingCharge: DEFAULT_SHIPPING_CHARGE,
  });
  const { isAuthenticated } = useAuth();

  // Load admin-configured tax/shipping rules so the cart matches checkout.
  useEffect(() => {
    settingsApi
      .public()
      .then((s) => {
        setPricing({
          taxPercent: Number(s.tax_percent ?? DEFAULT_TAX_PERCENT),
          freeShippingThreshold: Number(s.free_shipping_threshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD),
          shippingCharge: Number(s.shipping_charge ?? DEFAULT_SHIPPING_CHARGE),
        });
      })
      .catch(() => {
        /* keep defaults */
      });
  }, []);

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

  const subtotal = useMemo(
    () => (cart.items || []).reduce((sum, i) => sum + i.price * i.quantity, 0),
    [cart]
  );
  const totalItems = useMemo(
    () => (cart.items || []).reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );

  // Mirrors the backend order math: discount applies before tax; free shipping
  // is decided on the (pre-discount) subtotal.
  const getTotals = useCallback(
    (discount = 0): TotalsBreakdown => {
      const safeDiscount = Math.min(Math.max(discount, 0), subtotal);
      const afterDiscount = subtotal - safeDiscount;
      const tax = Math.round((afterDiscount * pricing.taxPercent) / 100);
      const shipping =
        subtotal === 0 || subtotal >= pricing.freeShippingThreshold ? 0 : pricing.shippingCharge;
      const total = afterDiscount + tax + shipping;
      return { subtotal, discount: safeDiscount, tax, shipping, total };
    },
    [subtotal, pricing]
  );

  const base = getTotals(0);

  const value: CartContextValue = {
    cart,
    loading,
    taxPercent: pricing.taxPercent,
    getTotals,
    addItem,
    updateItem,
    removeItem,
    clear,
    refresh,
    subtotal,
    tax: base.tax,
    shipping: base.shipping,
    total: base.total,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
