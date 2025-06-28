'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';

export function WelcomeStep() {
  const { nextStep, unlockAchievement } = useOnboarding();
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Auto-advance animation phases
    const timers = [
      setTimeout(() => setAnimationPhase(1), 1000),
      setTimeout(() => setAnimationPhase(2), 2500),
      setTimeout(() => setAnimationPhase(3), 4000)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const trustIndicators = [
    { icon: '🔒', label: 'HIPAA Compliant', description: 'Your health data is protected' },
    { icon: '🏥', label: 'Medical Grade', description: 'Used by healthcare professionals' },
    { icon: '🛡️', label: 'Bank-Level Security', description: '256-bit encryption for all data' },
    { icon: '👨‍⚕️', label: 'Doctor Approved', description: 'Designed with medical experts' }
  ];

  const benefits = [
    { title: 'Unified Health Management', description: 'All your health data in one secure place' },
    { title: 'Family Care Coordination', description: 'Manage your entire family\'s health together' },
    { title: 'Smart Health Insights', description: 'AI-powered recommendations for better health' },
    { title: 'Emergency Preparedness', description: 'Critical information available when you need it' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
      {/* Animated Logo Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-block"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.3 
          }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <motion.span 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              P
            </motion.span>
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-neutral-800 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Welcome to Praneya Healthcare
        </motion.h1>
        
        <motion.p
          className="text-lg text-neutral-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Your comprehensive healthcare companion for family wellness
        </motion.p>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        className="grid grid-cols-2 gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationPhase >= 1 ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {trustIndicators.map((indicator, index) => (
          <motion.div
            key={indicator.label}
            className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 + (index * 0.1) }}
          >
            <span className="text-2xl">{indicator.icon}</span>
            <div>
              <div className="font-medium text-sm text-neutral-800">{indicator.label}</div>
              <div className="text-xs text-neutral-600">{indicator.description}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Value Proposition */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationPhase >= 2 ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-neutral-800 mb-4 text-center">
          Why choose Praneya?
        </h2>
        
        <div className="space-y-3">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="flex items-start gap-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.8 + (index * 0.1) }}
            >
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-medium text-neutral-800">{benefit.title}</h3>
                <p className="text-sm text-neutral-600">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Get Started Button */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animationPhase >= 3 ? 1 : 0, y: animationPhase >= 3 ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={() => {
            unlockAchievement('welcome_complete');
            nextStep();
          }}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-8 rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Start Your Health Journey
        </motion.button>
        
        <p className="text-xs text-neutral-500 mt-3">
          Takes about 5 minutes • Your data is always secure
        </p>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
            <path d="M20 4l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
} 