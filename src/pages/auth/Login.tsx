import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthShell, TextField, SubmitButton, TextLink } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import SEOHead from '../../components/SEOHead';
import type { ApiErrorShape } from '../../api/client';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const redirectTo = location.state?.from || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : redirectTo, { replace: true });
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Login" noindex />
      <AuthShell
        title="Welcome back"
        subtitle="Sign in to your ReSip India account"
        footer={
          <span>
            New here? <TextLink to="/register">Create an account</TextLink>
          </span>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mb-6 text-right">
            <TextLink to="/forgot-password">Forgot password?</TextLink>
          </div>
          <SubmitButton type="submit" loading={loading}>
            Sign In
          </SubmitButton>
        </form>
      </AuthShell>
    </>
  );
}
