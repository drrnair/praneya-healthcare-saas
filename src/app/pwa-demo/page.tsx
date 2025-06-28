'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutProvider, useLayout, useResponsive } from '@/lib/layout/LayoutProvider';
import { MainLayout } from '@/lib/layout/components/MainLayout';
import { GridContainer, GridRow, GridCol, HealthcareGridPatterns } from '@/lib/layout/components/ResponsiveGrid';
import { ProgressCard, StreakTracker, HealthScoreWidget, InteractiveButton, NotificationToast } from '@/lib/design-system/components';
import { HealthcareThemeProvider } from '@/lib/design-system/theme-provider';
import { HealthScore, UserStreak, HealthGoal, Achievement } from '@/lib/design-system/types';

// Mock healthcare data for demonstration
const mockHealthScore: HealthScore = {
  id: '1',
  userId: 'demo-user',
  overallScore: 85,
  fitnessScore: 78,
  nutritionScore: 88,
  medicationScore: 95,
  wellnessScore: 82,
  trend: 'improving',
  lastCalculated: new Date(),
  factors: {
    exerciseConsistency: 78,
    medicationAdherence: 95,
    nutritionQuality: 88,
    sleepQuality: 82,
    stressLevel: 25
  }
};

const mockStreaks: UserStreak[] = [
  { id: '1', userId: 'demo-user', type: 'daily_login', currentStreak: 15, longestStreak: 23, lastActivityDate: new Date(), isActive: true },
  { id: '2', userId: 'demo-user', type: 'medication_taken', currentStreak: 7, longestStreak: 12, lastActivityDate: new Date(), isActive: true },
  { id: '3', userId: 'demo-user', type: 'exercise_completed', currentStreak: 4, longestStreak: 8, lastActivityDate: new Date(), isActive: true },
  { id: '4', userId: 'demo-user', type: 'healthy_meals', currentStreak: 12, longestStreak: 18, lastActivityDate: new Date(), isActive: true }
];

const mockHealthGoals: HealthGoal[] = [
  {
    id: '1',
    userId: 'demo-user',
    type: 'medication',
    title: 'Daily Medication',
    description: 'Take prescribed medications on time',
    currentValue: 85,
    targetValue: 100,
    unit: '%',
    deadline: new Date(Date.now() + 86400000),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    userId: 'demo-user',
    type: 'exercise',
    title: 'Weekly Exercise',
    description: 'Complete 150 minutes of moderate exercise',
    currentValue: 120,
    targetValue: 150,
    unit: 'min',
    deadline: new Date(Date.now() + 86400000 * 3),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    userId: 'demo-user',
    type: 'sleep',
    title: 'Sleep Quality',
    description: 'Get 7-9 hours of quality sleep',
    currentValue: 7.5,
    targetValue: 8,
    unit: 'hrs',
    deadline: new Date(Date.now() + 86400000),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

function PWADemoContent() {
  const { layout } = useLayout();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [achievements] = useState<Achievement[]>([
    { 
      id: '1', 
      userId: 'demo-user',
      type: 'milestone',
      title: 'Week Warrior', 
      description: '7 days medication streak', 
      badgeIcon: '��', 
      earnedAt: new Date(),
      category: 'medication',
      points: 100
    },
    { 
      id: '2', 
      userId: 'demo-user',
      type: 'exploration',
      title: 'Health Explorer', 
      description: 'Logged 5 different metrics', 
      badgeIcon: '🔍', 
      earnedAt: new Date(),
      category: 'tracking',
      points: 50
    },
    { 
      id: '3', 
      userId: 'demo-user',
      type: 'social',
      title: 'Family Champion', 
      description: 'Helped 3 family members', 
      badgeIcon: '👨‍👩‍👧‍👦', 
      earnedAt: new Date(),
      category: 'family',
      points: 150
    }
  ]);

  const [showToast, setShowToast] = useState(false);

  const handleGoalUpdate = async (goalId: string, newValue: number): Promise<void> => {
    console.log(`Goal ${goalId} updated to ${newValue}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleStreakUpdate = async (streakType: string): Promise<void> => {
    console.log(`Streak ${streakType} updated`);
  };

  const handleAchievement = (achievement: Achievement) => {
    console.log(`Achievement ${achievement.id} unlocked!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <MainLayout 
      title="PWA Healthcare Demo"
      subtitle={`${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} Experience`}
    >
      <div className="space-y-6">
        {/* Device Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Current Layout Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Device:</span>
              <span className="ml-1">{isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}</span>
            </div>
            <div>
              <span className="font-medium">Screen:</span>
              <span className="ml-1">{layout.screenWidth}×{layout.screenHeight}</span>
            </div>
            <div>
              <span className="font-medium">Orientation:</span>
              <span className="ml-1 capitalize">{layout.orientation}</span>
            </div>
            <div>
              <span className="font-medium">PWA:</span>
              <span className="ml-1">{layout.isStandalone ? 'Installed' : 'Browser'}</span>
            </div>
          </div>
        </div>

        {/* Hero Section - Health Score */}
        <HealthcareGridPatterns.DashboardHero>
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Your Health Score</h2>
              <p className="text-primary-100">Overall wellness tracking</p>
            </div>
            
            <HealthScoreWidget 
              healthScore={mockHealthScore}
              historicalScores={[]}
              showTrend={true}
              animateChanges={true}
            />

            {/* Quick stats grid */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-2xl font-bold">{mockStreaks[0]?.currentStreak || 0}</div>
                <div className="text-sm text-primary-100">Day Streak</div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-2xl font-bold">{achievements.length}</div>
                <div className="text-sm text-primary-100">Achievements</div>
              </div>
            </div>
          </div>
        </HealthcareGridPatterns.DashboardHero>

        {/* Progress Cards Grid */}
        <GridContainer>
          <GridRow gap="lg">
            <GridCol span={12}>
              <h3 className="text-xl font-semibold mb-4">Health Goals Progress</h3>
            </GridCol>
            {mockHealthGoals.map(goal => (
              <GridCol 
                key={goal.id}
                span={{ mobile: 4, tablet: 4, desktop: 4 }}
              >
                <ProgressCard
                  healthGoal={goal}
                  onGoalUpdate={handleGoalUpdate}
                  onCelebration={handleAchievement}
                />
              </GridCol>
            ))}
          </GridRow>
        </GridContainer>

        {/* Streak Tracking Section */}
        <GridContainer>
          <GridRow>
            <GridCol span={12}>
              <div className="bg-white rounded-lg shadow-subtle p-6">
                <h3 className="text-xl font-semibold mb-4">Activity Streaks</h3>
                <StreakTracker
                  userStreaks={mockStreaks}
                  achievements={achievements}
                  onStreakUpdate={handleStreakUpdate}
                />
              </div>
            </GridCol>
          </GridRow>
        </GridContainer>

        {/* Interactive Buttons Demo */}
        <GridContainer>
          <GridRow gap="md">
            <GridCol span={12}>
              <h3 className="text-xl font-semibold mb-4">Interactive Healthcare Actions</h3>
            </GridCol>
            <GridCol span={{ mobile: 4, tablet: 2, desktop: 3 }}>
              <InteractiveButton
                state="idle"
                variant="primary"
                size="lg"
                onClick={() => handleAchievement(achievements[0])}
                className="w-full"
              >
                💊 Log Medication
              </InteractiveButton>
            </GridCol>
            <GridCol span={{ mobile: 4, tablet: 2, desktop: 3 }}>
              <InteractiveButton
                state="idle"
                variant="secondary"
                size="lg"
                onClick={() => handleGoalUpdate('exercise', 140)}
                className="w-full"
              >
                🏃‍♂️ Record Exercise
              </InteractiveButton>
            </GridCol>
            <GridCol span={{ mobile: 4, tablet: 2, desktop: 3 }}>
              <InteractiveButton
                state="idle"
                variant="accent"
                size="lg"
                onClick={() => console.log('View health data')}
                className="w-full"
              >
                📊 View Data
              </InteractiveButton>
            </GridCol>
            <GridCol span={{ mobile: 4, tablet: 2, desktop: 3 }}>
              <InteractiveButton
                state="idle"
                variant="tier"
                size="lg"
                onClick={() => console.log('Emergency action')}
                className="w-full"
              >
                🚨 Emergency
              </InteractiveButton>
            </GridCol>
          </GridRow>
        </GridContainer>

        {/* Layout Patterns Demo */}
        <GridContainer>
          <GridRow>
            <GridCol span={12}>
              <h3 className="text-xl font-semibold mb-4">Responsive Layout Patterns</h3>
            </GridCol>
          </GridRow>
        </GridContainer>

        {/* Three Column Layout Demo */}
        <HealthcareGridPatterns.ThreeColumnDashboard
          left={
            <div className="bg-neutral-50 rounded-lg p-4 h-40">
              <h4 className="font-medium mb-2">Family Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Mom - All good</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Dad - Medication due</span>
                </div>
              </div>
            </div>
          }
          center={
            <div className="bg-white rounded-lg shadow-subtle p-4 h-40">
              <h4 className="font-medium mb-2">Today's Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">3/3</div>
                  <div className="text-xs text-neutral-600">Medications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">45m</div>
                  <div className="text-xs text-neutral-600">Exercise</div>
                </div>
              </div>
            </div>
          }
          right={
            <div className="bg-primary-50 rounded-lg p-4 h-40">
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full text-left text-sm p-2 hover:bg-white rounded">
                  📅 View Appointments
                </button>
                <button className="w-full text-left text-sm p-2 hover:bg-white rounded">
                  📊 Health Reports
                </button>
              </div>
            </div>
          }
        />

        {/* PWA Features Demo */}
        <GridContainer>
          <GridRow>
            <GridCol span={12}>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">PWA Features Active</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <div className="text-lg mb-1">📱</div>
                    <div className="font-medium">Mobile Optimized</div>
                    <div className="text-sm opacity-90">Bottom navigation & safe areas</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <div className="text-lg mb-1">⚡</div>
                    <div className="font-medium">Fast Loading</div>
                    <div className="text-sm opacity-90">Service worker caching</div>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-3">
                    <div className="text-lg mb-1">🔄</div>
                    <div className="font-medium">Offline Ready</div>
                    <div className="text-sm opacity-90">Background sync enabled</div>
                  </div>
                </div>
              </div>
            </GridCol>
          </GridRow>
        </GridContainer>

        {/* Floating Action Button Demo */}
        {isMobile && (
          <motion.div
            className="fixed bottom-20 right-4 z-40"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
          >
            <InteractiveButton
              state="idle"
              variant="primary"
              size="lg"
              onClick={() => console.log('Quick action')}
              className="rounded-full w-14 h-14 shadow-lg"
            >
              +
            </InteractiveButton>
          </motion.div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <NotificationToast
            id="demo-toast"
            type="achievement"
            title="Achievement Unlocked! 🎉"
            message="You've successfully tested PWA interactions"
            tier="premium"
            onDismiss={() => setShowToast(false)}
            duration={3000}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default function PWADemoPage() {
  return (
    <HealthcareThemeProvider userId="demo-user" subscriptionTier="premium">
      <LayoutProvider>
        <PWADemoContent />
      </LayoutProvider>
    </HealthcareThemeProvider>
  );
}
