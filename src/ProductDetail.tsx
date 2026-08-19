import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, Recycle } from 'lucide-react';
import {
  PRODUCTS,
  formatInr,
  getCandleUsageTips,
  getGlassSetEntryPrice,
  getProductGalleryImages,
  getProductPriceCaption,
  getShopCategoryPath,
  getVisibleProducts,
  isCandleProduct,
  isProductVisible,
  sellsGlassSets,
} from './constants';
import type { GlassSetSize } from './constants';
import { productsApi } from './api/products';
import { mapApiProduct, type ShopProduct } from './api/mapProduct';
import { useCart } from './context/CartContext';
import { useToast } from './context/ToastContext';
import SEOHead from './components/SEOHead';
import {
  BeforeAfterSlider,
  CandleDualImageHover,
  CandleLabelPicker,
  FragrancePicker,
  GlassPackPicker,
  ProductImageCarousel,
} from './components';
import type { CandleLabelType } from './components';
import OptimizedImage from './OptimizedImage';
import { optimizedSrc, IMG_WIDTHS } from './image-utils';

const ProductDetail = () => {
  const { id } = useParams();
  const [setSize, setSetSize] = useState<GlassSetSize>(() => {
    const p = PRODUCTS.find((x) => x.id === id);
    return p?.glassSetPricing?.format === '612' ? 6 : 2;
  });
  const [quantity, setQuantity] = useState(1);
  const [fragrance, setFragrance] = useState('');
  const [labelType, setLabelType] = useState<CandleLabelType>('text');
  const { addItem } = useCart();
  const toast = useToast();

  // Fetch the live product so we can target the cart API by Mongo _id. The
  // constants entry is still used for the rich UI when present.
  const [apiProduct, setApiProduct] = useState<ShopProduct | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let active = true;
    setApiProduct(null);
    if (!id) return;
    productsApi
      .get(id)
      .then((res) => {
        if (active) setApiProduct(mapApiProduct(res.product));
      })
      .catch(() => {
        /* product may only exist in constants */
      });
    return () => {
      active = false;
    };
  }, [id]);

  const constantsProduct = PRODUCTS.find((p) => p.id === id && isProductVisible(p));
  const product = constantsProduct ?? apiProduct ?? undefined;

  const handleAddToCart = async () => {
    if (!apiProduct?._id) {
      toast.error('This product is not available for online ordering yet.');
      return;
    }
    setAdding(true);
    try {
      await addItem({
        productId: apiProduct._id,
        quantity,
        setSize: sellsGlassSets(apiProduct) ? setSize : undefined,
        fragrance: fragrance || undefined,
        labelType: product?.labelImageSurcharge != null ? labelType : undefined,
      });
      toast.success(`${apiProduct.name} added to cart`);
    } catch (err: any) {
      toast.error(err?.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  const isCandle = product ? isCandleProduct(product) : false;
  const isSetSku = product ? sellsGlassSets(product) : false;
  const labelSurcharge =
    isCandle && labelType === 'image' ? (product?.labelImageSurcharge ?? 0) : 0;
  const unitPrice = useMemo(() => {
    if (!product?.glassSetPricing) return (product?.price ?? 0) + labelSurcharge;
    const p = product.glassSetPricing;
    let base = 0;
    if (p.format === '24') {
      base = setSize === 4 ? p.setOf4 : p.setOf2;
    } else {
      base = setSize === 12 ? p.setOf12 : p.setOf6;
    }
    return base + labelSurcharge;
  }, [product, setSize, labelSurcharge]);

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    if (!product?.fragrances?.length) {
      setFragrance('');
      return;
    }
    setFragrance(product.fragrances[0]);
  }, [id, product?.fragrances]);

  useEffect(() => {
    setLabelType('text');
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
  const usageTips = getCandleUsageTips(product);
  const featuresHeading = isCandle
    ? `Features – ${product.name}`
    : isSetSku
      ? `Glass Features – ${product.name}`
      : `Features – ${product.name}`;
  const whyChooseHeading =
    product.whyChooseHeading ??
    (isCandle ? 'Why Choose Our ReSip Scented Candles?' : 'Why Choose Our Upcycled Glasses?');

  return (
    <div className="pt-40 pb-32 px-6 bg-white">
      <SEOHead
        title={product.name}
        description={product.description || `${product.name} handcrafted upcycled glassware from ReSip India.`}
        image={getProductGalleryImages(product)[0]}
        type="product"
      />
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-12">
          <Link to="/shop" className="flex items-center gap-2 text-charcoal/40 hover:text-brand-blue transition-colors text-sm font-bold uppercase tracking-widest">
            <ChevronLeft size={16} /> Back to Collection
          </Link>
          <Link
            to={getShopCategoryPath(product.category)}
            className="mt-3 inline-block text-xs font-bold uppercase tracking-widest text-charcoal/40 hover:text-brand-blue transition-colors"
          >
            View all in {product.category}
          </Link>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[35fr_65fr] lg:gap-16">
          {/* Image Gallery */}
          <div className="w-full min-w-0 space-y-8">
            {isCandle ? (
              <CandleDualImageHover product={product} variant="detail" />
            ) : (
              <ProductImageCarousel product={product} />
            )}

            {/* Transformation Visual */}
            {product.beforeImage ? (
              <div className="w-full space-y-6">
                <h3 className="text-2xl font-bold">The Transformation</h3>
                <BeforeAfterSlider
                  before={optimizedSrc(product.beforeImage, IMG_WIDTHS.CARD)}
                  after={optimizedSrc(getProductGalleryImages(product)[0], IMG_WIDTHS.CARD)}
                  className="aspect-square bg-white shadow-lg"
                />
              </div>
            ) : null}
          </div>

          {/* Product Info */}
          <div className="w-full min-w-0 space-y-10">
            <div>
              <Link
                to={getShopCategoryPath(product.category)}
                className="text-brand-gold font-display font-bold tracking-[0.3em] uppercase text-xs mb-4 block hover:text-brand-blue transition-colors"
              >
                {product.category}
              </Link>
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
                {featuresHeading}
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
                {whyChooseHeading}
              </h4>
              <div className="space-y-4 text-charcoal/70 font-light leading-relaxed">
                {storyParagraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {isCandle ? (
              <section aria-labelledby="candle-usage-heading">
                <details className="group rounded-3xl border border-brand-blue/10 bg-white shadow-sm open:shadow-md motion-reduce:open:shadow-sm">
                  <summary
                    id="candle-usage-heading"
                    className="cursor-pointer list-none px-6 py-5 font-display text-lg font-bold text-charcoal marker:content-none md:px-8 md:py-6 md:text-xl [&::-webkit-details-marker]:hidden"
                  >
                    <span className="flex items-start justify-between gap-4">
                      <span>Usage tips</span>
                      <span
                        className="mt-1 shrink-0 text-brand-blue transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none motion-reduce:group-open:rotate-0"
                        aria-hidden
                      >
                        ▾
                      </span>
                    </span>
                  </summary>
                  <div className="border-t border-brand-blue/10 px-6 pb-6 pt-4 md:px-8 md:pb-8">
                    <ul className="space-y-4">
                      {usageTips.map((tip) => (
                        <li
                          key={tip}
                          className="flex gap-4 text-sm font-light leading-relaxed text-charcoal/75 md:text-base"
                        >
                          <span
                            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-gold"
                            aria-hidden
                          />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              </section>
            ) : null}

            {/* Add to Cart Section */}
            <div className="pt-10 border-t border-brand-blue/10 space-y-6">
              {isSetSku && product.glassSetPricing ? (
                <GlassPackPicker
                  pricing={product.glassSetPricing}
                  selected={setSize}
                  onChange={setSetSize}
                />
              ) : null}

              {product.fragrances?.length ? (
                <FragrancePicker
                  fragrances={product.fragrances}
                  selected={fragrance}
                  onChange={setFragrance}
                />
              ) : null}

              {product.labelImageSurcharge != null ? (
                <CandleLabelPicker
                  surcharge={product.labelImageSurcharge}
                  selected={labelType}
                  onChange={setLabelType}
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
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex flex-1 items-center justify-center gap-3 rounded-full bg-brand-blue py-5 text-lg font-bold text-white shadow-xl shadow-brand-blue/20 transition-all duration-500 hover:bg-brand-gold disabled:opacity-60"
                >
                  <ShoppingCart size={20} /> {adding ? 'Adding…' : 'Add to Cart'}
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
            {getVisibleProducts().filter(p => p.id !== id).slice(0, 4).map(p => (
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
