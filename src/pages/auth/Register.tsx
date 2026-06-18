import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShell, TextField, SubmitButton, TextLink } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import SEOHead from '../../components/SEOHead';
import type { ApiErrorShape } from '../../api/client';

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
      toast.success('Account created! Check your inbox to verify your email.');
      navigate('/account', { replace: true });
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Create Account" noindex />
      <AuthShell
        title="Create your account"
        subtitle="Join the ReSip family and shop sustainable glassware"
        footer={
          <span>
            Already have an account? <TextLink to="/login">Sign in</TextLink>
          </span>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <TextField id="name" label="Full Name" required value={form.name} onChange={update('name')} autoComplete="name" />
          <TextField id="email" label="Email" type="email" required value={form.email} onChange={update('email')} autoComplete="email" />
          <TextField id="phone" label="Phone (optional)" type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" />
          <TextField id="password" label="Password" type="password" required value={form.password} onChange={update('password')} autoComplete="new-password" />
          <TextField id="confirm" label="Confirm Password" type="password" required value={form.confirm} onChange={update('confirm')} autoComplete="new-password" />
          <SubmitButton type="submit" loading={loading} className="mt-2">
            Create Account
          </SubmitButton>
        </form>
      </AuthShell>
    </>
  );
}
