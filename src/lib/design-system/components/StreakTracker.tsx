'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useHealthcareTheme } from '../theme-provider';
import { StreakTrackerProps, StreakAnimationConfig } from '../types';

// Animation configurations for streak tracking
const streakAnimations: StreakAnimationConfig = {
  duration: 0.8,
  ease: [0.25, 0.46, 0.45, 0.94],
  flameAnimation: {
    scale: [1, 1.1, 1.2, 1.1, 1],
    opacity: [0.8, 1, 0.9, 1, 0.8],
    duration: 2,
  },
  badgeReveal: {
    scale: [0, 1.2, 1],
    rotateY: [90, 0, 0],
    duration: 0.6,
  },
  countUp: {
    duration: 1,
    ease: "easeOut",
  },
};

const flameVariants = {
  idle: {
    scale: 1,
    opacity: 0.8,
    rotate: [-2, 2, -2],
    transition: {
      rotate: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut"
      }
    }
  },
  active: {
    scale: streakAnimations.flameAnimation.scale,
    opacity: streakAnimations.flameAnimation.opacity,
    transition: {
      duration: streakAnimations.flameAnimation.duration,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  celebration: {
    scale: [1, 1.5, 1.3, 1],
    rotate: [0, 360],
    transition: {
      duration: 1,
      ease: "backOut"
    }
  }
};

const badgeVariants = {
  hidden: { scale: 0, opacity: 0, rotateY: 90 },
  visible: {
    scale: 1,
    opacity: 1,
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: "backOut"
    }
  },
  float: {
    y: [-2, 2, -2],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const milestoneVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "backOut" }
  },
  celebration: {
    scale: [1, 1.1, 1],
    transition: { duration: 0.3 }
  }
};

export function StreakTracker({
  userStreaks,
  achievements,
  onStreakUpdate,
  onBadgeEarned,
  className = '',
  showCelebration = true,
  animationDuration = 1000
}: StreakTrackerProps) {
  const { theme } = useHealthcareTheme();
  const [selectedStreak, setSelectedStreak] = useState<string | null>(null);
  const [celebratingStreak, setCelebratingStreak] = useState<string | null>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  const flameControls = useAnimation();
  const badgeControls = useAnimation();

  // Get streak icon and color based on type and length
  const getStreakDisplay = (streak: any) => {
    const streakConfig = {
      daily_login: { 
        icon: '📅', 
        name: 'Daily Check-in',
        color: 'var(--color-primary-500)',
        milestones: [7, 30, 100, 365]
      },
      medication_taken: { 
        icon: '💊', 
        name: 'Medication',
        color: 'var(--color-secondary-500)',
        milestones: [7, 14, 30, 90]
      },
      exercise_completed: { 
        icon: '🏃‍♂️', 
        name: 'Exercise',
        color: 'var(--color-accent-500)',
        milestones: [3, 7, 21, 100]
      },
      meal_logged: { 
        icon: '🍽️', 
        name: 'Meal Tracking',
        color: 'var(--color-success-500)',
        milestones: [7, 30, 60, 365]
      }
    };
    return streakConfig[streak.type] || { icon: '⭐', name: 'Activity', color: 'var(--color-neutral-500)', milestones: [] };
  };

  // Get flame intensity based on streak length
  const getFlameIntensity = (streakLength: number) => {
    if (streakLength >= 100) return { size: 'text-4xl', intensity: 'celebration' };
    if (streakLength >= 30) return { size: 'text-3xl', intensity: 'active' };
    if (streakLength >= 7) return { size: 'text-2xl', intensity: 'active' };
    if (streakLength >= 3) return { size: 'text-xl', intensity: 'idle' };
    return { size: 'text-lg', intensity: 'idle' };
  };

  // Check for milestone achievements
  const checkMilestones = (streak: any) => {
    const config = getStreakDisplay(streak);
    return config.milestones.filter(milestone => 
      streak.currentStreak >= milestone && 
      streak.currentStreak - 1 < milestone
    );
  };

  // Handle streak update with celebration
  const handleStreakUpdate = async (streakType: string) => {
    if (!onStreakUpdate) return;

    const currentStreak = userStreaks.find(s => s.type === streakType);
    if (!currentStreak) return;

    try {
      await onStreakUpdate(streakType);
      
      // Check for milestones
      const milestones = checkMilestones({ ...currentStreak, currentStreak: currentStreak.currentStreak + 1 });
      
      if (milestones.length > 0) {
        setCelebratingStreak(streakType);
        flameControls.start('celebration');
        
        // Award milestone badges
        milestones.forEach(milestone => {
          const achievement = {
            id: `milestone-${streakType}-${milestone}-${Date.now()}`,
            userId: currentStreak.userId,
            type: 'streak' as const,
            title: `${milestone} Day Streak!`,
            description: `Maintained a ${milestone}-day ${getStreakDisplay(currentStreak).name.toLowerCase()} streak`,
            badgeIcon: milestone >= 100 ? '🏆' : milestone >= 30 ? '🥇' : milestone >= 7 ? '🥈' : '🥉',
            earnedAt: new Date(),
            category: 'wellness' as const,
            points: milestone * 10
          };
          
          if (onBadgeEarned) {
            onBadgeEarned(achievement);
          }
          
          setNewBadges(prev => [...prev, achievement.id]);
        });

        // Reset celebration after animation
        setTimeout(() => {
          setCelebratingStreak(null);
          setNewBadges([]);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to update streak:', error);
    }
  };

  // Animate new badges
  useEffect(() => {
    if (newBadges.length > 0) {
      badgeControls.start('visible');
    }
  }, [newBadges, badgeControls]);

  return (
    <div className={`card-healthcare ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
          🔥 Streak Tracker
          {theme.tier === 'premium' && (
            <span className="text-xs bg-tier-gradient text-tier px-2 py-1 rounded-full">
              Premium
            </span>
          )}
        </h3>
        
        {/* Total streak score */}
        <div className="text-right">
          <div className="text-2xl font-bold text-tier">
            {userStreaks.reduce((total, streak) => total + streak.currentStreak, 0)}
          </div>
          <div className="text-xs text-neutral-500">Total Days</div>
        </div>
      </div>

      {/* Streak Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userStreaks.map((streak) => {
          const display = getStreakDisplay(streak);
          const flameIntensity = getFlameIntensity(streak.currentStreak);
          const isActive = new Date(streak.lastActivityDate).toDateString() === new Date().toDateString();
          const isCelebrating = celebratingStreak === streak.type;

          return (
            <motion.div
              key={streak.id}
              className={`
                relative p-4 rounded-lg border-2 transition-all cursor-pointer
                ${selectedStreak === streak.type 
                  ? 'border-tier shadow-tier bg-tier-surface' 
                  : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50'
                }
                ${!isActive ? 'opacity-75' : ''}
              `}
              style={{ borderColor: isActive ? display.color : undefined }}
              onClick={() => setSelectedStreak(selectedStreak === streak.type ? null : streak.type)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {/* Flame and streak count */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className={`${flameIntensity.size}`}>{display.icon}</span>
                  <motion.div
                    className={flameIntensity.size}
                    variants={flameVariants}
                    animate={isCelebrating ? 'celebration' : isActive ? flameIntensity.intensity : 'idle'}
                  >
                    🔥
                  </motion.div>
                </div>
                
                <div className="text-right">
                  <motion.div 
                    className="text-2xl font-bold"
                    style={{ color: display.color }}
                    key={streak.currentStreak}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {streak.currentStreak}
                  </motion.div>
                  <div className="text-xs text-neutral-500">
                    {streak.currentStreak === 1 ? 'day' : 'days'}
                  </div>
                </div>
              </div>

              {/* Streak info */}
              <div className="space-y-1">
                <h4 className="font-medium text-neutral-800">{display.name}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Best:</span>
                  <span className="font-medium">{streak.longestStreak} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Status:</span>
                  <span className={`font-medium ${
                    isActive ? 'text-success-600' : 'text-warning-600'
                  }`}>
                    {isActive ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Action button */}
              {isActive && streak.isActive && (
                <motion.button
                  className="w-full mt-3 btn-healthcare-primary text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStreakUpdate(streak.type);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Streak
                </motion.button>
              )}

              {/* Milestone indicators */}
              <div className="flex gap-1 mt-2">
                {display.milestones.map((milestone) => (
                  <motion.div
                    key={milestone}
                    className={`
                      w-2 h-2 rounded-full
                      ${streak.currentStreak >= milestone 
                        ? 'bg-success-500' 
                        : streak.currentStreak >= milestone * 0.8
                        ? 'bg-warning-400'
                        : 'bg-neutral-300'
                      }
                    `}
                    whileHover={{ scale: 1.5 }}
                    title={`${milestone} day milestone`}
                  />
                ))}
              </div>

              {/* Celebration overlay */}
              <AnimatePresence>
                {isCelebrating && showCelebration && (
                  <motion.div
                    className="absolute inset-0 bg-tier-gradient bg-opacity-20 rounded-lg flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <div className="text-3xl mb-1">🎉</div>
                      <div className="text-sm font-semibold text-tier">
                        Streak Extended!
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Recent achievements */}
      {achievements.length > 0 && (
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">Recent Achievements</h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {achievements.slice(0, 5).map((achievement) => (
              <motion.div
                key={achievement.id}
                className="flex-shrink-0 bg-tier-surface border border-tier-border rounded-lg p-2 min-w-[80px]"
                variants={badgeVariants}
                initial="hidden"
                animate={newBadges.includes(achievement.id) ? "visible" : "float"}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">{achievement.badgeIcon}</div>
                  <div className="text-xs font-medium text-tier truncate">
                    {achievement.title}
                  </div>
                  <div className="text-xs text-neutral-500">
                    +{achievement.points}pts
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded streak details */}
      <AnimatePresence>
        {selectedStreak && (
          <motion.div
            className="mt-4 p-4 bg-tier-surface rounded-lg border border-tier-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {(() => {
              const streak = userStreaks.find(s => s.type === selectedStreak);
              const display = getStreakDisplay(streak);
              
              return (
                <div>
                  <h5 className="font-medium text-tier mb-2">{display.name} Details</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-600">Started:</span>
                      <div className="font-medium">
                        {new Date(streak.lastActivityDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-600">Next Milestone:</span>
                      <div className="font-medium">
                        {display.milestones.find(m => m > streak.currentStreak) || 'Max achieved!'}
                        {display.milestones.find(m => m > streak.currentStreak) && ' days'}
                      </div>
                    </div>
                  </div>
                  
                  {theme.tier !== 'basic' && (
                    <div className="mt-3 p-2 bg-tier-gradient rounded text-sm">
                      <span className="font-medium text-tier">Tip:</span> Consistency is key! 
                      Keep up your {display.name.toLowerCase()} routine to unlock more rewards.
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility */}
      <div className="sr-only" aria-live="polite">
        {celebratingStreak && `Streak extended for ${getStreakDisplay(userStreaks.find(s => s.type === celebratingStreak)).name}`}
        {newBadges.length > 0 && `New achievement earned!`}
      </div>
    </div>
  );
} 