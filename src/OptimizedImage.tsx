import React, { useState, useCallback, useRef, useEffect } from 'react';
import { optimizedSrc, optimizedSrcSet, IMG_WIDTHS } from './image-utils';

type ImgWidth = (typeof IMG_WIDTHS)[keyof typeof IMG_WIDTHS] | number;

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  /** The original image URL (Wix or Unsplash). */
  src: string;
  /** Target display width – drives the resized URL. */
  displayWidth?: ImgWidth;
  /** JPEG / WebP quality 1-100, default 70. */
  quality?: number;
  /** When true the image is Above-The-Fold / LCP-critical. */
  priority?: boolean;
}

/**
 * Drop-in `<img>` replacement that auto-optimises external URLs,
 * adds lazy loading for below-the-fold images, generates
 * responsive `srcSet` for Retina displays.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  displayWidth = IMG_WIDTHS.CARD,
  quality = 70,
  priority = false,
  loading,
  decoding,
  referrerPolicy,
  className,
  ...rest
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  // Handle browser-cached images where onLoad may not fire after mount
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={optimizedSrc(src, displayWidth, quality)}
      srcSet={optimizedSrcSet(src, displayWidth, quality)}
      sizes={`(max-width: ${displayWidth}px) 100vw, ${displayWidth}px`}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding={decoding ?? (priority ? 'sync' : 'async')}
      referrerPolicy={referrerPolicy ?? 'no-referrer'}
      fetchPriority={priority ? 'high' : undefined}
      onLoad={handleLoad}
      className={className}
      style={
        loaded || priority
          ? undefined
          : { backgroundColor: 'color-mix(in srgb, var(--color-brand-blue) 4%, white)' }
      }
      {...rest}
    />
  );
};

export default OptimizedImage;
