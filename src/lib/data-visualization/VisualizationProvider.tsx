'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

// Types for healthcare data visualization
export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  range: {
    min: number;
    max: number;
    optimal: { min: number; max: number };
    caution: { min: number; max: number };
    warning: { min: number; max: number };
  };
  trend: 'improving' | 'stable' | 'declining';
  source: 'user_input' | 'device' | 'clinical' | 'calculated';
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  avatar: string;
  healthScore: number;
  privacyLevel: 'full' | 'summary' | 'none';
  lastActivity: Date;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: Date;
  category: 'nutrition' | 'exercise' | 'medication' | 'vitals' | 'goals';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  timestamp: Date;
}

export interface MedicationAdherence {
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  adherenceRate: number;
  streakDays: number;
  missedDoses: Date[];
  nextDue: Date;
  interactions: string[];
}

interface VisualizationContextType {
  // Data management
  healthMetrics: HealthMetric[];
  familyMembers: FamilyMember[];
  nutritionData: NutritionData[];
  medicationData: MedicationAdherence[];
  
  // Visualization preferences
  isReducedMotion: boolean;
  colorTheme: 'healthcare' | 'accessible' | 'high-contrast';
  timeRange: 'day' | 'week' | 'month' | 'year';
  
  // Accessibility
  announceDataChange: (message: string) => void;
  getAlternativeText: (chartType: string, data: any) => string;
  
  // Data operations
  updateHealthMetric: (metric: HealthMetric) => void;
  addNutritionEntry: (nutrition: NutritionData) => void;
  updateMedicationAdherence: (medication: MedicationAdherence) => void;
  
  // Visualization controls
  setTimeRange: (range: 'day' | 'week' | 'month' | 'year') => void;
  setColorTheme: (theme: 'healthcare' | 'accessible' | 'high-contrast') => void;
  
  // Real-time updates
  subscribeToUpdates: (callback: (data: any) => void) => () => void;
  
  // Gamification
  triggerAchievement: (achievement: Achievement) => void;
  celebrateProgress: (metric: string, improvement: number) => void;
}

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

// Healthcare-specific color palettes
export const colorPalettes = {
  healthcare: {
    primary: '#0891B2',
    secondary: '#10B981',
    accent: '#3B82F6',
    warning: '#F59E0B',
    danger: '#EF4444',
    success: '#10B981',
    neutral: '#6B7280',
    background: '#F8FAFC',
    zones: {
      optimal: '#22C55E',
      caution: '#F59E0B',
      warning: '#EF4444',
      critical: '#DC2626'
    }
  },
  accessible: {
    primary: '#1F2937',
    secondary: '#374151',
    accent: '#6366F1',
    warning: '#D97706',
    danger: '#DC2626',
    success: '#059669',
    neutral: '#9CA3AF',
    background: '#FFFFFF',
    zones: {
      optimal: '#059669',
      caution: '#D97706',
      warning: '#DC2626',
      critical: '#991B1B'
    }
  },
  'high-contrast': {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#0000FF',
    warning: '#FFFF00',
    danger: '#FF0000',
    success: '#00FF00',
    neutral: '#808080',
    background: '#FFFFFF',
    zones: {
      optimal: '#00FF00',
      caution: '#FFFF00',
      warning: '#FF0000',
      critical: '#FF0000'
    }
  }
};

// Sample data generators for demo purposes
const generateSampleHealthMetrics = (): HealthMetric[] => [
  {
    id: 'blood_pressure_systolic',
    name: 'Systolic Blood Pressure',
    value: 128,
    unit: 'mmHg',
    timestamp: new Date(),
    range: {
      min: 80,
      max: 200,
      optimal: { min: 90, max: 120 },
      caution: { min: 120, max: 140 },
      warning: { min: 140, max: 180 }
    },
    trend: 'improving',
    source: 'device'
  },
  {
    id: 'weight',
    name: 'Weight',
    value: 165,
    unit: 'lbs',
    timestamp: new Date(),
    range: {
      min: 100,
      max: 300,
      optimal: { min: 140, max: 180 },
      caution: { min: 180, max: 200 },
      warning: { min: 200, max: 250 }
    },
    trend: 'stable',
    source: 'user_input'
  },
  {
    id: 'blood_glucose',
    name: 'Blood Glucose',
    value: 95,
    unit: 'mg/dL',
    timestamp: new Date(),
    range: {
      min: 50,
      max: 400,
      optimal: { min: 80, max: 100 },
      caution: { min: 100, max: 126 },
      warning: { min: 126, max: 200 }
    },
    trend: 'improving',
    source: 'device'
  }
];

const generateSampleNutritionData = (): NutritionData[] => [
  {
    calories: 1850,
    protein: 125,
    carbs: 220,
    fat: 65,
    fiber: 28,
    sugar: 45,
    sodium: 1800,
    goals: {
      calories: 2000,
      protein: 130,
      carbs: 250,
      fat: 70
    },
    timestamp: new Date()
  }
];

interface VisualizationProviderProps {
  children: React.ReactNode;
  initialTheme?: 'healthcare' | 'accessible' | 'high-contrast';
}

export function VisualizationProvider({ 
  children, 
  initialTheme = 'healthcare' 
}: VisualizationProviderProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // State management
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(generateSampleHealthMetrics);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [nutritionData, setNutritionData] = useState<NutritionData[]>(generateSampleNutritionData);
  const [medicationData, setMedicationData] = useState<MedicationAdherence[]>([]);
  
  // Visualization preferences
  const [colorTheme, setColorTheme] = useState(initialTheme);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  
  // Real-time update subscriptions
  const updateSubscribers = useRef<Set<(data: any) => void>>(new Set());
  
  // Accessibility announcements
  const announceDataChange = useCallback((message: string) => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    }, 1000);
  }, []);
  
  // Alternative text generation for charts
  const getAlternativeText = useCallback((chartType: string, data: any): string => {
    switch (chartType) {
      case 'health-trend':
        return `Health trend chart showing ${data.metrics?.length || 0} metrics over ${timeRange}. ${data.summary || 'Data trends available.'}`;
      case 'nutrition-wheel':
        return `Nutrition balance wheel showing daily intake: ${data.calories || 0} calories, ${data.protein || 0}g protein, ${data.carbs || 0}g carbs, ${data.fat || 0}g fat.`;
      case 'medication-calendar':
        return `Medication adherence calendar showing ${data.adherenceRate || 0}% compliance rate over the last ${timeRange}.`;
      default:
        return `${chartType} visualization with current health data.`;
    }
  }, [timeRange]);
  
  // Data operations
  const updateHealthMetric = useCallback((metric: HealthMetric) => {
    setHealthMetrics(prev => {
      const updated = prev.map(m => m.id === metric.id ? metric : m);
      if (!prev.find(m => m.id === metric.id)) {
        updated.push(metric);
      }
      return updated;
    });
    
    announceDataChange(`${metric.name} updated to ${metric.value} ${metric.unit}`);
    
    // Notify subscribers
    updateSubscribers.current.forEach(callback => {
      callback({ type: 'health_metric_updated', data: metric });
    });
  }, [announceDataChange]);
  
  const addNutritionEntry = useCallback((nutrition: NutritionData) => {
    setNutritionData(prev => [...prev, nutrition]);
    
    announceDataChange(`Nutrition entry added: ${nutrition.calories} calories logged`);
    
    updateSubscribers.current.forEach(callback => {
      callback({ type: 'nutrition_added', data: nutrition });
    });
  }, [announceDataChange]);
  
  const updateMedicationAdherence = useCallback((medication: MedicationAdherence) => {
    setMedicationData(prev => {
      const updated = prev.map(m => m.medicationId === medication.medicationId ? medication : m);
      if (!prev.find(m => m.medicationId === medication.medicationId)) {
        updated.push(medication);
      }
      return updated;
    });
    
    announceDataChange(`${medication.medicationName} adherence updated to ${medication.adherenceRate}%`);
    
    updateSubscribers.current.forEach(callback => {
      callback({ type: 'medication_updated', data: medication });
    });
  }, [announceDataChange]);
  
  // Real-time subscriptions
  const subscribeToUpdates = useCallback((callback: (data: any) => void) => {
    updateSubscribers.current.add(callback);
    
    return () => {
      updateSubscribers.current.delete(callback);
    };
  }, []);
  
  // Gamification features
  const triggerAchievement = useCallback((achievement: Achievement) => {
    announceDataChange(`Achievement unlocked: ${achievement.title}`);
    
    updateSubscribers.current.forEach(callback => {
      callback({ type: 'achievement_unlocked', data: achievement });
    });
  }, [announceDataChange]);
  
  const celebrateProgress = useCallback((metric: string, improvement: number) => {
    const message = `${metric} improved by ${improvement > 0 ? '+' : ''}${improvement}%`;
    announceDataChange(message);
    
    updateSubscribers.current.forEach(callback => {
      callback({ type: 'progress_celebration', data: { metric, improvement } });
    });
  }, [announceDataChange]);
  
  // WebSocket connection for real-time updates (placeholder)
  useEffect(() => {
    // In a real implementation, this would establish WebSocket connection
    const interval = setInterval(() => {
      // Simulate real-time data updates
      if (Math.random() > 0.9) {
        const randomMetric = healthMetrics[Math.floor(Math.random() * healthMetrics.length)];
        if (randomMetric) {
          const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
          updateHealthMetric({
            ...randomMetric,
            value: Math.round(randomMetric.value * (1 + variation)),
            timestamp: new Date()
          });
        }
      }
    }, 10000); // Update every 10 seconds for demo
    
    return () => clearInterval(interval);
  }, [healthMetrics, updateHealthMetric]);
  
  const contextValue: VisualizationContextType = {
    // Data
    healthMetrics,
    familyMembers,
    nutritionData,
    medicationData,
    
    // Preferences
    isReducedMotion: prefersReducedMotion || false,
    colorTheme,
    timeRange,
    
    // Accessibility
    announceDataChange,
    getAlternativeText,
    
    // Operations
    updateHealthMetric,
    addNutritionEntry,
    updateMedicationAdherence,
    
    // Controls
    setTimeRange,
    setColorTheme,
    
    // Real-time
    subscribeToUpdates,
    
    // Gamification
    triggerAchievement,
    celebrateProgress
  };

  return (
    <VisualizationContext.Provider value={contextValue}>
      {children}
    </VisualizationContext.Provider>
  );
}

export function useVisualization() {
  const context = useContext(VisualizationContext);
  if (context === undefined) {
    throw new Error('useVisualization must be used within a VisualizationProvider');
  }
  return context;
}

// Utility functions for data processing
export const calculateHealthScore = (metrics: HealthMetric[]): number => {
  if (metrics.length === 0) return 0;
  
  const scores = metrics.map(metric => {
    const { value, range } = metric;
    const { optimal, caution, warning } = range;
    
    if (value >= optimal.min && value <= optimal.max) return 100;
    if (value >= caution.min && value <= caution.max) return 75;
    if (value >= warning.min && value <= warning.max) return 50;
    return 25;
  });
  
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

export const getHealthZone = (value: number, range: HealthMetric['range']): string => {
  const { optimal, caution, warning } = range;
  
  if (value >= optimal.min && value <= optimal.max) return 'optimal';
  if (value >= caution.min && value <= caution.max) return 'caution';
  if (value >= warning.min && value <= warning.max) return 'warning';
  return 'critical';
};

export const formatHealthValue = (value: number, unit: string): string => {
  if (unit === '%') return `${value}%`;
  if (unit === 'mg/dL' || unit === 'mmHg') return `${value} ${unit}`;
  if (unit === 'lbs' || unit === 'kg') return `${value} ${unit}`;
  return `${value} ${unit}`;
}; 