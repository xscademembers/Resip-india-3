import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Search } from 'lucide-react';
import { ProductCard } from './components';
import {
  getVisibleProducts,
  SHOP_CATEGORY_FILTERS,
  getShopCategoryPath,
  resolveShopCategory,
  sortProductsForShop,
} from './constants';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const shouldReduceMotion = useReducedMotion();

  const activeCategory = useMemo(
    () => resolveShopCategory(searchParams.get('category')),
    [searchParams]
  );

  const categoryProducts =
    activeCategory === 'All'
      ? getVisibleProducts()
      : getVisibleProducts().filter((p) => p.category === activeCategory);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchedProducts = normalizedQuery
    ? categoryProducts.filter((product) => {
        const haystack = [
          product.name,
          product.description,
          product.category,
          product.story,
          ...(product.features ?? []),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : categoryProducts;

  const filteredProducts = sortProductsForShop(searchedProducts, activeCategory);

  return (
    <motion.div className="pt-40 pb-32 px-6 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl mb-6">The <span className="text-brand-blue">Collection</span></h1>
          <p className="text-charcoal/60 font-light max-w-2xl">Explore our range of designer glassware, each piece uniquely crafted from upcycled premium bottles.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-8 border-b border-brand-blue/10">
          <nav className="flex flex-wrap gap-4" aria-label="Shop categories">
            {SHOP_CATEGORY_FILTERS.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Link
                  key={cat}
                  to={getShopCategoryPath(cat)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-lg'
                      : 'bg-white text-charcoal/60 hover:bg-brand-blue/5'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </nav>

          <div className="relative w-full md:w-72">
            <label htmlFor="shop-search" className="sr-only">
              Search products
            </label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={18} aria-hidden />
            <input
              id="shop-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-brand-blue/10 bg-white py-3 pl-12 pr-6 text-sm transition-colors focus:border-brand-blue focus:outline-none"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-lg text-charcoal/40">
              {normalizedQuery
                ? `No products found for “${searchQuery.trim()}”.`
                : 'No products found in this category.'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Shop;
