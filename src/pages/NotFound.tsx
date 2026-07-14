import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/ui';
import SEOHead from '../../components/SEOHead';

export default function NotFound() {
  return (
    <PageContainer>
      <SEOHead title="Page Not Found" noindex />
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h1 className="font-display text-8xl font-bold text-brand-blue/20">404</h1>
        <h2 className="mt-4 font-display text-2xl font-bold text-brand-blue md:text-3xl">Page Not Found</h2>
        <p className="mt-4 text-charcoal/70 max-w-md">
          We can't seem to find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-full bg-brand-blue px-8 py-3 font-bold text-white transition-colors hover:bg-brand-gold"
        >
          Return to Home
        </Link>
      </div>
    </PageContainer>
  );
}
