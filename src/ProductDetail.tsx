import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, Recycle } from 'lucide-react';
import {
  PRODUCTS,
  formatInr,
  getGlassSetEntryPrice,
  getProductGalleryImages,
  getProductPriceCaption,
  sellsGlassSets,
} from './constants';
import type { GlassSetSize } from './constants';
import { BeforeAfterSlider, GlassPackPicker, ProductImageCarousel } from './components';
import OptimizedImage from './OptimizedImage';
import { optimizedSrc, IMG_WIDTHS } from './image-utils';

const ProductDetail = () => {
  const { id } = useParams();
  const [setSize, setSetSize] = useState<GlassSetSize>(() => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p?.glassSetPricing?.format === '612' ? 6 : 2;
  });
  const [quantity, setQuantity] = useState(1);
  const product = PRODUCTS.find((p) => p.id === id);

  const isSetSku = product ? sellsGlassSets(product) : false;
  const unitPrice = useMemo(() => {
    if (!product?.glassSetPricing) return product?.price ?? 0;
    const p = product.glassSetPricing;
    if (p.format === '24') {
      return setSize === 4 ? p.setOf4 : p.setOf2;
    }
    return setSize === 12 ? p.setOf12 : p.setOf6;
  }, [product, setSize]);

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    if (!product?.glassSetPricing) return;
    setSetSize(product.glassSetPricing.format === '24' ? 2 : 6);
  }, [id, product?.glassSetPricing]);

  if (!product) return <div className="pt-40 text-center">Product not found.</div>;
  const storyParagraphs = product.story
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="pt-32 pb-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-12">
          <Link to="/shop" className="flex items-center gap-2 text-charcoal/40 hover:text-brand-blue transition-colors text-sm font-bold uppercase tracking-widest">
            <ChevronLeft size={16} /> Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Image Gallery */}
          <div className="space-y-8">
            <ProductImageCarousel product={product} />

            {/* Transformation Visual */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">The Transformation</h3>
              <BeforeAfterSlider 
                before={optimizedSrc(product.beforeImage || 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800', IMG_WIDTHS.CARD)}
                after={optimizedSrc(getProductGalleryImages(product)[0], IMG_WIDTHS.CARD)}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-10">
            <div>
              <span className="text-brand-gold font-display font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                {product.category}
              </span>
              <h1 className="text-5xl md:text-6xl mb-6">{product.name}</h1>
              {isSetSku && product.glassSetPricing ? (
                <p className="text-3xl font-display font-bold text-[var(--color-brand-blue)]">
                  Starting from ₹{formatInr(getGlassSetEntryPrice(product.glassSetPricing))}
                </p>
              ) : (
                <p className="text-3xl font-display font-bold text-[var(--color-brand-blue)]">
                  ₹{formatInr(product.price)}
                </p>
              )}
            </div>

            {product.description.trim() ? (
              <p className="text-lg text-charcoal/70 leading-relaxed font-light">
                {product.description}
              </p>
            ) : null}

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-charcoal/40">
                {isSetSku ? `Glass Features – ${product.name}` : `Features – ${product.name}`}
              </h4>
              <ul className="grid grid-cols-2 gap-4">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-charcoal/80">
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-widest text-charcoal/40">
                {product.whyChooseHeading ?? 'Why Choose Our Upcycled Glasses?'}
              </h4>
              <div className="space-y-4 text-charcoal/70 font-light leading-relaxed">
                {storyParagraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="pt-10 border-t border-brand-blue/10 space-y-6">
              {isSetSku && product.glassSetPricing ? (
                <GlassPackPicker
                  pricing={product.glassSetPricing}
                  selected={setSize}
                  onChange={setSetSize}
                />
              ) : null}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40">
                    {isSetSku ? 'Number of sets' : 'Quantity'}
                  </span>
                  <div className="flex items-center rounded-full border border-brand-blue/15 px-4 py-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:text-brand-blue"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:text-brand-blue"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-3 rounded-full bg-brand-blue py-5 text-lg font-bold text-white shadow-xl shadow-brand-blue/20 transition-all duration-500 hover:bg-brand-gold"
                >
                  <ShoppingCart size={20} /> Add to Cart
                </button>
              </div>

              {isSetSku ? (
                <p className="text-sm text-charcoal/60" aria-live="polite">
                  <span className="font-semibold text-charcoal">Line total: </span>
                  ₹{formatInr(unitPrice * quantity)} ({quantity} set{quantity > 1 ? 's' : ''} · set of {setSize} at ₹
                  {formatInr(unitPrice)} each)
                </p>
              ) : (
                <p className="text-sm text-charcoal/60" aria-live="polite">
                  <span className="font-semibold text-charcoal">Line total: </span>₹
                  {formatInr(unitPrice * quantity)} ({quantity} at ₹{formatInr(unitPrice)} each)
                </p>
              )}
              
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center text-center gap-2 p-4 bg-brand-bg rounded-2xl">
                  <Truck size={20} className="text-brand-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 bg-brand-bg rounded-2xl">
                  <ShieldCheck size={20} className="text-brand-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-4 bg-brand-bg rounded-2xl">
                  <Recycle size={20} className="text-brand-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60">Eco-Friendly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-32">
          <h2 className="text-3xl font-bold mb-12">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {PRODUCTS.filter(p => p.id !== id).slice(0, 4).map(p => (
              <Link key={p.id} to={`/product/${p.id}`} onClick={() => window.scrollTo(0, 0)}>
                <div className="group space-y-4">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-brand-bg">
                    <OptimizedImage src={p.image} displayWidth={IMG_WIDTHS.RELATED} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div>
                    <h4 className="font-bold group-hover:text-brand-blue transition-colors">{p.name}</h4>
                    <p className="text-sm text-charcoal/60">{getProductPriceCaption(p)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
