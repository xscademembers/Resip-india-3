import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Search } from 'lucide-react';
import { ProductCard } from './components';
import { PRODUCTS } from './constants';

const SHOP_CATEGORY_FILTERS = [
  'All',
  'Upcycled Glass',
  'Shots',
  'Scented Candles',
  'Party Gift Box',
  'Corporate Gift Box',
  'Gift Box (Matchbox, Coasters, Bowls)',
  'Jars',
] as const;

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const param = searchParams.get('category');
    if (!param) {
      setActiveCategory('All');
      return;
    }
    if ((SHOP_CATEGORY_FILTERS as readonly string[]).includes(param)) {
      setActiveCategory(param);
    } else {
      setActiveCategory('All');
    }
  }, [searchParams]);

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <div className="pt-32 pb-32 px-6 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl mb-6">The <span className="text-brand-blue">Collection</span></h1>
          <p className="text-charcoal/60 font-light max-w-2xl">Explore our range of designer glassware, each piece uniquely crafted from upcycled premium bottles.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-8 border-b border-brand-blue/10">
          <div className="flex flex-wrap gap-4">
            {SHOP_CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-brand-blue text-white shadow-lg' 
                    : 'bg-white text-charcoal/60 hover:bg-brand-blue/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-white border border-brand-blue/10 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:border-brand-blue transition-colors text-sm"
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
          <div className="text-center py-20">
            <p className="text-charcoal/40 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
