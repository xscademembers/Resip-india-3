/** Shared types mirroring the backend Mongoose models / API responses. */

export interface ApiCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface ApiGlassSetPricing {
  format?: '24' | '612';
  setOf2?: number;
  setOf4?: number;
  setOf6?: number;
  setOf12?: number;
}

export interface ApiProduct {
  _id: string;
  legacyId?: string;
  slug: string;
  name: string;
  description: string;
  story?: string;
  features?: string[];
  whyChooseHeading?: string;
  category?: ApiCategory | string;
  categoryName?: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  /** Virtual: first image. */
  image?: string;
  images?: string[];
  beforeImage?: string;
  glassSetPricing?: ApiGlassSetPricing;
  fragrances?: string[];
  labelImageSurcharge?: number;
  usageTips?: string[];
  stock: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  averageRating?: number;
  numReviews?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isEmailVerified?: boolean;
  avatar?: string;
}

export interface ApiCartItem {
  _id: string;
  product: ApiProduct;
  quantity: number;
  setSize?: number;
  fragrance?: string;
  labelType?: string;
  price: number;
}

export interface ApiCart {
  _id?: string;
  items: ApiCartItem[];
  totalItems?: number;
  subtotal?: number;
}

export interface ApiAddress {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  landmark?: string;
  type?: 'home' | 'office' | 'other';
  isDefault?: boolean;
}

export interface ApiOrderItem {
  product: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  setSize?: number;
  fragrance?: string;
  labelType?: string;
  subtotal: number;
}

export interface ApiOrder {
  _id: string;
  orderId: string;
  items: ApiOrderItem[];
  shippingAddress?: Record<string, any>;
  subtotal: number;
  taxAmount: number;
  taxPercent?: number;
  shippingCharge: number;
  couponDiscount?: number;
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus: string;
  trackingNumber?: string;
  statusHistory?: Array<{ status: string; timestamp: string; note?: string }>;
  createdAt: string;
}

export interface ApiReview {
  _id: string;
  user?: { name: string; avatar?: string };
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isVerifiedPurchase?: boolean;
  createdAt: string;
}
