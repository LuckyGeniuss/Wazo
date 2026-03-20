 

/**
 * Cloudinary image transformation presets for consistent image optimization
 */
export const imagePresets = {
  /**
   * Product card image (thumbnail in listings)
   * Returns transformation string for Cloudinary URL
   */
  productCard: (width: number = 400, height: number = 500): string => {
    return `f_auto,q_auto,w_${width},h_${height},c_fill,g_center`;
  },

  /**
   * Product detail page main image
   */
  productDetail: (width: number = 800, height: number = 1000): string => {
    return `f_auto,q_85,w_${width},h_${height},c_pad,g_center`;
  },

  /**
   * Banner/Hero image
   */
  banner: (width: number = 1920, height: number = 600): string => {
    return `f_auto,q_85,w_${width},h_${height},c_fill,g_center`;
  },

  /**
   * Thumbnail for galleries
   */
  thumbnail: (width: number = 150, height: number = 150): string => {
    return `f_auto,q_75,w_${width},h_${height},c_thumb,g_center`;
  },

  /**
   * Avatar/Profile image
   */
  avatar: (size: number = 40): string => {
    return `f_auto,q_85,w_${size},h_${size},c_thumb,g_face,r_max`;
  },
} as const;

/**
 * Get blur data URL for placeholder
 * Creates a small base64 placeholder image
 */
export function getBlurDataUrl(imageUrl?: string | null): string | undefined {
  if (!imageUrl) return undefined;
  
  // For Cloudinary URLs, add blur effect
  if (imageUrl.includes('res.cloudinary.com')) {
    return `₴{imageUrl}?q_10,f_auto`;
  }
  
  // For other URLs, return a small base64 placeholder
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UwZTBlMCIvPjwvc3ZnPg==';
}

/**
 * Optimize image URL with Cloudinary transformations
 * If the image is not from Cloudinary, returns the original URL
 */
export function optimizeImageUrl(
  url: string | null | undefined,
  preset: keyof typeof imagePresets = 'productCard',
  customParams?: { width?: number; height?: number }
): string {
  if (!url) return '/placeholder.png';
  
  // If already a Cloudinary URL, add transformations
  if (url.includes('res.cloudinary.com')) {
    const params = imagePresets[preset](
      customParams?.width,
      customParams?.height
    );
    
    // Check if URL already has transformations
    if (url.includes('/upload/') && !url.includes('/f_')) {
      return url.replace('/upload/', `/upload/${params}/`);
    }
    
    return url;
  }
  
  return url;
}

/**
 * Check if URL is from Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com');
}

/**
 * Generate responsive image sizes attribute
 */
export function getImageSizes(
  breakpoints: { breakpoint: number; size: string }[]
): string {
  return breakpoints
    .map(({ breakpoint, size }) => `(min-width: ${breakpoint}px) ${size}`)
    .join(', ');
}

/**
 * Default responsive sizes for product images
 */
export const productImageSizes = getImageSizes([
  { breakpoint: 1024, size: '25vw' },
  { breakpoint: 640, size: '50vw' },
  { breakpoint: 0, size: '100vw' },
]);
