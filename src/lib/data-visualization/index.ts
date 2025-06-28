// Core provider and context
export { 
  VisualizationProvider, 
  useVisualization,
  colorPalettes,
  calculateHealthScore,
  getHealthZone,
  formatHealthValue
} from './VisualizationProvider';

// Chart components
export { HealthTrendChart } from './charts/HealthTrendChart';
export { NutritionBalanceWheel } from './charts/NutritionBalanceWheel';
export { FamilyHealthOverview } from './charts/FamilyHealthOverview';
export { MedicationAdherenceTracker } from './charts/MedicationAdherenceTracker';
export { AIRecipeAnalysis } from './charts/AIRecipeAnalysis';

// Types
export type {
  HealthMetric,
  FamilyMember,
  Achievement,
  NutritionData,
  MedicationAdherence
} from './VisualizationProvider';

// Utility functions for quick setup
export const createHealthMetric = (
  name: string,
  value: number,
  unit: string,
  range?: Partial<HealthMetric['range']>
): HealthMetric => ({
  id: name.toLowerCase().replace(/\s+/g, '_'),
  name,
  value,
  unit,
  timestamp: new Date(),
  range: {
    min: 0,
    max: 200,
    optimal: { min: 70, max: 100 },
    caution: { min: 100, max: 130 },
    warning: { min: 130, max: 160 },
    ...range
  },
  trend: 'stable',
  source: 'user_input'
});

export const createNutritionData = (
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  goals?: Partial<NutritionData['goals']>
): NutritionData => ({
  calories,
  protein,
  carbs,
  fat,
  fiber: 0,
  sugar: 0,
  sodium: 0,
  goals: {
    calories: calories * 1.1,
    protein: protein * 1.1,
    carbs: carbs * 1.1,
    fat: fat * 1.1,
    ...goals
  },
  timestamp: new Date()
});

// Preset configurations for common use cases
export const presetConfigurations = {
  bloodPressure: {
    systolic: {
      range: {
        min: 80,
        max: 200,
        optimal: { min: 90, max: 120 },
        caution: { min: 120, max: 140 },
        warning: { min: 140, max: 180 }
      }
    },
    diastolic: {
      range: {
        min: 50,
        max: 120,
        optimal: { min: 60, max: 80 },
        caution: { min: 80, max: 90 },
        warning: { min: 90, max: 110 }
      }
    }
  },
  bloodGlucose: {
    range: {
      min: 50,
      max: 400,
      optimal: { min: 80, max: 100 },
      caution: { min: 100, max: 126 },
      warning: { min: 126, max: 200 }
    }
  },
  weight: {
    range: {
      min: 50,
      max: 300,
      optimal: { min: 120, max: 180 },
      caution: { min: 180, max: 220 },
      warning: { min: 220, max: 280 }
    }
  },
  heartRate: {
    range: {
      min: 40,
      max: 220,
      optimal: { min: 60, max: 100 },
      caution: { min: 100, max: 120 },
      warning: { min: 120, max: 180 }
    }
  }
};

// Quick setup functions
export const setupHealthDashboard = (userId: string, metrics: HealthMetric[] = []) => {
  return {
    userId,
    metrics,
    colorTheme: 'healthcare' as const,
    timeRange: 'week' as const,
    autoUpdate: true,
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      announcements: true
    }
  };
};

export const setupFamilyDashboard = (familyMembers: FamilyMember[], currentUserId: string) => {
  return {
    members: familyMembers,
    currentUserId,
    privacySettings: {
      defaultLevel: 'summary' as const,
      emergencyAccess: true,
      parentalControls: true
    },
    challenges: {
      enabled: true,
      ageAppropriate: true,
      rewardsSystem: true
    }
  };
}; 