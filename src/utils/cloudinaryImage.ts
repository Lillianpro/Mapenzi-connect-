/**
 * Cloudinary Low-Data Image Processor for Mapenzi Connect
 * Dynamically converts, compresses, and downscales user photos using Cloudinary's
 * Fetch & Transformation API to minimize data bundle consumption on East African
 * mobile networks (MTN, Airtel, Safaricom, Vodacom).
 */

export interface CloudinaryTransformOptions {
  isLowDataMode?: boolean;
  width?: number;
  height?: number;
  quality?: 'eco' | 'low' | 'good' | 'best' | 'auto' | string | number;
  crop?: 'limit' | 'fill' | 'fit' | 'scale' | 'thumb';
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
  cloudName?: string;
  forceFetch?: boolean;
}

export interface ImagePayloadStats {
  originalBytes: number;
  compressedBytes: number;
  originalFormatted: string;
  compressedFormatted: string;
  savingsPercent: number;
  estimatedFormat: string;
  transformSummary: string;
}

// Default Cloudinary cloud name for Mapenzi Connect
export const DEFAULT_CLOUDINARY_CLOUD_NAME = 'mapenzi-connect';

/**
 * Transforms an image URL into a Cloudinary Fetch / Delivery URL with
 * aggressive bandwidth-saving transformations when in Low Data Mode.
 */
export function getCloudinaryImageUrl(
  originalUrl: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!originalUrl) return '';

  // Local assets (e.g. /app_icon.png) or data URLs cannot be fetched by Cloudinary
  if (originalUrl.startsWith('data:') || originalUrl.startsWith('/')) {
    return originalUrl;
  }

  const {
    isLowDataMode = true,
    width = isLowDataMode ? 320 : 800,
    height,
    quality = isLowDataMode ? 'eco' : 'good',
    crop = 'limit',
    format = 'auto',
    cloudName = DEFAULT_CLOUDINARY_CLOUD_NAME,
    forceFetch = false,
  } = options;

  // If low data mode is OFF and forceFetch is false, return original high-res URL
  if (!isLowDataMode && !forceFetch) {
    return originalUrl;
  }

  // Construct Cloudinary transformation string
  const transforms: string[] = [];

  // 1. Format: f_auto serves WebP or AVIF to modern Android/iOS browsers
  transforms.push(`f_${format}`);

  // 2. Quality: q_auto:eco or q_auto:low for drastic compression
  if (typeof quality === 'number') {
    transforms.push(`q_${quality}`);
  } else if (quality === 'eco' || quality === 'low' || quality === 'good' || quality === 'best') {
    transforms.push(`q_auto:${quality}`);
  } else {
    transforms.push('q_auto');
  }

  // 3. Dimension constraint
  if (width) {
    transforms.push(`w_${width}`);
  }
  if (height) {
    transforms.push(`h_${height}`);
  }

  // 4. Crop mode
  transforms.push(`c_${crop}`);

  // 5. Flags: lossy compression and device pixel ratio capping to prevent 3x bandwidth spikes
  if (isLowDataMode) {
    transforms.push('fl_lossy');
    transforms.push('dpr_1.0');
  }

  const transformString = transforms.join(',');

  // Check if it's already a Cloudinary delivery URL
  if (originalUrl.includes('res.cloudinary.com')) {
    // If it already has /image/upload/, insert transformations
    if (originalUrl.includes('/image/upload/')) {
      return originalUrl.replace('/image/upload/', `/image/upload/${transformString}/`);
    }
    // If it's already a fetch URL, replace transformations
    if (originalUrl.includes('/image/fetch/')) {
      const parts = originalUrl.split('/image/fetch/');
      const targetUrl = parts[1].replace(/^[^/]+\//, '');
      return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformString}/${targetUrl}`;
    }
  }

  // For external URLs (Unsplash, Google Drive, user uploads), use Cloudinary Fetch API
  return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformString}/${originalUrl}`;
}

/**
 * Estimates the network payload and savings achieved by Cloudinary compression
 */
export function estimateImagePayloadStats(
  originalUrl: string,
  isLowDataMode: boolean,
  targetWidth: number = 320
): ImagePayloadStats {
  // Unsplash & high-res profile camera shots typically range between 1.5MB to 3.2MB
  let baselineBytes = 1850000;
  
  if (originalUrl.includes('w=800') || originalUrl.includes('w=1080')) {
    baselineBytes = 1600000;
  } else if (originalUrl.includes('w=400')) {
    baselineBytes = 420000;
  }

  if (!isLowDataMode) {
    return {
      originalBytes: baselineBytes,
      compressedBytes: baselineBytes,
      originalFormatted: formatBytes(baselineBytes),
      compressedFormatted: formatBytes(baselineBytes),
      savingsPercent: 0,
      estimatedFormat: 'JPEG / Original',
      transformSummary: 'Standard High-Resolution (Full Bandwidth)',
    };
  }

  // With Cloudinary f_auto (WebP/AVIF) + q_auto:eco + w_320 + fl_lossy:
  // Typically yields 22 KB to 38 KB per portrait image
  const compressedBytes = Math.round(targetWidth <= 240 ? 19500 : targetWidth <= 360 ? 28400 : 42000);
  const savings = Math.max(0, baselineBytes - compressedBytes);
  const savingsPercent = Math.round((savings / baselineBytes) * 100);

  return {
    originalBytes: baselineBytes,
    compressedBytes,
    originalFormatted: formatBytes(baselineBytes),
    compressedFormatted: formatBytes(compressedBytes),
    savingsPercent,
    estimatedFormat: 'WebP / AVIF (Cloudinary)',
    transformSummary: `f_auto,q_auto:eco,w_${targetWidth},fl_lossy,dpr_1.0`,
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
