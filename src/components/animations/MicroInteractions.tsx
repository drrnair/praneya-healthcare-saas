'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ANIMATION_VARIANTS, 
  SPRING_PRESETS, 
  ANIMATION_TIMING, 
  hapticFeedback,
} from '@/lib/animations/animation-system';

// ======================
// ANIMATED BUTTON COMPONENT
// ======================

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  haptic?: 'light' | 'medium' | 'heavy' | 'none';
  ripple?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  isLoading = false,
  haptic = 'light',
  ripple = true,
  onClick,
  disabled,
  ...props
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const controls = useAnimation();

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    // Haptic feedback
    if (haptic !== 'none') {
      hapticFeedback[haptic]();
    }

    // Ripple effect
    if (ripple && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    onClick?.(event);
  }, [disabled, isLoading, haptic, ripple, onClick]);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg hover:from-teal-700 hover:to-cyan-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-teal-600 text-teal-600 hover:bg-teal-50',
    ghost: 'text-teal-600 hover:bg-teal-50'
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-teal-500/50 disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      variants={ANIMATION_VARIANTS.buttonHover}
      initial="rest"
      whileHover={!disabled && !isLoading ? "hover" : undefined}
      whileTap={!disabled && !isLoading ? "tap" : undefined}
      animate={controls}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION_TIMING.FAST }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Button content */}
      <motion.span
        className={cn(
          'flex items-center justify-center gap-2',
          isLoading && 'opacity-0'
        )}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: ANIMATION_TIMING.FAST }}
      >
        {children}
      </motion.span>

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 10, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </motion.button>
  );
};

// ======================
// ANIMATED CARD COMPONENT
// ======================

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  tilt?: boolean;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  hover = true,
  tilt = false,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }, [tilt, x, y]);

  const handleMouseLeave = useCallback(() => {
    if (!tilt) return;
    
    x.set(0);
    y.set(0);
  }, [tilt, x, y]);

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'bg-white rounded-2xl border border-gray-200 overflow-hidden',
        onClick && 'cursor-pointer',
        className
      )}
      variants={hover ? ANIMATION_VARIANTS.cardHover : undefined}
      initial="rest"
      whileHover={hover && onClick ? "hover" : undefined}
      style={tilt ? { rotateX, rotateY, transformPerspective: 1000 } : {}}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  );
};

// ======================
// ANIMATED INPUT COMPONENT
// ======================

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  success,
  className,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    hapticFeedback.light();
    onFocus?.(event);
  }, [onFocus]);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(event.target.value.length > 0);
    onBlur?.(event);
  }, [onBlur]);

  return (
    <div className="relative">
      {/* Floating label */}
      {label && (
        <motion.label
          className={cn(
            'absolute left-3 pointer-events-none transition-all duration-200',
            isFocused || hasValue
              ? 'top-0 text-xs bg-white px-1 text-teal-600 -translate-y-1/2'
              : 'top-1/2 text-gray-500 -translate-y-1/2',
            error && 'text-red-500',
            success && 'text-green-500'
          )}
          animate={{
            scale: isFocused || hasValue ? 0.85 : 1,
          }}
          transition={SPRING_PRESETS.GENTLE}
        >
          {label}
        </motion.label>
      )}

      {/* Input field */}
      <motion.input
        className={cn(
          'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none',
          isFocused
            ? 'border-teal-500 shadow-lg shadow-teal-500/20'
            : 'border-gray-200 hover:border-gray-300',
          error && 'border-red-500 focus:border-red-500',
          success && 'border-green-500 focus:border-green-500',
          className
        )}
        onFocus={handleFocus}
        onBlur={handleBlur}
        whileFocus={{
          scale: 1.02,
          transition: SPRING_PRESETS.GENTLE
        }}
        {...props}
      />

      {/* Error message */}
      {error && (
        <motion.p
          className="mt-1 text-sm text-red-500"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING_PRESETS.GENTLE}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

// ======================
// ANIMATED TOGGLE COMPONENT
// ======================

interface AnimatedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const AnimatedToggle: React.FC<AnimatedToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false
}) => {
  const handleToggle = useCallback(() => {
    if (disabled) return;
    
    hapticFeedback.medium();
    onChange(!checked);
  }, [checked, onChange, disabled]);

  return (
    <div className="flex items-center gap-3">
      <motion.button
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
          checked ? 'bg-teal-600' : 'bg-gray-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={handleToggle}
        disabled={disabled}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        <motion.span
          className="inline-block h-4 w-4 rounded-full bg-white shadow-lg"
          animate={{
            x: checked ? 24 : 4,
          }}
          transition={SPRING_PRESETS.SNAPPY}
        />
      </motion.button>
      
      {label && (
        <span className={cn('text-sm font-medium', disabled && 'opacity-50')}>
          {label}
        </span>
      )}
    </div>
  );
}; 