'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMicroInteractions } from './MicroInteractionManager';

// Pill Logging Feedback
interface PillFeedbackProps {
  medicationName: string;
  dosage: string;
  onComplete: () => void;
  isVisible: boolean;
}

export function PillLoggedFeedback({ medicationName, dosage, onComplete, isVisible }: PillFeedbackProps) {
  const { triggerHealthAction, isReducedMotion } = useMicroInteractions();
  
  useEffect(() => {
    if (isVisible) {
      triggerHealthAction({
        type: 'pill',
        success: true,
        message: `${medicationName} ${dosage} logged successfully`
      });
    }
  }, [isVisible, medicationName, dosage, triggerHealthAction]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-4 max-w-sm"
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          x: 0, 
          scale: [0.8, 1.05, 1],
          y: [0, -5, 0]
        }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ 
          duration: 0.6,
          times: [0, 0.6, 1],
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 2000);
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
            animate={isReducedMotion ? {} : { 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              className="text-white text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              💊
            </motion.span>
          </motion.div>
          <div>
            <motion.h3 
              className="font-semibold text-green-800"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Medication Logged
            </motion.h3>
            <motion.p 
              className="text-sm text-green-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {medicationName} - {dosage}
            </motion.p>
            <motion.p 
              className="text-xs text-neutral-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Next dose reminder set
            </motion.p>
          </div>
        </div>
        
        {/* Progress indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-green-400 rounded-b-lg"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 2, ease: "linear" }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

// Meal Tracking Feedback
interface MealFeedbackProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories?: number;
  nutritionScore?: number;
  onComplete: () => void;
  isVisible: boolean;
}

export function MealTrackedFeedback({ mealType, calories, nutritionScore, onComplete, isVisible }: MealFeedbackProps) {
  const { triggerHealthAction, isReducedMotion } = useMicroInteractions();
  
  const mealEmojis = {
    breakfast: '🍳',
    lunch: '🥗',
    dinner: '🍽️',
    snack: '🍎'
  };

  useEffect(() => {
    if (isVisible) {
      triggerHealthAction({
        type: 'meal',
        success: true,
        value: calories,
        message: `${mealType} logged with ${calories} calories`
      });
    }
  }, [isVisible, mealType, calories, triggerHealthAction]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border-l-4 border-blue-500 p-4 max-w-sm"
        initial={{ opacity: 0, y: -50, rotateX: -90 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          rotateX: 0,
          scale: [0.9, 1.02, 1]
        }}
        exit={{ opacity: 0, y: -50, rotateX: 90 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 200,
          damping: 25
        }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 3000);
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
            animate={isReducedMotion ? {} : {
              scale: [1, 1.1, 1],
              backgroundColor: ['#DBEAFE', '#BFDBFE', '#DBEAFE']
            }}
            transition={{ duration: 1.5, repeat: 1 }}
          >
            <span className="text-xl">{mealEmojis[mealType]}</span>
          </motion.div>
          <div className="flex-1">
            <motion.h3 
              className="font-semibold text-blue-800 capitalize"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {mealType} Logged
            </motion.h3>
            {calories && (
              <motion.div 
                className="flex items-center gap-2 text-sm text-blue-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span>⚡ {calories} calories</span>
                {nutritionScore && (
                  <motion.span 
                    className="text-green-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    🌟 {nutritionScore}% nutrition score
                  </motion.span>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Animated nutrition rings */}
        {nutritionScore && (
          <motion.div 
            className="mt-3 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {['Protein', 'Carbs', 'Fats'].map((nutrient, index) => (
              <div key={nutrient} className="text-center">
                <motion.div 
                  className="w-8 h-8 rounded-full border-2 border-neutral-200 relative"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-500"
                    initial={{ clipPath: 'inset(50% 0 50% 0)' }}
                    animate={{ clipPath: 'inset(0% 0 0% 0)' }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  />
                </motion.div>
                <span className="text-xs text-neutral-600">{nutrient}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// Exercise Recording Feedback
interface ExerciseFeedbackProps {
  exerciseType: string;
  duration?: number;
  caloriesBurned?: number;
  onComplete: () => void;
  isVisible: boolean;
}

export function ExerciseRecordedFeedback({ exerciseType, duration, caloriesBurned, onComplete, isVisible }: ExerciseFeedbackProps) {
  const { triggerHealthAction, isReducedMotion } = useMicroInteractions();
  
  useEffect(() => {
    if (isVisible) {
      triggerHealthAction({
        type: 'exercise',
        success: true,
        value: duration,
        message: `${exerciseType} exercise recorded for ${duration} minutes`
      });
    }
  }, [isVisible, exerciseType, duration, triggerHealthAction]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border-l-4 border-orange-500 p-4 max-w-sm"
        initial={{ opacity: 0, scale: 0, rotateY: -180 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          rotateY: 0,
          y: [0, -10, 0]
        }}
        exit={{ opacity: 0, scale: 0, rotateY: 180 }}
        transition={{ 
          duration: 1.0,
          type: "spring",
          stiffness: 150,
          damping: 20
        }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 3000);
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center relative overflow-hidden"
            animate={isReducedMotion ? {} : {
              background: [
                'linear-gradient(45deg, #FED7AA, #FDBA74)',
                'linear-gradient(45deg, #FDBA74, #FB923C)',
                'linear-gradient(45deg, #FB923C, #FED7AA)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.span 
              className="text-2xl"
              animate={isReducedMotion ? {} : {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            >
              🏃‍♂️
            </motion.span>
            
            {/* Progress ring */}
            <motion.div
              className="absolute inset-0 border-4 border-orange-400 rounded-full"
              initial={{ pathLength: 0, rotate: -90 }}
              animate={{ pathLength: 1, rotate: 270 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                background: 'conic-gradient(from -90deg, transparent 0deg, #FB923C 0deg, transparent 360deg)'
              }}
            />
          </motion.div>
          
          <div className="flex-1">
            <motion.h3 
              className="font-semibold text-orange-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Exercise Completed! 🎉
            </motion.h3>
            <motion.p 
              className="text-sm text-orange-600 capitalize"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {exerciseType}
            </motion.p>
            <motion.div 
              className="flex gap-4 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {duration && (
                <div className="text-xs text-neutral-600">
                  ⏱️ {duration} min
                </div>
              )}
              {caloriesBurned && (
                <motion.div 
                  className="text-xs text-red-600"
                  animate={isReducedMotion ? {} : {
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  🔥 {caloriesBurned} cal
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Achievement progress */}
        <motion.div 
          className="mt-3 bg-neutral-100 rounded-full h-2 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-orange-400 to-red-500"
            initial={{ width: "0%" }}
            animate={{ width: "75%" }}
            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>
        <motion.p 
          className="text-xs text-neutral-500 mt-1 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          75% towards weekly goal
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}

// Vitals Entry Feedback
interface VitalsFeedbackProps {
  vitalType: 'blood_pressure' | 'heart_rate' | 'weight' | 'temperature' | 'blood_sugar';
  value: string | number;
  unit: string;
  status: 'normal' | 'low' | 'high' | 'critical';
  onComplete: () => void;
  isVisible: boolean;
}

export function VitalsEnteredFeedback({ vitalType, value, unit, status, onComplete, isVisible }: VitalsFeedbackProps) {
  const { triggerHealthAction, isReducedMotion } = useMicroInteractions();
  
  const vitalIcons = {
    blood_pressure: '🩺',
    heart_rate: '❤️',
    weight: '⚖️',
    temperature: '🌡️',
    blood_sugar: '🩸'
  };

  const statusColors = {
    normal: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800' },
    low: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-800' },
    high: { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-800' },
    critical: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800' }
  };

  useEffect(() => {
    if (isVisible) {
      triggerHealthAction({
        type: 'vitals',
        success: status !== 'critical',
        value: value,
        severity: status === 'critical' ? 'critical' : status === 'high' ? 'high' : 'low',
        message: `${vitalType.replace('_', ' ')} recorded: ${value} ${unit} - ${status}`
      });
    }
  }, [isVisible, vitalType, value, unit, status, triggerHealthAction]);

  if (!isVisible) return null;

  const colors = statusColors[status];

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border-l-4 ${colors.border} p-4 max-w-sm`}
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          x: 0, 
          scale: 1,
          ...(status === 'critical' && !isReducedMotion ? {
            x: [0, -5, 5, -5, 5, 0],
          } : {})
        }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ 
          duration: status === 'critical' ? 0.5 : 0.7,
          type: "spring",
          stiffness: 250,
          damping: 22
        }}
        onAnimationComplete={() => {
          setTimeout(onComplete, status === 'critical' ? 5000 : 3000);
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center`}
            animate={isReducedMotion ? {} : {
              scale: status === 'critical' ? [1, 1.1, 1] : [1, 1.05, 1],
              ...(status === 'critical' ? {
                backgroundColor: ['#FEE2E2', '#FECACA', '#FEE2E2']
              } : {})
            }}
            transition={{ 
              duration: status === 'critical' ? 0.5 : 1,
              repeat: status === 'critical' ? Infinity : 1 
            }}
          >
            <span className="text-xl">{vitalIcons[vitalType]}</span>
          </motion.div>
          
          <div className="flex-1">
            <motion.h3 
              className={`font-semibold ${colors.text} capitalize`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {vitalType.replace('_', ' ')} Recorded
            </motion.h3>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className={`text-lg font-bold ${colors.text}`}>
                {value} {unit}
              </span>
              <motion.span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {status.toUpperCase()}
              </motion.span>
            </motion.div>
            
            {status === 'critical' && (
              <motion.p 
                className="text-xs text-red-600 mt-1 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1] }}
                transition={{ delay: 0.7, duration: 0.5, repeat: Infinity }}
              >
                ⚠️ Please consult your healthcare provider
              </motion.p>
            )}
          </div>
        </div>
        
        {/* Trend indicator */}
        <motion.div 
          className="mt-3 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-xs text-neutral-500">
            Compared to last reading
          </span>
          <motion.div
            className="flex items-center gap-1"
            animate={isReducedMotion ? {} : {
              y: [0, -2, 0]
            }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <span className="text-sm">📈</span>
            <span className="text-xs text-neutral-600">+2%</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 