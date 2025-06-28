'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Simple micro-interaction components
function PillLoggedDemo({ isVisible, onComplete }: { isVisible: boolean; onComplete: () => void }) {
  const prefersReducedMotion = useReducedMotion();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border-l-4 border-green-500 p-4 max-w-sm"
        initial={{ opacity: 0, x: 300, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          x: 0, 
          scale: prefersReducedMotion ? 1 : [0.8, 1.05, 1],
          y: prefersReducedMotion ? 0 : [0, -5, 0]
        }}
        exit={{ opacity: 0, x: 300, scale: 0.8 }}
        transition={{ 
          duration: prefersReducedMotion ? 0.2 : 0.6,
          ...(prefersReducedMotion ? {} : { times: [0, 0.6, 1] }),
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
            animate={prefersReducedMotion ? {} : { 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-white text-lg">💊</span>
          </motion.div>
          <div>
            <h3 className="font-semibold text-green-800">Medication Logged</h3>
            <p className="text-sm text-green-600">Aspirin 81mg - Morning dose</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function HealthScoreDemo({ isVisible, onComplete }: { isVisible: boolean; onComplete: () => void }) {
  const [animatedScore, setAnimatedScore] = useState(75);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (isVisible) {
      let start = 75;
      let end = 82;
      let duration = prefersReducedMotion ? 500 : 1200;
      let startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentScore = Math.round(start + (end - start) * progress);
        setAnimatedScore(currentScore);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(onComplete, 1000);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isVisible, prefersReducedMotion, onComplete]);

  if (!isVisible) return null;

  const scorePercentage = (animatedScore / 100) * 100;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -50 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 25,
            duration: prefersReducedMotion ? 0.2 : 0.6
          }}
        >
          <div className="relative w-32 h-32 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * scorePercentage / 100) }}
                transition={{ duration: prefersReducedMotion ? 0.2 : 1.2, ease: "easeOut" }}
              />
            </svg>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-800">{animatedScore}</span>
                <div className="text-sm text-gray-500">/ 100</div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Health Score Improved!</h2>
          <p className="text-gray-600 mb-4">+7 points from your last assessment</p>
          <div className="flex items-center justify-center gap-2 text-green-600">
            <span className="text-2xl">🎉</span>
            <span className="font-semibold">Great progress!</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function AIThinkingDemo({ isVisible }: { isVisible: boolean }) {
  const prefersReducedMotion = useReducedMotion();

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
          animate={prefersReducedMotion ? {} : {
            scale: [1, 1.1, 1],
            backgroundColor: ['#DBEAFE', '#BFDBFE', '#DBEAFE']
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-sm">🤖</span>
        </motion.div>
        <div className="flex-1">
          <p className="text-sm text-blue-800">AI is analyzing your meal plan...</p>
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-blue-500 rounded-full"
                animate={prefersReducedMotion ? {} : {
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

function InteractiveButton({ 
  children, 
  onClick, 
  variant = 'primary',
  className = ''
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      whileHover={prefersReducedMotion ? {} : { 
        scale: 1.02,
        y: -1
      }}
      whileTap={prefersReducedMotion ? {} : { 
        scale: 0.98,
        y: 1
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }}
    >
      {children}
    </motion.button>
  );
}

export default function MicroInteractionsDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const prefersReducedMotion = useReducedMotion();

  // Health Action Demos
  const [pillLogged, setPillLogged] = useState(false);
  const [mealTracked, setMealTracked] = useState(false);
  const [exerciseRecorded, setExerciseRecorded] = useState(false);
  const [vitalsEntered, setVitalsEntered] = useState(false);
  
  // Progress Demos
  const [healthScore, setHealthScore] = useState(false);
  const [streakAnimation, setStreakAnimation] = useState(false);
  const [goalCompleted, setGoalCompleted] = useState(false);
  
  // AI Demos
  const [aiThinking, setAiThinking] = useState(false);
  const [drugWarning, setDrugWarning] = useState(false);
  const [recipeGeneration, setRecipeGeneration] = useState(false);
  
  // Social Demos
  const [familyActivity, setFamilyActivity] = useState(false);
  const [achievementSharing, setAchievementSharing] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState(false);

  const addNotification = (type: string, message: string) => {
    const id = Date.now();
    const notification = { id, type, message };
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const demoActions = {
    pill: () => {
      setActiveDemo('pill');
      addNotification('success', 'Medication logged successfully!');
    },
    healthScore: () => {
      setActiveDemo('healthScore');
      addNotification('achievement', 'Health score calculation started');
    },
    aiThinking: () => {
      setActiveDemo('aiThinking');
      addNotification('info', 'AI analysis in progress...');
      setTimeout(() => setActiveDemo(null), 3000);
    }
  };

  const demoSections = [
    {
      title: 'Health Action Feedback',
      demos: [
        {
          id: 'pill',
          title: 'Pill Logging',
          description: 'Gentle bounce animation with confirmation',
          action: demoActions.pill
        },
        {
          id: 'meal',
          title: 'Meal Tracking',
          description: 'Nutrition visualization with progress',
          action: () => addNotification('info', 'Meal tracking demo coming soon')
        }
      ]
    },
    {
      title: 'Progress Animations',
      demos: [
        {
          id: 'health-score',
          title: 'Health Score Update',
          description: 'Animated progress ring with number counting',
          action: demoActions.healthScore
        },
        {
          id: 'streak',
          title: 'Streak Counter',
          description: 'Achievement celebration with milestones',
          action: () => addNotification('streak', '7-day streak achieved! 🔥')
        }
      ]
    },
    {
      title: 'AI Interactions',
      demos: [
        {
          id: 'ai-thinking',
          title: 'AI Processing',
          description: 'Thoughtful typing indicator with breathing animation',
          action: demoActions.aiThinking
        },
        {
          id: 'drug-warning',
          title: 'Drug Warning',
          description: 'Attention-grabbing but calm safety alert',
          action: () => addNotification('warning', 'Potential interaction detected')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Praneya Micro-Interactions System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sophisticated micro-interactions that enhance user engagement while maintaining 
            the trust and professionalism required in healthcare applications.
          </p>
          
          {/* Accessibility indicator */}
          <motion.div 
            className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: prefersReducedMotion ? 0 : 0.3 }}
          >
            <span>♿</span>
            {prefersReducedMotion ? 'Reduced Motion Mode Active' : 'Full Animation Mode'}
          </motion.div>
        </motion.div>

        {/* AI Thinking Demo Display */}
        {activeDemo === 'aiThinking' && (
          <div className="mb-8">
            <AIThinkingDemo isVisible={true} />
          </div>
        )}

        {/* Demo Sections */}
        <div className="space-y-12">
          {demoSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              className="bg-white rounded-xl shadow-lg p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.1 : 0.5, 
                delay: prefersReducedMotion ? 0 : sectionIndex * 0.1 
              }}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{section.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.demos.map((demo, demoIndex) => (
                  <motion.div
                    key={demo.id}
                    className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: prefersReducedMotion ? 0.1 : 0.3, 
                      delay: prefersReducedMotion ? 0 : demoIndex * 0.05 
                    }}
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">{demo.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{demo.description}</p>
                    
                    <InteractiveButton
                      onClick={demo.action}
                      className="w-full"
                    >
                      Try Demo
                    </InteractiveButton>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Implementation Details */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: prefersReducedMotion ? 0.1 : 0.5, 
            delay: prefersReducedMotion ? 0 : 0.4 
          }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">♿</span>
              </div>
              <h3 className="font-semibold mb-2">Accessibility First</h3>
              <p className="text-sm text-gray-600">
                WCAG 2.2 AA compliant with reduced motion support
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">⚡</span>
              </div>
              <h3 className="font-semibold mb-2">Performance Optimized</h3>
              <p className="text-sm text-gray-600">
                60fps animations with GPU acceleration
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">🏥</span>
              </div>
              <h3 className="font-semibold mb-2">Healthcare Focused</h3>
              <p className="text-sm text-gray-600">
                Trust-building with professional interactions
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Notification System */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg text-white max-w-sm ${
                notification.type === 'success' ? 'bg-green-500' :
                notification.type === 'warning' ? 'bg-yellow-500' :
                notification.type === 'achievement' ? 'bg-purple-500' :
                notification.type === 'streak' ? 'bg-orange-500' :
                'bg-blue-500'
              }`}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
            >
              <p className="text-sm">{notification.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Active Demo Modals */}
      <PillLoggedDemo 
        isVisible={activeDemo === 'pill'} 
        onComplete={() => setActiveDemo(null)} 
      />
      <HealthScoreDemo 
        isVisible={activeDemo === 'healthScore'} 
        onComplete={() => setActiveDemo(null)} 
      />
    </div>
  );
} 