'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ProgressCard,
  StreakTracker,
  HealthScoreWidget,
  InteractiveButton,
  NotificationToast
} from '@/lib/design-system/components';
import { useHealthcareTheme } from '@/lib/design-system/theme-provider';
import { HealthGoal, UserStreak, HealthScore, Achievement } from '@/lib/design-system/types';

// Demo data
const demoHealthGoals: HealthGoal[] = [
  {
    id: '1',
    userId: 'demo-user',
    type: 'weight_loss',
    title: 'Lose 10 pounds',
    description: 'Reach healthy weight through diet and exercise',
    targetValue: 10,
    currentValue: 6.5,
    unit: 'lbs',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    userId: 'demo-user',
    type: 'exercise',
    title: 'Daily Steps Goal',
    description: 'Walk 10,000 steps every day',
    targetValue: 10000,
    currentValue: 8500,
    unit: 'steps',
    deadline: new Date(),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const demoStreaks: UserStreak[] = [
  {
    id: '1',
    userId: 'demo-user',
    type: 'daily_login',
    currentStreak: 15,
    longestStreak: 23,
    lastActivityDate: new Date(),
    isActive: true
  },
  {
    id: '2',
    userId: 'demo-user',
    type: 'medication_taken',
    currentStreak: 7,
    longestStreak: 12,
    lastActivityDate: new Date(),
    isActive: true
  },
  {
    id: '3',
    userId: 'demo-user',
    type: 'exercise_completed',
    currentStreak: 5,
    longestStreak: 8,
    lastActivityDate: new Date(),
    isActive: true
  }
];

const demoHealthScore: HealthScore = {
  id: '1',
  userId: 'demo-user',
  overallScore: 78,
  fitnessScore: 82,
  nutritionScore: 75,
  medicationScore: 88,
  wellnessScore: 70,
  trend: 'improving',
  lastCalculated: new Date(),
  factors: {
    exerciseConsistency: 85,
    medicationAdherence: 88,
    nutritionQuality: 75,
    sleepQuality: 68,
    stressLevel: 25
  }
};

interface ToastData {
  id: string;
  type: 'achievement' | 'milestone' | 'reminder';
  title: string;
  message: string;
  achievement?: Achievement;
  celebrationLevel?: 'subtle' | 'moderate' | 'enthusiastic';
}

export default function GamificationDemo() {
  const { theme } = useHealthcareTheme();
  const [goals, setGoals] = useState<HealthGoal[]>(demoHealthGoals);
  const [streaks, setStreaks] = useState<UserStreak[]>(demoStreaks);
  const [healthScore, setHealthScore] = useState<HealthScore>(demoHealthScore);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Demo functions
  const handleGoalUpdate = async (goalId: string, newValue: number) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentValue: newValue, updatedAt: new Date() }
        : goal
    ));

    // Check for goal completion
    const goal = goals.find(g => g.id === goalId);
    if (goal && newValue >= goal.targetValue) {
      const achievement: Achievement = {
        id: `achievement-${Date.now()}`,
        userId: 'demo-user',
        type: 'milestone',
        title: 'Goal Completed!',
        description: `You completed your ${goal.title} goal!`,
        badgeIcon: '🎯',
        earnedAt: new Date(),
        category: 'fitness',
        points: 100
      };
      
      setAchievements(prev => [achievement, ...prev]);
      showToast({
        id: `toast-${Date.now()}`,
        type: 'achievement',
        title: 'Goal Completed! 🎉',
        message: `Congratulations on completing your ${goal.title}!`,
        achievement,
        celebrationLevel: 'enthusiastic'
      });
    }
  };

  const handleStreakUpdate = async (streakType: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStreaks(prev => prev.map(streak => 
      streak.type === streakType 
        ? { 
            ...streak, 
            currentStreak: streak.currentStreak + 1,
            longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1),
            lastActivityDate: new Date()
          }
        : streak
    ));

    // Check for milestone
    const streak = streaks.find(s => s.type === streakType);
    if (streak) {
      const newStreakValue = streak.currentStreak + 1;
      const milestones = [7, 14, 21, 30, 50, 100];
      
      if (milestones.includes(newStreakValue)) {
        const achievement: Achievement = {
          id: `streak-${Date.now()}`,
          userId: 'demo-user',
          type: 'streak',
          title: `${newStreakValue} Day Streak!`,
          description: `Amazing consistency with your ${streakType.replace('_', ' ')} habit!`,
          badgeIcon: newStreakValue >= 30 ? '🏆' : newStreakValue >= 14 ? '🥇' : '🥉',
          earnedAt: new Date(),
          category: 'wellness',
          points: newStreakValue * 5
        };
        
        setAchievements(prev => [achievement, ...prev]);
        showToast({
          id: `toast-${Date.now()}`,
          type: 'achievement',
          title: `${newStreakValue} Day Streak! 🔥`,
          message: `You're on fire with your consistency!`,
          achievement,
          celebrationLevel: 'moderate'
        });
      }
    }
  };

  const handleScoreUpdate = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const improvement = Math.floor(Math.random() * 5) + 1;
    setHealthScore(prev => ({
      ...prev,
      overallScore: Math.min(prev.overallScore + improvement, 100),
      lastCalculated: new Date()
    }));

    // Check for score milestone
    const newScore = Math.min(healthScore.overallScore + improvement, 100);
    const scoreMilestones = [50, 60, 70, 80, 90, 95];
    const achievedMilestone = scoreMilestones.find(
      milestone => healthScore.overallScore < milestone && newScore >= milestone
    );

    if (achievedMilestone) {
      const achievement: Achievement = {
        id: `score-${Date.now()}`,
        userId: 'demo-user',
        type: 'milestone',
        title: `Health Score ${achievedMilestone}!`,
        description: `Your overall health score reached ${achievedMilestone} points!`,
        badgeIcon: achievedMilestone >= 90 ? '🌟' : achievedMilestone >= 80 ? '⭐' : '🎯',
        earnedAt: new Date(),
        category: 'wellness',
        points: achievedMilestone * 2
      };
      
      setAchievements(prev => [achievement, ...prev]);
      showToast({
        id: `toast-${Date.now()}`,
        type: 'achievement',
        title: `Health Score Milestone! ⭐`,
        message: `You've reached a health score of ${achievedMilestone}!`,
        achievement,
        celebrationLevel: 'moderate'
      });
    }
  };

  const showToast = (toastData: ToastData) => {
    const toast: ToastData = {
      ...toastData,
      id: toastData.id || `toast-${Date.now()}`
    };
    
    setToasts(prev => [toast, ...prev.slice(0, 4)]); // Max 5 toasts
  };

  const dismissToast = (toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  };

  const handleDemoAction = async () => {
    // Simulate multiple updates for demo effect
    await handleGoalUpdate('1', Math.min(goals[0].currentValue + 1, goals[0].targetValue));
    
    setTimeout(async () => {
      await handleStreakUpdate('daily_login');
    }, 1000);
    
    setTimeout(async () => {
      await handleScoreUpdate();
    }, 2000);
  };

  // Auto-dismiss toasts
  useEffect(() => {
    toasts.forEach(toast => {
      setTimeout(() => {
        dismissToast(toast.id);
      }, 5000);
    });
  }, [toasts]);

  // Demo celebration achievements on load
  useEffect(() => {
    const welcomeAchievement: Achievement = {
      id: 'welcome-demo',
      userId: 'demo-user',
      type: 'milestone',
      title: 'Welcome to Gamification!',
      description: 'You\'ve entered the gamification demo. Try updating your goals!',
      badgeIcon: '🎮',
      earnedAt: new Date(),
      category: 'wellness',
      points: 10
    };
    
    setTimeout(() => {
      setAchievements(prev => [welcomeAchievement, ...prev]);
      showToast({
        id: 'welcome-toast',
        type: 'achievement',
        title: 'Welcome! 🎮',
        message: 'Try updating your goals and building streaks!',
        achievement: welcomeAchievement,
        celebrationLevel: 'subtle'
      });
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-healthcare-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-tier mb-4">
            🎮 Healthcare Gamification Demo
          </h1>
          <p className="text-neutral-600 text-lg max-w-3xl mx-auto">
            Experience how we motivate healthy behaviors through goal tracking, achievement systems, 
            and social engagement designed specifically for healthcare scenarios.
          </p>
        </div>

        {/* Current Tier Display */}
        <div className="bg-tier-surface rounded-lg p-6 mb-8 border border-tier-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-tier capitalize">
                {theme.tier} Tier Experience
              </h2>
              <p className="text-neutral-600 text-sm mt-1">
                {theme.tier === 'basic' && 'Essential health tracking with basic gamification'}
                {theme.tier === 'enhanced' && 'Advanced features with family sharing and detailed analytics'}
                {theme.tier === 'premium' && 'Full AI-powered experience with clinical integration'}
              </p>
            </div>
            
            <InteractiveButton
              state="idle"
              variant="primary"
              size="md"
              onClick={handleDemoAction}
              enableHaptics={true}
              celebrateSuccess={true}
            >
              🚀 Demo All Features
            </InteractiveButton>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          <InteractiveButton
            state="idle"
            variant="secondary"
            size="md"
            onClick={() => handleGoalUpdate('1', Math.min(goals[0].currentValue + 0.5, goals[0].targetValue))}
          >
            📈 Update Weight Goal
          </InteractiveButton>
          
          <InteractiveButton
            state="idle"
            variant="accent"
            size="md"
            onClick={() => handleStreakUpdate('medication_taken')}
          >
            💊 Take Medication
          </InteractiveButton>
          
          <InteractiveButton
            state="idle"
            variant="tier"
            size="md"
            onClick={() => handleStreakUpdate('exercise_completed')}
          >
            🏃‍♂️ Complete Exercise
          </InteractiveButton>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Health Goals */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
              🎯 Active Health Goals
            </h2>
            
            {goals.map((goal) => (
              <ProgressCard
                key={goal.id}
                healthGoal={goal}
                onGoalUpdate={handleGoalUpdate}
                onCelebration={(achievement) => {
                  setAchievements(prev => [achievement, ...prev]);
                  showToast({
                    id: `celebration-${Date.now()}`,
                    type: 'achievement',
                    title: 'Achievement Unlocked! 🎉',
                    message: achievement.title,
                    achievement,
                    celebrationLevel: 'enthusiastic'
                  });
                }}
                className="transform hover:scale-[1.02] transition-transform"
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Score */}
            <HealthScoreWidget
              healthScore={healthScore}
              historicalScores={[]}
              onScoreUpdate={handleScoreUpdate}
              onTrendAnalysis={() => {
                showToast({
                  id: `trend-${Date.now()}`,
                  type: 'milestone',
                  title: 'Trend Analysis 📊',
                  message: 'Your health score has improved by 12% this month!',
                  celebrationLevel: 'moderate'
                });
              }}
            />

            {/* Streaks */}
            <StreakTracker
              userStreaks={streaks}
              achievements={achievements}
              onStreakUpdate={handleStreakUpdate}
              className="streak-tracker-demo"
            />
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">
              🏆 Recent Achievements
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.slice(0, 6).map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{achievement.badgeIcon}</span>
                    <div>
                      <h3 className="font-semibold text-neutral-800">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-tier-surface text-tier px-2 py-1 rounded">
                          +{achievement.points} pts
                        </span>
                        <span className="text-xs text-neutral-500">
                          {achievement.earnedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <NotificationToast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              tier={theme.tier}
              onDismiss={() => dismissToast(toast.id)}
              duration={5000}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
