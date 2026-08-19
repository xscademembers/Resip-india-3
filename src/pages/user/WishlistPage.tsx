import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { PageContainer, Spinner, EmptyState, inr } from '../../components/ui';
import { userApi } from '../../api/user';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import AccountNav from './AccountNav';
import SEOHead from '../../components/SEOHead';
import OptimizedImage from '../../OptimizedImage';
import { IMG_WIDTHS } from '../../image-utils';
import type { ApiProduct } from '../../api/types';
import type { ApiErrorShape } from '../../api/client';

export default function WishlistPage() {
  const toast = useToast();
  const { addItem } = useCart();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi
      .getWishlist()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const removeFromWishlist = async (productId: string) => {
    try {
      await userApi.toggleWishlist(productId);
      setProducts((p) => p.filter((x) => x._id !== productId));
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    }
  };

  const addToCart = async (product: ApiProduct) => {
    try {
      await addItem({ productId: product._id, quantity: 1 });
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    }
  };

  return (
    <PageContainer>
      <SEOHead title="My Wishlist" noindex />
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">My Account</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <AccountNav />
        </div>
        <div className="lg:col-span-3">
          <h2 className="mb-4 font-display text-xl font-bold text-brand-blue">Wishlist</h2>
          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<Heart size={48} />}
              title="Your wishlist is empty"
              description="Save your favourite pieces to find them here later."
              action={
                <Link
                  to="/shop"
                  className="inline-flex rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold"
                >
                  Explore Collection
                </Link>
              }
            />
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {products.map((product) => (
                <li key={product._id} className="flex gap-4 rounded-2xl border border-brand-blue/10 bg-white p-4 shadow-sm">
                  <OptimizedImage
                    src={product.image || product.images?.[0] || ''}
                    displayWidth={IMG_WIDTHS.MINI}
                    alt={product.name}
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <Link
                      to={`/product/${product.legacyId || product.slug}`}
                      className="font-display text-base font-bold leading-tight text-charcoal hover:text-brand-blue"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm font-bold text-brand-blue">{inr(product.price)}</p>
                    <div className="mt-auto flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="rounded-lg bg-brand-blue px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-gold"
                      >
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(product._id)}
                        className="rounded-lg p-1.5 text-charcoal/40 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
