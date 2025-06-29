/**
 * Hero Background Component
 * Animated background elements and visual enhancements
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

const HeroBackground: React.FC = () => {
  // Animation variants for floating elements
    const floatingVariants = {
    animate: {
      y: [-20, 20, -20],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as any
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as any
      }
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-green-500/5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/3 to-orange-500/5" />

      {/* Animated Geometric Shapes */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-xl"
        style={{ animationDelay: '0s' }}
      />

      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-lg"
        style={{ animationDelay: '1s' }}
      />

      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-32 left-20 w-40 h-40 bg-gradient-to-br from-orange-400/15 to-amber-500/15 rounded-full blur-2xl"
        style={{ animationDelay: '2s' }}
      />

      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-20 right-32 w-28 h-28 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl"
        style={{ animationDelay: '3s' }}
      />

      {/* Pulsing Background Elements */}
      <motion.div
        variants={pulseVariants}
        animate="animate"
        className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-teal-300/10 to-cyan-400/10 rounded-full blur-3xl"
        style={{ animationDelay: '0.5s' }}
      />

      <motion.div
        variants={pulseVariants}
        animate="animate"
        className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-green-300/8 to-emerald-400/8 rounded-full blur-3xl"
        style={{ animationDelay: '2.5s' }}
      />

      {/* Nutrition-themed Floating Icons */}
      <motion.div
        className="absolute top-24 right-1/4"
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 10, -10, 0],
        }}
                         transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" as any,
          delay: 1
        }}
      >
        <div className="w-8 h-8 bg-green-400/30 rounded-lg backdrop-blur-sm border border-green-300/50 flex items-center justify-center">
          <span className="text-green-600 text-lg">🥬</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-1/2 left-16"
        animate={{
          y: [15, -15, 15],
          rotate: [0, -15, 15, 0],
        }}
                         transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut" as any,
          delay: 2
        }}
      >
        <div className="w-8 h-8 bg-orange-400/30 rounded-lg backdrop-blur-sm border border-orange-300/50 flex items-center justify-center">
          <span className="text-orange-600 text-lg">🍎</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-12"
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 20, -20, 0],
        }}
                         transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut" as any,
          delay: 3
        }}
      >
        <div className="w-8 h-8 bg-blue-400/30 rounded-lg backdrop-blur-sm border border-blue-300/50 flex items-center justify-center">
          <span className="text-blue-600 text-lg">💪</span>
        </div>
      </motion.div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0891b2 1px, transparent 1px),
            linear-gradient(to bottom, #0891b2 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Subtle Gradient Lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-300/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-300/30 to-transparent" />
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-blue-300/20 to-transparent" />
      <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-orange-300/20 to-transparent" />

      {/* Spotlight Effects */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-teal-400/10 via-transparent to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 w-80 h-80 bg-gradient-radial from-green-400/8 via-transparent to-transparent blur-3xl" />

      {/* Animated Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-teal-400/40 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-100, -120, -100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
                               transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut" as any
          }}
        />
      ))}
    </div>
  );
};

export { HeroBackground }; 