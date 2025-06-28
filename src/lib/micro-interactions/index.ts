// Core micro-interaction system
export {
  MicroInteractionProvider,
  useMicroInteractions,
  useAnimationPerformance,
  animationConfigs,
  type MicroInteractionConfig,
  type HealthActionFeedback,
  type ProgressAnimation
} from './MicroInteractionManager';

// Health action feedback components
export {
  PillLoggedFeedback,
  MealTrackedFeedback,
  ExerciseRecordedFeedback,
  VitalsEnteredFeedback
} from './HealthActionFeedback';

// Progress and achievement animations
export {
  HealthScoreAnimation,
  StreakAnimation,
  GoalCompletionAnimation
} from './ProgressAnimations';

// Navigation and interaction feedback
export {
  InteractiveButton,
  InteractiveInput,
  LoadingState
} from './NavigationFeedback';

// AI interaction feedback
export {
  AIThinkingIndicator,
  DrugInteractionWarning,
  RecipeGenerationAnimation
} from './AIInteractionFeedback';

// Family and social feedback
export {
  FamilyActivityIndicator,
  AchievementSharingAnimation,
  EmergencyContactActivation
} from './FamilySocialFeedback';

// Accessibility utilities
export {
  AccessibilityManager,
  accessibleAnimations,
  colorContrast,
  hapticFeedback,
  AnimationPerformanceMonitor
} from './AccessibilityUtils';

// Type exports
export type {
  InteractiveButtonProps,
  InteractiveInputProps,
  LoadingStateProps
} from './NavigationFeedback';

// Animation presets and configurations
export const microInteractionPresets = {
  healthcare: {
    gentle: { duration: 0.3, easing: 'easeOut', haptic: 'light' },
    confident: { duration: 0.4, easing: 'easeInOut', haptic: 'medium' },
    celebration: { duration: 0.8, easing: 'easeOut', haptic: 'heavy' },
    urgent: { duration: 0.2, easing: 'easeIn', haptic: 'heavy' }
  },
  timing: {
    instant: 0.1,
    quick: 0.2,
    normal: 0.3,
    slow: 0.5,
    deliberate: 0.8
  },
  springs: {
    gentle: { stiffness: 200, damping: 25 },
    bouncy: { stiffness: 300, damping: 20 },
    snappy: { stiffness: 400, damping: 30 },
    wobbly: { stiffness: 150, damping: 15 }
  }
};

// Healthcare-specific color palette for micro-interactions
export const healthcareColors = {
  primary: {
    50: '#EFF6FF',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8'
  },
  success: {
    50: '#F0FDF4',
    500: '#10B981',
    600: '#059669',
    700: '#047857'
  },
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309'
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C'
  },
  medical: {
    50: '#F0F9FF',
    500: '#0891B2',
    600: '#0E7490',
    700: '#164E63'
  }
};

// Quick setup function for common healthcare interactions
export function setupHealthcareMicroInteractions(element: HTMLElement) {
  // Add visual focus indicators
  const cleanupFocus = AccessibilityManager.addVisualFocus(element);
  
  // Add keyboard navigation
  const cleanupKeyboard = AccessibilityManager.addKeyboardNavigation(element, (key) => {
    if (key === 'Enter' || key === ' ') {
      element.click();
    }
  });
  
  // Return cleanup function
  return () => {
    cleanupFocus();
    cleanupKeyboard();
  };
}

// Performance optimization helper
export function optimizeForLowEnd() {
  return {
    reducedMotion: true,
    animationQuality: 'low' as const,
    hapticEnabled: false,
    preferCSSTransitions: true
  };
}

// Emergency interaction helper
export function createEmergencyInteraction(callback: () => void) {
  return {
    duration: 0.2,
    haptic: 'heavy' as const,
    priority: 'high' as const,
    callback,
    accessibility: {
      announce: true,
      priority: 'assertive' as const
    }
  };
} 