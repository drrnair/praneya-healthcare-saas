'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GamificationMetrics, Achievement, HealthScore } from '../types';
import { useHealthGoals } from './useHealthGoals';
import { useStreakTracking } from './useStreakTracking';

interface UseGamificationOptions {
  userId: string;
  familyId?: string;
  enableNotifications?: boolean;
  celebrationDuration?: number;
}

interface UseGamificationReturn {
  metrics: GamificationMetrics;
  healthScore: HealthScore | null;
  loading: boolean;
  error: Error | null;
  celebrateAchievement: (achievement: Achievement) => void;
  updateProgress: (type: string, value: number) => Promise<void>;
  getLevel: () => number;
  getProgressToNextLevel: () => number;
  getEngagementStreak: () => number;
  getTotalPoints: () => number;
  recentAchievements: Achievement[];
  leaderboard: Array<{ userId: string; userName: string; points: number; level: number }>;
  refetch: () => Promise<void>;
}

// Experience point calculations
const EXPERIENCE_CONSTANTS = {
  BASE_POINTS_PER_LEVEL: 1000,
  LEVEL_MULTIPLIER: 1.5,
  MAX_LEVEL: 100,
  DAILY_LOGIN_POINTS: 10,
  GOAL_COMPLETION_POINTS: 100,
  STREAK_MILESTONE_MULTIPLIER: 10,
  HEALTH_IMPROVEMENT_POINTS: 50
};

// Calculate level from experience points
const calculateLevel = (experiencePoints: number): number => {
  let level = 1;
  let pointsNeeded = EXPERIENCE_CONSTANTS.BASE_POINTS_PER_LEVEL;
  let totalPointsForLevel = 0;

  while (totalPointsForLevel + pointsNeeded <= experiencePoints && level < EXPERIENCE_CONSTANTS.MAX_LEVEL) {
    totalPointsForLevel += pointsNeeded;
    level++;
    pointsNeeded = Math.floor(EXPERIENCE_CONSTANTS.BASE_POINTS_PER_LEVEL * Math.pow(EXPERIENCE_CONSTANTS.LEVEL_MULTIPLIER, level - 1));
  }

  return level;
};

// Calculate points needed for next level
const calculatePointsToNextLevel = (experiencePoints: number): number => {
  const currentLevel = calculateLevel(experiencePoints);
  if (currentLevel >= EXPERIENCE_CONSTANTS.MAX_LEVEL) return 0;

  let totalPointsForCurrentLevel = 0;
  for (let i = 1; i < currentLevel; i++) {
    totalPointsForCurrentLevel += Math.floor(EXPERIENCE_CONSTANTS.BASE_POINTS_PER_LEVEL * Math.pow(EXPERIENCE_CONSTANTS.LEVEL_MULTIPLIER, i - 1));
  }

  const pointsForNextLevel = Math.floor(EXPERIENCE_CONSTANTS.BASE_POINTS_PER_LEVEL * Math.pow(EXPERIENCE_CONSTANTS.LEVEL_MULTIPLIER, currentLevel - 1));
  const pointsInCurrentLevel = experiencePoints - totalPointsForCurrentLevel;
  
  return pointsForNextLevel - pointsInCurrentLevel;
};

export function useGamification({
  userId,
  familyId,
  enableNotifications = true,
  celebrationDuration = 3000
}: UseGamificationOptions): UseGamificationReturn {
  const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{ userId: string; userName: string; points: number; level: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [celebratingAchievement, setCelebratingAchievement] = useState<Achievement | null>(null);

  // Use our existing hooks
  const {
    goals,
    loading: goalsLoading,
    updateGoal,
    achievements: goalAchievements
  } = useHealthGoals({ userId });

  const {
    streaks,
    loading: streaksLoading,
    updateStreak,
    achievements: streakAchievements,
    getTotalStreakDays
  } = useStreakTracking({ userId });

  // Fetch health score and additional data
  const fetchAdditionalData = useCallback(async () => {
    try {
      const [scoreResponse, achievementsResponse, leaderboardResponse] = await Promise.all([
        fetch(`/api/health-score?userId=${userId}`),
        fetch(`/api/achievements?userId=${userId}&limit=10&recent=true`),
        familyId ? fetch(`/api/leaderboard?familyId=${familyId}`) : Promise.resolve({ json: () => ({ leaderboard: [] }) })
      ]);

      const [scoreData, achievementsData, leaderboardData] = await Promise.all([
        scoreResponse.ok ? scoreResponse.json() : { healthScore: null },
        achievementsResponse.ok ? achievementsResponse.json() : { achievements: [] },
        leaderboardResponse.json()
      ]);

      setHealthScore(scoreData.healthScore);
      setRecentAchievements(achievementsData.achievements || []);
      setLeaderboard(leaderboardData.leaderboard || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch gamification data'));
    }
  }, [userId, familyId]);

  // Calculate comprehensive gamification metrics
  const metrics = useMemo((): GamificationMetrics => {
    // Combine all achievements
    const allAchievements = [
      ...goalAchievements,
      ...streakAchievements,
      ...recentAchievements
    ].filter((achievement, index, self) => 
      index === self.findIndex(a => a.id === achievement.id)
    );

    // Calculate total points
    const totalPoints = allAchievements.reduce((sum, achievement) => sum + achievement.points, 0);

    // Calculate level and experience
    const level = calculateLevel(totalPoints);
    const nextLevelThreshold = calculatePointsToNextLevel(totalPoints);

    // Weekly goal completion rate
    const activeGoals = goals.filter(goal => goal.isActive);
    const completedGoals = activeGoals.filter(goal => 
      (goal.currentValue / goal.targetValue) >= 1
    );
    const weeklyGoalCompletion = activeGoals.length > 0 
      ? (completedGoals.length / activeGoals.length) * 100 
      : 0;

    // Monthly engagement (based on streaks and recent activity)
    const monthlyEngagement = Math.min(
      getTotalStreakDays() * 2 + // Streak contribution
      allAchievements.filter(a => {
        const earnedDate = new Date(a.earnedAt);
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return earnedDate >= monthAgo;
      }).length * 10, // Recent achievements contribution
      100
    );

    return {
      totalPoints,
      level,
      experiencePoints: totalPoints,
      nextLevelThreshold,
      badges: allAchievements,
      streaks,
      weeklyGoalCompletion,
      monthlyEngagement
    };
  }, [goals, streaks, goalAchievements, streakAchievements, recentAchievements, getTotalStreakDays]);

  // Celebrate achievement with optional notifications
  const celebrateAchievement = useCallback((achievement: Achievement) => {
    setCelebratingAchievement(achievement);
    
    // Add to recent achievements
    setRecentAchievements(prev => [achievement, ...prev.slice(0, 9)]);

    // Optional notification
    if (enableNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(`🎉 ${achievement.title}`, {
        body: achievement.description,
        icon: '/icons/achievement.png',
        badge: '/icons/badge.png'
      });
    }

    // Clear celebration after duration
    setTimeout(() => {
      setCelebratingAchievement(null);
    }, celebrationDuration);
  }, [enableNotifications, celebrationDuration]);

  // Update progress for different types
  const updateProgress = useCallback(async (type: string, value: number) => {
    try {
      if (type.includes('goal_')) {
        const goalId = type.replace('goal_', '');
        await updateGoal(goalId, value);
      } else if (type.includes('streak_')) {
        const streakType = type.replace('streak_', '');
        await updateStreak(streakType);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update progress'));
      throw err;
    }
  }, [updateGoal, updateStreak]);

  // Convenience methods
  const getLevel = useCallback(() => metrics.level, [metrics.level]);
  const getProgressToNextLevel = useCallback(() => metrics.nextLevelThreshold, [metrics.nextLevelThreshold]);
  const getEngagementStreak = useCallback(() => {
    const loginStreak = streaks.find(s => s.type === 'daily_login');
    return loginStreak?.currentStreak || 0;
  }, [streaks]);
  const getTotalPoints = useCallback(() => metrics.totalPoints, [metrics.totalPoints]);

  // Refetch all data
  const refetch = useCallback(async () => {
    await fetchAdditionalData();
  }, [fetchAdditionalData]);

  // Initial data loading
  useEffect(() => {
    fetchAdditionalData();
  }, [fetchAdditionalData]);

  // Update loading state
  useEffect(() => {
    setLoading(goalsLoading || streaksLoading);
  }, [goalsLoading, streaksLoading]);

  // Request notification permission on mount
  useEffect(() => {
    if (enableNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [enableNotifications]);

  return {
    metrics,
    healthScore,
    loading,
    error,
    celebrateAchievement,
    updateProgress,
    getLevel,
    getProgressToNextLevel,
    getEngagementStreak,
    getTotalPoints,
    recentAchievements,
    leaderboard,
    refetch
  };
} 