'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, useDragControls, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal, Star, Heart, Share } from 'lucide-react';
import { cn } from '@/lib/utils';

// ======================
// INTERFACES & TYPES
// ======================

interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  hapticFeedback?: boolean;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onLongPress?: () => void;
  className?: string;
}

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}

interface GestureIndicatorProps {
  direction: 'left' | 'right' | 'up' | 'down';
  visible: boolean;
  className?: string;
}

// ======================
// HAPTIC FEEDBACK UTILITY
// ======================

const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 30]
    };
    navigator.vibrate(patterns[type]);
  }
};

// ======================
// TOUCH-OPTIMIZED BUTTON
// ======================

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  hapticFeedback = true
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    ghost: 'text-primary-500 hover:bg-primary-50'
  };

  const sizes = {
    sm: 'min-h-[40px] px-4 py-2 text-sm',
    md: 'min-h-[44px] px-6 py-3 text-base',
    lg: 'min-h-[48px] px-8 py-4 text-lg'
  };

  const handleClick = useCallback(() => {
    if (disabled) return;
    
    if (hapticFeedback) {
      triggerHapticFeedback('light');
    }
    
    onClick?.();
  }, [disabled, hapticFeedback, onClick]);

  return (
    <motion.button
      className={cn(
        'rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      onClick={handleClick}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      animate={{
        scale: isPressed && !disabled ? 0.98 : 1
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {children}
    </motion.button>
  );
};

// ======================
// SWIPEABLE CARD
// ======================

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onLongPress,
  className
}) => {
  const dragControls = useDragControls();
  const [dragX, setDragX] = useState(0);
  const longPressTimer = useRef<NodeJS.Timeout>();

  const handleDragStart = () => {
    triggerHapticFeedback('light');
  };

  const handleDrag = (event: any, info: PanInfo) => {
    setDragX(info.offset.x);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      triggerHapticFeedback('medium');
      
      if (info.offset.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (info.offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
    
    setDragX(0);
  };

  const handleTouchStart = () => {
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        triggerHapticFeedback('heavy');
        onLongPress();
      }, 500);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  return (
    <motion.div
      className={cn(
        'relative bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden touch-manipulation',
        className
      )}
      drag="x"
      dragConstraints={{ left: -150, right: 150 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      animate={{
        x: dragX,
        scale: Math.abs(dragX) > 50 ? 0.98 : 1
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 40
      }}
    >
      {/* Background Actions */}
      {(onSwipeLeft || onSwipeRight) && (
        <>
          {onSwipeRight && (
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-success-500 flex items-center justify-center px-6"
              animate={{
                opacity: dragX > 50 ? 1 : 0,
                width: Math.max(0, dragX)
              }}
            >
              <Heart className="text-white" size={24} />
            </motion.div>
          )}
          
          {onSwipeLeft && (
            <motion.div
              className="absolute right-0 top-0 bottom-0 bg-error-500 flex items-center justify-center px-6"
              animate={{
                opacity: dragX < -50 ? 1 : 0,
                width: Math.max(0, -dragX)
              }}
            >
              <Share className="text-white" size={24} />
            </motion.div>
          )}
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// ======================
// PULL TO REFRESH
// ======================

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
  className
}) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      setCanRefresh(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canRefresh || isRefreshing) return;

    const touch = e.touches[0];
    if (!touch) return;
    
    const startY = touch.clientY;
    const currentY = touch.clientY;
    const distance = Math.max(0, currentY - startY);

    setPullDistance(Math.min(distance, threshold * 1.5));

    if (distance > threshold * 0.5) {
      triggerHapticFeedback('light');
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > threshold && !isRefreshing) {
      setIsRefreshing(true);
      triggerHapticFeedback('medium');
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setCanRefresh(false);
      }
    } else {
      setPullDistance(0);
      setCanRefresh(false);
    }
  };

  const refreshOpacity = Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-auto touch-manipulation', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-primary-50 border-b border-primary-200 z-10"
        animate={{
          height: pullDistance,
          opacity: refreshOpacity
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      >
        <motion.div
          animate={{
            rotate: isRefreshing ? 360 : pullDistance * 2,
            scale: Math.min(pullDistance / threshold, 1)
          }}
          transition={{
            rotate: isRefreshing 
              ? { duration: 1, repeat: Infinity, ease: "linear" }
              : { type: "spring", stiffness: 400, damping: 40 }
          }}
          className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        animate={{
          paddingTop: pullDistance
        }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// ======================
// GESTURE INDICATOR
// ======================

export const GestureIndicator: React.FC<GestureIndicatorProps> = ({
  direction,
  visible,
  className
}) => {
  const icons = {
    left: <ChevronLeft size={24} />,
    right: <ChevronRight size={24} />,
    up: <motion.div 
      animate={{ y: [-5, 5, -5] }} 
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="text-2xl"
    >
      ↑
    </motion.div>,
    down: <motion.div 
      animate={{ y: [5, -5, 5] }} 
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="text-2xl"
    >
      ↓
    </motion.div>
  };

  return (
    <motion.div
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50 pointer-events-none',
        className
      )}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.8
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl"
        animate={{
          scale: visible ? [1, 1.1, 1] : 1
        }}
        transition={{
          scale: { repeat: Infinity, duration: 2 }
        }}
      >
        <div className="text-neutral-700">
          {icons[direction]}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ======================
// FLOATING ACTION BUTTON
// ======================

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  onClick,
  position = 'bottom-right',
  size = 'md',
  className
}) => {
  const positions = {
    'bottom-right': 'bottom-20 right-6',
    'bottom-left': 'bottom-20 left-6',
    'bottom-center': 'bottom-20 left-1/2 transform -translate-x-1/2'
  };

  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <motion.button
      className={cn(
        'fixed bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center z-50 touch-manipulation',
        positions[position],
        sizes[size],
        className
      )}
      onClick={() => {
        triggerHapticFeedback('medium');
        onClick();
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {icon}
    </motion.button>
  );
};

// ======================
// TOUCH RIPPLE EFFECT
// ======================

interface TouchRippleProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TouchRipple: React.FC<TouchRippleProps> = ({
  children,
  className,
  disabled = false
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = (e: React.TouchEvent) => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    const touch = e.touches[0];
    if (!touch) return;

    const rect = container.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y
    };

    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    triggerHapticFeedback('light');
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden touch-manipulation', className)}
      onTouchStart={createRipple}
    >
      {children}
      
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          initial={{
            width: 0,
            height: 0,
            x: ripple.x,
            y: ripple.y,
            opacity: 1
          }}
          animate={{
            width: 100,
            height: 100,
            x: ripple.x - 50,
            y: ripple.y - 50,
            opacity: 0
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}; 