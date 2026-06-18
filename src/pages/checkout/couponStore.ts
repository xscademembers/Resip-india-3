/** Persists an applied coupon between the Cart and Checkout pages (session only). */
const KEY = 'resip_coupon';

export interface AppliedCoupon {
  code: string;
  discount: number;
}

export const couponStore = {
  get(): AppliedCoupon | null {
    try {
      const raw = sessionStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AppliedCoupon) : null;
    } catch {
      return null;
    }
  },
  set(coupon: AppliedCoupon) {
    sessionStorage.setItem(KEY, JSON.stringify(coupon));
  },
  clear() {
    sessionStorage.removeItem(KEY);
  },
};
