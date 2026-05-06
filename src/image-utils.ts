/**
 * Image optimisation helpers.
 *
 * Wix and Unsplash both support dynamic resizing via URL parameters.
 * By appending the right width / quality params we can avoid downloading
 * oversized originals and dramatically reduce page weight.
 */

/** Preset widths for common contexts. */
export const IMG_WIDTHS = {
  /** Product card thumbnail in a grid. */
  THUMB: 400,
  /** Category card / Instagram grid. */
  CARD: 560,
  /** Product detail carousel – main image. */
  DETAIL: 800,
  /** Full-width hero / banner image. */
  HERO: 1280,
  /** "Related product" small thumbnail. */
  RELATED: 360,
  /** Navbar logo. */
  LOGO: 200,
  /** Footer logo. */
  LOGO_FOOTER: 240,
} as const;

type ImgWidth = (typeof IMG_WIDTHS)[keyof typeof IMG_WIDTHS];

/**
 * Return a resized/optimised URL for the given source.
 *
 * - **Wix (`static.wixstatic.com`)**: Uses Wix image-transform API
 *   with WebP output, unsharp-mask sharpening, and proper aspect ratio.
 * - **Unsplash (`images.unsplash.com`)**: Replaces or appends `w=` and `q=` params
 *   and forces WebP via `fm=webp`.
 * - **Other URLs**: returned as-is.
 */
export function optimizedSrc(src: string, width: ImgWidth | number, quality = 75): string {
  if (!src) return src;

  // ── Wix ───────────────────────────────────────────────
  if (src.includes('static.wixstatic.com/media/')) {
    // Strip any existing /v1/ transform suffix and rebuild.
    const base = src.replace(/\/v1\/.*$/, '');
    // Use w_ only (no forced square h_) so Wix auto-calculates height.
    // Add unsharp-mask for sharpness after down-scale, and output WebP.
    return `${base}/v1/fill/w_${width},al_c,q_${quality},usm_0.66_1.00_0.01/image.webp`;
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
 * Provides 1× and 2× variants.
 */
export function optimizedSrcSet(src: string, width: ImgWidth | number, quality = 75): string {
  const w1 = width;
  const w2 = Math.round(width * 1.5);
  return `${optimizedSrc(src, w1, quality)} ${w1}w, ${optimizedSrc(src, w2, quality)} ${w2}w`;
}
