'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useAnimation } from 'framer-motion';

// Types for micro-interaction system
export interface MicroInteractionConfig {
  duration: number;
  delay?: number;
  easing: string;
  springConfig?: {
    type: 'spring';
    stiffness: number;
    damping: number;
    mass?: number;
  };
  hapticIntensity?: 'light' | 'medium' | 'heavy';
  soundEffect?: string;
  accessibleFallback?: boolean;
}

export interface HealthActionFeedback {
  type: 'pill' | 'meal' | 'exercise' | 'symptom' | 'vitals';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  value?: number | string;
  success: boolean;
  message?: string;
}

export interface ProgressAnimation {
  type: 'score' | 'streak' | 'goal' | 'weekly' | 'family';
  previousValue: number;
  currentValue: number;
  maxValue?: number;
  milestone?: boolean;
  celebrationLevel?: 'minor' | 'major' | 'achievement';
}

interface MicroInteractionContextType {
  // Configuration
  isReducedMotion: boolean;
  animationQuality: 'low' | 'medium' | 'high';
  hapticEnabled: boolean;
  soundEnabled: boolean;
  
  // Health Actions
  triggerHealthAction: (feedback: HealthActionFeedback) => void;
  
  // Progress Animations  
  animateProgress: (progress: ProgressAnimation) => Promise<void>;
  
  // Navigation Feedback
  triggerButtonFeedback: (type: 'hover' | 'click' | 'focus') => void;
  triggerFormFeedback: (type: 'focus' | 'blur' | 'error' | 'success', fieldName?: string) => void;
  
  // AI Interactions
  triggerAIFeedback: (type: 'thinking' | 'generating' | 'warning' | 'suggestion') => void;
  
  // Family Social
  triggerSocialFeedback: (type: 'activity' | 'sharing' | 'achievement' | 'emergency') => void;
  
  // Performance Management
  pauseAnimations: () => void;
  resumeAnimations: () => void;
  clearAnimationQueue: () => void;
}

const MicroInteractionContext = createContext<MicroInteractionContextType | undefined>(undefined);

// Animation configurations
export const animationConfigs = {
  // Health Actions
  healthActions: {
    pill: {
      success: {
        duration: 0.6,
        easing: 'easeOut',
        springConfig: { type: 'spring' as const, stiffness: 300, damping: 20 },
        hapticIntensity: 'light' as const
      },
      error: {
        duration: 0.4,
        easing: 'easeInOut',
        hapticIntensity: 'medium' as const
      }
    },
    meal: {
      success: {
        duration: 0.8,
        easing: 'easeOut',
        springConfig: { type: 'spring' as const, stiffness: 200, damping: 25 },
        hapticIntensity: 'light' as const
      }
    },
    exercise: {
      success: {
        duration: 1.0,
        easing: 'easeOut',
        springConfig: { type: 'spring' as const, stiffness: 150, damping: 20 },
        hapticIntensity: 'medium' as const
      }
    },
    symptom: {
      success: {
        duration: 0.5,
        easing: 'easeInOut',
        hapticIntensity: 'light' as const
      }
    },
    vitals: {
      success: {
        duration: 0.7,
        easing: 'easeOut',
        springConfig: { type: 'spring' as const, stiffness: 250, damping: 22 },
        hapticIntensity: 'light' as const
      }
    }
  },
  
  // Progress Animations
  progress: {
    score: {
      duration: 1.2,
      delay: 0.2,
      easing: 'easeOut',
      hapticIntensity: 'medium' as const
    },
    streak: {
      duration: 0.8,
      easing: 'easeOut',
      springConfig: { type: 'spring' as const, stiffness: 200, damping: 18 },
      hapticIntensity: 'light' as const
    },
    goal: {
      duration: 1.5,
      easing: 'easeOut',
      hapticIntensity: 'heavy' as const
    },
    weekly: {
      duration: 2.0,
      delay: 0.5,
      easing: 'easeInOut'
    },
    family: {
      duration: 1.0,
      easing: 'easeOut',
      hapticIntensity: 'medium' as const
    }
  },
  
  // Navigation
  navigation: {
    button: {
      hover: { duration: 0.15, easing: 'easeOut' },
      click: { duration: 0.1, easing: 'easeInOut', hapticIntensity: 'light' as const },
      focus: { duration: 0.2, easing: 'easeOut' }
    },
    form: {
      focus: { duration: 0.2, easing: 'easeOut' },
      blur: { duration: 0.15, easing: 'easeIn' },
      error: { duration: 0.3, easing: 'easeInOut', hapticIntensity: 'medium' as const },
      success: { duration: 0.4, easing: 'easeOut', hapticIntensity: 'light' as const }
    }
  },
  
  // AI Interactions
  ai: {
    thinking: { duration: 1.5, easing: 'easeInOut' },
    generating: { duration: 2.0, easing: 'easeOut' },
    warning: { duration: 0.6, easing: 'easeInOut', hapticIntensity: 'medium' as const },
    suggestion: { duration: 0.8, easing: 'easeOut', hapticIntensity: 'light' as const }
  },
  
  // Social
  social: {
    activity: { duration: 0.4, easing: 'easeOut' },
    sharing: { duration: 1.0, easing: 'easeOut', hapticIntensity: 'light' as const },
    achievement: { duration: 1.5, easing: 'easeOut', hapticIntensity: 'heavy' as const },
    emergency: { duration: 0.3, easing: 'easeInOut', hapticIntensity: 'heavy' as const }
  }
};

// Haptic feedback utility
const triggerHaptic = (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: [50],
      medium: [100],
      heavy: [200]
    };
    navigator.vibrate(patterns[intensity]);
  }
};

// Sound feedback utility
const playSound = (soundType: string) => {
  // Placeholder for sound implementation
  // In a real implementation, you would load and play audio files
  console.log(`Playing sound: ${soundType}`);
};

interface MicroInteractionProviderProps {
  children: React.ReactNode;
  initialQuality?: 'low' | 'medium' | 'high';
}

export function MicroInteractionProvider({ 
  children, 
  initialQuality = 'medium' 
}: MicroInteractionProviderProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isReducedMotion, setIsReducedMotion] = useState(prefersReducedMotion || false);
  const [animationQuality, setAnimationQuality] = useState(initialQuality);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [animationsPaused, setAnimationsPaused] = useState(false);
  
  const animationQueue = useRef<Array<() => Promise<void>>>([]);
  const isProcessingQueue = useRef(false);

  // Performance monitoring
  const [frameRate, setFrameRate] = useState(60);
  const lastFrameTime = useRef(performance.now());

  // Monitor device performance
  useEffect(() => {
    let animationId: number;
    
    const measureFrameRate = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTime.current;
      const currentFPS = 1000 / deltaTime;
      
      setFrameRate(prev => prev * 0.9 + currentFPS * 0.1); // Smooth average
      lastFrameTime.current = currentTime;
      
      animationId = requestAnimationFrame(measureFrameRate);
    };
    
    measureFrameRate();
    
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Adjust quality based on performance
  useEffect(() => {
    if (frameRate < 30 && animationQuality === 'high') {
      setAnimationQuality('medium');
    } else if (frameRate < 45 && animationQuality === 'medium') {
      setAnimationQuality('low');
    }
  }, [frameRate, animationQuality]);

  // Process animation queue
  const processAnimationQueue = useCallback(async () => {
    if (isProcessingQueue.current || animationsPaused) return;
    
    isProcessingQueue.current = true;
    
    while (animationQueue.current.length > 0) {
      const animation = animationQueue.current.shift();
      if (animation) {
        try {
          await animation();
        } catch (error) {
          console.error('Animation error:', error);
        }
      }
    }
    
    isProcessingQueue.current = false;
  }, [animationsPaused]);

  // Add animation to queue
  const queueAnimation = useCallback((animation: () => Promise<void>) => {
    animationQueue.current.push(animation);
    processAnimationQueue();
  }, [processAnimationQueue]);

  // Health Action Feedback
  const triggerHealthAction = useCallback((feedback: HealthActionFeedback) => {
    if (isReducedMotion && !feedback.severity) return;
    
    const config = animationConfigs.healthActions[feedback.type]?.[feedback.success ? 'success' : 'error'];
    if (!config) return;

    queueAnimation(async () => {
      // Trigger haptic feedback
      if (hapticEnabled && config.hapticIntensity) {
        triggerHaptic(config.hapticIntensity);
      }
      
      // Announce to screen readers
      if (feedback.message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = feedback.message;
        document.body.appendChild(announcement);
        
        setTimeout(() => document.body.removeChild(announcement), 1000);
      }
      
      return new Promise(resolve => {
        setTimeout(resolve, config.duration * 1000);
      });
    });
  }, [isReducedMotion, hapticEnabled, queueAnimation]);

  // Progress Animations
  const animateProgress = useCallback(async (progress: ProgressAnimation): Promise<void> => {
    if (isReducedMotion && !progress.milestone) return;
    
    const config = animationConfigs.progress[progress.type];
    if (!config) return;

    return new Promise(resolve => {
      queueAnimation(async () => {
        // Trigger haptic for milestones
        if (hapticEnabled && config.hapticIntensity && progress.milestone) {
          triggerHaptic(config.hapticIntensity);
        }
        
        // Announce progress to screen readers
        const announcement = `${progress.type} updated from ${progress.previousValue} to ${progress.currentValue}${progress.milestone ? '. Milestone achieved!' : ''}`;
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        document.body.appendChild(announcer);
        
        setTimeout(() => {
          document.body.removeChild(announcer);
          resolve();
        }, config.duration * 1000);
      });
    });
  }, [isReducedMotion, hapticEnabled, queueAnimation]);

  // Button Feedback
  const triggerButtonFeedback = useCallback((type: 'hover' | 'click' | 'focus') => {
    if (isReducedMotion && type !== 'focus') return;
    
    const config = animationConfigs.navigation.button[type];
    if (hapticEnabled && config.hapticIntensity) {
      triggerHaptic(config.hapticIntensity);
    }
  }, [isReducedMotion, hapticEnabled]);

  // Form Feedback
  const triggerFormFeedback = useCallback((
    type: 'focus' | 'blur' | 'error' | 'success', 
    fieldName?: string
  ) => {
    const config = animationConfigs.navigation.form[type];
    
    if (hapticEnabled && config.hapticIntensity) {
      triggerHaptic(config.hapticIntensity);
    }
    
    // Screen reader announcements for errors and success
    if ((type === 'error' || type === 'success') && fieldName) {
      const message = type === 'error' 
        ? `Error in ${fieldName} field` 
        : `${fieldName} field completed successfully`;
      
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'assertive');
      announcer.className = 'sr-only';
      announcer.textContent = message;
      document.body.appendChild(announcer);
      
      setTimeout(() => document.body.removeChild(announcer), 1000);
    }
  }, [hapticEnabled]);

  // AI Feedback
  const triggerAIFeedback = useCallback((type: 'thinking' | 'generating' | 'warning' | 'suggestion') => {
    const config = animationConfigs.ai[type];
    
    if (hapticEnabled && config.hapticIntensity) {
      triggerHaptic(config.hapticIntensity);
    }
    
    // Announce AI actions to screen readers
    const messages = {
      thinking: 'AI is processing your request',
      generating: 'AI is generating content',
      warning: 'AI has identified a potential concern',
      suggestion: 'AI has a suggestion for you'
    };
    
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', type === 'warning' ? 'assertive' : 'polite');
    announcer.className = 'sr-only';
    announcer.textContent = messages[type];
    document.body.appendChild(announcer);
    
    setTimeout(() => document.body.removeChild(announcer), 2000);
  }, [hapticEnabled]);

  // Social Feedback
  const triggerSocialFeedback = useCallback((type: 'activity' | 'sharing' | 'achievement' | 'emergency') => {
    const config = animationConfigs.social[type];
    
    if (hapticEnabled && config.hapticIntensity) {
      triggerHaptic(config.hapticIntensity);
    }
    
    // Emergency feedback requires immediate attention
    if (type === 'emergency') {
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'assertive');
      announcer.setAttribute('role', 'alert');
      announcer.className = 'sr-only';
      announcer.textContent = 'Emergency contact has been activated';
      document.body.appendChild(announcer);
      
      setTimeout(() => document.body.removeChild(announcer), 3000);
    }
  }, [hapticEnabled]);

  // Performance Management
  const pauseAnimations = useCallback(() => {
    setAnimationsPaused(true);
  }, []);

  const resumeAnimations = useCallback(() => {
    setAnimationsPaused(false);
    processAnimationQueue();
  }, [processAnimationQueue]);

  const clearAnimationQueue = useCallback(() => {
    animationQueue.current = [];
  }, []);

  // Battery and performance optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseAnimations();
      } else {
        resumeAnimations();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Battery API (experimental)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const handleBatteryChange = () => {
          if (battery.level < 0.2) {
            setAnimationQuality('low');
          }
        };
        
        battery.addEventListener('levelchange', handleBatteryChange);
        handleBatteryChange();
      });
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseAnimations, resumeAnimations]);

  const contextValue: MicroInteractionContextType = {
    isReducedMotion,
    animationQuality,
    hapticEnabled,
    soundEnabled,
    triggerHealthAction,
    animateProgress,
    triggerButtonFeedback,
    triggerFormFeedback,
    triggerAIFeedback,
    triggerSocialFeedback,
    pauseAnimations,
    resumeAnimations,
    clearAnimationQueue
  };

  return (
    <MicroInteractionContext.Provider value={contextValue}>
      {children}
    </MicroInteractionContext.Provider>
  );
}

export function useMicroInteractions() {
  const context = useContext(MicroInteractionContext);
  if (context === undefined) {
    throw new Error('useMicroInteractions must be used within a MicroInteractionProvider');
  }
  return context;
}

// Performance monitoring hook
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFps(currentFPS);
        setIsLowPerformance(currentFPS < 30);
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
    
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return { fps, isLowPerformance };
} 