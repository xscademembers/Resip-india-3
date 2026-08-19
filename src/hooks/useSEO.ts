import { useEffect } from 'react';

export interface SEOOptions {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  type?: string;
  noindex?: boolean;
}

const DEFAULT_TITLE = 'ReSip India Handcrafted Upcycled Glassware';
const DEFAULT_DESCRIPTION =
  'ReSip India transforms discarded bottles into stunning handcrafted upcycled glassware and candles. Sustainable luxury, made in India.';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Lightweight document-head SEO manager. Updates title, meta description,
 * Open Graph / Twitter tags, and canonical URL on mount and when options change.
 */
export function useSEO(options: SEOOptions = {}) {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    image,
    canonical,
    type = 'website',
    noindex = false,
  } = options;

  useEffect(() => {
    const fullTitle = title ? `${title} | ReSip India` : DEFAULT_TITLE;
    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    if (image) setMeta('property', 'og:image', image);

    setMeta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    if (image) setMeta('name', 'twitter:image', image);

    const canonicalUrl = canonical || window.location.href.split('?')[0];
    setLink('canonical', canonicalUrl);
    setMeta('property', 'og:url', canonicalUrl);
  }, [title, description, image, canonical, type, noindex]);
}
