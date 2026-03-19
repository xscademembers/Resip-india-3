import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Recycle, Award, Sparkles, Droplets, Instagram, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BeforeAfterSlider, ProductCard } from './components';
import { PRODUCTS, CATEGORIES } from './constants';

const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Glass Reflection Overlay */}
        <div className="absolute inset-0 glass-reflection opacity-30 z-10 pointer-events-none" />

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block text-brand-gold font-display font-bold tracking-[0.4em] uppercase text-sm mb-6">
              Sustainable Luxury
            </span>
            <h1 className="text-5xl md:text-8xl text-white mb-8 leading-[0.9] tracking-tighter">
              From Discarded Bottles to <span className="text-brand-gold italic">Designer</span> Glassware
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-12 font-light max-w-2xl mx-auto">
              Handcrafted. Sustainable. Timeless. We reimagine waste into premium lifestyle pieces for the modern home.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/shop" className="group bg-brand-blue text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-brand-gold transition-all duration-500 flex items-center gap-3">
                Shop Now <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              <a href="#process" className="text-white font-bold text-lg hover:text-brand-gold transition-colors flex items-center gap-3 border-b border-white/20 pb-1">
                Our Process
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Transformation Section */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-blue font-display font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              The Signature Experience
            </span>
            <h2 className="text-4xl md:text-6xl mb-8 leading-tight">
              Waste. <br /><span className="text-brand-blue">Reimagined.</span>
            </h2>
            <p className="text-lg text-charcoal/70 mb-10 leading-relaxed font-light">
              Every piece at Resip India tells a story of transformation. We take what the world discards and apply artisanal craftsmanship to create something truly exceptional.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-blue shrink-0">
                  <Recycle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Eco-Conscious</h4>
                  <p className="text-charcoal/60 text-sm">Reducing landfill waste one bottle at a time.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-brand-blue shrink-0">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Premium Quality</h4>
                  <p className="text-charcoal/60 text-sm">Fire-polished edges and weighted bases for a luxury feel.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <BeforeAfterSlider 
              before="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=800"
              after="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800"
            />
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-32 px-6 bg-brand-blue text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl mb-6">The Art of <span className="text-brand-gold">Upcycling</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto font-light">A meticulous 5-step process that ensures every glass meets our high-end standards.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 hidden lg:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative z-10">
              {[
                { icon: <Recycle />, title: "Collect", desc: "Sourcing premium bottles from across India." },
                { icon: <Droplets />, title: "Clean", desc: "Sanitization and label removal process." },
                { icon: <Sparkles />, title: "Cut", desc: "Precision diamond-blade cutting." },
                { icon: <Award />, title: "Polish", desc: "Multi-stage fire and hand polishing." },
                { icon: <ChevronRight />, title: "Finish", desc: "Quality check and premium packaging." }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold mx-auto mb-6 group-hover:bg-brand-gold group-hover:text-brand-blue transition-all duration-500">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-3">{step.title}</h4>
                  <p className="text-white/50 text-sm font-light leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 px-6 bg-brand-bg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-brand-blue font-display font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                Collections
              </span>
              <h2 className="text-4xl md:text-5xl">Shop by Category</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-brand-blue font-bold hover:text-brand-gold transition-colors">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -10 }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg"
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-2xl text-white font-bold mb-2">{cat.name}</h3>
                  <Link to="/shop" className="text-brand-gold font-bold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Explore <ChevronRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-brand-blue font-display font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              Curated Selection
            </span>
            <h2 className="text-4xl md:text-5xl mb-6">Featured Products</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-32 px-6 bg-brand-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-4xl md:text-5xl mb-6">Our <span className="text-brand-blue">Impact</span></h2>
              <p className="text-charcoal/60 font-light leading-relaxed">
                Sustainability isn't just a buzzword for us. It's the foundation of everything we build. Every glass you buy directly contributes to a cleaner planet.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-3xl border border-black/5 shadow-sm">
                <div className="text-brand-gold mb-4"><Recycle size={40} /></div>
                <h3 className="text-5xl font-display font-bold text-brand-blue mb-2">50,000+</h3>
                <p className="text-charcoal/50 uppercase tracking-widest text-xs font-bold">Bottles Recycled</p>
              </div>
              <div className="bg-white p-10 rounded-3xl border border-black/5 shadow-sm">
                <div className="text-brand-gold mb-4"><Droplets size={40} /></div>
                <h3 className="text-5xl font-display font-bold text-brand-blue mb-2">12 Tons</h3>
                <p className="text-charcoal/50 uppercase tracking-widest text-xs font-bold">Waste Diverted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl font-bold">Resip in the Wild</h2>
            <a href="#" className="flex items-center gap-2 text-brand-blue font-bold hover:text-brand-gold transition-colors">
              <Instagram size={20} /> @resipindia
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden group relative">
                <img 
                  src={`https://picsum.photos/seed/glass${i}/600/600`} 
                  alt="Social" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-blue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-brand-blue text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 glass-reflection opacity-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl mb-8 leading-tight">Drink Better. <br /><span className="text-brand-gold">Waste Less.</span></h2>
          <p className="text-xl text-white/60 mb-12 font-light">Join the movement of conscious luxury. Elevate your drinking experience while protecting the planet.</p>
          <Link to="/shop" className="inline-block bg-white text-brand-blue px-12 py-6 rounded-full font-bold text-xl hover:bg-brand-gold hover:text-white transition-all duration-500">
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
