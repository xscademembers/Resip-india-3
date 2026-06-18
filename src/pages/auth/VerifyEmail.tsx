import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { AuthShell, TextLink } from '../../components/ui';
import { authApi } from '../../api/auth';
import SEOHead from '../../components/SEOHead';
import { useAuth } from '../../context/AuthContext';
import type { ApiErrorShape } from '../../api/client';

export default function VerifyEmail() {
  const { token = '' } = useParams();
  const { refresh } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email…');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    authApi
      .verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res.message || 'Your email has been verified.');
        refresh();
      })
      .catch((err: ApiErrorShape) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed.');
      });
  }, [token, refresh]);

  return (
    <>
      <SEOHead title="Verify Email" noindex />
      <AuthShell title="Email verification" footer={<TextLink to="/account">Go to my account</TextLink>}>
        <div className="flex flex-col items-center text-center">
          {status === 'verifying' && (
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-blue/20 border-t-brand-blue" />
          )}
          {status === 'success' && <CheckCircle2 className="text-green-600" size={56} aria-hidden />}
          {status === 'error' && <XCircle className="text-red-500" size={56} aria-hidden />}
          <p className="mt-6 text-charcoal/70">{message}</p>
          {status !== 'verifying' && (
            <Link
              to="/shop"
              className="mt-6 inline-flex rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold"
            >
              Continue Shopping
            </Link>
          )}
        </div>
      </AuthShell>
    </>
  );
}
