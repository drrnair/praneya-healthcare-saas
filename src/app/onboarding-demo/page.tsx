'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HealthcareThemeProvider } from '@/lib/design-system/theme-provider';

// Simplified onboarding components for demo
function OnboardingDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    healthGoals: [] as string[],
    subscription: 'basic'
  });
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState<string | null>(null);

  const steps = [
    { id: 'welcome', title: 'Welcome', description: 'Trust building & introduction' },
    { id: 'profile', title: 'Profile', description: 'Personal information' },
    { id: 'health', title: 'Health Assessment', description: 'Health goals & conditions' },
    { id: 'subscription', title: 'Choose Plan', description: 'Select your plan' },
    { id: 'consent', title: 'Privacy & Consent', description: 'HIPAA compliance' }
  ];

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  // Celebration trigger
  const triggerCelebration = (achievement: string) => {
    if (!achievements.includes(achievement)) {
      setAchievements(prev => [...prev, achievement]);
      setShowCelebration(achievement);
      setTimeout(() => setShowCelebration(null), 2000);
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  };

  // Step components
  const WelcomeStep = () => (
    <motion.div
      className="text-center space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
      >
        <motion.span 
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          P
        </motion.span>
      </motion.div>

      <div>
        <motion.h1
          className="text-4xl font-bold text-neutral-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Welcome to Praneya Healthcare
        </motion.h1>
        <motion.p
          className="text-xl text-neutral-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Your comprehensive healthcare companion for family wellness
        </motion.p>
      </div>

      {/* Trust indicators */}
      <motion.div
        className="grid grid-cols-2 gap-4 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[
          { icon: '🔒', label: 'HIPAA Compliant' },
          { icon: '🏥', label: 'Medical Grade' },
          { icon: '🛡️', label: 'Bank-Level Security' },
          { icon: '👨‍⚕️', label: 'Doctor Approved' }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            className="flex items-center gap-2 p-3 bg-neutral-50 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + (index * 0.1) }}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        onClick={() => {
          triggerCelebration('welcome_complete');
          setCurrentStep(1);
        }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Your Health Journey ✨
      </motion.button>
    </motion.div>
  );

  const ProfileStep = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Personal Information</h2>
        <p className="text-neutral-600">Let's get to know you better</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            First Name ⭐
          </label>
          <motion.input
            type="text"
            value={formData.firstName}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, firstName: e.target.value }));
              if (e.target.value.length >= 2) {
                triggerCelebration('first_name_complete');
              }
            }}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            placeholder="Enter your first name"
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Last Name ⭐
          </label>
          <motion.input
            type="text"
            value={formData.lastName}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, lastName: e.target.value }));
              if (e.target.value.length >= 2) {
                triggerCelebration('last_name_complete');
              }
            }}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            placeholder="Enter your last name"
            whileFocus={{ scale: 1.02 }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Email Address ⭐
        </label>
        <motion.input
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, email: e.target.value }));
            if (e.target.value.includes('@')) {
              triggerCelebration('email_complete');
            }
          }}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
          placeholder="your.email@example.com"
          whileFocus={{ scale: 1.02 }}
        />
      </div>

      {/* Progress indicator */}
      <div className="bg-neutral-100 rounded-lg p-4">
        <div className="flex justify-between text-sm text-neutral-600 mb-2">
          <span>Profile completion</span>
          <span>{Math.round((achievements.filter(a => a.includes('complete')).length / 3) * 100)}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
            animate={{ width: `${(achievements.filter(a => a.includes('complete')).length / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );

  const HealthStep = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🎯</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Health Goals</h2>
        <p className="text-neutral-600">What would you like to focus on?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { id: 'fitness', label: 'Fitness', icon: '🏃‍♂️' },
          { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
          { id: 'sleep', label: 'Sleep', icon: '😴' },
          { id: 'medication', label: 'Medication', icon: '💊' },
          { id: 'mental_health', label: 'Mental Health', icon: '🧠' },
          { id: 'family', label: 'Family Care', icon: '👨‍👩‍👧‍👦' }
        ].map((goal) => (
          <motion.button
            key={goal.id}
            onClick={() => {
              const isSelected = formData.healthGoals.includes(goal.id);
              setFormData(prev => ({
                ...prev,
                healthGoals: isSelected 
                  ? prev.healthGoals.filter(g => g !== goal.id)
                  : [...prev.healthGoals, goal.id]
              }));
              if (!isSelected) {
                triggerCelebration(`goal_${goal.id}`);
              }
            }}
            className={`
              p-4 rounded-xl border-2 transition-all duration-200 text-center
              ${formData.healthGoals.includes(goal.id)
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:shadow-sm'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-3xl mb-2">{goal.icon}</div>
            <div className="font-medium">{goal.label}</div>
            {formData.healthGoals.includes(goal.id) && (
              <motion.div
                className="mt-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                ✅
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {formData.healthGoals.length > 0 && (
        <motion.div
          className="bg-green-50 border border-green-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">🎉</span>
            <span className="font-medium text-green-800">Great choices!</span>
          </div>
          <p className="text-sm text-green-700">
            You've selected {formData.healthGoals.length} health goal{formData.healthGoals.length !== 1 ? 's' : ''}. 
            We'll help you track and achieve them.
          </p>
        </motion.div>
      )}
    </motion.div>
  );

  const SubscriptionStep = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💎</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Choose Your Plan</h2>
        <p className="text-neutral-600">Select the plan that fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            id: 'basic',
            name: 'Basic',
            price: 'Free',
            description: 'Perfect for getting started',
            features: ['Personal dashboard', 'Basic tracking', '1 family member'],
            tag: 'Free Forever'
          },
          {
            id: 'enhanced',
            name: 'Enhanced',
            price: '$9.99/month',
            description: 'Comprehensive health management',
            features: ['Everything in Basic', 'Advanced analytics', '5 family members', 'Priority support'],
            tag: 'Most Popular',
            recommended: true
          },
          {
            id: 'premium',
            name: 'Premium',
            price: '$19.99/month',
            description: 'Complete healthcare ecosystem',
            features: ['Everything in Enhanced', 'AI insights', 'Unlimited family', 'Concierge support'],
            tag: 'Complete Care'
          }
        ].map((plan) => (
          <motion.button
            key={plan.id}
            onClick={() => {
              setFormData(prev => ({ ...prev, subscription: plan.id }));
              triggerCelebration(`subscription_${plan.id}`);
            }}
            className={`
              relative p-6 rounded-2xl border-2 text-left transition-all duration-300
              ${formData.subscription === plan.id
                ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                : plan.recommended
                ? 'border-secondary-300 bg-secondary-50 hover:shadow-md'
                : 'border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
              }
            `}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            {plan.tag && (
              <div className={`
                absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium
                ${plan.recommended ? 'bg-primary-500 text-white' : 'bg-green-500 text-white'}
              `}>
                {plan.tag}
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-xl font-bold text-neutral-800">{plan.name}</h3>
              <div className="text-2xl font-bold text-primary-600 my-2">{plan.price}</div>
              <p className="text-sm text-neutral-600">{plan.description}</p>
            </div>

            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {formData.subscription === plan.id && (
              <motion.div
                className="absolute top-4 right-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const ConsentStep = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🛡️</span>
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Privacy & Consent</h2>
        <p className="text-neutral-600">Your privacy and data security are our top priorities</p>
      </div>

      {/* HIPAA Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-blue-600 text-xl">🏥</span>
          <h3 className="font-semibold text-blue-800">HIPAA Compliance Notice</h3>
        </div>
        <p className="text-sm text-blue-700">
          Praneya Healthcare is fully HIPAA compliant. Your health information is encrypted, secured, and never shared without your explicit consent.
        </p>
      </div>

      {/* Consent items */}
      <div className="space-y-4">
        {[
          { id: 'terms', title: 'Terms of Service', required: true },
          { id: 'privacy', title: 'Privacy Policy', required: true },
          { id: 'hipaa', title: 'HIPAA Authorization', required: true },
          { id: 'marketing', title: 'Marketing Communications', required: false }
        ].map((item) => (
          <motion.div
            key={item.id}
            className="border-2 border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      triggerCelebration(`consent_${item.id}`);
                    }
                  }}
                />
                <div>
                  <span className="font-medium text-neutral-800">{item.title}</span>
                  {item.required && <span className="text-error-600 ml-1">*</span>}
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-700 text-sm underline">
                Review
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        onClick={() => {
          triggerCelebration('onboarding_complete');
          // Complete onboarding
        }}
        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Complete Setup & Enter Praneya 🎉
      </motion.button>
    </motion.div>
  );

  const getCurrentStepComponent = () => {
    switch (currentStep) {
      case 0: return <WelcomeStep />;
      case 1: return <ProfileStep />;
      case 2: return <HealthStep />;
      case 3: return <SubscriptionStep />;
      case 4: return <ConsentStep />;
      default: return <WelcomeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header with Progress */}
      <motion.header
        className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-neutral-900">Praneya Healthcare</h1>
                <p className="text-xs text-neutral-500">Revolutionary Onboarding Experience</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-neutral-700">
                Step {currentStep + 1} of {steps.length}
              </div>
              <div className="text-xs text-neutral-500">
                {achievements.length} achievements unlocked
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full relative overflow-hidden"
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
                />
              </motion.div>
            </div>

            {/* Step indicators */}
            <div className="flex justify-between mt-3">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`flex flex-col items-center transition-all duration-200 ${
                    index <= currentStep ? 'text-primary-600' : 'text-neutral-400'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium mb-1
                    ${index < currentStep 
                      ? 'bg-primary-500 border-primary-500 text-white' 
                      : index === currentStep
                      ? 'bg-white border-primary-500 text-primary-600'
                      : 'bg-neutral-100 border-neutral-300 text-neutral-400'
                    }
                  `}>
                    {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-4xl">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8"
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {getCurrentStepComponent()}
          </motion.div>
        </div>
      </main>

      {/* Navigation Footer */}
      <motion.footer
        className="bg-white border-t border-neutral-200 p-4 sticky bottom-0"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 0
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-neutral-700 hover:bg-neutral-100'
            }`}
            whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
            whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
          >
            ← Back
          </motion.button>

          {currentStep < steps.length - 1 && (
            <motion.button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue →
            </motion.button>
          )}
        </div>
      </motion.footer>

      {/* Achievement Celebrations */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <div className="bg-white rounded-full p-8 shadow-2xl">
              <motion.div
                className="text-6xl text-center"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.8, repeat: 2 }}
              >
                🎉
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Counter */}
      <motion.div
        className="fixed bottom-20 right-4 bg-white rounded-full shadow-lg p-3 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">🏆</span>
          <span className="font-semibold text-neutral-800">{achievements.length}</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function OnboardingDemoPage() {
  return (
    <HealthcareThemeProvider userId="demo-onboarding-user" subscriptionTier="basic">
      <OnboardingDemo />
    </HealthcareThemeProvider>
  );
} 