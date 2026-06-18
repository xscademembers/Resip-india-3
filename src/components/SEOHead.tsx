import { useSEO, type SEOOptions } from '../hooks/useSEO';

/**
 * Declarative wrapper around {@link useSEO}. Render anywhere in a page tree to
 * manage document head tags. Renders nothing itself.
 */
export default function SEOHead(props: SEOOptions) {
  useSEO(props);
  return null;
}
