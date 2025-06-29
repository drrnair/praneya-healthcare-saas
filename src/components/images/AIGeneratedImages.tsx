'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// ======================
// SIMPLIFIED AI IMAGE TYPES
// ======================

export interface AIImageConfig {
  id: string;
  prompt: string;
  category: 'hero' | 'feature' | 'trust' | 'journey' | 'testimonial' | 'badge';
  aspectRatio: string;
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
// SIMPLIFIED AI IMAGE CONFIGURATIONS
// ======================

export const AI_GENERATED_IMAGES: Record<string, AIImageConfig> = {
  // Hero Section Images
  heroFamilyCooking: {
    id: 'hero-family-cooking',
    prompt:
      'Diverse multi-generational family cooking healthy colorful meal together in modern kitchen',
    category: 'hero',
    aspectRatio: '16/9',
    alt: 'Diverse family cooking healthy meal together in modern kitchen',
    priority: true,
  },

  heroAIInterface: {
    id: 'hero-ai-interface',
    prompt:
      'AI-powered smartphone interface displaying food recognition technology',
    category: 'hero',
    aspectRatio: '3/4',
    alt: 'AI-powered smartphone showing food recognition technology',
    priority: true,
  },

  // Feature Demonstration Images
  nutritionDashboard: {
    id: 'nutrition-dashboard',
    prompt:
      'Clean modern nutrition app dashboard interface with colorful charts',
    category: 'feature',
    aspectRatio: '16/10',
    alt: 'Modern nutrition app dashboard with health metrics and charts',
  },

  familyMealPlanning: {
    id: 'family-meal-planning',
    prompt:
      'Family meal planning scene with tablet showing recipe recommendations',
    category: 'feature',
    aspectRatio: '4/3',
    alt: 'Family planning healthy meals with tablet showing recipe recommendations',
  },

  // Trust Building Images
  healthcareProfessionals: {
    id: 'healthcare-professionals',
    prompt:
      'Professional diverse group of registered dietitians and healthcare professionals',
    category: 'trust',
    aspectRatio: '16/9',
    alt: 'Diverse group of professional healthcare providers and registered dietitians',
  },

  certificationBadges: {
    id: 'certification-badges',
    prompt: 'Modern medical certification badges and awards',
    category: 'badge',
    aspectRatio: '1/1',
    alt: 'Medical certification badges and professional credentials',
  },
};

// ======================
// SIMPLIFIED OPTIMIZED IMAGE COMPONENT
// ======================

export const OptimizedAIImage: React.FC<OptimizedImageProps> = ({
  config,
  className,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
  overlay,
  fallback = '/images/placeholder-healthcare.svg',
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gradient-to-br from-teal-50 to-blue-50',
        className
      )}
      style={{ aspectRatio: config.aspectRatio }}
    >
      {/* Placeholder/Fallback Image */}
      <Image
        src={fallback}
        alt={config.alt}
        fill
        className={cn(
          'object-cover transition-opacity duration-300',
          imageLoaded && !imageError ? 'opacity-100' : 'opacity-100'
        )}
        style={{ objectFit }}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        priority={config.priority}
      />

      {/* Loading State */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      {/* AI Generation Notice */}
      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        AI Generated
      </div>

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          {overlay}
        </div>
      )}
    </div>
  );
};

// ======================
// SPECIALIZED COMPONENTS
// ======================

interface HeroImageProps {
  imageKey: keyof typeof AI_GENERATED_IMAGES;
  className?: string;
  overlay?: React.ReactNode;
}

export const HeroAIImage: React.FC<HeroImageProps> = ({
  imageKey,
  className,
  overlay,
}) => {
  const config = AI_GENERATED_IMAGES[imageKey];

  if (!config || config.category !== 'hero') {
    return null;
  }

  return (
    <OptimizedAIImage
      config={config}
      {...(className && { className })}
      loading="eager"
      {...(overlay && { overlay })}
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
  lazy = true,
}) => {
  const config = AI_GENERATED_IMAGES[imageKey];

  if (!config || config.category !== 'feature') {
    return null;
  }

  return (
    <OptimizedAIImage
      config={config}
      {...(className && { className })}
      loading={lazy ? 'lazy' : 'eager'}
    />
  );
};

interface TrustImageProps {
  imageKey: keyof typeof AI_GENERATED_IMAGES;
  className?: string;
}

export const TrustAIImage: React.FC<TrustImageProps> = ({
  imageKey,
  className,
}) => {
  const config = AI_GENERATED_IMAGES[imageKey];

  if (!config || config.category !== 'trust') {
    return null;
  }

  return <OptimizedAIImage config={config} {...(className && { className })} />;
};

interface BadgeImageProps {
  imageKey: keyof typeof AI_GENERATED_IMAGES;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BadgeAIImage: React.FC<BadgeImageProps> = ({
  imageKey,
  className,
  size = 'md',
}) => {
  const config = AI_GENERATED_IMAGES[imageKey];

  if (!config || config.category !== 'badge') {
    return null;
  }

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <OptimizedAIImage
      config={config}
      className={cn(sizeClasses[size], className)}
    />
  );
};

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
  gap = 'md',
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      className={cn(
        'grid',
        gapClasses[gap],
        `grid-cols-1 md:grid-cols-${Math.min(columns, 2)} lg:grid-cols-${columns}`,
        className
      )}
    >
      {images.map(imageKey => {
        const config = AI_GENERATED_IMAGES[imageKey];
        if (!config) return null;

        return (
          <motion.div
            key={imageKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OptimizedAIImage
              config={config}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
        );
      })}
    </div>
  );
};
