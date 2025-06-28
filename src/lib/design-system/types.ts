// Healthcare Gamification Component Types
// Integrates with Prisma database schema for emotional engagement

export interface HealthGoal {
  id: string;
  userId: string;
  type: 'weight_loss' | 'exercise' | 'medication_adherence' | 'nutrition' | 'sleep' | 'hydration';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BiometricReading {
  id: string;
  userId: string;
  type: 'weight' | 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'steps' | 'sleep_hours';
  value: number;
  unit: string;
  recordedAt: Date;
  deviceSource?: string;
  notes?: string;
}

export interface UserStreak {
  id: string;
  userId: string;
  type: 'daily_login' | 'medication_taken' | 'exercise_completed' | 'meal_logged';
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  isActive: boolean;
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'milestone' | 'streak' | 'improvement' | 'consistency';
  title: string;
  description: string;
  badgeIcon: string;
  earnedAt: Date;
  category: 'fitness' | 'nutrition' | 'medication' | 'wellness';
  points: number;
}

export interface HealthScore {
  id: string;
  userId: string;
  overallScore: number; // 0-100
  fitnessScore: number;
  nutritionScore: number;
  medicationScore: number;
  wellnessScore: number;
  trend: 'improving' | 'stable' | 'declining';
  lastCalculated: Date;
  factors: {
    exerciseConsistency: number;
    medicationAdherence: number;
    nutritionQuality: number;
    sleepQuality: number;
    stressLevel: number;
  };
}

// Component Props Interfaces

export interface ProgressCardProps {
  healthGoal: HealthGoal;
  recentReadings: BiometricReading[];
  onGoalUpdate?: (goalId: string, newValue: number) => Promise<void>;
  onCelebration?: (achievement: Achievement) => void;
  className?: string;
  showAnimation?: boolean;
  enableHaptics?: boolean;
}

export interface StreakTrackerProps {
  userStreaks: UserStreak[];
  achievements: Achievement[];
  onStreakUpdate?: (streakType: string) => Promise<void>;
  onBadgeEarned?: (achievement: Achievement) => void;
  className?: string;
  showCelebration?: boolean;
  animationDuration?: number;
}

export interface HealthScoreWidgetProps {
  healthScore: HealthScore;
  historicalScores: HealthScore[];
  onScoreUpdate?: () => Promise<void>;
  onTrendAnalysis?: () => void;
  className?: string;
  showTrend?: boolean;
  animateChanges?: boolean;
}

export interface InteractiveButtonProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'accent' | 'tier';
  size: 'sm' | 'md' | 'lg' | 'xl';
  state: 'idle' | 'hover' | 'active' | 'loading' | 'success' | 'error';
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
  enableHaptics?: boolean;
  celebrateSuccess?: boolean;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  ariaLabel?: string;
}

export interface NotificationToastProps {
  id: string;
  type: 'achievement' | 'reminder' | 'celebration' | 'warning' | 'info';
  title: string;
  message: string;
  achievement?: Achievement;
  duration?: number;
  onDismiss?: (id: string) => void;
  onAction?: () => void;
  actionLabel?: string;
  showProgress?: boolean;
  celebrationLevel?: 'subtle' | 'moderate' | 'enthusiastic';
  tier?: 'basic' | 'enhanced' | 'premium';
}

// Animation Configuration Types

export interface AnimationConfig {
  duration: number;
  ease: [number, number, number, number];
  delay?: number;
  repeat?: number;
  repeatType?: 'loop' | 'reverse' | 'mirror';
}

export interface ProgressAnimationConfig extends AnimationConfig {
  strokeWidth: number;
  trailWidth: number;
  circleTransition: AnimationConfig;
  celebrationConfig: {
    scale: number[];
    duration: number;
    particles: boolean;
  };
}

export interface StreakAnimationConfig extends AnimationConfig {
  flameAnimation: {
    scale: number[];
    opacity: number[];
    duration: number;
  };
  badgeReveal: {
    scale: number[];
    rotateY: number[];
    duration: number;
  };
  countUp: {
    duration: number;
    ease: string;
  };
}

export interface HealthScoreAnimationConfig extends AnimationConfig {
  scoreCounter: {
    duration: number;
    ease: string;
  };
  trendIndicator: {
    x: number[];
    duration: number;
  };
  celebration: {
    confetti: boolean;
    duration: number;
    particleCount: number;
  };
}

// Accessibility Types

export interface AccessibilityConfig {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  touchTargetSize: number;
  ariaLiveRegion: 'polite' | 'assertive' | 'off';
}

// Haptic Feedback Types

export interface HapticFeedbackConfig {
  enabled: boolean;
  patterns: {
    success: 'light' | 'medium' | 'heavy';
    warning: 'light' | 'medium' | 'heavy';
    achievement: 'light' | 'medium' | 'heavy';
    interaction: 'light' | 'medium' | 'heavy';
  };
}

// Database Integration Types

export interface DatabaseIntegration {
  healthGoalsService: {
    updateProgress: (goalId: string, value: number) => Promise<HealthGoal>;
    getGoalsByUser: (userId: string) => Promise<HealthGoal[]>;
    createGoal: (goal: Omit<HealthGoal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<HealthGoal>;
  };
  
  biometricsService: {
    recordReading: (reading: Omit<BiometricReading, 'id'>) => Promise<BiometricReading>;
    getRecentReadings: (userId: string, type: string, limit: number) => Promise<BiometricReading[]>;
  };
  
  streaksService: {
    updateStreak: (userId: string, type: string) => Promise<UserStreak>;
    getActiveStreaks: (userId: string) => Promise<UserStreak[]>;
  };
  
  achievementsService: {
    awardAchievement: (userId: string, achievement: Omit<Achievement, 'id' | 'earnedAt'>) => Promise<Achievement>;
    getUserAchievements: (userId: string) => Promise<Achievement[]>;
  };
  
  healthScoreService: {
    calculateScore: (userId: string) => Promise<HealthScore>;
    getScoreHistory: (userId: string, days: number) => Promise<HealthScore[]>;
  };
}

// Component State Types

export interface ComponentState {
  isLoading: boolean;
  isAnimating: boolean;
  hasError: boolean;
  errorMessage?: string;
  lastUpdated: Date;
}

// Gamification Metrics

export interface GamificationMetrics {
  totalPoints: number;
  level: number;
  experiencePoints: number;
  nextLevelThreshold: number;
  badges: Achievement[];
  streaks: UserStreak[];
  weeklyGoalCompletion: number;
  monthlyEngagement: number;
}

// Tier-Specific Features

export interface TierFeatures {
  basic: {
    maxGoals: number;
    basicAnimations: boolean;
    simpleNotifications: boolean;
  };
  enhanced: {
    maxGoals: number;
    advancedAnimations: boolean;
    familySharing: boolean;
    trendAnalysis: boolean;
  };
  premium: {
    maxGoals: number;
    premiumAnimations: boolean;
    aiInsights: boolean;
    customGoals: boolean;
    hapticFeedback: boolean;
    celebrationEffects: boolean;
  };
}

// Event Types for Analytics

export interface AnalyticsEvent {
  eventType: 'goal_completed' | 'streak_achieved' | 'score_improved' | 'badge_earned' | 'engagement_milestone';
  userId: string;
  familyAccountId?: string;
  timestamp: Date;
  properties: Record<string, any>;
  tier: 'basic' | 'enhanced' | 'premium';
}

// Component Integration Hooks

export interface ComponentHooks {
  useHealthGoals: (userId: string) => {
    goals: HealthGoal[];
    loading: boolean;
    error: Error | null;
    updateGoal: (goalId: string, value: number) => Promise<void>;
    refetch: () => Promise<void>;
  };
  
  useStreakTracking: (userId: string) => {
    streaks: UserStreak[];
    loading: boolean;
    updateStreak: (type: string) => Promise<void>;
    achievements: Achievement[];
  };
  
  useHealthScore: (userId: string) => {
    currentScore: HealthScore | null;
    history: HealthScore[];
    loading: boolean;
    recalculate: () => Promise<void>;
  };
  
  useGamification: (userId: string) => {
    metrics: GamificationMetrics;
    celebrateAchievement: (achievement: Achievement) => void;
    updateProgress: (type: string, value: number) => Promise<void>;
  };
} 