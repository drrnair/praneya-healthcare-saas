'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMicroInteractions } from './MicroInteractionManager';

// AI Thinking Indicator
interface AIThinkingProps {
  message?: string;
  isVisible: boolean;
}

export function AIThinkingIndicator({ message = 'AI is thinking...', isVisible }: AIThinkingProps) {
  const { triggerAIFeedback, isReducedMotion } = useMicroInteractions();

  useEffect(() => {
    if (isVisible) {
      triggerAIFeedback('thinking');
    }
  }, [isVisible, triggerAIFeedback]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
          animate={isReducedMotion ? {} : {
            scale: [1, 1.1, 1],
            backgroundColor: ['#DBEAFE', '#BFDBFE', '#DBEAFE']
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-sm">🤖</span>
        </motion.div>
        <div className="flex-1">
          <p className="text-sm text-blue-800">{message}</p>
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-blue-500 rounded-full"
                animate={isReducedMotion ? {} : {
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Drug Interaction Warning
interface DrugWarningProps {
  medications: string[];
  severity: 'mild' | 'moderate' | 'severe';
  warningMessage: string;
  isVisible: boolean;
  onDismiss: () => void;
}

export function DrugInteractionWarning({ 
  medications, 
  severity, 
  warningMessage, 
  isVisible, 
  onDismiss 
}: DrugWarningProps) {
  const { triggerAIFeedback, isReducedMotion } = useMicroInteractions();

  const severityConfig = {
    mild: { color: 'yellow', emoji: '⚠️', urgency: 'low' },
    moderate: { color: 'orange', emoji: '🚨', urgency: 'medium' },
    severe: { color: 'red', emoji: '🚨', urgency: 'high' }
  };

  const config = severityConfig[severity];

  useEffect(() => {
    if (isVisible) {
      triggerAIFeedback('warning');
    }
  }, [isVisible, triggerAIFeedback]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border-l-4 border-${config.color}-500`}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
            ...(severity === 'severe' && !isReducedMotion ? {
              x: [0, -2, 2, -2, 2, 0]
            } : {})
          }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start gap-3">
            <motion.div
              className={`w-10 h-10 bg-${config.color}-100 rounded-full flex items-center justify-center`}
              animate={isReducedMotion ? {} : {
                scale: severity === 'severe' ? [1, 1.1, 1] : [1, 1.05, 1],
                rotate: severity === 'severe' ? [0, 5, -5, 0] : [0, 2, -2, 0]
              }}
              transition={{ 
                duration: severity === 'severe' ? 0.3 : 0.5,
                repeat: severity === 'severe' ? Infinity : 2
              }}
            >
              <span className="text-lg">{config.emoji}</span>
            </motion.div>
            
            <div className="flex-1">
              <motion.h3
                className={`font-bold text-${config.color}-800 mb-2`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Drug Interaction Detected
              </motion.h3>
              
              <motion.p
                className={`text-${config.color}-700 text-sm mb-3`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {warningMessage}
              </motion.p>
              
              <motion.div
                className="bg-gray-50 rounded-lg p-3 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs text-gray-600 mb-1">Medications involved:</p>
                <div className="flex flex-wrap gap-1">
                  {medications.map((med, index) => (
                    <motion.span
                      key={med}
                      className={`px-2 py-1 bg-${config.color}-100 text-${config.color}-800 text-xs rounded-full`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {med}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={onDismiss}
                  className={`px-4 py-2 bg-${config.color}-600 text-white rounded-lg text-sm font-medium hover:bg-${config.color}-700 transition-colors`}
                >
                  Understood
                </button>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Contact Doctor
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Recipe Generation Animation
interface RecipeGenerationProps {
  ingredients: string[];
  isVisible: boolean;
  onComplete: () => void;
}

export function RecipeGenerationAnimation({ ingredients, isVisible, onComplete }: RecipeGenerationProps) {
  const { triggerAIFeedback, isReducedMotion } = useMicroInteractions();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Analyzing ingredients...',
    'Checking nutritional compatibility...',
    'Generating recipe ideas...',
    'Finalizing recommendations...'
  ];

  useEffect(() => {
    if (isVisible) {
      triggerAIFeedback('generating');
      
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(onComplete, 1000);
            return prev;
          }
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isVisible, triggerAIFeedback, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={isReducedMotion ? {} : {
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl">🍳</span>
            </motion.div>
            
            <motion.h2
              className="text-xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Creating Your Recipe
            </motion.h2>
            
            <motion.p
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {steps[currentStep]}
            </motion.p>
            
            {/* Ingredient visualization */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-sm text-gray-500 mb-2">Using your ingredients:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {ingredients.map((ingredient, index) => (
                  <motion.span
                    key={ingredient}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {ingredient}
                  </motion.span>
                ))}
              </div>
            </motion.div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <motion.div
                className="bg-green-500 h-2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <motion.div
              className="text-sm text-gray-500"
              animate={isReducedMotion ? {} : {
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              Step {currentStep + 1} of {steps.length}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 