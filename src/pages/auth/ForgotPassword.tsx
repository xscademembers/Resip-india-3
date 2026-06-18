import React, { useState } from 'react';
import { AuthShell, TextField, SubmitButton, TextLink } from '../../components/ui';
import { authApi } from '../../api/auth';
import { useToast } from '../../context/ToastContext';
import SEOHead from '../../components/SEOHead';
import type { ApiErrorShape } from '../../api/client';

export default function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success('Password reset email sent');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Forgot Password" noindex />
      <AuthShell
        title="Reset your password"
        subtitle="Enter your email and we'll send you a reset link"
        footer={<TextLink to="/login">Back to sign in</TextLink>}
      >
        {sent ? (
          <p className="rounded-xl bg-brand-blue/5 p-4 text-sm text-charcoal/70">
            If an account exists for <strong>{email}</strong>, a reset link is on its way. The link expires in 1 hour.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              id="email"
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <SubmitButton type="submit" loading={loading}>
              Send Reset Link
            </SubmitButton>
          </form>
        )}
      </AuthShell>
    </>
  );
}
