import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const CustomOrders = () => {
  return (
    <div className="pt-32 pb-32 px-6 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl mb-8 leading-tight">Custom & <br /><span className="text-brand-blue">Corporate</span> Orders</h1>
              <p className="text-xl text-charcoal/60 font-light leading-relaxed">
                Elevate your brand or event with bespoke upcycled glassware. From custom branding to bulk orders for cafes and bars, we offer tailored solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Bars & Cafes</h3>
                <p className="text-sm text-charcoal/60 font-light">Customized glassware that matches your establishment's aesthetic.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Corporate Gifting</h3>
                <p className="text-sm text-charcoal/60 font-light">Sustainable and unique gifts for your clients and employees.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Events</h3>
                <p className="text-sm text-charcoal/60 font-light">Memorable wedding favors or event giveaways.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Branding</h3>
                <p className="text-sm text-charcoal/60 font-light">Engrave your logo or custom designs on our glassware.</p>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-black/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center"><Mail size={20} /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40">Email Us</p>
                  <p className="text-lg font-bold">hello@resipindia.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center"><Phone size={20} /></div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-charcoal/40">Call Us</p>
                  <p className="text-lg font-bold">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-black/5"
          >
            <h2 className="text-3xl font-bold mb-10">Inquiry Form</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">Full Name</label>
                  <input type="text" className="w-full bg-brand-bg border border-black/5 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">Email Address</label>
                  <input type="email" className="w-full bg-brand-bg border border-black/5 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">Company / Organization</label>
                <input type="text" className="w-full bg-brand-bg border border-black/5 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="Company Name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">Order Type</label>
                <select className="w-full bg-brand-bg border border-black/5 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors appearance-none">
                  <option>Corporate Gifting</option>
                  <option>Bar / Cafe Supply</option>
                  <option>Event Favors</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">Message</label>
                <textarea rows={4} className="w-full bg-brand-bg border border-black/5 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="Tell us about your requirements..."></textarea>
              </div>
              <button className="w-full bg-brand-blue text-white py-5 rounded-full font-bold text-lg hover:bg-brand-gold transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/20">
                Send Inquiry <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrders;
