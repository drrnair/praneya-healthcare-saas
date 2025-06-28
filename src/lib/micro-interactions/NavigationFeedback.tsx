'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMicroInteractions } from './MicroInteractionManager';

// Enhanced Button Component with Micro-interactions
interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function InteractiveButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = ''
}: InteractiveButtonProps) {
  const { triggerButtonFeedback, isReducedMotion } = useMicroInteractions();
  const [isPressed, setIsPressed] = useState(false);

  const baseClasses = "relative overflow-hidden font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const handleMouseEnter = () => {
    if (!disabled && !loading) {
      triggerButtonFeedback('hover');
    }
  };

  const handleMouseDown = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
      triggerButtonFeedback('click');
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleFocus = () => {
    if (!disabled && !loading) {
      triggerButtonFeedback('focus');
    }
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={isReducedMotion ? {} : { 
        scale: disabled ? 1 : 1.02,
        y: disabled ? 0 : -1
      }}
      whileTap={isReducedMotion ? {} : { 
        scale: disabled ? 1 : 0.98,
        y: disabled ? 0 : 1
      }}
      animate={isPressed && !isReducedMotion ? {
        scale: [1, 0.95, 1],
      } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }}
    >
      {/* Loading spinner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-inherit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button content */}
      <motion.span
        className={loading ? 'invisible' : 'visible'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {children}
      </motion.span>

      {/* Ripple effect */}
      {!isReducedMotion && (
        <motion.div
          className="absolute inset-0 bg-white rounded-lg"
          initial={{ scale: 0, opacity: 0.3 }}
          animate={isPressed ? { 
            scale: 1, 
            opacity: [0.3, 0] 
          } : {}}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}

// Enhanced Form Input with Feedback
interface InteractiveInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  success?: boolean;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function InteractiveInput({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  success, 
  placeholder, 
  required, 
  className = ''
}: InteractiveInputProps) {
  const { triggerFormFeedback, isReducedMotion } = useMicroInteractions();
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    triggerFormFeedback('focus', label);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasInteracted(true);
    triggerFormFeedback('blur', label);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  useEffect(() => {
    if (hasInteracted) {
      if (error) {
        triggerFormFeedback('error', label);
      } else if (success) {
        triggerFormFeedback('success', label);
      }
    }
  }, [error, success, hasInteracted, label, triggerFormFeedback]);

  return (
    <motion.div 
      className={`relative ${className}`}
      layout
    >
      <motion.label
        className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
          error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-700'
        }`}
        animate={isReducedMotion ? {} : {
          y: isFocused ? -2 : 0
        }}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </motion.label>
      
      <motion.div
        className="relative"
        animate={isReducedMotion ? {} : {
          scale: isFocused ? 1.01 : 1
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none transition-all duration-200 ${
            error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : success 
                ? 'border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
          }`}
          animate={error && !isReducedMotion ? {
            x: [0, -5, 5, -5, 5, 0]
          } : {}}
          transition={{ duration: 0.3 }}
        />
        
        {/* Focus glow effect */}
        <motion.div
          className={`absolute inset-0 rounded-lg pointer-events-none ${
            error ? 'bg-red-500' : success ? 'bg-green-500' : 'bg-blue-500'
          }`}
          initial={{ opacity: 0, scale: 1 }}
          animate={isFocused && !isReducedMotion ? {
            opacity: [0, 0.1, 0],
            scale: [1, 1.02, 1]
          } : {}}
          transition={{ duration: 0.3 }}
        />

        {/* Success checkmark */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                animate={isReducedMotion ? {} : {
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mt-1 text-sm text-red-600 flex items-center gap-1"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              animate={isReducedMotion ? {} : {
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.3 }}
            >
              ⚠️
            </motion.span>
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Loading State Animation
interface LoadingStateProps {
  type: 'spinner' | 'dots' | 'pulse' | 'healthcare';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ type, message, size = 'md' }: LoadingStateProps) {
  const { isReducedMotion } = useMicroInteractions();

  const sizeClasses = {
    sm: { container: 'w-4 h-4', text: 'text-sm' },
    md: { container: 'w-8 h-8', text: 'text-base' },
    lg: { container: 'w-12 h-12', text: 'text-lg' }
  };

  const classes = sizeClasses[size];

  const LoadingSpinner = () => (
    <motion.div
      className={`border-2 border-blue-200 border-t-blue-600 rounded-full ${classes.container}`}
      animate={isReducedMotion ? {} : { rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const LoadingDots = () => (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`bg-blue-600 rounded-full ${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'}`}
          animate={isReducedMotion ? {} : {
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
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

  const LoadingPulse = () => (
    <motion.div
      className={`bg-blue-600 rounded-full ${classes.container}`}
      animate={isReducedMotion ? {} : {
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1,
        repeat: Infinity
      }}
    />
  );

  const HealthcareLoading = () => (
    <div className="relative">
      <motion.div
        className={`border-2 border-green-200 border-t-green-600 rounded-full ${classes.container}`}
        animate={isReducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={isReducedMotion ? {} : {
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}>
          🏥
        </span>
      </motion.div>
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return <LoadingDots />;
      case 'pulse':
        return <LoadingPulse />;
      case 'healthcare':
        return <HealthcareLoading />;
      default:
        return <LoadingSpinner />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {renderLoader()}
      {message && (
        <motion.p
          className={`text-gray-600 ${classes.text}`}
          animate={isReducedMotion ? {} : {
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
} 