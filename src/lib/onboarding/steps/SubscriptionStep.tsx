'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';

interface SubscriptionTier {
  id: 'basic' | 'enhanced' | 'premium';
  name: string;
  price: { monthly: number; annual: number };
  description: string;
  features: string[];
  recommended?: boolean;
  savings?: number;
  familyMembers: number;
  tag?: string;
}

export function SubscriptionStep() {
  const { formData, updateFormData, unlockAchievement } = useOnboarding();
  
  const [selectedTier, setSelectedTier] = useState<'basic' | 'enhanced' | 'premium'>(
    formData.subscription?.selectedTier || 'basic'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    formData.subscription?.billingCycle || 'monthly'
  );
  const [showComparison, setShowComparison] = useState(false);
  const [personalizedRecommendation, setPersonalizedRecommendation] = useState<string>('basic');

  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started with your health journey',
      features: [
        'Personal health dashboard',
        'Basic medication tracking',
        'Simple goal setting',
        'Health score tracking',
        'Basic family member (1)',
        'Email support'
      ],
      familyMembers: 1,
      tag: 'Free Forever'
    },
    {
      id: 'enhanced',
      name: 'Enhanced',
      price: { monthly: 9.99, annual: 99.99 },
      description: 'Comprehensive health management for individuals and families',
      features: [
        'Everything in Basic',
        'Advanced analytics & trends',
        'Family health coordination (up to 5)',
        'Medication interaction alerts',
        'Custom health goals',
        'Emergency access features',
        'Priority support',
        'Health report generation'
      ],
      familyMembers: 5,
      recommended: true,
      savings: 20,
      tag: 'Most Popular'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 19.99, annual: 199.99 },
      description: 'Complete healthcare ecosystem for comprehensive family wellness',
      features: [
        'Everything in Enhanced',
        'Unlimited family members',
        'AI health insights & predictions',
        'Advanced clinical integrations',
        'Telehealth coordination',
        'Health coaching access',
        'Priority emergency features',
        'Concierge support',
        'Data export & portability'
      ],
      familyMembers: 999,
      savings: 17,
      tag: 'Complete Care'
    }
  ];

  // Calculate personalized recommendation based on form data
  useEffect(() => {
    const hasFamily = formData.familySetup?.familyMembers && formData.familySetup.familyMembers.length > 1;
    const hasMultipleConditions = formData.healthProfile?.conditions && formData.healthProfile.conditions.length > 2;
    const hasMultipleMedications = formData.healthProfile?.medications && formData.healthProfile.medications.length > 3;

    if (hasFamily && (hasMultipleConditions || hasMultipleMedications)) {
      setPersonalizedRecommendation('premium');
    } else if (hasFamily || hasMultipleConditions || hasMultipleMedications) {
      setPersonalizedRecommendation('enhanced');
    } else {
      setPersonalizedRecommendation('basic');
    }
  }, [formData]);

  // Save selection to context
  useEffect(() => {
    updateFormData('subscription', {
      selectedTier,
      billingCycle,
      trialActivated: selectedTier !== 'basic'
    });
  }, [selectedTier, billingCycle, updateFormData]);

  const calculateSavings = (tier: SubscriptionTier) => {
    if (billingCycle === 'annual' && tier.price.monthly > 0) {
      const monthlyCost = tier.price.monthly * 12;
      const annualCost = tier.price.annual;
      return monthlyCost - annualCost;
    }
    return 0;
  };

  const getDisplayPrice = (tier: SubscriptionTier) => {
    const price = tier.price[billingCycle];
    if (price === 0) return 'Free';
    
    if (billingCycle === 'monthly') {
      return `$${price}/month`;
    } else {
      const monthlyEquivalent = (price / 12).toFixed(2);
      return `$${monthlyEquivalent}/month`;
    }
  };

  const handleTierSelect = (tier: 'basic' | 'enhanced' | 'premium') => {
    setSelectedTier(tier);
    
    // Trigger achievements
    if (tier === 'enhanced') {
      unlockAchievement('subscription_enhanced');
    } else if (tier === 'premium') {
      unlockAchievement('subscription_premium');
    }
  };

  const renderPersonalizedRecommendation = () => {
    const recommendedTier = subscriptionTiers.find(t => t.id === personalizedRecommendation);
    if (!recommendedTier || personalizedRecommendation === 'basic') return null;

    return (
      <motion.div
        className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🎯</span>
          </div>
          <h3 className="text-lg font-semibold text-primary-800">
            Recommended for You
          </h3>
        </div>
        <p className="text-primary-700 mb-4">
          Based on your health profile and family setup, we recommend the{' '}
          <span className="font-semibold">{recommendedTier.name}</span> plan for the best experience.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-white text-primary-700 px-3 py-1 rounded-full text-sm">
            Family coordination
          </span>
          <span className="bg-white text-primary-700 px-3 py-1 rounded-full text-sm">
            Advanced tracking
          </span>
          <span className="bg-white text-primary-700 px-3 py-1 rounded-full text-sm">
            Safety features
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <span className="text-2xl">💎</span>
        </motion.div>
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">
          Choose Your Health Plan
        </h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Select the plan that best fits your health management needs. You can upgrade or downgrade anytime.
        </p>
      </div>

      {/* Personalized Recommendation */}
      {renderPersonalizedRecommendation()}

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-neutral-100 rounded-lg p-1 flex">
          <motion.button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              billingCycle === 'monthly'
                ? 'bg-white text-neutral-800 shadow-sm'
                : 'text-neutral-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Monthly
          </motion.button>
          <motion.button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 relative ${
              billingCycle === 'annual'
                ? 'bg-white text-neutral-800 shadow-sm'
                : 'text-neutral-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Annual
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              Save 17%
            </span>
          </motion.button>
        </div>
      </div>

      {/* Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {subscriptionTiers.map((tier, index) => {
          const isSelected = selectedTier === tier.id;
          const isRecommended = tier.id === personalizedRecommendation;
          const savings = calculateSavings(tier);

          return (
            <motion.div
              key={tier.id}
              className={`
                relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300
                ${isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                  : isRecommended
                  ? 'border-secondary-300 bg-secondary-50 hover:border-secondary-400'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md'
                }
              `}
              onClick={() => handleTierSelect(tier.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Tag */}
              {tier.tag && (
                <div className={`
                  absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium
                  ${tier.recommended
                    ? 'bg-primary-500 text-white'
                    : tier.id === 'basic'
                    ? 'bg-green-500 text-white'
                    : 'bg-purple-500 text-white'
                  }
                `}>
                  {tier.tag}
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-2">
                  {tier.name}
                </h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-neutral-800">
                    {getDisplayPrice(tier)}
                  </span>
                  {tier.price[billingCycle] > 0 && billingCycle === 'annual' && (
                    <div className="text-sm text-neutral-500">
                      ${tier.price.annual} billed annually
                    </div>
                  )}
                </div>
                {savings > 0 && (
                  <div className="text-sm text-green-600 font-medium">
                    Save ${savings.toFixed(0)} per year
                  </div>
                )}
                <p className="text-sm text-neutral-600 mt-2">
                  {tier.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {tier.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                  >
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <span className="text-sm text-neutral-700">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Family members indicator */}
              <div className="flex items-center justify-center gap-2 mb-4 text-sm text-neutral-600">
                <span>👨‍👩‍👧‍👦</span>
                <span>
                  {tier.familyMembers === 999 
                    ? 'Unlimited family members' 
                    : `Up to ${tier.familyMembers} family ${tier.familyMembers === 1 ? 'member' : 'members'}`
                  }
                </span>
              </div>

              {/* Select button */}
              <motion.button
                className={`
                  w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                  ${isSelected
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSelected ? 'Selected' : 'Select Plan'}
              </motion.button>

              {/* Trial badge for paid plans */}
              {tier.price[billingCycle] > 0 && (
                <div className="text-center mt-3">
                  <span className="text-xs text-neutral-500">
                    🎁 14-day free trial included
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Feature Comparison Toggle */}
      <div className="text-center mb-8">
        <motion.button
          onClick={() => setShowComparison(!showComparison)}
          className="text-primary-600 hover:text-primary-700 font-medium underline"
          whileHover={{ scale: 1.05 }}
        >
          {showComparison ? 'Hide' : 'Show'} detailed feature comparison
        </motion.button>
      </div>

      {/* Detailed Comparison Table */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            className="bg-neutral-50 rounded-lg p-6 mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Feature Comparison
            </h3>
            {/* Add detailed comparison table here */}
            <div className="text-sm text-neutral-600">
              Detailed feature comparison table would go here...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Money Back Guarantee */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-green-600 text-xl">🛡️</span>
          <span className="font-semibold text-green-800">30-Day Money Back Guarantee</span>
        </div>
        <p className="text-sm text-green-700">
          Not satisfied? Get a full refund within 30 days, no questions asked.
        </p>
      </div>
    </div>
  );
} 