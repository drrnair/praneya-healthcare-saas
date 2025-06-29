/**
 * Problem Column Component
 * Individual audience problem breakdown with progressive reveal
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ProblemColumnProps {
  headline: string;
  icon: React.ReactNode;
  painPoints: string[];
  emotionalHook: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  audience: string;
  delay: number;
  isSelected: boolean;
}

const ProblemColumn: React.FC<ProblemColumnProps> = ({
  headline,
  icon,
  painPoints,
  emotionalHook,
  bgColor,
  borderColor,
  iconColor,
  audience,
  delay,
  isSelected
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [revealedPoints, setRevealedPoints] = useState(0);

  // Progressive reveal of pain points
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (revealedPoints < painPoints.length) {
        setRevealedPoints(prev => prev + 1);
      }
    }, 500 + (revealedPoints * 300));

    return () => clearTimeout(timer);
  }, [revealedPoints, painPoints.length]);

  const audienceImages = {
    fitness: "💪",
    family: "👨‍👩‍👧‍👦", 
    health: "❤️"
  };

  const audienceLabels = {
    fitness: "Fitness Enthusiasts",
    family: "Busy Families", 
    health: "Health-Conscious"
  };

  return (
    <motion.div
      className={`
        relative bg-gradient-to-br ${bgColor} rounded-2xl border-2 ${borderColor}
        shadow-lg transition-all duration-300 overflow-hidden
        ${isSelected ? 'ring-4 ring-teal-500/50 scale-105' : 'hover:shadow-xl hover:-translate-y-1'}
      `}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      role="article"
      aria-labelledby={`problem-${audience}-headline`}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className="text-8xl">
          {audienceImages[audience as keyof typeof audienceImages]}
        </div>
      </div>

      {/* Stress indicator */}
      <motion.div
        className="absolute top-4 right-4 flex space-x-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.5 }}
      >
        {[1, 2, 3].map((level) => (
          <motion.div
            key={level}
            className="w-2 h-6 bg-red-400 rounded-full"
            animate={{ 
              height: [24, 32, 24],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              delay: level * 0.2
            }}
          />
        ))}
      </motion.div>

      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconColor}`}>
                {icon}
              </div>
              <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {audienceLabels[audience as keyof typeof audienceLabels]}
              </span>
            </div>
            
            <h3 
              id={`problem-${audience}-headline`}
              className="text-xl md:text-2xl font-bold text-gray-900 leading-tight"
            >
              {headline}
            </h3>
          </div>
        </div>

        {/* Pain Points List */}
        <div className="space-y-4 mb-6">
          {painPoints.slice(0, revealedPoints).map((point, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0 mt-1">
                <X className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                "{point}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Loading indicator for unrevealed points */}
        {revealedPoints < painPoints.length && (
          <motion.div
            className="flex items-center gap-2 mb-6"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-xs text-gray-500">More struggles loading...</span>
          </motion.div>
        )}

        {/* Emotional Hook */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: delay + 1 }}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💭
                </motion.div>
              </div>
              <p className="text-sm md:text-base text-gray-800 font-medium leading-relaxed italic">
                {emotionalHook}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Problem Intensity Meter */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: delay + 1.2 }}
        >
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Frustration Level</span>
            <span className="font-semibold">Very High</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "85%" }}
              transition={{ duration: 1.5, delay: delay + 1.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Hover effect: "Does this sound familiar?" */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm font-medium text-gray-600 bg-white/80 px-3 py-1 rounded-full">
            Does this sound familiar? 🤔
          </span>
        </motion.div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute top-4 left-4 flex items-center gap-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-100 px-2 py-1 rounded-full">
            This is me!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export { ProblemColumn }; 