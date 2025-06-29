'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import AIFeatureShowcase from '@/components/landing/AIFeatureShowcase';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { PricingSection } from '@/components/landing/PricingSection';

/**
 * =======================================================================
 * PRANEYA HEALTHCARE 2025 - MAIN LANDING PAGE
 * =======================================================================
 * 
 * A stunning showcase of modern healthcare design featuring:
 * - AI-driven personalization with hyper-personalized interfaces
 * - Micro-interactions for emotional engagement
 * - Neuroscience-based design for reduced cognitive load
 * - Sustainability and ethical design principles
 * - Zero-UI and invisible design elements
 * 
 * =======================================================================
 */

export default function HomePage() {
  const [currentPersona, setCurrentPersona] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [_userType, _setUserType] = useState<'individual' | 'family' | 'provider'>('individual');

  // AI-Driven Personalization Content
  const personas = [
    {
      type: 'family',
      title: "Transform Your Family's Health Journey",
      subtitle: "AI-powered nutrition planning that adapts to every family member's needs",
      gradient: "from-success-400 to-secondary-500",
      icon: "👨‍👩‍👧‍👦",
      stats: { families: "50K+", satisfaction: "98%", meals: "2M+" },
      features: ["Family Meal Planning", "Allergy Detection", "Growth Tracking"]
    },
    {
      type: 'fitness',
      title: "Optimize Your Athletic Performance",
      subtitle: "Scientific nutrition strategies designed for peak performance",
      gradient: "from-warning-400 to-copper-500",
      icon: "🏋️‍♀️",
      stats: { athletes: "25K+", improvement: "40%", workouts: "1M+" },
      features: ["Performance Nutrition", "Recovery Optimization", "Goal Tracking"]
    },
    {
      type: 'wellness',
      title: "Simplify Your Wellness Journey",
      subtitle: "Effortless healthy living with personalized guidance",
      gradient: "from-primary-500 to-primary-700",
      icon: "🌱",
      stats: { members: "100K+", goals: "95%", recipes: "10K+" },
      features: ["Mindful Eating", "Stress Management", "Lifestyle Balance"]
    }
  ];

  // Auto-rotate personas every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPersona((prev) => (prev + 1) % personas.length);
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full blur-3xl opacity-40"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-success-200 to-secondary-300 rounded-full blur-3xl opacity-40"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-br from-warning-200 to-copper-300 rounded-full blur-3xl opacity-40"
          animate={{ 
            y: [-20, 20, -20],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,_theme(colors.primary.500)_1px,_transparent_0)] bg-[size:24px_24px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container mx-auto px-6 py-6"
        >
          <div className="flex items-center justify-between">
            <motion.div 
              className="text-2xl font-bold text-gradient-primary"
              whileHover={{ scale: 1.05 }}
            >
              Praneya Healthcare
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Pricing', 'About', 'Contact'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-neutral-600 hover:text-primary-600 transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              ))}
              
              <motion.button
                className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 123, 255, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-6 py-20"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
            {/* Content Column */}
            <div className="space-y-8">
              {/* AI Personalization Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium border border-primary-200 flex items-center space-x-1">
                  <span>🤖</span>
                  <span>AI-Powered Personalization</span>
                </div>
                <div className="bg-success-100 text-success-700 px-3 py-1 rounded-full text-xs font-medium border border-success-200">
                  HIPAA Compliant
                </div>
              </motion.div>

              {/* Dynamic Headlines */}
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.h1
                    key={currentPersona}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl lg:text-6xl font-extrabold leading-tight"
                  >
                    <span className={`block bg-gradient-to-r ${currentData.gradient} bg-clip-text text-transparent mb-2`}>
                      {currentData.title.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span className="block text-neutral-800">
                      {currentData.title.split(' ').slice(2).join(' ')}
                    </span>
                  </motion.h1>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentPersona}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl lg:text-2xl text-neutral-600 leading-relaxed max-w-lg"
                  >
                    {currentData.subtitle}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3"
              >
                {currentData.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <span className="text-neutral-700 font-medium">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <motion.button
                  className={`bg-gradient-to-r ${currentData.gradient} text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg flex items-center space-x-2 justify-center`}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{currentData.icon}</span>
                  <span>Start Free Trial</span>
                </motion.button>
                
                <motion.button
                  className="border border-neutral-300 text-neutral-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neutral-50 transition-colors flex items-center space-x-2 justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>▶️</span>
                  <span>Watch Demo</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Visual Column */}
            <div className="relative">
              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative z-10"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-neutral-800">Health Impact</h3>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentPersona}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="text-4xl"
                        >
                          {currentData.icon}
                        </motion.span>
                      </AnimatePresence>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <AnimatePresence mode="wait">
                        {Object.entries(currentData.stats).map(([key, value], index) => (
                          <motion.div
                            key={`${currentPersona}-${key}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                          >
                            <motion.p 
                              className="text-2xl font-bold text-primary-600"
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {value}
                            </motion.p>
                            <p className="text-xs text-neutral-500 capitalize">{key}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="pt-4 border-t border-neutral-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">Join the community</span>
                        <motion.span
                          className="text-success-600 font-medium"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Growing daily ↗
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-8 -right-8 z-0"
              >
                <motion.div
                  animate={{ 
                    y: [-10, 10, -10],
                    rotate: [-5, 5, -5]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-success-100 text-success-700 px-4 py-2 rounded-full text-sm font-medium border border-success-200 shadow-lg"
                >
                  🎯 Goal Achieved
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 z-0"
              >
                <motion.div
                  animate={{ 
                    y: [10, -10, 10],
                    rotate: [5, -5, 5]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-warning-100 text-warning-700 px-4 py-2 rounded-full text-sm font-medium border border-warning-200 shadow-lg"
                >
                  ⚡ Energy Boost
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute top-1/2 -left-12 z-0"
              >
                <motion.div
                  animate={{ 
                    x: [-5, 5, -5],
                    rotate: [-3, 3, -3]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium border border-primary-200 shadow-lg"
                >
                  🧠 AI Insights
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* AI Feature Showcase - NEW SECTION */}
        <AIFeatureShowcase />

        {/* Social Proof Section - Trust & Credibility */}
        <SocialProofSection />

        {/* Pricing Section - Conversion Optimized */}
        <PricingSection />

        {/* Demo Navigation */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="container mx-auto px-6 py-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-800 mb-4">Explore Our Platform</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Experience the future of healthcare technology with our comprehensive demo suite
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Family Management",
                description: "Complete family health coordination system",
                link: "/family-management-demo",
                icon: "👨‍👩‍👧‍👦",
                gradient: "from-success-400 to-secondary-500"
              },
              {
                title: "Gamification System",
                description: "Engaging health challenges and rewards",
                link: "/gamification-demo",
                icon: "🎮",
                gradient: "from-warning-400 to-copper-500"
              },
              {
                title: "Clinical Interfaces",
                description: "Professional healthcare provider tools",
                link: "/clinical-interfaces-demo",
                icon: "🏥",
                gradient: "from-primary-500 to-info-500"
              },
              {
                title: "Data Visualization",
                description: "Beautiful health analytics dashboard",
                link: "/data-visualization-demo",
                icon: "📊",
                gradient: "from-primary-600 to-primary-700"
              },
              {
                title: "Micro Interactions",
                description: "Delightful user experience elements",
                link: "/micro-interactions-demo",
                icon: "✨",
                gradient: "from-secondary-400 to-accent-500"
              },
              {
                title: "PWA Features",
                description: "Progressive web app capabilities",
                link: "/pwa-demo",
                icon: "📱",
                gradient: "from-forest-500 to-forest-700"
              }
            ].map((demo, index) => (
              <motion.div
                key={demo.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <Link href={demo.link}>
                  <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-neutral-200 cursor-pointer h-full"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${demo.gradient} flex items-center justify-center text-2xl`}>
                          {demo.icon}
                        </div>
                        <h3 className="text-xl font-bold text-neutral-800">{demo.title}</h3>
                      </div>
                      <p className="text-neutral-600">{demo.description}</p>
                      <div className="flex items-center text-primary-600 font-medium">
                        <span>Explore Demo</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-2"
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2 text-neutral-500"
          >
            <span className="text-sm font-medium">Discover More</span>
            <div className="w-6 h-10 border-2 border-neutral-300 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-primary-500 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
