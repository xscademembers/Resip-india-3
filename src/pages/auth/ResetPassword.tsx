import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthShell, TextField, SubmitButton, TextLink } from '../../components/ui';
import { authApi } from '../../api/auth';
import { tokenStore } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import SEOHead from '../../components/SEOHead';
import type { ApiErrorShape } from '../../api/client';

export default function ResetPassword() {
  const { token = '' } = useParams();
  const { setUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, password);
      tokenStore.set(res.token);
      setUser(res.user);
      toast.success('Password reset successfully');
      navigate('/account', { replace: true });
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Reset Password" noindex />
      <AuthShell title="Set a new password" footer={<TextLink to="/login">Back to sign in</TextLink>}>
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            id="password"
            label="New Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <TextField
            id="confirm"
            label="Confirm Password"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
          <SubmitButton type="submit" loading={loading}>
            Reset Password
          </SubmitButton>
        </form>
      </AuthShell>
    </>
  );
}
