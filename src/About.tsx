import React from 'react';
import { motion } from 'motion/react';
import { Recycle, Award, Sparkles, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-32 pb-32">
      {/* Hero */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-brand-blue font-display font-bold tracking-[0.4em] uppercase text-sm mb-6 block">
              Our Story
            </span>
            <h1 className="text-5xl md:text-8xl mb-12 leading-tight tracking-tighter">
              A Modern <span className="text-brand-blue italic">Sustainability</span> Movement
            </h1>
            <div className="w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1920" 
                alt="Workshop" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="px-6 mb-32">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8">The Problem</h2>
            <p className="text-lg text-charcoal/60 leading-relaxed font-light mb-6">
              In India alone, millions of glass bottles end up in landfills every year. Glass takes over a million years to decompose, leaving a permanent scar on our planet.
            </p>
            <p className="text-lg text-charcoal/60 leading-relaxed font-light">
              We saw these discarded vessels not as waste, but as raw potential—beautiful, durable materials waiting for a second life.
            </p>
          </div>
          <div className="bg-brand-blue p-12 rounded-[3rem] text-white">
            <h2 className="text-4xl font-bold mb-8 text-brand-gold">The Solution</h2>
            <p className="text-lg text-white/70 leading-relaxed font-light mb-6">
              Resip India was born from a simple idea: Upcycling with Elegance. We combine traditional craftsmanship with modern design to transform liquor bottles into premium glassware.
            </p>
            <div className="flex items-center gap-4 text-brand-gold">
              <Recycle size={32} />
              <span className="font-bold tracking-widest uppercase text-xs">Zero Waste Mission</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-32 bg-brand-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl mb-6">Our Core Values</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-brand-blue mx-auto shadow-sm">
                <Award size={32} />
              </div>
              <h3 className="text-2xl font-bold">Design-First</h3>
              <p className="text-charcoal/60 font-light">We don't just recycle; we design. Every curve and cut is intentional, creating a product that stands on its own merit.</p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-brand-blue mx-auto shadow-sm">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-bold">Artisanal Craft</h3>
              <p className="text-charcoal/60 font-light">Hand-cut and fire-polished by skilled Indian artisans, ensuring the highest level of finish and safety.</p>
            </div>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-brand-blue mx-auto shadow-sm">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold">Conscious Living</h3>
              <p className="text-charcoal/60 font-light">Promoting a lifestyle where luxury and sustainability coexist beautifully in your everyday rituals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
