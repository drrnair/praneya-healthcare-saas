'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';
import { useHealthcareTheme } from '@/lib/design-system/theme-provider';

interface OnboardingShellProps {
  children: React.ReactNode;
  showProgress?: boolean;
  showNavigation?: boolean;
}

export function OnboardingShell({ 
  children, 
  showProgress = true, 
  showNavigation = true 
}: OnboardingShellProps) {
  const { theme } = useHealthcareTheme();
  const {
    currentStep,
    steps,
    totalSteps,
    estimatedTimeRemaining,
    progress,
    nextStep,
    previousStep,
    skipStep,
    validateStep,
    isCompleting
  } = useOnboarding();

  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);

  const currentStepData = steps[currentStep];
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  const canGoNext = currentStepData ? validateStep(currentStepData.id) : false;
  const canSkip = currentStepData ? !currentStepData.required : false;

  const handleNext = () => {
    if (canGoNext) {
      nextStep();
    }
  };

  const handleSkip = () => {
    if (canSkip) {
      setShowSkipConfirmation(true);
    }
  };

  const confirmSkip = (reason?: string) => {
    skipStep(reason);
    setShowSkipConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col">
      {/* Header with Progress */}
      {showProgress && (
        <motion.header
          className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-40"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="max-w-4xl mx-auto px-4 py-4">
            {/* Logo and branding */}
            <div className="flex items-center justify-between mb-4">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-neutral-900">Praneya Healthcare</h1>
                  <p className="text-xs text-neutral-500">Setting up your health journey</p>
                </div>
              </motion.div>

              {/* Time estimate */}
              <motion.div
                className="text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-sm font-medium text-neutral-700">
                  {estimatedTimeRemaining} min remaining
                </div>
                <div className="text-xs text-neutral-500">
                  Step {currentStep + 1} of {totalSteps}
                </div>
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      repeatDelay: 3 
                    }}
                  />
                </motion.div>
              </div>

              {/* Step indicators */}
              <div className="flex justify-between mt-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`
                      flex flex-col items-center cursor-pointer transition-all duration-200
                      ${index <= currentStep ? 'text-primary-600' : 'text-neutral-400'}
                    `}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium
                      ${index < currentStep 
                        ? 'bg-primary-500 border-primary-500 text-white' 
                        : index === currentStep
                        ? 'bg-white border-primary-500 text-primary-600'
                        : 'bg-neutral-100 border-neutral-300 text-neutral-400'
                      }
                    `}>
                      {index < currentStep ? '✓' : index + 1}
                    </div>
                    <span className="text-xs mt-1 hidden sm:block">
                      {step.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Current step info */}
            {currentStepData && (
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-neutral-900 mb-1">
                  {currentStepData.title}
                </h2>
                <p className="text-neutral-600">
                  {currentStepData.description}
                </p>
              </motion.div>
            )}
          </div>
        </motion.header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-2xl"
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Navigation Footer */}
      {showNavigation && (
        <motion.footer
          className="bg-white border-t border-neutral-200 p-4 sticky bottom-0"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {/* Back button */}
            <motion.button
              onClick={previousStep}
              disabled={currentStep === 0}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${currentStep === 0
                  ? 'text-neutral-400 cursor-not-allowed'
                  : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                }
              `}
              whileHover={currentStep > 0 ? { scale: 1.02 } : {}}
              whileTap={currentStep > 0 ? { scale: 0.98 } : {}}
            >
              ← Back
            </motion.button>

            {/* Skip button */}
            {canSkip && (
              <motion.button
                onClick={handleSkip}
                className="text-neutral-500 hover:text-neutral-700 text-sm px-3 py-1 rounded transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Skip this step
              </motion.button>
            )}

            {/* Next/Complete button */}
            <motion.button
              onClick={handleNext}
              disabled={!canGoNext || isCompleting}
              className={`
                px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                ${canGoNext && !isCompleting
                  ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }
              `}
              whileHover={canGoNext && !isCompleting ? { scale: 1.02 } : {}}
              whileTap={canGoNext && !isCompleting ? { scale: 0.98 } : {}}
            >
              {isCompleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Completing...
                </>
              ) : currentStep === totalSteps - 1 ? (
                'Complete Setup'
              ) : (
                'Continue →'
              )}
            </motion.button>
          </div>
        </motion.footer>
      )}

      {/* Skip Confirmation Modal */}
      <AnimatePresence>
        {showSkipConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <h3 className="text-lg font-semibold mb-2">Skip this step?</h3>
              <p className="text-neutral-600 mb-4">
                You can always add this information later in your profile settings.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSkipConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => confirmSkip('User chose to skip')}
                  className="flex-1 px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
                >
                  Skip Step
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating help button */}
      <motion.button
        className="fixed bottom-20 right-4 w-12 h-12 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-colors flex items-center justify-center z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        ?
      </motion.button>
    </div>
  );
}

// Progress celebration component
export function ProgressCelebration({ milestone }: { milestone: string }) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl p-8 text-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 0.6,
            repeat: 2
          }}
        >
          🎉
        </motion.div>
        <h3 className="text-xl font-bold text-primary-600 mb-2">
          Great Progress!
        </h3>
        <p className="text-neutral-600">
          {milestone}
        </p>
      </motion.div>
    </motion.div>
  );
} 