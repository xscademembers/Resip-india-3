import type { Product } from '../constants';
import type { ApiProduct } from './types';

/** A storefront product that also carries its Mongo `_id` for cart/wishlist APIs. */
export type ShopProduct = Product & { _id: string };

/**
 * Maps a backend product document into the shape the existing storefront UI
 * (ProductCard, ProductDetail, helpers in constants.ts) already understands,
 * while preserving `_id` so cart and wishlist actions can target it.
 */
export function mapApiProduct(p: ApiProduct): ShopProduct {
  const categoryName =
    typeof p.category === 'object' && p.category ? p.category.name : p.categoryName || '';

  return {
    _id: p._id,
    id: p.legacyId || p.slug || p._id,
    name: p.name,
    price: p.price,
    category: categoryName,
    image: p.image || p.images?.[0] || '',
    images: p.images,
    beforeImage: p.beforeImage,
    description: p.description,
    story: p.story || '',
    features: p.features || [],
    whyChooseHeading: p.whyChooseHeading,
    glassSetPricing: p.glassSetPricing as Product['glassSetPricing'],
    fragrances: p.fragrances,
    labelImageSurcharge: p.labelImageSurcharge,
    usageTips: p.usageTips,
    hidden: false,
  };
}
