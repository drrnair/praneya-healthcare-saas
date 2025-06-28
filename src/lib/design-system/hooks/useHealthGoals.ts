'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { HealthGoal, BiometricReading, Achievement } from '../types';

interface UseHealthGoalsOptions {
  userId: string;
  enableOptimisticUpdates?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseHealthGoalsReturn {
  goals: HealthGoal[];
  loading: boolean;
  error: Error | null;
  updateGoal: (goalId: string, value: number) => Promise<void>;
  createGoal: (goal: Omit<HealthGoal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<HealthGoal>;
  deleteGoal: (goalId: string) => Promise<void>;
  getGoalProgress: (goalId: string) => number;
  getGoalsByType: (type: string) => HealthGoal[];
  refetch: () => Promise<void>;
  recentReadings: BiometricReading[];
  achievements: Achievement[];
}

export function useHealthGoals({
  userId,
  enableOptimisticUpdates = true,
  autoRefresh = false,
  refreshInterval = 300000 // 5 minutes
}: UseHealthGoalsOptions): UseHealthGoalsReturn {
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [recentReadings, setRecentReadings] = useState<BiometricReading[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch goals from API
  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [goalsResponse, readingsResponse, achievementsResponse] = await Promise.all([
        fetch(`/api/health-goals?userId=${userId}`),
        fetch(`/api/biometric-readings?userId=${userId}&limit=10`),
        fetch(`/api/achievements?userId=${userId}&limit=5`)
      ]);

      if (!goalsResponse.ok) {
        throw new Error('Failed to fetch health goals');
      }

      const [goalsData, readingsData, achievementsData] = await Promise.all([
        goalsResponse.json(),
        readingsResponse.json(),
        achievementsResponse.json()
      ]);

      setGoals(goalsData.goals || []);
      setRecentReadings(readingsData.readings || []);
      setAchievements(achievementsData.achievements || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update goal progress
  const updateGoal = useCallback(async (goalId: string, value: number) => {
    const originalGoals = [...goals];
    
    // Optimistic update
    if (enableOptimisticUpdates) {
      setGoals(prev => prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, currentValue: value, updatedAt: new Date() }
          : goal
      ));
    }

    try {
      const response = await fetch(`/api/health-goals/${goalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentValue: value }),
      });

      if (!response.ok) {
        throw new Error('Failed to update goal');
      }

      const updatedGoal = await response.json();
      
      // Update with server response
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? updatedGoal.goal : goal
      ));

      // Check for new achievements
      if (updatedGoal.achievements && updatedGoal.achievements.length > 0) {
        setAchievements(prev => [...updatedGoal.achievements, ...prev]);
      }

    } catch (err) {
      // Revert optimistic update on error
      if (enableOptimisticUpdates) {
        setGoals(originalGoals);
      }
      throw err;
    }
  }, [goals, enableOptimisticUpdates]);

  // Create new goal
  const createGoal = useCallback(async (goalData: Omit<HealthGoal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/health-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        throw new Error('Failed to create goal');
      }

      const { goal: newGoal } = await response.json();
      setGoals(prev => [newGoal, ...prev]);
      
      return newGoal;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create goal'));
      throw err;
    }
  }, []);

  // Delete goal
  const deleteGoal = useCallback(async (goalId: string) => {
    const originalGoals = [...goals];
    
    // Optimistic update
    if (enableOptimisticUpdates) {
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    }

    try {
      const response = await fetch(`/api/health-goals/${goalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }
    } catch (err) {
      // Revert optimistic update on error
      if (enableOptimisticUpdates) {
        setGoals(originalGoals);
      }
      throw err;
    }
  }, [goals, enableOptimisticUpdates]);

  // Calculate goal progress percentage
  const getGoalProgress = useCallback((goalId: string): number => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 0;
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  }, [goals]);

  // Filter goals by type
  const getGoalsByType = useCallback((type: string): HealthGoal[] => {
    return goals.filter(goal => goal.type === type);
  }, [goals]);

  // Refetch data
  const refetch = useCallback(async () => {
    await fetchGoals();
  }, [fetchGoals]);

  // Initial data fetch
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshTimeoutRef.current = setInterval(fetchGoals, refreshInterval);
      
      return () => {
        if (refreshTimeoutRef.current) {
          clearInterval(refreshTimeoutRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, fetchGoals]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearInterval(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    goals,
    loading,
    error,
    updateGoal,
    createGoal,
    deleteGoal,
    getGoalProgress,
    getGoalsByType,
    refetch,
    recentReadings,
    achievements
  };
} 