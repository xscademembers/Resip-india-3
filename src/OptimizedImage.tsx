import React, { useState, useCallback } from 'react';
import { optimizedSrc, optimizedSrcSet, IMG_WIDTHS } from './image-utils';

type ImgWidth = (typeof IMG_WIDTHS)[keyof typeof IMG_WIDTHS] | number;

interface OptimizedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'srcSet'> {
  /** The original image URL (Wix or Unsplash). */
  src: string;
  /** Target display width – drives the resized URL. */
  displayWidth?: ImgWidth;
  /** JPEG / WebP quality 1-100, default 75. */
  quality?: number;
  /** When true the image is Above-The-Fold / LCP-critical. */
  priority?: boolean;
}

/**
 * Drop-in `<img>` replacement that auto-optimises external URLs,
 * adds lazy loading for below-the-fold images, generates
 * responsive `srcSet` for Retina displays, and shows a smooth
 * fade-in transition when images load.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  displayWidth = IMG_WIDTHS.CARD,
  quality = 75,
  priority = false,
  loading,
  decoding,
  referrerPolicy,
  style,
  className,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <img
      src={optimizedSrc(src, displayWidth, quality)}
      srcSet={optimizedSrcSet(src, displayWidth, quality)}
      sizes={`(max-width: ${displayWidth}px) 100vw, ${displayWidth}px`}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding={decoding ?? (priority ? 'sync' : 'async')}
      referrerPolicy={referrerPolicy ?? 'no-referrer'}
      fetchpriority={priority ? 'high' : undefined}
      onLoad={handleLoad}
      className={className}
      style={{
        ...style,
        opacity: priority ? 1 : loaded ? 1 : 0,
        transition: priority ? undefined : 'opacity 0.3s ease-in',
      }}
      {...rest}
    />
  );
};

export default OptimizedImage;
