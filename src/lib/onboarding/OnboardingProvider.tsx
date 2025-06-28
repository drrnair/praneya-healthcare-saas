'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthcareTheme } from '@/lib/design-system/theme-provider';

// Onboarding step definitions
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  required: boolean;
  completionCriteria: string[];
  estimatedTime: number; // in minutes
  category: 'welcome' | 'profile' | 'health' | 'subscription' | 'consent';
  achievements?: string[];
}

// User progress tracking
export interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  achievements: string[];
  startTime: Date;
  estimatedCompletion: Date;
  personalizedPath: string[];
  skipReasons: Record<string, string>;
}

// Form data structure
export interface OnboardingData {
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };

  // Health Profile
  healthProfile: {
    height: number;
    weight: number;
    bloodType: string;
    allergies: Array<{
      allergen: string;
      severity: 'mild' | 'moderate' | 'severe';
      reactions: string[];
    }>;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      prescribedBy: string;
      startDate: string;
    }>;
    conditions: Array<{
      condition: string;
      diagnosedDate: string;
      severity: 'mild' | 'moderate' | 'severe';
      managementPlan: string;
    }>;
    healthGoals: Array<{
      category: 'fitness' | 'nutrition' | 'medication' | 'sleep' | 'mental_health';
      description: string;
      targetValue: number;
      unit: string;
      timeframe: string;
    }>;
  };

  // Family Configuration
  familySetup: {
    isPrimaryAccount: boolean;
    familyMembers: Array<{
      name: string;
      relationship: string;
      dateOfBirth: string;
      permissions: string[];
      isMinor: boolean;
    }>;
    guardianConsent: Record<string, boolean>;
  };

  // Subscription Preferences
  subscription: {
    selectedTier: 'basic' | 'enhanced' | 'premium';
    billingCycle: 'monthly' | 'annual';
    addOns: string[];
    trialActivated: boolean;
  };

  // Consent & Compliance
  consents: {
    termsOfService: { accepted: boolean; timestamp: Date; version: string };
    privacyPolicy: { accepted: boolean; timestamp: Date; version: string };
    hipaaAuthorization: { accepted: boolean; timestamp: Date; version: string };
    dataSharing: { accepted: boolean; timestamp: Date; preferences: string[] };
    marketingCommunications: { accepted: boolean; timestamp: Date };
    familyDataAccess: Record<string, { accepted: boolean; timestamp: Date }>;
  };
}

interface OnboardingContextType {
  // State
  currentStep: number;
  progress: OnboardingProgress;
  formData: Partial<OnboardingData>;
  achievements: string[];
  isCompleting: boolean;
  
  // Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
  skipStep: (reason?: string) => void;
  
  // Data Management
  updateFormData: (section: keyof OnboardingData, data: any) => void;
  validateStep: (stepId: string) => boolean;
  saveProgress: () => Promise<void>;
  
  // Achievements
  unlockAchievement: (achievementId: string) => void;
  celebrateCompletion: (stepId: string) => void;
  
  // Completion
  completeOnboarding: () => Promise<void>;
  
  // Configuration
  steps: OnboardingStep[];
  totalSteps: number;
  estimatedTimeRemaining: number;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Achievement definitions
const ACHIEVEMENTS = {
  'profile_complete': {
    id: 'profile_complete',
    title: 'Profile Pioneer',
    description: 'Completed your health profile',
    icon: '👤',
    points: 100,
    category: 'profile'
  },
  'health_data_hero': {
    id: 'health_data_hero',
    title: 'Health Data Hero',
    description: 'Added comprehensive health information',
    icon: '🏥',
    points: 200,
    category: 'health'
  },
  'family_organizer': {
    id: 'family_organizer',
    title: 'Family Organizer',
    description: 'Set up family health management',
    icon: '👨‍👩‍👧‍👦',
    points: 150,
    category: 'family'
  },
  'goal_setter': {
    id: 'goal_setter',
    title: 'Goal Setter',
    description: 'Defined your health goals',
    icon: '🎯',
    points: 120,
    category: 'goals'
  },
  'compliance_champion': {
    id: 'compliance_champion',
    title: 'Compliance Champion',
    description: 'Completed all consent requirements',
    icon: '🛡️',
    points: 80,
    category: 'compliance'
  },
  'onboarding_master': {
    id: 'onboarding_master',
    title: 'Onboarding Master',
    description: 'Completed the entire onboarding journey',
    icon: '🏆',
    points: 500,
    category: 'completion'
  }
};

interface OnboardingProviderProps {
  children: React.ReactNode;
  initialData?: Partial<OnboardingData>;
}

export function OnboardingProvider({ children, initialData }: OnboardingProviderProps) {
  const { theme } = useHealthcareTheme();
  
  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingData>>(initialData || {});
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 0,
    completedSteps: [],
    achievements: [],
    startTime: new Date(),
    estimatedCompletion: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes
    personalizedPath: [],
    skipReasons: {}
  });

  // Step definitions (will be populated by individual step components)
  const [steps, setSteps] = useState<OnboardingStep[]>([]);

  // Auto-save progress
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveProgress();
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [formData, currentStep, achievements]);

  // Calculate estimated time remaining
  const estimatedTimeRemaining = steps
    .slice(currentStep)
    .reduce((total, step) => total + step.estimatedTime, 0);

  // Navigation functions
  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const completedStepId = steps[currentStep].id;
      
      setProgress(prev => ({
        ...prev,
        currentStep: currentStep + 1,
        completedSteps: [...prev.completedSteps, completedStepId]
      }));
      
      setCurrentStep(prev => prev + 1);
      
      // Check for step completion achievements
      celebrateCompletion(completedStepId);
    }
  }, [currentStep, steps]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setProgress(prev => ({
        ...prev,
        currentStep: currentStep - 1
      }));
    }
  }, [currentStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
      setProgress(prev => ({
        ...prev,
        currentStep: stepIndex
      }));
    }
  }, [steps.length]);

  const skipStep = useCallback((reason?: string) => {
    const stepId = steps[currentStep]?.id;
    if (stepId && !steps[currentStep].required) {
      setProgress(prev => ({
        ...prev,
        skipReasons: { ...prev.skipReasons, [stepId]: reason || 'User skipped' }
      }));
      nextStep();
    }
  }, [currentStep, steps, nextStep]);

  // Data management
  const updateFormData = useCallback((section: keyof OnboardingData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  }, []);

  const validateStep = useCallback((stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;

    // Implementation of step-specific validation logic
    switch (step.category) {
      case 'profile':
        return formData.personalInfo?.firstName && formData.personalInfo?.lastName;
      case 'health':
        return formData.healthProfile?.height && formData.healthProfile?.weight;
      case 'subscription':
        return formData.subscription?.selectedTier;
      case 'consent':
        return formData.consents?.termsOfService?.accepted && 
               formData.consents?.privacyPolicy?.accepted;
      default:
        return true;
    }
  }, [steps, formData]);

  const saveProgress = useCallback(async () => {
    try {
      // Save to localStorage as backup
      localStorage.setItem('praneya-onboarding-progress', JSON.stringify({
        formData,
        progress,
        achievements,
        currentStep
      }));

      // Save to backend if user is authenticated
      // await api.post('/onboarding/progress', { formData, progress, achievements });
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
    }
  }, [formData, progress, achievements, currentStep]);

  // Achievement system
  const unlockAchievement = useCallback((achievementId: string) => {
    if (!achievements.includes(achievementId)) {
      setAchievements(prev => [...prev, achievementId]);
      setProgress(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementId]
      }));

      // Trigger celebration animation
      const achievement = ACHIEVEMENTS[achievementId as keyof typeof ACHIEVEMENTS];
      if (achievement) {
        // You can trigger a toast notification or modal here
        console.log('🎉 Achievement Unlocked:', achievement.title);
      }
    }
  }, [achievements]);

  const celebrateCompletion = useCallback((stepId: string) => {
    // Trigger step-specific achievements
    switch (stepId) {
      case 'personal-info':
        unlockAchievement('profile_complete');
        break;
      case 'health-assessment':
        unlockAchievement('health_data_hero');
        break;
      case 'family-setup':
        unlockAchievement('family_organizer');
        break;
      case 'goal-setting':
        unlockAchievement('goal_setter');
        break;
      case 'consent-management':
        unlockAchievement('compliance_champion');
        break;
    }

    // Add celebration effects
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [unlockAchievement]);

  // Complete onboarding
  const completeOnboarding = useCallback(async () => {
    setIsCompleting(true);
    
    try {
      // Final validation
      const allStepsValid = steps.every(step => 
        step.required ? validateStep(step.id) : true
      );

      if (!allStepsValid) {
        throw new Error('Required onboarding steps not completed');
      }

      // Submit final data to backend
      // await api.post('/onboarding/complete', {
      //   formData,
      //   progress,
      //   achievements,
      //   completionTime: new Date()
      // });

      // Unlock completion achievement
      unlockAchievement('onboarding_master');

      // Clear saved progress
      localStorage.removeItem('praneya-onboarding-progress');

      // Redirect to dashboard
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Onboarding completion failed:', error);
      setIsCompleting(false);
    }
  }, [steps, formData, progress, achievements, validateStep, unlockAchievement]);

  // Load saved progress on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('praneya-onboarding-progress');
      if (savedProgress) {
        const { formData: savedData, progress: savedProgressData, achievements: savedAchievements, currentStep: savedStep } = JSON.parse(savedProgress);
        
        setFormData(savedData);
        setProgress(savedProgressData);
        setAchievements(savedAchievements);
        setCurrentStep(savedStep);
      }
    } catch (error) {
      console.error('Failed to load saved onboarding progress:', error);
    }
  }, []);

  const contextValue: OnboardingContextType = {
    // State
    currentStep,
    progress,
    formData,
    achievements,
    isCompleting,
    
    // Navigation
    nextStep,
    previousStep,
    goToStep,
    skipStep,
    
    // Data Management
    updateFormData,
    validateStep,
    saveProgress,
    
    // Achievements
    unlockAchievement,
    celebrateCompletion,
    
    // Completion
    completeOnboarding,
    
    // Configuration
    steps,
    totalSteps: steps.length,
    estimatedTimeRemaining
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

// Achievement component for displaying unlocked achievements
export function AchievementNotification({ achievementId }: { achievementId: string }) {
  const achievement = ACHIEVEMENTS[achievementId as keyof typeof ACHIEVEMENTS];
  
  if (!achievement) return null;

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-primary-200 p-4 max-w-sm"
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">{achievement.icon}</div>
        <div>
          <h3 className="font-semibold text-primary-800">Achievement Unlocked!</h3>
          <p className="text-sm text-primary-600">{achievement.title}</p>
          <p className="text-xs text-neutral-500">{achievement.description}</p>
        </div>
      </div>
      <div className="absolute top-1 right-1">
        <div className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
          +{achievement.points}
        </div>
      </div>
    </motion.div>
  );
} 