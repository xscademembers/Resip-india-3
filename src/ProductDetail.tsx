import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, Recycle, ChevronRight } from 'lucide-react';
import { PRODUCTS, formatInr, getProductPriceCaption, sellsGlassPacks } from './constants';
import type { GlassPackSize } from './constants';
import { BeforeAfterSlider, GlassPackPicker } from './components';

const ProductDetail = () => {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [packSize, setPackSize] = useState<GlassPackSize>(4);

  const isGlassPacks = product ? sellsGlassPacks(product) : false;
  const unitPrice = useMemo(() => {
    if (!product?.glassPackPricing) return product?.price ?? 0;
    return packSize === 4 ? product.glassPackPricing.packOf4 : product.glassPackPricing.packOf6;
  }, [product, packSize]);

  useEffect(() => {
    setPackSize(4);
    setQuantity(1);
  }, [id]);

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
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/5] rounded-3xl overflow-hidden bg-brand-bg shadow-xl"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            {/* Transformation Visual */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">The Transformation</h3>
              <BeforeAfterSlider 
                before={product.beforeImage || "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800"}
                after={product.image}
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
              {isGlassPacks && product.glassPackPricing ? (
                <p className="text-3xl font-display font-bold text-[var(--color-brand-blue)]">
                  Starting from ₹{formatInr(product.price)}
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
                {isGlassPacks ? `Glass Features – ${product.name}` : `Features – ${product.name}`}
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
            <div className="pt-10 border-t border-black/5 space-y-6">
              {isGlassPacks && product.glassPackPricing ? (
                <GlassPackPicker
                  packOf4={product.glassPackPricing.packOf4}
                  packOf6={product.glassPackPricing.packOf6}
                  selected={packSize}
                  onChange={setPackSize}
                />
              ) : null}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40">
                    {isGlassPacks ? 'Number of sets' : 'Quantity'}
                  </span>
                  <div className="flex items-center rounded-full border border-black/10 px-4 py-2">
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

              {isGlassPacks ? (
                <p className="text-sm text-charcoal/60" aria-live="polite">
                  <span className="font-semibold text-charcoal">Line total: </span>
                  ₹{formatInr(unitPrice * quantity)} ({quantity} set{quantity > 1 ? 's' : ''} at ₹
                  {formatInr(unitPrice)} each)
                </p>
              ) : null}
              
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
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
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
