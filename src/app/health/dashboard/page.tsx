'use client';

import React from 'react';
import { useHealthcareTheme, useTierFeatures } from '@/lib/design-system/theme-provider';
import { 
  HealthStatus, 
  FeatureCard, 
  HealthcareAlert, 
  FamilyRoleBadge, 
  HealthMetric, 
  TierUpgradePrompt,
  EmergencyAccess 
} from '@/lib/design-system/healthcare-components';

// Mock data that would come from Prisma queries
const mockHealthData = {
  user: {
    id: 'user-123',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
  },
  familyAccount: {
    id: 'family-456', 
    name: 'Johnson Family',
    subscriptionTier: 'enhanced',
  },
  familyMember: {
    role: 'PARENT' as const,
  },
  healthProfile: {
    age: 34,
    weight: 145,
    allergies: ['Peanuts', 'Shellfish'],
    medications: ['Lisinopril', 'Metformin'],
    conditions: ['Type 2 Diabetes', 'Hypertension'],
  },
  healthMetrics: [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'good' as const, trend: 'stable' as const, icon: '🩺' },
    { label: 'Blood Sugar', value: '110', unit: 'mg/dL', status: 'excellent' as const, trend: 'down' as const, icon: '🩸' },
    { label: 'Weight', value: '145', unit: 'lbs', status: 'good' as const, trend: 'down' as const, icon: '⚖️' },
    { label: 'Steps Today', value: '8,247', status: 'good' as const, trend: 'up' as const, icon: '👟' },
  ],
  familyMembers: [
    { name: 'Sarah Johnson', role: 'PARENT' as const },
    { name: 'Mike Johnson', role: 'PARENT' as const },
    { name: 'Emma Johnson', role: 'CHILD' as const },
    { name: 'Alex Johnson', role: 'CHILD' as const },
  ],
  recentAlerts: [
    {
      type: 'clinical' as const,
      urgency: 'medium' as const,
      title: 'Medication Reminder',
      message: 'Time to take your evening Lisinopril (5mg)',
    },
    {
      type: 'warning' as const,
      urgency: 'low' as const,
      title: 'Exercise Goal',
      message: 'You\'re 2,000 steps away from your daily goal of 10,000 steps',
    },
  ],
};

export default function HealthDashboard() {
  const { theme } = useHealthcareTheme();
  const tierFeatures = useTierFeatures();

  return (
    <div className="min-h-screen bg-tier-background">
      {/* Import design tokens CSS */}
      <style jsx global>{`
        @import url('/src/styles/design-tokens.css');
      `}</style>

      {/* Header with tier-aware styling */}
      <header className="bg-tier-surface border-b border-tier-border shadow-tier">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-tier">
                Health Dashboard
              </h1>
              <p className="text-accessible mt-1">
                Welcome back, {mockHealthData.user.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Family role indicator */}
              <FamilyRoleBadge 
                role={mockHealthData.familyMember.role}
                userName={mockHealthData.user.name}
              />
              
              {/* Subscription tier indicator */}
              <div className={`
                px-4 py-2 rounded-lg border font-medium text-sm
                ${theme.tier === 'basic' && 'bg-neutral-100 border-neutral-300 text-neutral-700'}
                ${theme.tier === 'enhanced' && 'bg-primary-100 border-primary-300 text-primary-700'}
                ${theme.tier === 'premium' && 'bg-tier-gradient border-accent-300 text-accent-700'}
              `}>
                {theme.tier.charAt(0).toUpperCase() + theme.tier.slice(1)} Plan
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Emergency Access Component */}
        <div className="mb-6">
          <EmergencyAccess 
            familyRole={mockHealthData.familyMember.role}
            onEmergencyAccess={() => console.log('Emergency access activated')}
          />
        </div>

        {/* Health Alerts */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            Health Alerts
          </h2>
          <div className="space-y-4">
            {mockHealthData.recentAlerts.map((alert, index) => (
              <HealthcareAlert
                key={index}
                type={alert.type}
                urgency={alert.urgency}
                title={alert.title}
                message={alert.message}
                action={{
                  label: alert.type === 'clinical' ? 'Mark as Taken' : 'View Details',
                  onClick: () => console.log('Alert action clicked')
                }}
                dismissible
                onDismiss={() => console.log('Alert dismissed')}
              />
            ))}
          </div>
        </section>

        {/* Health Metrics Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            Health Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockHealthData.healthMetrics.map((metric, index) => (
              <HealthMetric
                key={index}
                label={metric.label}
                value={metric.value}
                unit={metric.unit}
                status={metric.status}
                trend={metric.trend}
                trendValue={metric.trend === 'up' ? '+5%' : '-3%'}
                icon={metric.icon}
              />
            ))}
          </div>
        </section>

        {/* Feature Cards with Tier Gating */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            Healthcare Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Basic Feature - Always Available */}
            <FeatureCard
              title="Meal Planning"
              description="Plan healthy meals for your family"
              featureKey="meal-planning"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                <div>
                  <p className="text-sm font-medium text-tier">
                    7 meals planned this week
                  </p>
                  <button className="btn-tier mt-2 text-sm">
                    View Meal Plans
                  </button>
                </div>
              </div>
            </FeatureCard>

            {/* Enhanced Feature */}
            <FeatureCard
              title="Family Health Tracking"
              description="Monitor health metrics for all family members"
              featureKey="family-sharing"
            >
              <div className="space-y-2">
                {mockHealthData.familyMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{member.name}</span>
                    <HealthStatus status="good" size="sm" />
                  </div>
                ))}
              </div>
            </FeatureCard>

            {/* Premium Feature */}
            <FeatureCard
              title="AI Health Recommendations"
              description="Personalized health insights powered by AI"
              featureKey="ai-recommendations"
            >
              <div className="bg-tier-gradient p-3 rounded-md">
                <p className="text-sm text-neutral-700">
                  "Based on your recent metrics, consider increasing your daily water intake."
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  AI Recommendation • Updated 2 hours ago
                </p>
              </div>
            </FeatureCard>

          </div>
        </section>

        {/* Tier Upgrade Prompt for Missing Features */}
        {theme.tier === 'basic' && (
          <section className="mb-8">
            <TierUpgradePrompt
              currentTier="basic"
              targetTier="enhanced"
              featureName="Family Health Tracking"
              onUpgrade={() => console.log('Upgrade to Enhanced')}
              onDismiss={() => console.log('Upgrade dismissed')}
            />
          </section>
        )}

        {theme.tier !== 'premium' && (
          <section className="mb-8">
            <TierUpgradePrompt
              currentTier={theme.tier}
              targetTier="premium"
              featureName="AI Health Recommendations"
              onUpgrade={() => console.log('Upgrade to Premium')}
              onDismiss={() => console.log('Upgrade dismissed')}
            />
          </section>
        )}

        {/* Family Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            Family Overview
          </h2>
          <div className="card-tier">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-tier mb-3">Family Members</h3>
                <div className="space-y-2">
                  {mockHealthData.familyMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-tier-surface">
                      <FamilyRoleBadge role={member.role} userName={member.name} />
                      <HealthStatus status="good" size="sm" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-tier mb-3">Account Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Plan:</span>
                    <span className="font-medium text-tier">
                      {theme.tier.charAt(0).toUpperCase() + theme.tier.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Members:</span>
                    <span className="font-medium">
                      {mockHealthData.familyMembers.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Features:</span>
                    <span className="font-medium">
                      {tierFeatures.features.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn-healthcare-primary">
              📊 View Reports
            </button>
            <button className="btn-healthcare-secondary">
              💊 Log Medication
            </button>
            <button className="btn-tier">
              🍽️ Plan Meals
            </button>
            <button className="btn-healthcare-primary">
              👨‍👩‍👧‍👦 Family Settings
            </button>
          </div>
        </section>
      </main>
    </div>
  );
} 