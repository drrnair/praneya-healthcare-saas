'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SPRING_PRESETS, hapticFeedback } from '@/lib/animations/animation-system';
import { Eye, EyeOff, Check, X, AlertTriangle } from 'lucide-react';

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  isLoading?: boolean;
  showPasswordToggle?: boolean;
  onValidation?: (isValid: boolean, error?: string) => void;
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  error,
  success,
  isLoading = false,
  showPasswordToggle = false,
  onValidation,
  className,
  onFocus,
  onBlur,
  onChange,
  type: initialType = 'text',
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const shakeControls = useAnimation();
  
  const inputType = showPasswordToggle && initialType === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : initialType;

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

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setHasValue(inputValue.length > 0);
    
    if (error && inputValue.length > 0) {
      shakeControls.start({
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.4 }
      });
      hapticFeedback.error();
    }
    
    onChange?.(event);
  }, [onChange, error, shakeControls]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
    hapticFeedback.light();
  }, [showPassword]);

  return (
    <div className="relative">
      <motion.div
        className="relative"
        animate={shakeControls}
      >
        {label && (
          <motion.label
            className={cn(
              'absolute left-3 pointer-events-none transition-all duration-200 z-10',
              isFocused || hasValue
                ? 'top-0 text-xs bg-white px-1 -translate-y-1/2'
                : 'top-1/2 text-base -translate-y-1/2',
              isFocused
                ? 'text-teal-600'
                : error
                ? 'text-red-500'
                : success
                ? 'text-green-500'
                : 'text-gray-500'
            )}
            animate={{
              scale: isFocused || hasValue ? 0.85 : 1,
            }}
            transition={SPRING_PRESETS.GENTLE}
          >
            {label}
          </motion.label>
        )}

        <motion.div
          whileFocus={{ scale: 1.02 }}
          transition={SPRING_PRESETS.GENTLE}
        >
          <input
            ref={inputRef}
            type={inputType}
            value={value}
            className={cn(
              'w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none bg-white',
              'placeholder-transparent focus:placeholder-gray-400',
              isFocused
                ? 'border-teal-500 shadow-lg shadow-teal-500/20'
                : error
                ? 'border-red-500 focus:border-red-500'
                : success
                ? 'border-green-500 focus:border-green-500'
                : 'border-gray-200 hover:border-gray-300',
              showPasswordToggle && 'pr-12',
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
        </motion.div>

        {isLoading && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={SPRING_PRESETS.GENTLE}
          >
            <motion.div
              className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}

        {showPasswordToggle && !isLoading && (
          <motion.button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={togglePasswordVisibility}
            whileTap={{ scale: 0.95 }}
            transition={SPRING_PRESETS.SNAPPY}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </motion.button>
        )}

        {success && !isLoading && !showPasswordToggle && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING_PRESETS.BOUNCY}
          >
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, ...SPRING_PRESETS.BOUNCY }}
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {error && !isLoading && !showPasswordToggle && (
          <motion.div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={SPRING_PRESETS.BOUNCY}
          >
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={SPRING_PRESETS.GENTLE}
          className="mt-2 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-500">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={SPRING_PRESETS.GENTLE}
          className="mt-2 flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
          <p className="text-sm text-green-500">Looks good!</p>
        </motion.div>
      )}
    </div>
  );
}; 