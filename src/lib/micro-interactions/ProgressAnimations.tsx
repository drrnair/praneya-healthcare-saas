'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMicroInteractions } from './MicroInteractionManager';

// Health Score Animation
interface HealthScoreProps {
  previousScore: number;
  currentScore: number;
  maxScore: number;
  isVisible: boolean;
  onComplete: () => void;
}

export function HealthScoreAnimation({ previousScore, currentScore, maxScore, isVisible, onComplete }: HealthScoreProps) {
  const { animateProgress, isReducedMotion } = useMicroInteractions();
  const [animatedScore, setAnimatedScore] = useState(previousScore);
  
  useEffect(() => {
    if (isVisible) {
      animateProgress({
        type: 'score',
        previousValue: previousScore,
        currentValue: currentScore,
        maxValue: maxScore,
        milestone: currentScore >= maxScore * 0.8
      });
      
      // Animate number counting
      const duration = 1200;
      const startTime = Date.now();
      const difference = currentScore - previousScore;
      
      const animateNumber = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        setAnimatedScore(Math.round(previousScore + difference * easeOutQuart));
        
        if (progress < 1) {
          requestAnimationFrame(animateNumber);
        } else {
          setTimeout(onComplete, 1000);
        }
      };
      
      requestAnimationFrame(animateNumber);
    }
  }, [isVisible, previousScore, currentScore, maxScore, animateProgress, onComplete]);

  if (!isVisible) return null;

  const scorePercentage = (animatedScore / maxScore) * 100;
  const isImprovement = currentScore > previousScore;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -50 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 25,
            duration: 0.6
          }}
        >
          <motion.div
            className="relative w-32 h-32 mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
          >
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * scorePercentage / 100) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            
            {/* Score number */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <motion.span 
                  className="text-3xl font-bold text-gray-800"
                  key={animatedScore}
                >
                  {animatedScore}
                </motion.span>
                <div className="text-sm text-gray-500">/ {maxScore}</div>
              </motion.div>
            </div>
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {isImprovement ? 'Health Score Improved!' : 'Health Score Updated'}
          </motion.h2>
          
          <motion.p
            className="text-gray-600 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {isImprovement 
              ? `+${currentScore - previousScore} points from your last assessment`
              : 'Your health profile has been updated'
            }
          </motion.p>

          {isImprovement && (
            <motion.div
              className="flex items-center justify-center gap-2 text-green-600"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.span
                className="text-2xl"
                animate={isReducedMotion ? {} : {
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.6, repeat: 2 }}
              >
                🎉
              </motion.span>
              <span className="font-semibold">Great progress!</span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Streak Counter Animation
interface StreakCounterProps {
  currentStreak: number;
  streakType: string;
  isNewRecord?: boolean;
  isVisible: boolean;
  onComplete: () => void;
}

export function StreakAnimation({ currentStreak, streakType, isNewRecord, isVisible, onComplete }: StreakCounterProps) {
  const { animateProgress, isReducedMotion } = useMicroInteractions();

  useEffect(() => {
    if (isVisible) {
      animateProgress({
        type: 'streak',
        previousValue: currentStreak - 1,
        currentValue: currentStreak,
        milestone: isNewRecord
      });
    }
  }, [isVisible, currentStreak, isNewRecord, animateProgress]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg p-4 min-w-64 text-center"
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotate: [0, 1, -1, 0]
        }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 200,
          damping: 18
        }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 3000);
        }}
      >
        <motion.div
          className="flex items-center justify-center gap-3 mb-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <motion.div
            className="relative"
            animate={isReducedMotion ? {} : {
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 1, repeat: isNewRecord ? 3 : 1 }}
          >
            <span className="text-3xl">🔥</span>
            {currentStreak > 7 && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-xs text-white">!</span>
              </motion.div>
            )}
          </motion.div>
          
          <div>
            <motion.div
              className="text-2xl font-bold text-orange-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {currentStreak} Day{currentStreak !== 1 ? 's' : ''}
            </motion.div>
            <motion.div
              className="text-sm text-gray-600 capitalize"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {streakType} Streak
            </motion.div>
          </div>
        </motion.div>

        {isNewRecord && (
          <motion.div
            className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-2 mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="flex items-center justify-center gap-2 text-yellow-700"
              animate={isReducedMotion ? {} : {
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <span>🏆</span>
              <span className="font-semibold">New Personal Record!</span>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          className="text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Keep it up to reach your next milestone!
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Goal Completion Animation
interface GoalCompletionProps {
  goalName: string;
  achievementLevel: 'minor' | 'major' | 'achievement';
  isVisible: boolean;
  onComplete: () => void;
}

export function GoalCompletionAnimation({ goalName, achievementLevel, isVisible, onComplete }: GoalCompletionProps) {
  const { animateProgress, isReducedMotion } = useMicroInteractions();

  useEffect(() => {
    if (isVisible) {
      animateProgress({
        type: 'goal',
        previousValue: 90,
        currentValue: 100,
        maxValue: 100,
        milestone: true,
        celebrationLevel: achievementLevel
      });
    }
  }, [isVisible, achievementLevel, animateProgress]);

  if (!isVisible) return null;

  const celebrationElements = {
    minor: { emoji: '🎯', particles: 8, colors: ['#3B82F6', '#10B981'] },
    major: { emoji: '🏆', particles: 12, colors: ['#F59E0B', '#EF4444'] },
    achievement: { emoji: '🎉', particles: 20, colors: ['#8B5CF6', '#EC4899', '#F59E0B'] }
  };

  const config = celebrationElements[achievementLevel];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 4000);
        }}
      >
        {/* Confetti particles */}
        {!isReducedMotion && Array.from({ length: config.particles }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              backgroundColor: config.colors[i % config.colors.length],
              left: '50%',
              top: '50%'
            }}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: (Math.random() - 0.5) * 400,
              y: (Math.random() - 0.5) * 400,
              rotate: Math.random() * 360
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              ease: "easeOut"
            }}
          />
        ))}

        <motion.div
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center relative overflow-hidden"
          initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ 
            duration: 1.5,
            type: "spring",
            stiffness: 150,
            damping: 20
          }}
        >
          <motion.div
            className="text-6xl mb-4"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 360, 0]
            }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              type: "spring"
            }}
          >
            {config.emoji}
          </motion.div>

          <motion.h2
            className="text-2xl font-bold text-gray-800 mb-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            Goal Completed!
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {goalName}
          </motion.p>

          <motion.div
            className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="text-green-700 font-semibold"
              animate={isReducedMotion ? {} : {
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 0.5, repeat: 3, delay: 1.5 }}
            >
              {achievementLevel === 'achievement' && '🌟 Major Achievement Unlocked!'}
              {achievementLevel === 'major' && '🎯 Major Goal Completed!'}
              {achievementLevel === 'minor' && '✅ Goal Achieved!'}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 