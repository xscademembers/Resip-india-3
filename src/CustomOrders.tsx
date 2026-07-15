import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from './constants';
import { contactApi } from './api/contact';

const ORDER_TYPES = ['Corporate Gifting', 'Bar / Cafe Supply', 'Event Favors', 'Other'];

const CustomOrders = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    orderType: ORDER_TYPES[0],
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    setStatus('loading');
    setFeedback('');

    try {
      const res = await contactApi.send(form);
      setStatus('success');
      setFeedback(res.message || "Thank you! Your inquiry has been sent. We'll get back to you soon.");
      setForm({ name: '', email: '', company: '', orderType: ORDER_TYPES[0], message: '' });
    } catch (err: any) {
      setStatus('error');
      setFeedback(
        err?.message || 'Something went wrong while sending your message. Please try again later.'
      );
    }
  };

  return (
    <div className="pt-40 pb-32 px-6 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl mb-8 leading-tight"><span className="text-brand-blue">Contact</span> Us</h1>
              <p className="text-xl text-charcoal/60 font-light leading-relaxed">
                Elevate your brand or event with bespoke upcycled glassware. From custom branding to bulk orders for cafes and bars, we offer tailored solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-blue/10">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Bars & Cafes</h3>
                <p className="text-sm text-charcoal/60 font-light">Customized glassware that matches your establishment's aesthetic.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-blue/10">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Corporate Gifting</h3>
                <p className="text-sm text-charcoal/60 font-light">Sustainable and unique gifts for your clients and employees.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-blue/10">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Events</h3>
                <p className="text-sm text-charcoal/60 font-light">Memorable wedding favors or event giveaways.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-blue/10">
                <h3 className="text-xl font-bold mb-4 text-brand-blue">Branding</h3>
                <p className="text-sm text-charcoal/60 font-light">Engrave your logo or custom designs on our glassware.</p>
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-brand-blue/10">
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
                  <a href={CONTACT_PHONE_TEL} className="text-lg font-bold hover:text-brand-blue transition-colors">
                    {CONTACT_PHONE}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl border border-brand-blue/10"
          >
            <h2 className="text-3xl font-bold mb-10">Inquiry Form</h2>
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full bg-brand-bg border border-brand-blue/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full bg-brand-bg border border-brand-blue/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">Company / Organization</label>
                <input type="text" name="company" value={form.company} onChange={handleChange} className="w-full bg-brand-bg border border-brand-blue/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="Company Name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">Order Type</label>
                <select name="orderType" value={form.orderType} onChange={handleChange} className="w-full bg-brand-bg border border-brand-blue/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors appearance-none">
                  {ORDER_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal/60">Message</label>
                <textarea rows={4} name="message" value={form.message} onChange={handleChange} required className="w-full bg-brand-bg border border-brand-blue/10 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-blue transition-colors" placeholder="Tell us about your requirements..."></textarea>
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-brand-blue text-white py-5 rounded-full font-bold text-lg hover:bg-brand-gold transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>Sending... <Loader2 size={20} className="animate-spin" /></>
                ) : (
                  <>Send Inquiry <Send size={20} /></>
                )}
              </button>

              {status === 'success' && (
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-800" role="status">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{feedback}</p>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700" role="alert">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <p className="text-sm font-medium">{feedback}</p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CustomOrders;
