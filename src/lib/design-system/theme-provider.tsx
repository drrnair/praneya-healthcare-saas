'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Types for healthcare theme system
export interface HealthcareTheme {
  tier: 'basic' | 'enhanced' | 'premium';
  colorMode: 'light' | 'dark' | 'auto';
  contrastMode: 'normal' | 'high';
  reducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  familyAccountId?: string;
  userId: string;
}

export interface ThemeContextType {
  theme: HealthcareTheme;
  updateTheme: (updates: Partial<HealthcareTheme>) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Healthcare theme configuration for each subscription tier
const TIER_CONFIGS = {
  basic: {
    features: ['basic-analytics', 'meal-planning', 'recipes'],
    colorIntensity: 'subtle',
    shadowLevel: 'minimal',
  },
  enhanced: {
    features: ['advanced-analytics', 'family-sharing', 'health-tracking', 'meal-planning', 'recipes'],
    colorIntensity: 'medium',
    shadowLevel: 'elevated',
  },
  premium: {
    features: ['ai-recommendations', 'clinical-integration', 'emergency-access', 'advanced-analytics', 'family-sharing', 'health-tracking', 'meal-planning', 'recipes'],
    colorIntensity: 'vibrant',
    shadowLevel: 'premium',
  },
};

interface HealthcareThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: Partial<HealthcareTheme>;
  familyAccountId?: string;
  userId: string;
  subscriptionTier: 'basic' | 'enhanced' | 'premium';
}

export function HealthcareThemeProvider({ 
  children, 
  initialTheme, 
  familyAccountId, 
  userId, 
  subscriptionTier 
}: HealthcareThemeProviderProps) {
  const [theme, setTheme] = useState<HealthcareTheme>({
    tier: subscriptionTier,
    colorMode: 'light',
    contrastMode: 'normal',
    reducedMotion: false,
    fontSize: 'normal',
    familyAccountId,
    userId,
    ...initialTheme,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load user preferences from backend
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/preferences`);
        if (response.ok) {
          const preferences = await response.json();
          setTheme(prev => ({
            ...prev,
            colorMode: preferences.colorMode || 'light',
            contrastMode: preferences.contrastMode || 'normal',
            reducedMotion: preferences.reducedMotion || false,
            fontSize: preferences.fontSize || 'normal',
          }));
        }
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPreferences();
  }, [userId]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Set subscription tier data attribute
    root.setAttribute('data-tier', theme.tier);
    
    // Set color mode
    root.setAttribute('data-theme', theme.colorMode === 'auto' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme.colorMode
    );
    
    // Set accessibility preferences
    if (theme.contrastMode === 'high') {
      root.setAttribute('data-contrast', 'high');
    } else {
      root.removeAttribute('data-contrast');
    }
    
    if (theme.reducedMotion) {
      root.setAttribute('data-motion', 'reduced');
    } else {
      root.removeAttribute('data-motion');
    }
    
    if (theme.fontSize !== 'normal') {
      root.setAttribute('data-font-size', theme.fontSize);
    } else {
      root.removeAttribute('data-font-size');
    }

    // Set family account context if available
    if (theme.familyAccountId) {
      root.setAttribute('data-family-account', theme.familyAccountId);
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme.colorMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme.colorMode]);

  // Update theme function with backend persistence
  const updateTheme = async (updates: Partial<HealthcareTheme>) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);

    // Persist preferences to backend
    try {
      await fetch(`/api/users/${userId}/preferences`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          colorMode: newTheme.colorMode,
          contrastMode: newTheme.contrastMode,
          reducedMotion: newTheme.reducedMotion,
          fontSize: newTheme.fontSize,
        }),
      });
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use the healthcare theme
export function useHealthcareTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useHealthcareTheme must be used within a HealthcareThemeProvider');
  }
  return context;
}

// Hook to get tier-specific features
export function useTierFeatures() {
  const { theme } = useHealthcareTheme();
  return TIER_CONFIGS[theme.tier];
}

// Utility function to get tier-aware styles
export function getTierStyles(tier: 'basic' | 'enhanced' | 'premium') {
  const baseStyles = 'transition-all duration-base ease-healthcare';
  
  switch (tier) {
    case 'basic':
      return `${baseStyles} bg-tier-surface border-tier-border shadow-subtle`;
    case 'enhanced':
      return `${baseStyles} bg-tier-surface border-tier-border shadow-raised bg-tier-gradient`;
    case 'premium':
      return `${baseStyles} bg-tier-surface border-tier-border shadow-floating bg-tier-gradient`;
    default:
      return baseStyles;
  }
}

// Component wrapper for tier-aware styling
interface TierAwareComponentProps {
  children: React.ReactNode;
  className?: string;
  component?: keyof JSX.IntrinsicElements;
}

export function TierAwareComponent({ 
  children, 
  className = '', 
  component: Component = 'div' 
}: TierAwareComponentProps) {
  const { theme } = useHealthcareTheme();
  const tierStyles = getTierStyles(theme.tier);
  
  return (
    <Component className={`${tierStyles} ${className}`}>
      {children}
    </Component>
  );
}

// Healthcare-specific theme utilities
export const healthcareThemeUtils = {
  // Get color for health status
  getHealthStatusColor: (status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical') => {
    switch (status) {
      case 'excellent': return 'var(--color-success-500)';
      case 'good': return 'var(--color-secondary-500)';
      case 'fair': return 'var(--color-accent-500)';
      case 'poor': return 'var(--color-warning-500)';
      case 'critical': return 'var(--color-error-500)';
      default: return 'var(--color-neutral-500)';
    }
  },

  // Get urgency-based styling
  getUrgencyStyles: (urgency: 'low' | 'medium' | 'high' | 'critical') => {
    switch (urgency) {
      case 'low': return 'border-l-4 border-success-500 bg-success-50';
      case 'medium': return 'border-l-4 border-warning-500 bg-warning-50';
      case 'high': return 'border-l-4 border-error-500 bg-error-50';
      case 'critical': return 'border-l-4 border-error-700 bg-error-100 shadow-floating';
      default: return 'border-l-4 border-neutral-300 bg-neutral-50';
    }
  },

  // Get role-based styling
  getRoleStyles: (role: 'ADMIN' | 'PARENT' | 'MEMBER' | 'CHILD') => {
    switch (role) {
      case 'ADMIN': return 'bg-primary-50 border-primary-200 text-primary-700';
      case 'PARENT': return 'bg-secondary-50 border-secondary-200 text-secondary-700';
      case 'MEMBER': return 'bg-accent-50 border-accent-200 text-accent-700';
      case 'CHILD': return 'bg-neutral-50 border-neutral-200 text-neutral-700';
      default: return 'bg-neutral-50 border-neutral-200 text-neutral-700';
    }
  },
}; 