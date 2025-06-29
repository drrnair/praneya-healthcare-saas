'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SPRING_PRESETS, hapticFeedback } from '@/lib/animations/animation-system';
import { Trophy, Star, Target, Award, Zap, Heart, CheckCircle } from 'lucide-react';

// Confetti Animation Component
interface ConfettiAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({
  isActive,
  onComplete
}) => {
  const [confettiPieces] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotate: Math.random() * 360,
      color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
      size: Math.random() * 8 + 4
    }))
  );

  useEffect(() => {
    if (isActive) {
      hapticFeedback.success();
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                backgroundColor: piece.color,
                width: piece.size,
                height: piece.size,
                borderRadius: '2px'
              }}
              initial={{
                y: -20,
                rotate: 0,
                opacity: 1
              }}
              animate={{
                y: 1000,
                rotate: piece.rotate + 720,
                opacity: 0,
                x: [0, Math.sin(piece.id) * 100]
              }}
              transition={{
                duration: 3,
                ease: "easeOut",
                delay: Math.random() * 0.5
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Pulse Effect Component
interface PulseEffectProps {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}

export const PulseEffect: React.FC<PulseEffectProps> = ({
  isActive,
  children,
  className
}) => {
  return (
    <motion.div
      className={className}
      animate={isActive ? {
        scale: [1, 1.1, 1],
        boxShadow: [
          '0 0 0 0 rgba(16, 185, 129, 0)',
          '0 0 0 20px rgba(16, 185, 129, 0.3)',
          '0 0 0 40px rgba(16, 185, 129, 0)'
        ]
      } : {}}
      transition={{
        duration: 0.6,
        repeat: isActive ? 3 : 0,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Trophy Reveal Animation
interface TrophyRevealProps {
  isRevealed: boolean;
  title: string;
  description: string;
  onComplete?: () => void;
}

export const TrophyReveal: React.FC<TrophyRevealProps> = ({
  isRevealed,
  title,
  description,
  onComplete
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isRevealed) {
      hapticFeedback.success();
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 800);
      
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    }
  }, [isRevealed, onComplete]);

  return (
    <AnimatePresence>
      {isRevealed && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4"
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: 180 }}
            transition={SPRING_PRESETS.BOUNCY}
          >
            {/* Trophy Icon */}
            <motion.div
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>

            {/* Sparkles */}
            <div className="relative">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: Math.cos(i * 45 * Math.PI / 180) * 40,
                    y: Math.sin(i * 45 * Math.PI / 180) * 40,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                  <p className="text-gray-600">{description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Progress Bar Animation
interface AnimatedProgressBarProps {
  progress: number;
  goal: number;
  isAnimating: boolean;
  label: string;
  className?: string;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  progress,
  goal,
  isAnimating,
  label,
  className
}) => {
  const percentage = Math.min((progress / goal) * 100, 100);
  const isComplete = progress >= goal;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">{progress}/{goal}</span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              isComplete 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-teal-500 to-cyan-500'
            )}
            initial={{ width: 0 }}
            animate={{ 
              width: `${percentage}%`,
              boxShadow: isAnimating ? [
                '0 0 0 0 rgba(16, 185, 129, 0.4)',
                '0 0 10px 2px rgba(16, 185, 129, 0.2)',
                '0 0 0 0 rgba(16, 185, 129, 0.4)'
              ] : '0 0 0 0 rgba(16, 185, 129, 0)'
            }}
            transition={{ 
              width: { duration: 1, ease: "easeOut" },
              boxShadow: { duration: 1.5, repeat: isAnimating ? Infinity : 0 }
            }}
          />
        </div>

        {/* Success Checkmark */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={SPRING_PRESETS.BOUNCY}
            >
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Milestone Celebration Card
interface MilestoneCelebrationProps {
  isVisible: boolean;
  milestone: {
    title: string;
    description: string;
    icon: 'target' | 'star' | 'award' | 'zap' | 'heart';
    color: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
  };
  onClose?: () => void;
}

export const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  isVisible,
  milestone,
  onClose
}) => {
  const iconMap = {
    target: Target,
    star: Star,
    award: Award,
    zap: Zap,
    heart: Heart
  };

  const colorMap = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    yellow: 'from-yellow-400 to-yellow-600',
    red: 'from-red-400 to-red-600'
  };

  const Icon = iconMap[milestone.icon];

  useEffect(() => {
    if (isVisible) {
      hapticFeedback.success();
      const timer = setTimeout(() => {
        onClose?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 right-4 z-50 max-w-sm"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={SPRING_PRESETS.BOUNCY}
        >
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500" />
            </div>

            {/* Content */}
            <div className="relative flex items-start gap-3">
              <motion.div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br',
                  colorMap[milestone.color]
                )}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm">
                  {milestone.title}
                </h4>
                <p className="text-gray-600 text-xs mt-1">
                  {milestone.description}
                </p>
              </div>

              <motion.button
                className="text-gray-400 hover:text-gray-600"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
            </div>

            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-transparent"
              style={{
                background: `linear-gradient(45deg, transparent 30%, rgba(16, 185, 129, 0.3) 50%, transparent 70%)`,
                backgroundSize: '200% 200%'
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 