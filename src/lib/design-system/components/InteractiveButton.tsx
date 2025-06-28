'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useHealthcareTheme } from '../theme-provider';
import { InteractiveButtonProps } from '../types';

const buttonVariants: Variants = {
  idle: { 
    scale: 1,
    boxShadow: 'var(--shadow-subtle)',
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },
  hover: { 
    scale: 1.02,
    y: -2,
    boxShadow: 'var(--shadow-raised)',
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  },
  active: { 
    scale: 0.98,
    y: 0,
    transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] }
  },
  loading: {
    scale: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  success: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] }
  },
  error: {
    x: [-2, 2, -2, 2, 0],
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
  }
};

const iconVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.68, -0.55, 0.265, 1.55] }
  },
  spin: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  }
};

export function InteractiveButton({
  children,
  variant = 'primary',
  size = 'md',
  state = 'idle',
  onClick,
  disabled = false,
  className = '',
  enableHaptics = false,
  celebrateSuccess = true,
  loadingText = 'Loading...',
  successText = 'Success!',
  errorText = 'Error',
  ariaLabel,
  ...props
}: InteractiveButtonProps) {
  const { theme } = useHealthcareTheme();
  const [internalState, setInternalState] = useState(state);
  const [isProcessing, setIsProcessing] = useState(false);

  // Haptic feedback simulation
  const triggerHaptic = (pattern: 'light' | 'medium' | 'heavy') => {
    if (!enableHaptics) return;
    
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50, 20, 50]
      };
      navigator.vibrate(patterns[pattern]);
    }
  };

  // Handle click with state management
  const handleClick = async () => {
    if (disabled || isProcessing || !onClick) return;

    triggerHaptic('light');
    setIsProcessing(true);
    setInternalState('loading');

    try {
      await onClick();
      
      if (celebrateSuccess) {
        setInternalState('success');
        triggerHaptic('medium');
        
        setTimeout(() => {
          setInternalState('idle');
          setIsProcessing(false);
        }, 1500);
      } else {
        setInternalState('idle');
        setIsProcessing(false);
      }
    } catch (error) {
      setInternalState('error');
      triggerHaptic('heavy');
      
      setTimeout(() => {
        setInternalState('idle');
        setIsProcessing(false);
      }, 2000);
    }
  };

  // Sync external state
  useEffect(() => {
    if (!isProcessing) {
      setInternalState(state);
    }
  }, [state, isProcessing]);

  // Get variant styles
  const getVariantStyles = () => {
    const baseStyles = 'font-medium transition-all duration-base ease-healthcare border border-transparent';
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-300`;
      case 'secondary':
        return `${baseStyles} bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-2 focus:ring-secondary-300`;
      case 'accent':
        return `${baseStyles} bg-accent-500 text-white hover:bg-accent-600 focus:ring-2 focus:ring-accent-300`;
      case 'tier':
        return `${baseStyles} bg-tier-primary text-white hover:brightness-90 focus:ring-2 focus:ring-tier-primary focus:ring-opacity-50`;
      default:
        return baseStyles;
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm rounded-md min-h-[36px]';
      case 'md':
        return 'px-4 py-2 text-base rounded-md min-h-[44px]';
      case 'lg':
        return 'px-6 py-3 text-lg rounded-lg min-h-[52px]';
      case 'xl':
        return 'px-8 py-4 text-xl rounded-lg min-h-[60px]';
      default:
        return 'px-4 py-2 text-base rounded-md min-h-[44px]';
    }
  };

  // Get state-specific content
  const getStateContent = () => {
    switch (internalState) {
      case 'loading':
        return (
          <div className="flex items-center justify-center gap-2">
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              variants={iconVariants}
              animate="spin"
            />
            <span>{loadingText}</span>
          </div>
        );
      case 'success':
        return (
          <motion.div 
            className="flex items-center justify-center gap-2"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="text-lg">✓</span>
            <span>{successText}</span>
          </motion.div>
        );
      case 'error':
        return (
          <motion.div 
            className="flex items-center justify-center gap-2"
            variants={iconVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="text-lg">⚠</span>
            <span>{errorText}</span>
          </motion.div>
        );
      default:
        return children;
    }
  };

  // Get disabled styles
  const getDisabledStyles = () => {
    if (disabled || isProcessing) {
      return 'opacity-50 cursor-not-allowed';
    }
    return 'cursor-pointer';
  };

  return (
    <motion.button
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${getDisabledStyles()}
        ${className}
        relative overflow-hidden
        focus:outline-none focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      variants={buttonVariants}
      initial="idle"
      animate={internalState}
      whileHover={!disabled && !isProcessing ? "hover" : undefined}
      whileTap={!disabled && !isProcessing ? "active" : undefined}
      onClick={handleClick}
      disabled={disabled || isProcessing}
      aria-label={ariaLabel}
      aria-busy={internalState === 'loading'}
      {...props}
    >
      {/* Background animation for premium tier */}
      {theme.tier === 'premium' && internalState === 'success' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        />
      )}

      {/* Content with state transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={internalState}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {getStateContent()}
        </motion.div>
      </AnimatePresence>

      {/* Success celebration particles (premium tier) */}
      {theme.tier === 'premium' && celebrateSuccess && internalState === 'success' && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xs"
              initial={{ 
                opacity: 0, 
                scale: 0, 
                x: '50%', 
                y: '50%' 
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: ['50%', `${50 + (i - 1) * 30}%`],
                y: ['50%', '20%'],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      {/* Accessibility announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {internalState === 'loading' && `Loading, please wait`}
        {internalState === 'success' && `Action completed successfully`}
        {internalState === 'error' && `An error occurred, please try again`}
      </div>
    </motion.button>
  );
} 
