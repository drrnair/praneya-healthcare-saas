// Healthcare Onboarding Animation Library
// Smooth, engaging animations optimized for healthcare UX

export const onboardingAnimations = {
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },

  // Logo and branding animations
  logoReveal: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: { 
      type: "spring", 
      stiffness: 200, 
      damping: 15,
      delay: 0.3 
    }
  },

  // Progress animations
  progressBar: {
    initial: { width: 0 },
    animate: (progress: number) => ({ width: `${progress}%` }),
    transition: { duration: 0.8, ease: "easeOut" }
  },

  progressShine: {
    animate: { x: ["-100%", "100%"] },
    transition: { 
      duration: 2, 
      repeat: Infinity, 
      ease: "easeInOut",
      repeatDelay: 3 
    }
  },

  // Form field animations
  fieldFocus: {
    whileFocus: { scale: 1.02 },
    transition: { duration: 0.2 }
  },

  fieldSuccess: {
    animate: { 
      borderColor: ["#10B981", "#34D399", "#10B981"],
      backgroundColor: ["#F0FDF4", "#ECFDF5", "#F0FDF4"]
    },
    transition: { duration: 0.6, ease: "easeInOut" }
  },

  // Achievement celebrations
  celebrationPop: {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1.2, 1],
      opacity: [0, 1, 1],
      rotate: [0, 10, -10, 0]
    },
    exit: { scale: 0, opacity: 0 },
    transition: { 
      duration: 0.8,
      times: [0, 0.6, 1],
      ease: "easeOut"
    }
  },

  achievementBadge: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: { 
      type: "spring", 
      stiffness: 400,
      damping: 20
    }
  },

  // Button interactions
  primaryButton: {
    whileHover: { 
      scale: 1.02, 
      y: -2,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
    },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  },

  secondaryButton: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  },

  // Health goal selections
  goalSelection: {
    whileHover: { scale: 1.05, y: -3 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 }
  },

  goalSelected: {
    animate: { 
      borderColor: "#3B82F6",
      backgroundColor: "#EBF8FF",
      scale: [1, 1.05, 1]
    },
    transition: { duration: 0.3 }
  },

  // Subscription plan animations
  planCard: {
    whileHover: { 
      y: -5,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
    },
    transition: { duration: 0.3 }
  },

  planSelected: {
    animate: { 
      scale: 1.05,
      borderColor: "#3B82F6"
    },
    transition: { duration: 0.3 }
  },

  // Consent document animations
  consentModal: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: { duration: 0.3 }
  },

  scrollProgress: {
    animate: (progress: number) => ({ width: `${progress}%` }),
    transition: { duration: 0.3 }
  },

  // Trust indicators
  trustBadgeStagger: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: (index: number) => ({
      delay: 1.2 + (index * 0.1),
      duration: 0.4
    })
  },

  // Step indicators
  stepIndicator: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: (index: number) => ({
      delay: index * 0.1,
      duration: 0.3
    })
  },

  stepComplete: {
    animate: { 
      backgroundColor: "#3B82F6",
      borderColor: "#3B82F6",
      color: "#FFFFFF"
    },
    transition: { duration: 0.3 }
  },

  // Health assessment chat
  chatMessage: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: (index: number) => ({
      delay: index * 0.1,
      duration: 0.3
    })
  },

  // Floating elements
  floatingElement: {
    animate: { 
      y: [0, -10, 0],
      rotate: [0, 2, -2, 0]
    },
    transition: { 
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  // Loading states
  loadingSpinner: {
    animate: { rotate: 360 },
    transition: { 
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  },

  loadingPulse: {
    animate: { 
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7]
    },
    transition: { 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Animation variants for complex sequences
export const sequenceAnimations = {
  welcomeSequence: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    }
  },

  trustIndicatorSequence: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 1
      }
    },
    item: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 }
    }
  },

  formFieldSequence: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 }
    }
  }
};

// Haptic feedback patterns
export const hapticPatterns = {
  success: [100, 50, 100],
  achievement: [50, 30, 50, 30, 100],
  error: [200],
  selection: [50],
  completion: [100, 50, 100, 50, 200]
};

// Trigger haptic feedback if available
export const triggerHaptic = (pattern: keyof typeof hapticPatterns) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(hapticPatterns[pattern]);
  }
};

// Animation presets for different healthcare contexts
export const healthcarePresets = {
  gentle: {
    duration: 0.6,
    ease: "easeOut",
    scale: { from: 0.95, to: 1.02 }
  },
  
  encouraging: {
    duration: 0.4,
    ease: "easeInOut",
    bounce: { amplitude: 0.1, frequency: 2 }
  },
  
  trustworthy: {
    duration: 0.8,
    ease: "easeInOut",
    fade: { from: 0, to: 1 }
  },
  
  celebratory: {
    duration: 1.2,
    ease: "easeOut",
    confetti: true,
    scale: { from: 0, to: 1.1, settle: 1 }
  }
};

// Accessibility-friendly reduced motion variants
export const reducedMotionAnimations = {
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  
  logoReveal: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 }
  },
  
  celebration: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }
};

// Utility function to get animation based on user preferences
export const getAnimation = (animationKey: keyof typeof onboardingAnimations, respectMotionPreference = true) => {
  const prefersReducedMotion = respectMotionPreference && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion && reducedMotionAnimations[animationKey as keyof typeof reducedMotionAnimations]) {
    return reducedMotionAnimations[animationKey as keyof typeof reducedMotionAnimations];
  }
  
  return onboardingAnimations[animationKey];
};

export default onboardingAnimations; 