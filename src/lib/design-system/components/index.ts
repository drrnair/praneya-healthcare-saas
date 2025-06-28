// Gamified Healthcare Component Library
// Emotional engagement through subtle gamification while maintaining healthcare professionalism

// Core gamification components
export { ProgressCard } from './ProgressCard';
export { StreakTracker } from './StreakTracker';
export { HealthScoreWidget } from './HealthScoreWidget';
export { InteractiveButton } from './InteractiveButton';
export { NotificationToast } from './NotificationToast';

// Re-export types for external use
export type {
  ProgressCardProps,
  StreakTrackerProps,
  HealthScoreWidgetProps,
  InteractiveButtonProps,
  NotificationToastProps,
  HealthGoal,
  UserStreak,
  Achievement,
  HealthScore,
  BiometricReading,
  AnimationConfig,
  ProgressAnimationConfig,
  StreakAnimationConfig,
  HealthScoreAnimationConfig,
  AccessibilityConfig,
  HapticFeedbackConfig,
  DatabaseIntegration,
  ComponentState,
  GamificationMetrics,
  TierFeatures,
  AnalyticsEvent,
  ComponentHooks
} from '../types';

// Theme provider and utilities
export { 
  useHealthcareTheme, 
  useTierFeatures,
  getTierStyles,
  TierAwareComponent,
  healthcareThemeUtils 
} from '../theme-provider';

// Component usage examples and best practices
export const COMPONENT_USAGE_EXAMPLES = {
  progressCard: `
// Basic usage with health goal tracking
<ProgressCard
  healthGoal={userGoal}
  recentReadings={biometricData}
  onGoalUpdate={handleGoalUpdate}
  onCelebration={handleAchievement}
  enableHaptics={true}
/>`,

  streakTracker: `
// Gamified habit tracking with achievements
<StreakTracker
  userStreaks={activeStreaks}
  achievements={recentBadges}
  onStreakUpdate={updateStreak}
  onBadgeEarned={celebrateAchievement}
  showCelebration={true}
/>`,

  healthScoreWidget: `
// Overall wellness visualization
<HealthScoreWidget
  healthScore={currentScore}
  historicalScores={scoreHistory}
  onScoreUpdate={recalculateScore}
  showTrend={true}
  animateChanges={true}
/>`,

  interactiveButton: `
// Enhanced engagement button
<InteractiveButton
  variant="primary"
  size="md"
  enableHaptics={true}
  celebrateSuccess={true}
  onClick={handleAsyncAction}
>
  Complete Goal
</InteractiveButton>`,

  notificationToast: `
// Achievement celebration toast
<NotificationToast
  type="achievement"
  title="Goal Completed!"
  message="You've reached your daily step goal"
  achievement={newAchievement}
  celebrationLevel="enthusiastic"
  tier={userTier}
  onDismiss={dismissToast}
/>`
};

// Accessibility guidelines for healthcare components
export const ACCESSIBILITY_GUIDELINES = {
  keyboardNavigation: {
    description: 'All interactive elements support keyboard navigation',
    requirements: [
      'Tab order follows visual hierarchy',
      'Enter/Space activate buttons',
      'Escape dismisses modals/toasts',
      'Arrow keys navigate between related items'
    ]
  },
  screenReaders: {
    description: 'Components are optimized for screen reader users',
    requirements: [
      'Descriptive ARIA labels for all interactions',
      'Live regions announce dynamic changes',
      'Progress indicators verbally described',
      'Achievement celebrations announced'
    ]
  },
  visualAccessibility: {
    description: 'Visual elements meet WCAG 2.2 AA standards',
    requirements: [
      'Minimum 4.5:1 contrast ratios',
      'Touch targets minimum 44px',
      'Reduced motion preferences respected',
      'High contrast mode support'
    ]
  },
  cognitiveAccessibility: {
    description: 'Components support users with cognitive differences',
    requirements: [
      'Clear visual hierarchy',
      'Consistent interaction patterns',
      'Error prevention and recovery',
      'Simple, healthcare-appropriate language'
    ]
  }
};

// Performance optimization guidelines
export const PERFORMANCE_GUIDELINES = {
  animations: {
    description: 'Optimized animations for smooth performance',
    bestPractices: [
      'Use CSS transforms instead of layout properties',
      'Respect reduced motion preferences',
      'Debounce rapid user interactions',
      'Use requestAnimationFrame for complex animations'
    ]
  },
  dataFetching: {
    description: 'Efficient data loading and caching',
    bestPractices: [
      'Implement optimistic updates for immediate feedback',
      'Cache frequently accessed data',
      'Use pagination for large datasets',
      'Debounce API calls from user interactions'
    ]
  },
  memoryManagement: {
    description: 'Prevent memory leaks in long-running sessions',
    bestPractices: [
      'Clean up event listeners in useEffect',
      'Cancel pending requests on unmount',
      'Use React.memo for expensive components',
      'Implement virtual scrolling for large lists'
    ]
  }
};

// Integration examples with Prisma database
export const DATABASE_INTEGRATION_EXAMPLES = {
  healthGoals: `
// Updating progress in database
const updateGoalProgress = async (goalId: string, newValue: number) => {
  const updatedGoal = await prisma.healthGoals.update({
    where: { id: goalId },
    data: { 
      currentValue: newValue,
      updatedAt: new Date()
    }
  });
  
  // Check for goal completion
  if (updatedGoal.currentValue >= updatedGoal.targetValue) {
    await awardAchievement(updatedGoal.userId, {
      type: 'milestone',
      title: 'Goal Completed!',
      points: 100
    });
  }
  
  return updatedGoal;
};`,

  streakTracking: `
// Updating user streaks
const updateUserStreak = async (userId: string, streakType: string) => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  const existingStreak = await prisma.userStreaks.findFirst({
    where: { userId, type: streakType }
  });
  
  if (!existingStreak) {
    return prisma.userStreaks.create({
      data: {
        userId,
        type: streakType,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: new Date(),
        isActive: true
      }
    });
  }
  
  const lastActivity = existingStreak.lastActivityDate.toDateString();
  let newStreakValue = existingStreak.currentStreak;
  
  if (lastActivity === yesterday) {
    // Continue streak
    newStreakValue += 1;
  } else if (lastActivity !== today) {
    // Reset streak
    newStreakValue = 1;
  }
  
  return prisma.userStreaks.update({
    where: { id: existingStreak.id },
    data: {
      currentStreak: newStreakValue,
      longestStreak: Math.max(existingStreak.longestStreak, newStreakValue),
      lastActivityDate: new Date(),
      isActive: true
    }
  });
};`,

  healthScoreCalculation: `
// Calculate comprehensive health score
const calculateHealthScore = async (userId: string) => {
  const [biometrics, goals, streaks, medications] = await Promise.all([
    prisma.biometricReadings.findMany({
      where: { userId },
      orderBy: { recordedAt: 'desc' },
      take: 30
    }),
    prisma.healthGoals.findMany({
      where: { userId, isActive: true }
    }),
    prisma.userStreaks.findMany({
      where: { userId, isActive: true }
    }),
    prisma.medications.findMany({
      where: { userId, isActive: true }
    })
  ]);
  
  // Calculate component scores
  const fitnessScore = calculateFitnessScore(biometrics, goals);
  const consistencyScore = calculateConsistencyScore(streaks);
  const adherenceScore = calculateMedicationAdherence(medications);
  
  const overallScore = Math.round(
    (fitnessScore * 0.3) + 
    (consistencyScore * 0.3) + 
    (adherenceScore * 0.4)
  );
  
  return prisma.healthScores.create({
    data: {
      userId,
      overallScore,
      fitnessScore,
      nutritionScore: calculateNutritionScore(goals),
      medicationScore: adherenceScore,
      wellnessScore: consistencyScore,
      trend: determineTrend(overallScore, previousScores),
      lastCalculated: new Date(),
      factors: {
        exerciseConsistency: getExerciseConsistency(streaks),
        medicationAdherence: adherenceScore,
        nutritionQuality: getNutritionQuality(goals),
        sleepQuality: getSleepQuality(biometrics),
        stressLevel: getStressLevel(biometrics)
      }
    }
  });
};`
}; 