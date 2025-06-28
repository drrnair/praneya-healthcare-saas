'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform, Variants } from 'framer-motion';
import { useHealthcareTheme } from '../theme-provider';
import { HealthScoreWidgetProps, HealthScoreAnimationConfig } from '../types';

const scoreAnimations: HealthScoreAnimationConfig = {
  duration: 2,
  ease: [0.25, 0.46, 0.45, 0.94],
  scoreCounter: {
    duration: 1.5,
    ease: [0.4, 0, 0.2, 1],
  },
  trendIndicator: {
    x: [-10, 0, 10, 0],
    duration: 2,
  },
  celebration: {
    confetti: true,
    duration: 3,
    particleCount: 20,
  },
};

const scoreCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] }
  },
  improved: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
  }
};

export function HealthScoreWidget({
  healthScore,
  historicalScores,
  onScoreUpdate,
  onTrendAnalysis,
  className = '',
  showTrend = true,
  animateChanges = true
}: HealthScoreWidgetProps) {
  const { theme } = useHealthcareTheme();
  const [showCelebration, setShowCelebration] = useState(false);
  const [previousScore, setPreviousScore] = useState(healthScore.overallScore);
  const scoreAnimation = useAnimation();
  const motionScore = useMotionValue(previousScore);
  const animatedScore = useTransform(motionScore, Math.round);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'var(--color-success-500)';
    if (score >= 70) return 'var(--color-secondary-500)';
    if (score >= 55) return 'var(--color-primary-500)';
    if (score >= 40) return 'var(--color-accent-500)';
    return 'var(--color-warning-500)';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', emoji: '🌟', message: 'Excellent health!' };
    if (score >= 85) return { grade: 'A', emoji: '😊', message: 'Great job!' };
    if (score >= 70) return { grade: 'B', emoji: '👍', message: 'Good progress' };
    if (score >= 55) return { grade: 'C', emoji: '📈', message: 'Keep improving' };
    return { grade: 'D', emoji: '💪', message: 'Focus needed' };
  };

  const getTrendIndicator = () => {
    if (historicalScores.length < 2) return null;
    
    const currentScore = healthScore.overallScore;
    const previousScore = historicalScores[historicalScores.length - 2]?.overallScore || currentScore;
    const change = currentScore - previousScore;
    
    if (change > 5) return { direction: 'up', icon: '📈', color: 'text-success-600', change: `+${change}` };
    if (change < -5) return { direction: 'down', icon: '📉', color: 'text-error-600', change: `${change}` };
    return { direction: 'stable', icon: '➡️', color: 'text-neutral-600', change: '±0' };
  };

  // Animate score changes
  useEffect(() => {
    if (animateChanges && healthScore.overallScore !== previousScore) {
      motionScore.set(previousScore);
      
      // Check for significant improvement
      if (healthScore.overallScore > previousScore + 10) {
        setShowCelebration(true);
        scoreAnimation.start('improved');
        setTimeout(() => setShowCelebration(false), 3000);
      }

      // Animate to new score
      setTimeout(() => {
        motionScore.set(healthScore.overallScore);
      }, 200);

      setPreviousScore(healthScore.overallScore);
    }
  }, [healthScore.overallScore, previousScore, animateChanges, motionScore, scoreAnimation]);

  const scoreGrade = getScoreGrade(healthScore.overallScore);
  const trendData = getTrendIndicator();

  return (
    <motion.div 
      className={`card-healthcare relative overflow-hidden ${className}`}
      variants={scoreCardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Celebration overlay */}
      {showCelebration && (
        <motion.div
          className="absolute inset-0 bg-tier-gradient bg-opacity-10 rounded-lg flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="text-center"
          >
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-lg font-semibold text-tier">Score Improved!</div>
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
          💚 Health Score
          {theme.tier === 'premium' && (
            <span className="text-xs bg-tier-gradient text-tier px-2 py-1 rounded-full">
              AI Enhanced
            </span>
          )}
        </h3>
        
        {showTrend && trendData && (
          <motion.div 
            className={`flex items-center gap-1 text-sm ${trendData.color}`}
            variants={{
              stable: { x: 0 },
              up: { x: scoreAnimations.trendIndicator.x },
              down: { x: scoreAnimations.trendIndicator.x.map(x => -x) }
            }}
            animate={trendData.direction}
            transition={{ duration: scoreAnimations.trendIndicator.duration, repeat: Infinity }}
          >
            <span>{trendData.icon}</span>
            <span className="font-medium">{trendData.change}</span>
          </motion.div>
        )}
      </div>

      {/* Main score display */}
      <div className="text-center mb-6">
        <motion.div 
          className="text-6xl font-bold mb-2"
          style={{ color: getScoreColor(healthScore.overallScore) }}
        >
          {animatedScore}
        </motion.div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">{scoreGrade.emoji}</span>
          <span className="text-xl font-semibold text-tier">{scoreGrade.grade}</span>
        </div>
        
        <p className="text-sm text-neutral-600">{scoreGrade.message}</p>
      </div>

      {/* Score breakdown */}
      <div className="space-y-3 mb-4">
        {[
          { label: 'Fitness', value: healthScore.fitnessScore, icon: '🏃‍♂️' },
          { label: 'Nutrition', value: healthScore.nutritionScore, icon: '🥗' },
          { label: 'Medication', value: healthScore.medicationScore, icon: '💊' },
          { label: 'Wellness', value: healthScore.wellnessScore, icon: '🧘‍♀️' },
        ].map((category) => (
          <div key={category.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>{category.icon}</span>
              <span className="text-sm font-medium text-neutral-700">{category.label}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: getScoreColor(category.value) }}
                  initial={{ width: 0 }}
                  animate={{ width: `${category.value}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              <span className="text-sm font-medium text-neutral-800 w-8">
                {category.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {onScoreUpdate && (
          <motion.button
            className="btn-healthcare-primary flex-1 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onScoreUpdate}
          >
            Update Score
          </motion.button>
        )}
        
        {onTrendAnalysis && theme.tier !== 'basic' && (
          <motion.button
            className="btn-healthcare-secondary px-4 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTrendAnalysis}
          >
            📊
          </motion.button>
        )}
      </div>

      {/* Last updated */}
      <div className="mt-4 pt-3 border-t border-neutral-200 text-center">
        <span className="text-xs text-neutral-500">
          Last updated: {new Date(healthScore.lastCalculated).toLocaleDateString()}
        </span>
      </div>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        Health score: {healthScore.overallScore} out of 100. Grade: {scoreGrade.grade}. 
        {trendData && `Trend: ${trendData.direction} ${trendData.change} points.`}
      </div>
    </motion.div>
  );
} 
