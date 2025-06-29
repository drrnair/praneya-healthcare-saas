/**
 * Praneya Animation System
 * Sophisticated animations and micro-interactions for 2025 design trends
 * Based on neuroscience principles for optimal cognitive processing
 */

import { Variants } from 'framer-motion';

// ======================
// NEUROSCIENCE-BASED TIMING
// ======================

export const ANIMATION_TIMING = {
  // Micro-interactions (immediate feedback)
  INSTANT: 0.1,        // 100ms - Immediate response threshold
  QUICK: 0.2,          // 200ms - Optimal for button feedback
  FAST: 0.3,           // 300ms - Card hover effects
  
  // Standard interactions
  NORMAL: 0.5,         // 500ms - Page transitions
  SMOOTH: 0.7,         // 700ms - Complex transformations
  SLOW: 1.0,           // 1000ms - Attention-grabbing animations
  
  // Attention and focus
  FOCUS: 1.2,          // 1200ms - Hero animations
  EMPHASIZE: 1.5,      // 1500ms - Important announcements
  DRAMATIC: 2.0,       // 2000ms - Storytelling animations
} as const;

// ======================
// SPRING PHYSICS PRESETS
// ======================

export const SPRING_PRESETS = {
  GENTLE: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  },
  BOUNCY: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
    mass: 0.6,
  },
  SNAPPY: {
    type: "spring" as const,
    stiffness: 500,
    damping: 35,
    mass: 0.5,
  },
  SMOOTH: {
    type: "spring" as const,
    stiffness: 250,
    damping: 40,
    mass: 1.0,
  },
} as const;

// ======================
// EASING FUNCTIONS
// ======================

export const EASING = {
  EASE_OUT: [0.25, 0.46, 0.45, 0.94],
  EASE_IN: [0.55, 0.055, 0.675, 0.19],
  EASE_IN_OUT: [0.645, 0.045, 0.355, 1],
  EASE_OUT_BACK: [0.34, 1.56, 0.64, 1],
  EASE_OUT_CIRC: [0.08, 0.82, 0.17, 1],
  EASE_OUT_QUART: [0.25, 1, 0.5, 1],
} as const;

// ======================
// ANIMATION VARIANTS
// ======================

export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: ANIMATION_TIMING.FAST, ease: EASING.EASE_OUT }
    }
  } as Variants,
  
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: ANIMATION_TIMING.NORMAL, ease: EASING.EASE_OUT }
    }
  } as Variants,
  
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: ANIMATION_TIMING.NORMAL, ease: EASING.EASE_OUT }
    }
  } as Variants,
  
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: SPRING_PRESETS.GENTLE
    }
  } as Variants,
  
  scaleInBounce: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: SPRING_PRESETS.BOUNCY
    }
  } as Variants,
  
  slideInLeft: {
    hidden: { x: -100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: ANIMATION_TIMING.SMOOTH, ease: EASING.EASE_OUT_BACK }
    }
  } as Variants,
  
  slideInRight: {
    hidden: { x: 100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { duration: ANIMATION_TIMING.SMOOTH, ease: EASING.EASE_OUT_BACK }
    }
  } as Variants,
  
  buttonHover: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: SPRING_PRESETS.SNAPPY
    },
    tap: { 
      scale: 0.98,
      transition: SPRING_PRESETS.SNAPPY
    }
  } as Variants,
  
  cardHover: {
    rest: { 
      scale: 1, 
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
    },
    hover: { 
      scale: 1.02,
      y: -4,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: SPRING_PRESETS.GENTLE
    }
  } as Variants,
  
  staggerChildren: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  } as Variants,
  
  pulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: ANIMATION_TIMING.SLOW,
        repeat: Infinity,
        ease: EASING.EASE_IN_OUT
      }
    }
  } as Variants,
} as const;

// ======================
// MICRO-INTERACTION UTILITIES
// ======================

export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 10, 30]);
    }
  },
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  },
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }
};

// ======================
// ACCESSIBILITY UTILITIES
// ======================

export const respectMotionPreferences = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return { duration: 0.01, ease: "linear" as const };
  }
  
  return { duration: ANIMATION_TIMING.NORMAL, ease: EASING.EASE_OUT };
};

// ======================
// SCROLL ANIMATIONS
// ======================

export const scrollAnimation = {
  fadeInOnScroll: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: ANIMATION_TIMING.NORMAL,
        ease: EASING.EASE_OUT
      }
    }
  } as Variants,
  
  slideInOnScroll: {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: ANIMATION_TIMING.SMOOTH,
        ease: EASING.EASE_OUT_BACK
      }
    }
  } as Variants,
}; 