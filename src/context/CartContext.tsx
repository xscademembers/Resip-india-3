import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { cartApi, type AddToCartPayload } from '../api/cart';
import { settingsApi } from '../api/settings';
import { cartSessionStore, guestCartStore } from '../api/client';
import type { ApiCart } from '../api/types';
import { useAuth } from './AuthContext';

/** Default pricing rules   overridden by admin Settings once they load. */
export const DEFAULT_TAX_PERCENT = 18;
export const DEFAULT_FREE_SHIPPING_THRESHOLD = 999;
export const DEFAULT_SHIPPING_CHARGE = 50;
export const DEFAULT_COD_CHARGE = 50;

interface PricingConfig {
  taxPercent: number;
  freeShippingThreshold: number;
  shippingCharge: number;
  codCharge: number;
  codEnabled: boolean;
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
  codCharge: number;
  total: number;
}

interface CartContextValue extends CartTotals {
  cart: ApiCart;
  loading: boolean;
  taxPercent: number;
  codCharge: number;
  codEnabled: boolean;
  /** Compute totals for an applied discount (mirrors the server order math). */
  getTotals: (discount?: number, isCod?: boolean) => TotalsBreakdown;
  addItem: (payload: AddToCartPayload) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

const emptyCart: ApiCart = { items: [] };

function readGuestCartFromStorage(): ApiCart | null {
  try {
    const raw = guestCartStore.get();
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ApiCart;
    return parsed?.items ? parsed : null;
  } catch {
    return null;
  }
}

function persistGuestCart(cart: ApiCart) {
  guestCartStore.set(JSON.stringify(cart));
}

function clearGuestStorage() {
  cartSessionStore.clear();
  guestCartStore.clear();
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ApiCart>(emptyCart);
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<PricingConfig>({
    taxPercent: DEFAULT_TAX_PERCENT,
    freeShippingThreshold: DEFAULT_FREE_SHIPPING_THRESHOLD,
    shippingCharge: DEFAULT_SHIPPING_CHARGE,
    codCharge: DEFAULT_COD_CHARGE,
    codEnabled: true,
  });
  const { isAuthenticated, loading: authLoading } = useAuth();
  const wasAuthenticated = useRef(isAuthenticated);

  const applyCart = useCallback((next: ApiCart | null | undefined) => {
    const resolved = next || emptyCart;
    setCart(resolved);
    if (!isAuthenticated) {
      persistGuestCart(resolved);
    }
  }, [isAuthenticated]);

  // Load admin-configured tax/shipping rules so the cart matches checkout.
  useEffect(() => {
    settingsApi
      .public()
      .then((s) => {
        setPricing({
          taxPercent: Number(s.tax_percent ?? DEFAULT_TAX_PERCENT),
          freeShippingThreshold: Number(s.free_shipping_threshold ?? DEFAULT_FREE_SHIPPING_THRESHOLD),
          shippingCharge: Number(s.shipping_charge ?? DEFAULT_SHIPPING_CHARGE),
          codCharge: Number(s.cod_charge ?? DEFAULT_COD_CHARGE),
          codEnabled: s.cod_enabled === undefined ? true : Boolean(s.cod_enabled),
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
      applyCart(next);
    } catch {
      if (!isAuthenticated) {
        const cached = readGuestCartFromStorage();
        setCart(cached || emptyCart);
      } else {
        setCart(emptyCart);
      }
    } finally {
      setLoading(false);
    }
  }, [applyCart, isAuthenticated]);

  // Reload the cart whenever auth state changes. On login/signup we merge the
  // guest session stored in localStorage into the user's account cart.
  useEffect(() => {
    if (authLoading) return;

    const sync = async () => {
      const justAuthenticated = isAuthenticated && !wasAuthenticated.current;

      if (isAuthenticated) {
        if (justAuthenticated) {
          const guestSession = cartSessionStore.get();
          if (guestSession) {
            try {
              await cartApi.merge(guestSession);
            } catch {
              /* best effort */
            }
          }
          clearGuestStorage();
        }
        await refresh();
      } else {
        const cached = readGuestCartFromStorage();
        if (cached?.items?.length) {
          setCart(cached);
        }
        await refresh();
      }

      wasAuthenticated.current = isAuthenticated;
    };

    sync();
  }, [isAuthenticated, authLoading, refresh]);

  const addItem = useCallback(async (payload: AddToCartPayload) => {
    const next = await cartApi.add(payload);
    applyCart(next);
  }, [applyCart]);

  const updateItem = useCallback(async (itemId: string, quantity: number) => {
    const next = await cartApi.update(itemId, quantity);
    applyCart(next);
  }, [applyCart]);

  const removeItem = useCallback(async (itemId: string) => {
    const next = await cartApi.remove(itemId);
    applyCart(next);
  }, [applyCart]);

  const clear = useCallback(async () => {
    await cartApi.clear();
    setCart(emptyCart);
    if (!isAuthenticated) {
      guestCartStore.clear();
    }
  }, [isAuthenticated]);

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
    (discount = 0, isCod = false): TotalsBreakdown => {
      const safeDiscount = Math.min(Math.max(discount, 0), subtotal);
      const afterDiscount = subtotal - safeDiscount;
      const tax = Math.round((afterDiscount * pricing.taxPercent) / 100);
      const shipping =
        subtotal === 0 || subtotal >= pricing.freeShippingThreshold ? 0 : pricing.shippingCharge;
      const codCharge = isCod ? pricing.codCharge : 0;
      const total = afterDiscount + tax + shipping + codCharge;
      return { subtotal, discount: safeDiscount, tax, shipping, codCharge, total };
    },
    [subtotal, pricing]
  );

  const base = getTotals(0);

  const value: CartContextValue = {
    cart,
    loading,
    taxPercent: pricing.taxPercent,
    codCharge: pricing.codCharge,
    codEnabled: pricing.codEnabled,
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
