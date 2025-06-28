'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthcareTheme } from '../theme-provider';
import { NotificationToastProps } from '../types';

const toastVariants = {
  hidden: { 
    opacity: 0, 
    x: 300, 
    scale: 0.8,
    rotate: 5 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    rotate: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      duration: 0.5 
    }
  },
  exit: { 
    opacity: 0, 
    x: 300, 
    scale: 0.8,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

const celebrationVariants = {
  subtle: {
    scale: [1, 1.02, 1],
    transition: { duration: 0.6, ease: "easeInOut" }
  },
  moderate: {
    scale: [1, 1.05, 1],
    y: [0, -2, 0],
    transition: { duration: 0.8, ease: "backOut" }
  },
  enthusiastic: {
    scale: [1, 1.1, 0.95, 1.05, 1],
    y: [0, -5, 0, -2, 0],
    rotate: [0, 2, -1, 1, 0],
    transition: { duration: 1.2, ease: "backOut" }
  }
};

export function NotificationToast({
  id,
  type,
  title,
  message,
  achievement,
  duration = 5000,
  onDismiss,
  onAction,
  actionLabel,
  showProgress = true,
  celebrationLevel = 'moderate',
  tier = 'enhanced'
}: NotificationToastProps) {
  const { theme } = useHealthcareTheme();
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-dismiss timer
  useEffect(() => {
    if (duration <= 0 || isHovered) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          setIsVisible(false);
          setTimeout(() => onDismiss?.(id), 300);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, id, onDismiss, isHovered]);

  // Get toast configuration based on type
  const getToastConfig = () => {
    const configs = {
      achievement: {
        icon: achievement?.badgeIcon || '🏆',
        bgColor: 'bg-success-50',
        borderColor: 'border-success-200',
        textColor: 'text-success-800',
        iconBg: 'bg-success-100',
        progressColor: 'bg-success-500'
      },
      celebration: {
        icon: '🎉',
        bgColor: 'bg-tier-gradient',
        borderColor: 'border-tier-border',
        textColor: 'text-tier',
        iconBg: 'bg-tier-surface',
        progressColor: 'bg-tier-primary'
      },
      reminder: {
        icon: '⏰',
        bgColor: 'bg-primary-50',
        borderColor: 'border-primary-200',
        textColor: 'text-primary-800',
        iconBg: 'bg-primary-100',
        progressColor: 'bg-primary-500'
      },
      warning: {
        icon: '⚠️',
        bgColor: 'bg-warning-50',
        borderColor: 'border-warning-200',
        textColor: 'text-warning-800',
        iconBg: 'bg-warning-100',
        progressColor: 'bg-warning-500'
      },
      info: {
        icon: 'ℹ️',
        bgColor: 'bg-neutral-50',
        borderColor: 'border-neutral-200',
        textColor: 'text-neutral-800',
        iconBg: 'bg-neutral-100',
        progressColor: 'bg-neutral-500'
      }
    };
    
    return configs[type] || configs.info;
  };

  const config = getToastConfig();

  // Handle dismiss
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(id), 300);
  };

  // Handle action click
  const handleAction = () => {
    onAction?.();
    handleDismiss();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`
          max-w-sm w-full ${config.bgColor} border ${config.borderColor} rounded-lg shadow-floating
          ${tier === 'premium' ? 'shadow-modal' : 'shadow-raised'}
          relative overflow-hidden
        `}
        variants={toastVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        layout
      >
        {/* Progress bar */}
        {showProgress && duration > 0 && (
          <motion.div
            className="absolute top-0 left-0 h-1 bg-opacity-50"
            style={{
              width: `${progress}%`,
              backgroundColor: config.progressColor.replace('bg-', ''),
            }}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        )}

        {/* Toast content */}
        <motion.div 
          className="p-4"
          variants={type === 'achievement' ? celebrationVariants : {}}
          animate={type === 'achievement' ? celebrationLevel : ''}
        >
          <div className="flex items-start">
            {/* Icon */}
            <motion.div
              className={`
                flex-shrink-0 w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center
                ${tier === 'premium' ? 'shadow-subtle' : ''}
              `}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-lg">{config.icon}</span>
            </motion.div>

            {/* Content */}
            <div className="ml-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-sm font-semibold ${config.textColor}`}>
                    {title}
                  </h4>
                  <p className={`text-sm ${config.textColor} opacity-90 mt-1`}>
                    {message}
                  </p>
                  
                  {/* Achievement details */}
                  {achievement && (
                    <div className="mt-2 text-xs opacity-75">
                      <span className="font-medium">+{achievement.points} points</span>
                      {tier !== 'basic' && (
                        <span className="ml-2">🔥 {achievement.category}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Dismiss button */}
                <motion.button
                  className={`ml-2 ${config.textColor} opacity-60 hover:opacity-100 transition-opacity`}
                  onClick={handleDismiss}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Dismiss notification"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.button>
              </div>

              {/* Action button */}
              {actionLabel && onAction && (
                <motion.button
                  className={`
                    mt-3 text-sm font-medium px-3 py-1 rounded-md
                    ${config.textColor} ${config.iconBg} border border-current border-opacity-20
                    hover:bg-opacity-80 transition-all
                  `}
                  onClick={handleAction}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {actionLabel}
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Premium tier celebration effects */}
        {tier === 'premium' && type === 'achievement' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-xs opacity-60"
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: '50%',
                  y: '50%',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: ['50%', `${20 + i * 15}%`],
                  y: ['50%', `${10 + (i % 2) * 80}%`],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
              >
                {i % 2 === 0 ? '✨' : '🌟'}
              </motion.div>
            ))}
          </div>
        )}

        {/* Accessibility */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {type === 'achievement' && 'Achievement unlocked! '}
          {title}. {message}
          {achievement && ` You earned ${achievement.points} points.`}
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 