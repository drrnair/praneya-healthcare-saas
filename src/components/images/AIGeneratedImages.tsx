'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

// ======================
// AI IMAGE TYPES & INTERFACES
// ======================

export interface AIImageConfig {
  id: string;
  prompt: string;
  category: 'hero' | 'feature' | 'trust' | 'journey' | 'testimonial' | 'badge';
  aspectRatio: string;
  sizes: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  resolutions: {
    '1x': string;
    '2x': string;
    '3x': string;
  };
  webp?: {
    '1x': string;
    '2x': string;
    '3x': string;
  };
  alt: string;
  priority?: boolean;
}

export interface OptimizedImageProps {
  config: AIImageConfig;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  overlay?: React.ReactNode;
  fallback?: string;
}

// ======================
// AI IMAGE CONFIGURATIONS
// ======================

export const AI_GENERATED_IMAGES: Record<string, AIImageConfig> = {
  // Hero Section Images
  heroFamilyCooking: {
    id: 'hero-family-cooking',
    prompt: 'Diverse multi-generational family cooking healthy colorful meal together in modern kitchen, natural lighting, authentic expressions, professional photography style, warm and inviting atmosphere, vegetables and fresh ingredients visible, clean minimal background',
    category: 'hero',
    aspectRatio: '16/9',
    sizes: {
      mobile: '100vw',
      tablet: '100vw',
      desktop: '1920px'
    },
    resolutions: {
      '1x': '/images/ai-generated/hero-family-cooking-1920w.jpg',
      '2x': '/images/ai-generated/hero-family-cooking-3840w.jpg',
      '3x': '/images/ai-generated/hero-family-cooking-5760w.jpg'
    },
    webp: {
      '1x': '/images/ai-generated/hero-family-cooking-1920w.webp',
      '2x': '/images/ai-generated/hero-family-cooking-3840w.webp',
      '3x': '/images/ai-generated/hero-family-cooking-5760w.webp'
    },
    alt: 'Diverse family cooking healthy meal together in modern kitchen',
    priority: true
  },

  heroAIInterface: {
    id: 'hero-ai-interface',
    prompt: 'AI-powered smartphone interface displaying food recognition technology, scanning fresh ingredients, futuristic but clean design, healthcare blue and green color scheme, professional product photography, high-tech but approachable',
    category: 'hero',
    aspectRatio: '3/4',
    sizes: {
      mobile: '50vw',
      tablet: '400px',
      desktop: '500px'
    },
    resolutions: {
      '1x': '/images/ai-generated/hero-ai-interface-500w.jpg',
      '2x': '/images/ai-generated/hero-ai-interface-1000w.jpg',
      '3x': '/images/ai-generated/hero-ai-interface-1500w.jpg'
    },
    webp: {
      '1x': '/images/ai-generated/hero-ai-interface-500w.webp',
      '2x': '/images/ai-generated/hero-ai-interface-1000w.webp',
      '3x': '/images/ai-generated/hero-ai-interface-1500w.webp'
    },
    alt: 'AI-powered smartphone showing food recognition technology',
    priority: true
  },

  // Feature Demonstration Images
  nutritionDashboard: {
    id: 'nutrition-dashboard',
    prompt: 'Clean modern nutrition app dashboard interface, displaying colorful charts and health metrics, professional UI design, blue and green healthcare color palette, minimalist layout, data visualization elements',
    category: 'feature',
    aspectRatio: '16/10',
    sizes: {
      mobile: '100vw',
      tablet: '600px',
      desktop: '800px'
    },
    resolutions: {
      '1x': '/images/ai-generated/nutrition-dashboard-800w.jpg',
      '2x': '/images/ai-generated/nutrition-dashboard-1600w.jpg',
      '3x': '/images/ai-generated/nutrition-dashboard-2400w.jpg'
    },
    webp: {
      '1x': '/images/ai-generated/nutrition-dashboard-800w.webp',
      '2x': '/images/ai-generated/nutrition-dashboard-1600w.webp',
      '3x': '/images/ai-generated/nutrition-dashboard-2400w.webp'
    },
    alt: 'Modern nutrition app dashboard with health metrics and charts'
  },

  familyMealPlanning: {
    id: 'family-meal-planning',
    prompt: 'Family meal planning scene with tablet showing recipe recommendations, diverse family members engaged, healthy ingredients spread on counter, natural lighting, authentic lifestyle photography',
    category: 'feature',
    aspectRatio: '4/3',
    sizes: {
      mobile: '100vw',
      tablet: '600px',
      desktop: '700px'
    },
    resolutions: {
      '1x': '/images/ai-generated/family-meal-planning-700w.jpg',
      '2x': '/images/ai-generated/family-meal-planning-1400w.jpg',
      '3x': '/images/ai-generated/family-meal-planning-2100w.jpg'
    },
    webp: {
      '1x': '/images/ai-generated/family-meal-planning-700w.webp',
      '2x': '/images/ai-generated/family-meal-planning-1400w.webp',
      '3x': '/images/ai-generated/family-meal-planning-2100w.webp'
    },
    alt: 'Family planning healthy meals with tablet showing recipe recommendations'
  },

  // Trust Building Images
  healthcareProfessionals: {
    id: 'healthcare-professionals',
    prompt: 'Professional diverse group of registered dietitians and healthcare professionals, clean white background, confident poses, professional attire, medical credentials visible, trustworthy expressions',
    category: 'trust',
    aspectRatio: '16/9',
    sizes: {
      mobile: '100vw',
      tablet: '800px',
      desktop: '1200px'
    },
    resolutions: {
      '1x': '/images/ai-generated/healthcare-professionals-1200w.jpg',
      '2x': '/images/ai-generated/healthcare-professionals-2400w.jpg',
      '3x': '/images/ai-generated/healthcare-professionals-3600w.jpg'
    },
    webp: {
      '1x': '/images/ai-generated/healthcare-professionals-1200w.webp',
      '2x': '/images/ai-generated/healthcare-professionals-2400w.webp',
      '3x': '/images/ai-generated/healthcare-professionals-3600w.webp'
    },
    alt: 'Diverse group of professional healthcare providers and registered dietitians'
  },

  certificationBadges: {
    id: 'certification-badges',
    prompt: 'Modern medical certification badges and awards, clean vector style, healthcare blue and green colors, professional shield designs, trust symbols, high quality rendering',
    category: 'badge',
    aspectRatio: '1/1',
    sizes: {
      mobile: '200px',
      tablet: '300px',
      desktop: '400px'
    },
    resolutions: {
      '1x': '/images/ai-generated/certification-badges-400w.jpg',
      '2x': '/images/ai-generated/certification-badges-800w.jpg',
      '3x': '/images/ai-generated/certification-badges-1200w.jpg'
    },
    webp: {
      '1x': '/images/ai-generated/certification-badges-400w.webp',
      '2x': '/images/ai-generated/certification-badges-800w.webp',
      '3x': '/images/ai-generated/certification-badges-1200w.webp'
    },
    alt: 'Medical certification badges and professional credentials'
  },

  // User Journey Visualization
  foodScanningProcess: {
    id: 'food-scanning-process',
    prompt: 'Step-by-step food scanning process illustration, smartphone camera focusing on healthy meal, AI analysis overlay graphics, clean infographic style, healthcare color scheme',
    category: 'journey',
    aspectRatio: '16/10',
    sizes: {
      mobile: '100vw',
      tablet: '600px',
      desktop: '800px'
    },
    resolutions: {
      '1x': '/images/ai-generated/food-scanning-process-800w.jpg',
      '2x': '/images/ai-generated/food-scanning-process-1600w.jpg',
      '3x': '/images/ai-generated/food-scanning-process-2400w.jpg'
    },
    webp: {
      '1x': '/images/ai-generated/food-scanning-process-800w.webp',
      '2x': '/images/ai-generated/food-scanning-process-1600w.webp',
      '3x': '/images/ai-generated/food-scanning-process-2400w.webp'
    },
    alt: 'Step-by-step illustration of AI food scanning and analysis process'
  },

  healthTransformation: {
    id: 'health-transformation',
    prompt: 'Before and after health transformation visualization, split screen design, progress charts and healthy lifestyle imagery, professional medical illustration style',
    category: 'journey',
    aspectRatio: '16/9',
    sizes: {
      mobile: '100vw',
      tablet: '700px',
      desktop: '900px'
    },
    resolutions: {
      '1x': '/images/ai-generated/health-transformation-900w.jpg',
      '2x': '/images/ai-generated/health-transformation-1800w.jpg',
      '3x': '/images/ai-generated/health-transformation-2700w.jpg'
    },
    webp: {
      '1x': '/images/ai-generated/health-transformation-900w.webp',
      '2x': '/images/ai-generated/health-transformation-1800w.webp',
      '3x': '/images/ai-generated/health-transformation-2700w.webp'
    },
    alt: 'Health transformation visualization showing progress and improvement'
  }
};

// ======================
// OPTIMIZED IMAGE COMPONENT
// ======================

export const OptimizedAIImage: React.FC<OptimizedImageProps> = ({
  config,
  className,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
  overlay,
  fallback = '/images/placeholder-healthcare.svg'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(imgRef, { once: true, margin: '100px' });

  // Determine optimal image source based on device pixel ratio and viewport
  useEffect(() => {
    if (!isInView && loading === 'lazy') return;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const viewport = window.innerWidth;
    
    let selectedResolution: '1x' | '2x' | '3x' = '1x';
    
    if (devicePixelRatio >= 3) {
      selectedResolution = '3x';
    } else if (devicePixelRatio >= 2) {
      selectedResolution = '2x';
    }

    // Check WebP support
    const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('webp') > -1;
    
    const sourceMap = supportsWebP && config.webp ? config.webp : config.resolutions;
    setCurrentSrc(sourceMap[selectedResolution]);
  }, [isInView, loading, config]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    setCurrentSrc(fallback);
    onError?.();
  };

  const generateSrcSet = (sources: Record<string, string>) => {
    return Object.entries(sources)
      .map(([resolution, src]) => {
        const multiplier = resolution === '1x' ? '' : ` ${resolution.replace('x', '')}x`;
        return `${src}${multiplier}`;
      })
      .join(', ');
  };

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio: config.aspectRatio }}
    >
      {/* Loading Skeleton */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
        animate={{
          x: imageLoaded ? '100%' : ['-100%', '100%'],
          opacity: imageLoaded ? 0 : 1
        }}
        transition={{
          x: {
            repeat: imageLoaded ? 0 : Infinity,
            duration: 1.5,
            ease: "linear"
          },
          opacity: { duration: 0.3 }
        }}
      />

      {/* Main Image */}
      {(isInView || loading === 'eager') && currentSrc && (
        <picture>
          {/* WebP sources */}
          {config.webp && (
            <>
              <source
                media="(max-width: 768px)"
                sizes={config.sizes.mobile}
                srcSet={generateSrcSet(config.webp)}
                type="image/webp"
              />
              <source
                media="(max-width: 1024px)"
                sizes={config.sizes.tablet}
                srcSet={generateSrcSet(config.webp)}
                type="image/webp"
              />
              <source
                sizes={config.sizes.desktop}
                srcSet={generateSrcSet(config.webp)}
                type="image/webp"
              />
            </>
          )}
          
          {/* JPEG fallback sources */}
          <source
            media="(max-width: 768px)"
            sizes={config.sizes.mobile}
            srcSet={generateSrcSet(config.resolutions)}
            type="image/jpeg"
          />
          <source
            media="(max-width: 1024px)"
            sizes={config.sizes.tablet}
            srcSet={generateSrcSet(config.resolutions)}
            type="image/jpeg"
          />
          <source
            sizes={config.sizes.desktop}
            srcSet={generateSrcSet(config.resolutions)}
            type="image/jpeg"
          />
          
          {/* Main img element */}
          <motion.img
            src={currentSrc}
            alt={config.alt}
            className={cn(
              'absolute inset-0 w-full h-full transition-opacity duration-300',
              objectFit === 'cover' && 'object-cover',
              objectFit === 'contain' && 'object-contain',
              objectFit === 'fill' && 'object-fill',
              objectFit === 'none' && 'object-none',
              objectFit === 'scale-down' && 'object-scale-down'
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading={loading}
            decoding="async"
            animate={{
              opacity: imageLoaded ? 1 : 0,
              scale: imageLoaded ? 1 : 1.05
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </picture>
      )}

      {/* Overlay Content */}
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          {overlay}
        </div>
      )}

      {/* Error State */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="text-center text-neutral-500">
            <div className="text-sm">Image not available</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ======================
// SPECIALIZED IMAGE COMPONENTS
// ======================

interface HeroImageProps {
  imageKey: keyof typeof AI_GENERATED_IMAGES;
  className?: string;
  overlay?: React.ReactNode;
}

export const HeroAIImage: React.FC<HeroImageProps> = ({ imageKey, className, overlay }) => {
  const config = AI_GENERATED_IMAGES[imageKey];
  
  if (!config || config.category !== 'hero') {
    console.warn(`Invalid hero image key: ${imageKey}`);
    return null;
  }

  return (
    <OptimizedAIImage
      config={config}
      className={className}
      loading="eager"
      overlay={overlay}
      objectFit="cover"
    />
  );
};

interface FeatureImageProps {
  imageKey: keyof typeof AI_GENERATED_IMAGES;
  className?: string;
  lazy?: boolean;
}

export const FeatureAIImage: React.FC<FeatureImageProps> = ({ 
  imageKey, 
  className, 
  lazy = true 
}) => {
  const config = AI_GENERATED_IMAGES[imageKey];
  
  if (!config || config.category !== 'feature') {
    console.warn(`Invalid feature image key: ${imageKey}`);
    return null;
  }

  return (
    <OptimizedAIImage
      config={config}
      className={className}
      loading={lazy ? 'lazy' : 'eager'}
      objectFit="contain"
    />
  );
};

interface TrustImageProps {
  imageKey: keyof typeof AI_GENERATED_IMAGES;
  className?: string;
}

export const TrustAIImage: React.FC<TrustImageProps> = ({ imageKey, className }) => {
  const config = AI_GENERATED_IMAGES[imageKey];
  
  if (!config || config.category !== 'trust') {
    console.warn(`Invalid trust image key: ${imageKey}`);
    return null;
  }

  return (
    <OptimizedAIImage
      config={config}
      className={className}
      loading="lazy"
      objectFit="cover"
    />
  );
};

interface BadgeImageProps {
  imageKey: keyof typeof AI_GENERATED_IMAGES;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BadgeAIImage: React.FC<BadgeImageProps> = ({ 
  imageKey, 
  className, 
  size = 'md' 
}) => {
  const config = AI_GENERATED_IMAGES[imageKey];
  
  if (!config || config.category !== 'badge') {
    console.warn(`Invalid badge image key: ${imageKey}`);
    return null;
  }

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <OptimizedAIImage
      config={config}
      className={cn(sizeClasses[size], className)}
      loading="lazy"
      objectFit="contain"
    />
  );
};

// ======================
// IMAGE GALLERY COMPONENT
// ======================

interface ImageGalleryProps {
  images: (keyof typeof AI_GENERATED_IMAGES)[];
  className?: string;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
}

export const AIImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  className,
  columns = 3,
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  return (
    <div 
      className={cn(
        'grid',
        `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`,
        gapClasses[gap],
        className
      )}
    >
      {images.map((imageKey, index) => {
        const config = AI_GENERATED_IMAGES[imageKey];
        if (!config) return null;

        return (
          <motion.div
            key={imageKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <OptimizedAIImage
              config={config}
              className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              loading="lazy"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

// ======================
// EXPORT ALL COMPONENTS
// ======================

export {
  AI_GENERATED_IMAGES,
  OptimizedAIImage as default
}; 