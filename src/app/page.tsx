'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIFeatureShowcase from '@/components/landing/AIFeatureShowcase';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { ArrowRight } from 'lucide-react';

/**
 * =======================================================================
 * PRANEYA HEALTHCARE 2025 - VIBRANT MAIN LANDING PAGE
 * =======================================================================
 *
 * A stunning showcase of modern healthcare design featuring:
 * - Vibrant gradient backgrounds and colorful CTAs
 * - AI-driven personalization with animated elements
 * - High-conversion design patterns
 * - Engaging micro-interactions and hover effects
 * - Modern glassmorphism and colorful shadows
 * - Dynamic background animations
 *
 * =======================================================================
 */

export default function HomePage() {
  const [currentPersona, setCurrentPersona] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // AI-Driven Personalization Content with vibrant themes
  const personas = [
    {
      type: 'family',
      title: "Transform Your Family's Health Journey",
      subtitle:
        "AI-powered nutrition planning that adapts to every family member's needs",
      gradient: 'bg-gradient-cta-secondary',
      textGradient: 'text-gradient-feature',
      icon: '👨‍👩‍👧‍👦',
      stats: { families: '50K+', satisfaction: '98%', meals: '2M+' },
      features: [
        'Family Meal Planning',
        'Allergy Detection',
        'Growth Tracking',
      ],
      color: 'secondary',
    },
    {
      type: 'fitness',
      title: 'Optimize Your Athletic Performance',
      subtitle: 'Scientific nutrition strategies designed for peak performance',
      gradient: 'bg-gradient-cta-primary',
      textGradient: 'text-gradient-cta',
      icon: '🏋️‍♀️',
      stats: { athletes: '25K+', improvement: '40%', workouts: '1M+' },
      features: [
        'Performance Nutrition',
        'Recovery Optimization',
        'Goal Tracking',
      ],
      color: 'accent',
    },
    {
      type: 'wellness',
      title: 'Simplify Your Wellness Journey',
      subtitle: 'Effortless healthy living with personalized guidance',
      gradient: 'bg-gradient-cta-purple',
      textGradient: 'text-gradient-hero',
      icon: '🌱',
      stats: { members: '100K+', goals: '95%', recipes: '10K+' },
      features: ['Mindful Eating', 'Stress Management', 'Lifestyle Balance'],
      color: 'purple',
    },
  ];

  // Auto-rotate personas every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPersona(prev => (prev + 1) % personas.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const currentData = personas[currentPersona] || personas[0]!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Dynamic Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Animated Dot Pattern */}
      <div className="fixed inset-0 bg-animated-dots opacity-40" />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="container mx-auto px-6 py-6"
        >
          <div className="flex items-center justify-between">
            <motion.div
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Praneya Healthcare
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Features', href: '#features' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'About', href: '#about' },
                { name: 'Contact', href: '#contact' },
              ].map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-slate-700 hover:text-blue-600 transition-colors font-medium relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}

              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => window.open('/signup', '_blank')}
              >
                Get Started Free
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-6 py-16"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
            {/* Content Column */}
            <div className="space-y-8">
              {/* AI Personalization Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3 flex-wrap gap-3"
              >
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 flex items-center space-x-2">
                  <span>🤖</span>
                  <span>AI-Powered Personalization</span>
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200 flex items-center space-x-2">
                  <span>🔒</span>
                  <span>HIPAA Compliant</span>
                </div>
                <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium border border-orange-200 flex items-center space-x-2">
                  <span>⭐</span>
                  <span>Clinical Grade</span>
                </div>
              </motion.div>

              {/* Dynamic Hero Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPersona}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{currentData.icon}</span>
                    <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                      {currentData.type} focused
                    </span>
                  </div>

                  <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
                    {currentData.title}
                  </h1>

                  <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                    {currentData.subtitle}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 py-6">
                    {Object.entries(currentData.stats).map(
                      ([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="text-center"
                        >
                          <div className="text-2xl font-bold text-slate-800">
                            {value}
                          </div>
                          <div className="text-sm text-slate-600 capitalize">
                            {key}
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-3">
                    {currentData.features.map((feature, _index) => (
                      <span
                        key={feature}
                        className="bg-white text-slate-700 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <motion.button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open('/signup', '_blank')}
                    >
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </motion.button>

                    <motion.button
                      className="bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open('/demo', '_blank')}
                    >
                      Watch Demo
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Visual Column */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="relative"
              >
                {/* Main Dashboard Mockup */}
                <div className="card-vibrant shadow-xl p-8 relative overflow-hidden hover-glow">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-vibrant-hero"></div>

                  {/* Mock Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">P</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-800">
                          Family Dashboard
                        </h3>
                        <p className="text-sm text-neutral-600">
                          Today's Health Overview
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full pulse-secondary"></div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Health Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                      <div className="text-2xl font-bold text-blue-600">
                        98%
                      </div>
                      <div className="text-sm text-neutral-600">
                        Nutrition Goals
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
                      <div className="text-2xl font-bold text-emerald-600">
                        4/4
                      </div>
                      <div className="text-sm text-neutral-600">
                        Family Active
                      </div>
                    </div>
                  </div>

                  {/* Mock AI Suggestions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-neutral-800 flex items-center space-x-2">
                      <span>🤖</span>
                      <span>AI Recommendations</span>
                    </h4>
                    {[
                      'Mediterranean salmon for dinner',
                      'Add more fiber to breakfast',
                      'Stay hydrated reminder',
                    ].map((suggestion, index) => (
                      <motion.div
                        key={suggestion}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.2 }}
                        className="flex items-center space-x-3 p-3 bg-gradient-to-r from-white to-neutral-50 rounded-lg border border-neutral-100 hover-lift"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full"></div>
                        <span className="text-sm text-neutral-700">
                          {suggestion}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating AI Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, type: 'spring', stiffness: 500 }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-accent pulse-primary"
                >
                  AI Powered ✨
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* AI Feature Showcase */}
        <AIFeatureShowcase className="py-20" />

        {/* Social Proof */}
        <SocialProofSection />

        {/* Pricing */}
        <PricingSection />
      </div>
    </div>
  );
}
