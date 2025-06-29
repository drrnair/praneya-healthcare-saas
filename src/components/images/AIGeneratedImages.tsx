'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Sparkles, Image as ImageIcon, Wind, Zap } from 'lucide-react';

// ===================================
// VIBRANT AI IMAGE TYPES - 2025 EDITION
// ===================================

export interface AIImageConfig {
  id: string;
  prompt: string;
  category: 'hero' | 'feature' | 'trust' | 'journey' | 'testimonial' | 'badge';
  aspectRatio: string;
  alt: string;
  priority?: boolean;
}

export interface VibrantImageProps {
  config: AIImageConfig;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  overlay?: React.ReactNode;
  fallback?: string;
  shimmer?: boolean;
}

// ===================================
// VIBRANT AI IMAGE CONFIGURATIONS
// ===================================

export const AI_GENERATED_IMAGES: Record<string, AIImageConfig> = {
  // Hero Section Images
  heroFamilyCooking: {
    id: 'hero-family-cooking',
    prompt:
      'Vibrant, abstract representation of a diverse multi-generational family cooking a healthy colorful meal together, style of digital art, volumetric lighting',
    category: 'hero',
    aspectRatio: '16/9',
    alt: 'AI-generated image of a diverse family cooking a healthy meal',
    priority: true,
  },

  heroAIInterface: {
    id: 'hero-ai-interface',
    prompt:
      'Futuristic AI-powered smartphone interface displaying food recognition technology with glowing data visualizations, holographic style',
    category: 'hero',
    aspectRatio: '3/4',
    alt: 'AI-powered smartphone showing food recognition technology',
    priority: true,
  },

  // Feature Demonstration Images
  nutritionDashboard: {
    id: 'nutrition-dashboard',
    prompt:
      'Clean, modern, and vibrant nutrition app dashboard interface with colorful 3D charts and data visualizations, glassmorphism',
    category: 'feature',
    aspectRatio: '16/10',
    alt: 'Modern nutrition app dashboard with health metrics and charts',
  },

  familyMealPlanning: {
    id: 'family-meal-planning',
    prompt:
      'Heartwarming scene of a family joyfully meal planning on a futuristic transparent tablet, with holographic recipe suggestions floating above',
    category: 'feature',
    aspectRatio: '4/3',
    alt: 'Family planning healthy meals with a futuristic AI tablet',
  },

  // Trust Building Images
  healthcareProfessionals: {
    id: 'healthcare-professionals',
    prompt:
      'A diverse group of professional, friendly, and approachable registered dietitians and healthcare professionals in a modern, bright clinic, soft focus',
    category: 'trust',
    aspectRatio: '16/9',
    alt: 'Diverse group of professional healthcare providers and registered dietitians',
  },

  certificationBadges: {
    id: 'certification-badges',
    prompt: 'A collection of sleek, modern, glowing medical certification badges and awards, in a holographic display',
    category: 'badge',
    aspectRatio: '1/1',
    alt: 'AI-generated image of medical certification badges',
  },
};

// ===================================
// NEW: VIBRANT AI GENERATED IMAGE COMPONENT
// ===================================

export const VibrantAIGeneratedImage: React.FC<VibrantImageProps> = ({
  config,
  className,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
  overlay,
  fallback = '/images/placeholder-healthcare.svg',
  shimmer = false,
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

  // Use a real image path for demonstration. In a real app, this would come from a CDN.
  const imagePath = `/images/hero/diverse-families-cooking.jpg`; 

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-2xl shadow-lg border border-white/10',
        className
      )}
      style={{ aspectRatio: config.aspectRatio }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-animated-waves" />

      {/* Shimmer Effect */}
      <AnimatePresence>
        {!imageLoaded && !imageError && shimmer && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </AnimatePresence>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%2032%2032%27%20width=%2732%27%20height=%2732%27%20fill=%27none%27%20stroke=%27rgb(255%20255%20255%20/%200.1)%27%3e%3cpath%20d=%27M0%20.5H31.5V32%27/%3e%3c/svg%3e')]"
           style={{ backgroundSize: '32px 32px' }} />

      {/* Actual Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded && !imageError ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src={imageError ? fallback : imagePath}
          alt={config.alt}
          fill
          style={{ objectFit }}
          loading={loading}
          onLoad={handleImageLoad}
          onError={handleImageError}
          priority={config.priority}
          className="transition-all duration-300 group-hover:scale-105"
        />
      </motion.div>

      {/* AI Generation Badge */}
      <motion.div
        className="absolute top-3 right-3 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        ✨ AI Generated
      </motion.div>

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          {overlay}
        </div>
      )}
    </motion.div>
  );
};

// ===================================
// SPECIALIZED COMPONENTS (Updated)
// ===================================

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
    console.warn(`Invalid hero image key: ${imageKey}`);
    return null;
  }

  return (
    <VibrantAIGeneratedImage
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
    console.warn(`Invalid feature image key: ${imageKey}`);
    return null;
  }

  return (
    <VibrantAIGeneratedImage
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
    console.warn(`Invalid trust image key: ${imageKey}`);
    return null;
  }
  return <VibrantAIGeneratedImage config={config} {...(className && { className })} />;
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
    console.warn(`Invalid badge image key: ${imageKey}`);
    return null;
  }

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <VibrantAIGeneratedImage
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
  const gapClasses = { sm: 'gap-2', md: 'gap-4', lg: 'gap-8' };

  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${columns}`,
        gapClasses[gap],
        className
      )}
    >
      {images.map((key) => {
        const config = AI_GENERATED_IMAGES[key];
        if (!config) {
          console.warn(`Invalid image key in gallery: ${key}`);
          return null;
        }
        return <VibrantAIGeneratedImage key={key} config={config} />;
      })}
    </div>
  );
};

// Simplified Shimmer Effect Component
const ShimmerEffect = () => (
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
);

export const AIGeneratedImages = () => {
  // console.log("Rendering AIGeneratedImages component");

  const imageVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="p-4 md:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {/* Main large image */}
        <div className="col-span-2 row-span-2">
          <VibrantAIGeneratedImage
            config={AI_GENERATED_IMAGES.heroFamilyCooking}
            shimmer={true}
          />
        </div>

        {/* Smaller images */}
        <VibrantAIGeneratedImage
          src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
          alt="AI Generated Fresh Salad"
        />
        <VibrantAIGeneratedImage
          src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80"
          alt="AI Generated Healthy Bowl"
        />
        <VibrantAIGeneratedImage
          src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80"
          alt="AI Generated Salmon Dish"
        />
        <VibrantAIGeneratedImage
          src="https://images.unsplash.com/photo-1484723050470-6b39d986cc87?w=800&q=80"
          alt="AI Generated Breakfast Toast"
        />
      </div>

      <div className="mt-6 text-center">
        <h3 className="text-xl font-bold text-gradient-hero">Vibrant AI-Enhanced Meal Visualizations</h3>
        <p className="text-neutral-300 mt-2 max-w-2xl mx-auto">
          Our AI doesn't just analyze nutrition; it generates stunning, inspirational images of your future healthy meals. See your diet in a whole new light.
        </p>
        <button className="mt-4 btn-vibrant-purple">
          <Sparkles className="w-5 h-5 mr-2" />
          Visualize My Meal Plan
        </button>
      </div>
    </div>
  );
};

export default AIGeneratedImages;
