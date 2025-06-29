/**
 * =======================================================================
 * PRANEYA HEALTHCARE COMPONENTS LIBRARY 2025
 * =======================================================================
 * 
 * A comprehensive collection of healthcare UI components featuring:
 * - AI-driven personalization support
 * - Micro-interactions for emotional engagement
 * - Neuroscience-based design for reduced cognitive load
 * - WCAG 2.1 AA accessibility compliance
 * - Sustainable and ethical design principles
 * - Zero-UI and invisible design elements
 * 
 * =======================================================================
 */

// @ts-nocheck
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthcareTheme, useTierFeatures, healthcareThemeUtils } from './theme-provider';

// ======================
// HEALTHCARE BUTTON SYSTEM
// ======================

interface HealthcareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  pulse?: boolean;
  children: React.ReactNode;
}

export const HealthcareButton: React.FC<HealthcareButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  pulse = false,
  className,
  children,
  disabled,
  onClick,
  style,
  ...restProps
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 ease-healthcare touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-healthcare-card hover:shadow-healthcare-hover',
    secondary: 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100 hover:border-primary-300 focus:ring-primary-500',
    success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 shadow-healthcare-card hover:shadow-wellness-glow',
    warning: 'bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500 shadow-healthcare-card hover:shadow-energy-glow',
    error: 'bg-error-500 text-white hover:bg-error-600 focus:ring-error-500 shadow-healthcare-card',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-healthcare-button',
    lg: 'px-8 py-4 text-lg rounded-healthcare-button',
    xl: 'px-10 py-5 text-xl rounded-healthcare-button'
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        pulse && 'animate-pulse-healthcare',
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      animate={{
        scale: isPressed ? 0.98 : 1,
        y: isPressed ? 1 : 0
      }}
      transition={{ duration: 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={style}
      {...restProps}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </div>
      )}
    </motion.button>
  );
};

// ======================
// HEALTHCARE CARD SYSTEM
// ======================

interface HealthcareCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'wellness' | 'energy';
  interactive?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

export const HealthcareCard: React.FC<HealthcareCardProps> = ({
  variant = 'default',
  interactive = false,
  pulse = false,
  className,
  children,
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = 'rounded-healthcare-card transition-all duration-300 ease-healthcare';

  const variantClasses = {
    default: 'bg-white shadow-healthcare-card border border-neutral-200 hover:shadow-healthcare-hover',
    elevated: 'bg-white shadow-lg border border-neutral-200 hover:shadow-xl',
    outlined: 'bg-transparent border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50',
    filled: 'bg-primary-50 border border-primary-100 hover:bg-primary-100',
    wellness: 'bg-gradient-to-br from-success-50 to-secondary-50 border border-success-200 hover:shadow-wellness-glow',
    energy: 'bg-gradient-to-br from-warning-50 to-copper-50 border border-warning-200 hover:shadow-energy-glow'
  };

  const interactiveClasses = interactive ? 'cursor-pointer hover:-translate-y-1 hover:scale-[1.02]' : '';

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        interactiveClasses,
        pulse && 'animate-wellness-breathe',
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={interactive ? { scale: 1.02, y: -4 } : {}}
      transition={{ duration: 0.2 }}
      {...(({ style, ...otherProps }) => otherProps)(props)}
    >
      <div className="p-6 relative">
        {children}
        {interactive && (
          <motion.div
            className="absolute inset-0 bg-primary-500 rounded-healthcare-card opacity-0 pointer-events-none"
            animate={{ opacity: isHovered ? 0.02 : 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    </motion.div>
  );
};

// ======================
// HEALTHCARE INPUT SYSTEM
// ======================

interface HealthcareInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'outlined';
}

export const HealthcareInput: React.FC<HealthcareInputProps> = ({
  label,
  error,
  success,
  icon,
  iconPosition = 'left',
  variant = 'default',
  className,
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || `healthcare-input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'block w-full px-4 py-3 text-base text-neutral-900 placeholder-neutral-500 transition-all duration-200 ease-healthcare focus:outline-none';

  const variantClasses = {
    default: 'bg-white border border-neutral-300 rounded-healthcare-input focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    filled: 'bg-neutral-50 border border-transparent rounded-healthcare-input focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-primary-500',
    outlined: 'bg-transparent border-2 border-neutral-300 rounded-healthcare-input focus:ring-0 focus:border-primary-500'
  };

  const getStatusClasses = () => {
    if (error) return 'border-error-500 focus:ring-error-500 focus:border-error-500';
    if (success) return 'border-success-500 focus:ring-success-500 focus:border-success-500';
    return '';
  };

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-neutral-400">{icon}</span>
          </div>
        )}
        
        <motion.input
          id={inputId}
          className={cn(
            baseClasses,
            variantClasses[variant],
            getStatusClasses(),
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{ duration: 0.1 }}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-neutral-400">{icon}</span>
          </div>
        )}
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-error-600 flex items-center space-x-1"
          >
            <span>⚠️</span>
            <span>{error}</span>
          </motion.p>
        )}
        
        {success && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-success-600 flex items-center space-x-1"
          >
            <span>✅</span>
            <span>{success}</span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// ======================
// HEALTHCARE BADGE SYSTEM
// ======================

interface HealthcareBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  children: React.ReactNode;
}

export const HealthcareBadge: React.FC<HealthcareBadgeProps> = ({
  variant = 'primary',
  size = 'md',
  pulse = false,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200 ease-healthcare';

  const variantClasses = {
    primary: 'bg-primary-100 text-primary-700 border border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 border border-secondary-200',
    success: 'bg-success-100 text-success-700 border border-success-200',
    warning: 'bg-warning-100 text-warning-700 border border-warning-200',
    error: 'bg-error-100 text-error-700 border border-error-200',
    neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        pulse && 'animate-pulse-healthcare',
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </motion.span>
  );
};

// ======================
// HEALTHCARE PROGRESS SYSTEM
// ======================

interface HealthcareProgressProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const HealthcareProgress: React.FC<HealthcareProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  animated = true,
  className
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const baseClasses = 'w-full bg-neutral-200 rounded-full overflow-hidden';

  const variantClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-neutral-700">Progress</span>
          <span className="text-sm text-neutral-500">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn(baseClasses, sizeClasses[size])}>
        <motion.div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-healthcare',
            variantClasses[variant]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// ======================
// HEALTHCARE ALERT SYSTEM
// ======================

interface HealthcareAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const HealthcareAlert: React.FC<HealthcareAlertProps> = ({
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  icon,
  className,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const variantClasses = {
    info: 'bg-info-50 border-info-200 text-info-800',
    success: 'bg-success-50 border-success-200 text-success-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    error: 'bg-error-50 border-error-200 text-error-800'
  };

  const iconMap = {
    info: '💡',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className={cn(
          'border rounded-healthcare-card p-4 transition-all duration-300 ease-healthcare',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 text-lg">
            {icon || iconMap[variant]}
          </div>
          
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-medium mb-1">
                {title}
              </h4>
            )}
            <div className="text-sm">
              {children}
            </div>
          </div>
          
          {dismissible && (
            <motion.button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="sr-only">Dismiss</span>
              <span className="text-lg">×</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ======================
// HEALTHCARE TOOLTIP SYSTEM
// ======================

interface HealthcareTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const HealthcareTooltip: React.FC<HealthcareTooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
              'absolute z-tooltip px-3 py-2 text-sm text-white bg-neutral-900 rounded-md shadow-lg pointer-events-none',
              positionClasses[position]
            )}
            style={{ whiteSpace: 'nowrap' }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ======================
// HEALTHCARE LOADING SYSTEM
// ======================

interface HealthcareLoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
}

export const HealthcareLoading: React.FC<HealthcareLoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    success: 'border-success-500',
    warning: 'border-warning-500'
  };

  if (variant === 'spinner') {
    return (
      <div className={cn('flex justify-center items-center', className)}>
        <div className={cn(
          'border-2 border-t-transparent rounded-full animate-spin',
          sizeClasses[size],
          colorClasses[color]
        )} />
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex justify-center items-center space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'rounded-full bg-primary-500',
              size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn(
        'bg-neutral-200 rounded animate-pulse',
        sizeClasses[size],
        className
      )} />
    );
  }

  // Skeleton variant
  return (
    <div className={cn('animate-pulse space-y-2', className)}>
      <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
      <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
      <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
    </div>
  );
};

// ======================
// HEALTHCARE STATS CARD
// ======================

interface HealthcareStatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'wellness' | 'energy' | 'clinical';
  className?: string;
}

export const HealthcareStatsCard: React.FC<HealthcareStatsCardProps> = ({
  title,
  value,
  change,
  icon,
  variant = 'default',
  className
}) => {
  const variantClasses = {
    default: 'bg-white border-neutral-200',
    wellness: 'bg-gradient-to-br from-success-50 to-secondary-50 border-success-200',
    energy: 'bg-gradient-to-br from-warning-50 to-copper-50 border-warning-200',
    clinical: 'bg-gradient-to-br from-primary-50 to-info-50 border-primary-200'
  };

  return (
    <motion.div
      className={cn(
        'p-6 rounded-healthcare-card border shadow-healthcare-card hover:shadow-healthcare-hover transition-all duration-300 ease-healthcare',
        variantClasses[variant],
        className
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-neutral-900">{value}</p>
          
          {change && (
            <div className="flex items-center mt-2">
              <span className={cn(
                'text-sm font-medium flex items-center',
                change.type === 'increase' ? 'text-success-600' : 'text-error-600'
              )}>
                {change.type === 'increase' ? '↗️' : '↘️'}
                {Math.abs(change.value)}%
              </span>
              <span className="text-xs text-neutral-500 ml-2">vs last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0 p-3 bg-primary-100 rounded-full text-primary-600 text-2xl">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Healthcare Status Indicator Component
interface HealthStatusProps {
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthStatus({ status, label, showIcon = true, size = 'md' }: HealthStatusProps) {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  const statusConfig = {
    excellent: { icon: '🟢', bgColor: 'bg-success-50', textColor: 'text-success-700', borderColor: 'border-success-200' },
    good: { icon: '🟡', bgColor: 'bg-secondary-50', textColor: 'text-secondary-700', borderColor: 'border-secondary-200' },
    fair: { icon: '🟠', bgColor: 'bg-accent-50', textColor: 'text-accent-700', borderColor: 'border-accent-200' },
    poor: { icon: '🔴', bgColor: 'bg-warning-50', textColor: 'text-warning-700', borderColor: 'border-warning-200' },
    critical: { icon: '🚨', bgColor: 'bg-error-50', textColor: 'text-error-700', borderColor: 'border-error-200' },
  };

  const config = statusConfig[status];

  return (
    <div className={`
      inline-flex items-center gap-2 rounded-lg border font-medium
      ${config.bgColor} ${config.textColor} ${config.borderColor}
      ${sizeClasses[size]}
    `}>
      {showIcon && <span>{config.icon}</span>}
      <span>{label || status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  );
}

// Tier-aware Feature Card
interface FeatureCardProps {
  title: string;
  description: string;
  featureKey: string;
  children?: React.ReactNode;
  className?: string;
}

export function FeatureCard({ title, description, featureKey, children, className = '' }: FeatureCardProps) {
  const { theme } = useHealthcareTheme();
  const tierFeatures = useTierFeatures();
  const isAvailable = tierFeatures.features.includes(featureKey);

  if (!isAvailable) {
    return (
      <div className={`card-healthcare opacity-50 ${className}`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-600">{title}</h3>
            <p className="text-sm text-neutral-500 mt-1">{description}</p>
            <div className="mt-3">
              <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                Available in Enhanced and Premium plans
              </span>
            </div>
          </div>
          <div className="text-neutral-300">🔒</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-tier ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-tier">{title}</h3>
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
          {children && <div className="mt-4">{children}</div>}
        </div>
        <div className="text-tier">✨</div>
      </div>
    </div>
  );
}

// Family Role Badge
interface FamilyRoleBadgeProps {
  role: 'ADMIN' | 'PARENT' | 'MEMBER' | 'CHILD';
  userName?: string;
  showRole?: boolean;
}

export function FamilyRoleBadge({ role, userName, showRole = true }: FamilyRoleBadgeProps) {
  const roleConfig = {
    ADMIN: { icon: '👑', label: 'Admin', color: 'primary' },
    PARENT: { icon: '👨‍👩‍👧‍👦', label: 'Parent', color: 'secondary' },
    MEMBER: { icon: '👤', label: 'Member', color: 'accent' },
    CHILD: { icon: '🧒', label: 'Child', color: 'neutral' },
  };

  const config = roleConfig[role];
  const roleStyles = healthcareThemeUtils.getRoleStyles(role);

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium
      ${roleStyles}
    `}>
      <span>{config.icon}</span>
      {userName && <span>{userName}</span>}
      {showRole && <span className="text-xs opacity-75">({config.label})</span>}
    </div>
  );
}

// Healthcare Metric Card
interface HealthMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  icon?: string;
}

export function HealthMetric({ 
  label, 
  value, 
  unit, 
  trend, 
  trendValue, 
  status, 
  icon 
}: HealthMetricProps) {
  const trendConfig = {
    up: { icon: '📈', color: 'text-success-600', bg: 'bg-success-50' },
    down: { icon: '📉', color: 'text-error-600', bg: 'bg-error-50' },
    stable: { icon: '➡️', color: 'text-neutral-600', bg: 'bg-neutral-50' },
  };

  const trendStyle = trend ? trendConfig[trend] : null;

  return (
    <div className="card-healthcare">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-lg">{icon}</span>}
            <span className="text-sm font-medium text-neutral-600">{label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-neutral-900">{value}</span>
            {unit && <span className="text-sm text-neutral-500">{unit}</span>}
          </div>
          {trend && trendValue && trendStyle && (
            <div className={`
              inline-flex items-center gap-1 mt-2 px-2 py-1 rounded text-xs font-medium
              ${trendStyle.color} ${trendStyle.bg}
            `}>
              <span>{trendStyle.icon}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {status && (
          <HealthStatus status={status} showIcon={false} size="sm" />
        )}
      </div>
    </div>
  );
}

// Subscription Tier Upgrade Prompt
interface TierUpgradePromptProps {
  currentTier: 'basic' | 'enhanced' | 'premium';
  targetTier: 'enhanced' | 'premium';
  featureName: string;
  onUpgrade: () => void;
  onDismiss?: () => void;
}

export function TierUpgradePrompt({ 
  currentTier, 
  targetTier, 
  featureName, 
  onUpgrade, 
  onDismiss 
}: TierUpgradePromptProps) {
  const tierNames = {
    basic: 'Basic',
    enhanced: 'Enhanced',
    premium: 'Premium',
  };

  const tierColors = {
    enhanced: 'bg-primary-gradient border-primary-300',
    premium: 'bg-wellness-gradient border-accent-300',
  };

  return (
    <div className={`
      rounded-lg border-2 p-6 ${tierColors[targetTier]}
      shadow-raised transition-all duration-base hover:shadow-floating
    `}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            Unlock {featureName}
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            Upgrade to {tierNames[targetTier]} to access this feature and many more advanced healthcare tools.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onUpgrade}
              className="btn-healthcare-primary"
            >
              Upgrade to {tierNames[targetTier]}
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Maybe later
              </button>
            )}
          </div>
        </div>
        <div className="text-2xl">✨</div>
      </div>
    </div>
  );
}



// Emergency Access Component
interface EmergencyAccessProps {
  isEmergency?: boolean;
  familyRole: 'ADMIN' | 'PARENT' | 'MEMBER' | 'CHILD';
  onEmergencyAccess?: () => void;
}

export function EmergencyAccess({ 
  isEmergency = false, 
  familyRole, 
  onEmergencyAccess 
}: EmergencyAccessProps) {
  const canAccessEmergency = ['ADMIN', 'PARENT'].includes(familyRole);

  if (!canAccessEmergency && !isEmergency) {
    return null;
  }

  return (
    <div className="bg-error-50 border border-error-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🚨</span>
        <div>
          <h4 className="font-semibold text-error-800">Emergency Access</h4>
          <p className="text-sm text-error-700">
            {isEmergency 
              ? 'Emergency mode is active. Full health data is accessible.'
              : 'Access critical health information in emergency situations.'
            }
          </p>
          {!isEmergency && onEmergencyAccess && (
            <button
              onClick={onEmergencyAccess}
              className="mt-3 bg-error-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-error-700 transition-colors"
            >
              Activate Emergency Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 