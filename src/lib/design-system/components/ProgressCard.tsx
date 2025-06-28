'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useHealthcareTheme } from '../theme-provider';
import { ProgressCardProps, AnimationConfig, ProgressAnimationConfig } from '../types';

// Default animation configurations
const progressAnimations: ProgressAnimationConfig = {
  duration: 1.5,
  ease: [0.25, 0.46, 0.45, 0.94],
  strokeWidth: 8,
  trailWidth: 4,
  circleTransition: {
    duration: 2,
    ease: [0.4, 0, 0.2, 1],
  },
  celebrationConfig: {
    scale: [1, 1.2, 1],
    duration: 0.6,
    particles: true,
  },
};

const celebrationVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.5, ease: "backOut" }
  },
  celebration: {
    scale: [1, 1.3, 1.1, 1],
    transition: { duration: 0.8, ease: "easeInOut" }
  }
};

const particleVariants = {
  hidden: { scale: 0, opacity: 0, y: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: [0, 1, 0],
    y: [-20, -60, -80],
    x: [(i - 2) * 15, (i - 2) * 25, (i - 2) * 30],
    transition: {
      duration: 1.5,
      delay: i * 0.1,
      ease: "easeOut"
    }
  })
};

export function ProgressCard({
  healthGoal,
  recentReadings,
  onGoalUpdate,
  onCelebration,
  className = '',
  showAnimation = true,
  enableHaptics = false
}: ProgressCardProps) {
  const { theme } = useHealthcareTheme();
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const progressControls = useAnimation();
  const celebrationControls = useAnimation();
  const prevProgressRef = useRef(currentProgress);

  // Calculate progress percentage
  const progressPercentage = Math.min((healthGoal.currentValue / healthGoal.targetValue) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Color coding based on progress and health goal type
  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'var(--color-success-500)';
    if (progressPercentage >= 75) return 'var(--color-secondary-500)';
    if (progressPercentage >= 50) return 'var(--color-primary-500)';
    if (progressPercentage >= 25) return 'var(--color-accent-500)';
    return 'var(--color-warning-500)';
  };

  // Haptic feedback simulation (would integrate with device APIs)
  const triggerHaptic = (pattern: 'light' | 'medium' | 'heavy') => {
    if (!enableHaptics) return;
    
    // Web Vibration API (where supported)
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50, 20, 50]
      };
      navigator.vibrate(patterns[pattern]);
    }
  };

  // Handle goal completion celebration
  useEffect(() => {
    if (progressPercentage >= 100 && !isCompleted) {
      setIsCompleted(true);
      setShowCelebration(true);
      triggerHaptic('heavy');
      
      // Trigger celebration animation
      celebrationControls.start('celebration');
      
      // Create achievement for goal completion
      if (onCelebration) {
        const achievement = {
          id: `goal-${healthGoal.id}-${Date.now()}`,
          userId: healthGoal.userId,
          type: 'milestone' as const,
          title: `${healthGoal.title} Completed!`,
          description: `Successfully reached your ${healthGoal.title.toLowerCase()} goal`,
          badgeIcon: '🎯',
          earnedAt: new Date(),
          category: healthGoal.type === 'exercise' ? 'fitness' as const : 'wellness' as const,
          points: 100
        };
        onCelebration(achievement);
      }

      // Hide celebration after animation
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [progressPercentage, isCompleted, onCelebration, healthGoal, celebrationControls]);

  // Animate progress changes
  useEffect(() => {
    if (showAnimation && prevProgressRef.current !== currentProgress) {
      progressControls.start({
        strokeDashoffset,
        transition: progressAnimations.circleTransition
      });
      prevProgressRef.current = currentProgress;
    }
  }, [currentProgress, strokeDashoffset, progressControls, showAnimation]);

  // Update progress value
  const handleProgressUpdate = async (newValue: number) => {
    if (isUpdating || !onGoalUpdate) return;
    
    setIsUpdating(true);
    triggerHaptic('light');
    
    try {
      await onGoalUpdate(healthGoal.id, newValue);
      setCurrentProgress(newValue);
    } catch (error) {
      console.error('Failed to update goal progress:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get appropriate icon for goal type
  const getGoalIcon = () => {
    const icons = {
      weight_loss: '⚖️',
      exercise: '🏃‍♂️',
      medication_adherence: '💊',
      nutrition: '🥗',
      sleep: '😴',
      hydration: '💧'
    };
    return icons[healthGoal.type] || '🎯';
  };

  // Format time remaining
  const getTimeRemaining = () => {
    const now = new Date();
    const deadline = new Date(healthGoal.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  return (
    <div className={`card-healthcare relative overflow-hidden ${className}`}>
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="absolute inset-0 bg-tier-gradient bg-opacity-10 rounded-lg flex items-center justify-center z-10"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={celebrationVariants}
          >
            {/* Celebration Particles */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                custom={i}
                variants={particleVariants}
                initial="hidden"
                animate="visible"
              >
                ✨
              </motion.div>
            ))}
            
            <motion.div 
              className="text-center z-20"
              animate={celebrationControls}
            >
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-lg font-semibold text-tier">Goal Completed!</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex items-start justify-between">
        {/* Progress Circle */}
        <div className="relative">
          <svg width="100" height="100" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="var(--color-neutral-200)"
              strokeWidth={progressAnimations.trailWidth}
              fill="transparent"
            />
            
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke={getProgressColor()}
              strokeWidth={progressAnimations.strokeWidth}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={progressControls}
              style={{
                filter: theme.tier === 'premium' ? 'drop-shadow(0 0 8px currentColor)' : 'none'
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl mb-1">{getGoalIcon()}</span>
            <span className="text-lg font-bold text-tier">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Goal Details */}
        <div className="flex-1 ml-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-1">
                {healthGoal.title}
              </h3>
              <p className="text-sm text-neutral-600 mb-2">
                {healthGoal.description}
              </p>
            </div>
            
            {/* Status badge */}
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${isCompleted 
                ? 'bg-success-100 text-success-700 border border-success-200' 
                : progressPercentage >= 75
                ? 'bg-secondary-100 text-secondary-700 border border-secondary-200'
                : 'bg-accent-100 text-accent-700 border border-accent-200'
              }
            `}>
              {isCompleted ? 'Completed' : 'In Progress'}
            </div>
          </div>

          {/* Progress metrics */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Progress:</span>
              <span className="font-medium text-neutral-800">
                {healthGoal.currentValue} / {healthGoal.targetValue} {healthGoal.unit}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Deadline:</span>
              <span className={`font-medium ${
                getTimeRemaining().includes('Overdue') ? 'text-error-600' : 'text-neutral-800'
              }`}>
                {getTimeRemaining()}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          {!isCompleted && (
            <div className="flex gap-2 mt-4">
              <motion.button
                className="btn-healthcare-primary text-sm flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProgressUpdate(healthGoal.currentValue + 1)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </div>
                ) : (
                  `Update Progress`
                )}
              </motion.button>
              
              {theme.tier !== 'basic' && (
                <motion.button
                  className="btn-healthcare-secondary text-sm px-4"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => triggerHaptic('medium')}
                >
                  📊
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent readings indicator */}
      {recentReadings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Recent: {recentReadings[0].value} {recentReadings[0].unit}
            </span>
            <span className="text-xs text-neutral-400">
              {new Date(recentReadings[0].recordedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}

      {/* Accessibility enhancements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {healthGoal.title} progress: {Math.round(progressPercentage)}% complete. 
        {healthGoal.currentValue} of {healthGoal.targetValue} {healthGoal.unit} achieved.
        {isCompleted && " Congratulations! Goal completed."}
      </div>
    </div>
  );
} 