/**
 * Image optimisation helpers.
 *
 * Wix and Unsplash both support dynamic resizing via URL parameters.
 * By appending the right width / quality params we can avoid downloading
 * oversized originals and dramatically reduce page weight.
 */

/** Preset widths for common contexts. */
export const IMG_WIDTHS = {
  /** Cart / wishlist / order line-item thumbnail. */
  MINI: 128,
  /** Product card thumbnail in a grid. */
  THUMB: 320,
  /** Category card / Instagram grid. */
  CARD: 480,
  /** Product detail carousel – main image. */
  DETAIL: 640,
  /** Full-width hero / banner image (desktop). */
  HERO: 1200,
  /** Hero on phones. */
  HERO_MOBILE: 720,
  /** "Related product" small thumbnail. */
  RELATED: 280,
  /** Navbar logo. */
  LOGO: 200,
  /** Footer logo. */
  LOGO_FOOTER: 240,
  /** Media partner press logo. */
  PARTNER: 320,
} as const;

type ImgWidth = (typeof IMG_WIDTHS)[keyof typeof IMG_WIDTHS];

/** Wix `fill` / `fit` transforms require both width and height or the CDN returns 400. */
function wixTransformHeight(width: ImgWidth | number): number {
  if (width === IMG_WIDTHS.HERO || width === 1200) return Math.round((width * 9) / 16);
  if (width === IMG_WIDTHS.HERO_MOBILE || width === 720) return Math.round((width * 9) / 16);
  if (width === IMG_WIDTHS.LOGO || width === IMG_WIDTHS.LOGO_FOOTER) {
    return Math.round((width * 80) / 280);
  }
  if (width === IMG_WIDTHS.PARTNER) return Math.round((width * 80) / 320);
  if (width === IMG_WIDTHS.DETAIL) return Math.round((width * 5) / 4);
  if (width === IMG_WIDTHS.MINI) return width;
  return width;
}

/**
 * Return a resized/optimised URL for the given source.
 *
 * - **Wix (`static.wixstatic.com`)**: Uses Wix image-transform API
 *   with WebP output, unsharp-mask sharpening, and proper aspect ratio.
 * - **Unsplash (`images.unsplash.com`)**: Replaces or appends `w=` and `q=` params
 *   and forces WebP via `fm=webp`.
 * - **Other URLs**: returned as-is.
 */
export function optimizedSrc(src: string, width: ImgWidth | number, quality = 70): string {
  if (!src) return src;

  // ── Wix ───────────────────────────────────────────────
  if (src.includes('static.wixstatic.com/media/')) {
    // Strip any existing /v1/ transform suffix and rebuild.
    const base = src.replace(/\/v1\/.*$/, '');
    const height = wixTransformHeight(width);
    // `fit` preserves aspect ratio inside the box; both w_ and h_ are required.
    return `${base}/v1/fit/w_${width},h_${height},al_c,q_${quality},usm_0.66_1.00_0.01/image.webp`;
  }

  // ── Unsplash ──────────────────────────────────────────
  if (src.includes('images.unsplash.com/')) {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality));
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('fm', 'webp');
    return url.toString();
  }

  return src;
}

/**
 * Generate a `srcSet` string for responsive loading.
 * Small thumbnails only need 1×; larger images get 1× and 1.25× variants.
 */
export function optimizedSrcSet(src: string, width: ImgWidth | number, quality = 70): string {
  const w1 = width;
  if (width <= IMG_WIDTHS.MINI) {
    return `${optimizedSrc(src, w1, quality)} ${w1}w`;
  }
  const w2 = Math.round(width * 1.25);
  return `${optimizedSrc(src, w1, quality)} ${w1}w, ${optimizedSrc(src, w2, quality)} ${w2}w`;
}

/** Prefetch an image URL into the browser cache (e.g. carousel next/prev slide). */
export function prefetchImage(src: string, width: ImgWidth | number, quality = 70): void {
  if (!src) return;
  const href = optimizedSrc(src, width, quality);
  const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
  if (existing) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'image';
  link.href = href;
  document.head.appendChild(link);
}
