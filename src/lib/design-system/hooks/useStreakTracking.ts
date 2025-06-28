'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserStreak, Achievement } from '../types';

interface UseStreakTrackingOptions {
  userId: string;
  enableMilestoneDetection?: boolean;
  autoAwardAchievements?: boolean;
}

interface UseStreakTrackingReturn {
  streaks: UserStreak[];
  loading: boolean;
  error: Error | null;
  updateStreak: (type: string) => Promise<UserStreak>;
  getStreakByType: (type: string) => UserStreak | null;
  getTotalStreakDays: () => number;
  getLongestStreak: () => UserStreak | null;
  checkMilestones: (streak: UserStreak) => number[];
  isStreakActive: (streak: UserStreak) => boolean;
  achievements: Achievement[];
  refetch: () => Promise<void>;
}

// Milestone configurations for different streak types
const STREAK_MILESTONES = {
  daily_login: [7, 30, 100, 365, 1000],
  medication_taken: [7, 14, 30, 90, 180, 365],
  exercise_completed: [3, 7, 21, 50, 100, 365],
  meal_logged: [7, 30, 60, 180, 365],
  sleep_tracked: [7, 30, 90, 365],
  water_intake: [7, 30, 90, 365],
  meditation: [7, 21, 50, 100, 365],
  weight_recorded: [7, 30, 90, 365]
};

export function useStreakTracking({
  userId,
  enableMilestoneDetection = true,
  autoAwardAchievements = true
}: UseStreakTrackingOptions): UseStreakTrackingReturn {
  const [streaks, setStreaks] = useState<UserStreak[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user streaks
  const fetchStreaks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/streaks?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch streaks');
      }

      const data = await response.json();
      setStreaks(data.streaks || []);
      setAchievements(data.achievements || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Check if streak is active (activity within last 24-48 hours depending on type)
  const isStreakActive = useCallback((streak: UserStreak): boolean => {
    const now = new Date();
    const lastActivity = new Date(streak.lastActivityDate);
    const hoursSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

    // Different grace periods for different streak types
    const gracePeriods = {
      daily_login: 48, // 2 days grace
      medication_taken: 36, // 1.5 days grace (important for health)
      exercise_completed: 48, // 2 days grace
      meal_logged: 48, // 2 days grace
      sleep_tracked: 48, // 2 days grace
      water_intake: 36, // 1.5 days grace
      meditation: 48, // 2 days grace
      weight_recorded: 72 // 3 days grace (weekly tracking acceptable)
    };

    const gracePeriod = gracePeriods[streak.type as keyof typeof gracePeriods] || 48;
    return hoursSinceActivity <= gracePeriod;
  }, []);

  // Check milestones for a streak
  const checkMilestones = useCallback((streak: UserStreak): number[] => {
    const milestones = STREAK_MILESTONES[streak.type as keyof typeof STREAK_MILESTONES] || [];
    return milestones.filter(milestone => 
      streak.currentStreak >= milestone && 
      (streak.currentStreak - 1) < milestone
    );
  }, []);

  // Award achievement for milestone
  const awardMilestoneAchievement = useCallback(async (streak: UserStreak, milestone: number) => {
    if (!autoAwardAchievements) return;

    const streakTypeNames = {
      daily_login: 'Daily Check-in',
      medication_taken: 'Medication Adherence',
      exercise_completed: 'Exercise',
      meal_logged: 'Meal Tracking',
      sleep_tracked: 'Sleep Tracking',
      water_intake: 'Hydration',
      meditation: 'Meditation',
      weight_recorded: 'Weight Tracking'
    };

    const achievementData = {
      userId: streak.userId,
      type: 'streak' as const,
      title: `${milestone} Day ${streakTypeNames[streak.type as keyof typeof streakTypeNames] || 'Activity'} Streak!`,
      description: `Maintained a ${milestone}-day streak of consistent ${streakTypeNames[streak.type as keyof typeof streakTypeNames]?.toLowerCase() || 'activity'}`,
      badgeIcon: milestone >= 365 ? '🏆' : milestone >= 100 ? '🥇' : milestone >= 30 ? '🥈' : milestone >= 7 ? '🥉' : '⭐',
      category: 'wellness' as const,
      points: milestone >= 365 ? 1000 : milestone >= 100 ? 500 : milestone >= 30 ? 200 : milestone >= 7 ? 100 : 50
    };

    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(achievementData)
      });

      if (response.ok) {
        const { achievement } = await response.json();
        setAchievements(prev => [achievement, ...prev]);
        return achievement;
      }
    } catch (error) {
      console.error('Failed to award achievement:', error);
    }

    return null;
  }, [autoAwardAchievements]);

  // Update streak
  const updateStreak = useCallback(async (type: string): Promise<UserStreak> => {
    try {
      const response = await fetch('/api/streaks/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, type })
      });

      if (!response.ok) {
        throw new Error('Failed to update streak');
      }

      const { streak: updatedStreak, isNewMilestone, milestone } = await response.json();

      // Update local state
      setStreaks(prev => {
        const existingIndex = prev.findIndex(s => s.type === type);
        if (existingIndex >= 0) {
          const newStreaks = [...prev];
          newStreaks[existingIndex] = updatedStreak;
          return newStreaks;
        } else {
          return [updatedStreak, ...prev];
        }
      });

      // Award milestone achievement if applicable
      if (enableMilestoneDetection && isNewMilestone && milestone) {
        await awardMilestoneAchievement(updatedStreak, milestone);
      }

      return updatedStreak;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update streak'));
      throw err;
    }
  }, [userId, enableMilestoneDetection, awardMilestoneAchievement]);

  // Get streak by type
  const getStreakByType = useCallback((type: string): UserStreak | null => {
    return streaks.find(streak => streak.type === type) || null;
  }, [streaks]);

  // Get total streak days across all types
  const getTotalStreakDays = useCallback((): number => {
    return streaks.reduce((total, streak) => total + streak.currentStreak, 0);
  }, [streaks]);

  // Get longest current streak
  const getLongestStreak = useCallback((): UserStreak | null => {
    if (streaks.length === 0) return null;
    return streaks.reduce((longest, current) => 
      current.currentStreak > longest.currentStreak ? current : longest
    );
  }, [streaks]);

  // Refetch data
  const refetch = useCallback(async () => {
    await fetchStreaks();
  }, [fetchStreaks]);

  // Initial data fetch
  useEffect(() => {
    fetchStreaks();
  }, [fetchStreaks]);

  // Periodic check for streak status (every 30 minutes)
  useEffect(() => {
    const checkStreakStatus = () => {
      setStreaks(prev => prev.map(streak => ({
        ...streak,
        isActive: isStreakActive(streak)
      })));
    };

    const interval = setInterval(checkStreakStatus, 30 * 60 * 1000); // 30 minutes
    
    return () => clearInterval(interval);
  }, [isStreakActive]);

  return {
    streaks,
    loading,
    error,
    updateStreak,
    getStreakByType,
    getTotalStreakDays,
    getLongestStreak,
    checkMilestones,
    isStreakActive,
    achievements,
    refetch
  };
} 