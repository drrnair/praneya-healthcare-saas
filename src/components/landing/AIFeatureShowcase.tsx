'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  HealthcareButton, 
  HealthcareCard, 
  HealthcareBadge,
  HealthcareTooltip 
} from '@/lib/design-system/healthcare-components';
import { FeatureAIImage, TrustAIImage } from '@/components/images/AIGeneratedImages';
import { trackConversion } from '@/lib/analytics/conversion-tracking';
import { 
  Scan, 
  Brain, 
  Target, 
  Zap,
  Check,
  ArrowRight,
  Sparkles,
  Camera,
  BarChart3,
  Users,
  Calendar,
  ShoppingCart,
  Clock,
  Heart
} from 'lucide-react';

/**
 * =======================================================================
 * AI FEATURE SHOWCASE 2025
 * =======================================================================
 * 
 * Interactive demonstration of Praneya's AI capabilities through:
 * - Glassmorphism design with backdrop-blur effects
 * - Device mockups with realistic shadows and reflections
 * - Interactive hotspots with feature explanations
 * - Real-time AI processing animations
 * - Dynamic recipe generation displays
 * - Nutrition analysis dashboard with charts
 * - Sophisticated visual storytelling
 * 
 * =======================================================================
 */

interface AIFeatureShowcaseProps {
  className?: string;
}

// Interactive Hotspot Component
const InteractiveHotspot: React.FC<{
  x: number;
  y: number;
  title: string;
  description: string;
  delay?: number;
}> = ({ x, y, title, description, delay = 0 }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 300 }}
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsActive(!isActive)}
      >
        {/* Pulsing Ring */}
        <motion.div
          className="absolute inset-0 w-6 h-6 bg-primary-500 rounded-full opacity-30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Core Dot */}
        <div className="w-6 h-6 bg-primary-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-primary-100"
            >
              <h4 className="font-semibold text-neutral-800 mb-2">{title}</h4>
              <p className="text-sm text-neutral-600">{description}</p>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white/95" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Animated Progress Ring
const ProgressRing: React.FC<{ 
  percentage: number; 
  color: string; 
  size?: number;
  strokeWidth?: number;
  label?: string;
}> = ({ 
  percentage, 
  color, 
  size = 120, 
  strokeWidth = 8,
  label 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-neutral-200"
        />
        
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 2, ease: "easeInOut" }}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className="text-2xl font-bold text-neutral-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {percentage}%
        </motion.span>
        {label && (
          <span className="text-xs text-neutral-500 text-center">{label}</span>
        )}
      </div>
    </div>
  );
};

// Recipe Card Component
const RecipeCard: React.FC<{
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cookTime: string;
  calories: number;
  tags: string[];
  isActive?: boolean;
  delay?: number;
}> = ({ title, difficulty, cookTime, calories, tags, isActive = false, delay = 0 }) => {
  const difficultyColors = {
    Easy: 'bg-success-100 text-success-700',
    Medium: 'bg-warning-100 text-warning-700',
    Hard: 'bg-error-100 text-error-700'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: isActive ? 1.05 : 1 }}
      transition={{ delay, type: "spring", stiffness: 300 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={cn(
        "bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,123,255,0.12)] border border-white/20 cursor-pointer transition-all duration-300",
        isActive && "ring-2 ring-primary-500 shadow-[0_16px_48px_rgba(0,123,255,0.2)]"
      )}
    >
      {/* Recipe Image Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl mb-4 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-4xl"
        >
          🍽️
        </motion.div>
      </div>

      {/* Recipe Details */}
      <h3 className="font-bold text-lg text-neutral-800 mb-3">{title}</h3>
      
      <div className="flex items-center justify-between mb-4">
        <span className={cn("px-3 py-1 rounded-full text-sm font-medium", difficultyColors[difficulty])}>
          {difficulty}
        </span>
        <div className="flex items-center space-x-4 text-sm text-neutral-600">
          <span>⏱️ {cookTime}</span>
          <span>🔥 {calories} cal</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <motion.span
            key={tag}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + (index * 0.1) }}
            className="px-2 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600"
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

// Tab System Component
const TabSystem: React.FC<{
  tabs: { id: string; label: string; icon: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className="relative">
      <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 font-medium",
              activeTab === tab.id 
                ? "text-primary-600" 
                : "text-neutral-600 hover:text-primary-500"
            )}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
        
        {/* Sliding Active Indicator */}
        <motion.div
          className="absolute bg-white rounded-xl shadow-lg border border-primary-100"
          initial={false}
          animate={{
            x: activeIndex * (100 / tabs.length) + '%',
            width: `${100 / tabs.length}%`
          }}
          style={{
            height: 'calc(100% - 8px)',
            top: '4px',
            left: '4px'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
};

export const AIFeatureShowcase: React.FC<AIFeatureShowcaseProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState('recognition');
  const [scanningProgress, setScanningProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-20%' });
  const controls = useAnimation();

  const tabs = [
    { id: 'recognition', label: 'AI Food Recognition', icon: '📸' },
    { id: 'recipes', label: 'Recipe Generation', icon: '🍳' },
    { id: 'nutrition', label: 'Nutrition Analysis', icon: '📊' }
  ];

  const sampleRecipes = [
    {
      title: "Mediterranean Quinoa Bowl",
      difficulty: 'Easy' as const,
      cookTime: "20 min",
      calories: 420,
      tags: ["Vegetarian", "High Protein", "Gluten-Free"]
    },
    {
      title: "Grilled Salmon with Asparagus",
      difficulty: 'Medium' as const,
      cookTime: "25 min", 
      calories: 380,
      tags: ["Keto", "High Protein", "Omega-3"]
    },
    {
      title: "Chickpea Curry with Brown Rice",
      difficulty: 'Easy' as const,
      cookTime: "30 min",
      calories: 350,
      tags: ["Vegan", "High Fiber", "Anti-Inflammatory"]
    }
  ];

  // Simulate AI scanning process
  useEffect(() => {
    if (activeTab === 'recognition' && isInView) {
      const timer = setTimeout(() => {
        setIsScanning(true);
        const interval = setInterval(() => {
          setScanningProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 2;
          });
        }, 50);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeTab, isInView]);

  // Auto-cycle through recipes
  useEffect(() => {
    if (activeTab === 'recipes') {
      const interval = setInterval(() => {
        setSelectedRecipe(prev => (prev + 1) % sampleRecipes.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeTab, sampleRecipes.length]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      className={cn("py-24 bg-gradient-to-br from-neutral-50 to-primary-50/30", className)}
    >
      <motion.div
        className="container mx-auto px-6"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <HealthcareBadge variant="primary" className="mb-4">
            🤖 AI-Powered Features
          </HealthcareBadge>
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-800 mb-6">
            Experience the Future of 
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"> Nutrition AI</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Discover how our advanced AI technology transforms the way you plan, cook, and track your nutrition with real-time insights and personalized recommendations.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className="flex justify-center mb-12">
          <TabSystem
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </motion.div>

        {/* Feature Content */}
        <AnimatePresence mode="wait">
          {/* AI Food Recognition */}
          {activeTab === 'recognition' && (
            <motion.div
              key="recognition"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Device Mockup */}
              <div className="relative">
                <div className="relative mx-auto w-72 h-[600px] bg-neutral-900 rounded-[3rem] p-2 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Phone Screen Content */}
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-100 to-neutral-200">
                      {/* Camera Interface */}
                      <div className="absolute inset-4 border-2 border-dashed border-primary-300 rounded-xl flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-6xl"
                        >
                          🥗
                        </motion.div>
                      </div>

                      {/* Scanning Animation */}
                      {isScanning && (
                        <>
                          <motion.div
                            className="absolute inset-4 border-2 border-primary-500 rounded-xl"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          
                          {/* AI Processing Indicator */}
                          <div className="absolute bottom-8 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" />
                              <span className="text-sm font-medium">AI Analysis in Progress...</span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <motion.div
                                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                                initial={{ width: "0%" }}
                                animate={{ width: `${scanningProgress}%` }}
                                transition={{ duration: 0.1 }}
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {/* Food Recognition Results */}
                      {scanningProgress >= 100 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-8 left-4 right-4 space-y-2"
                        >
                          {[
                            { name: "Cherry Tomatoes", confidence: 98 },
                            { name: "Mixed Greens", confidence: 95 },
                            { name: "Feta Cheese", confidence: 92 },
                            { name: "Olive Oil", confidence: 89 }
                          ].map((ingredient, index) => (
                            <motion.div
                              key={ingredient.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 }}
                              className="bg-white/95 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between"
                            >
                              <span className="font-medium text-sm">{ingredient.name}</span>
                              <span className="text-xs text-primary-600 font-bold">
                                {ingredient.confidence}%
                              </span>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Hotspots */}
                <InteractiveHotspot
                  x={20} y={30}
                  title="Real-time AI Recognition"
                  description="Our advanced computer vision identifies ingredients with 95%+ accuracy in real-time"
                  delay={1}
                />
                <InteractiveHotspot
                  x={80} y={60}
                  title="Confidence Scoring" 
                  description="Each ingredient comes with an AI confidence score to ensure accuracy"
                  delay={1.5}
                />
              </div>

              {/* Feature Description */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-neutral-800">
                  Instant Food Recognition with AI Vision
                </h3>
                <p className="text-lg text-neutral-600 leading-relaxed">
                  Simply point your camera at any dish or ingredient, and our advanced AI instantly identifies what you're looking at. Get detailed nutritional information, allergen warnings, and recipe suggestions in seconds.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="font-semibold mb-1">Lightning Fast</h4>
                    <p className="text-sm text-neutral-600">Results in under 2 seconds</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-semibold mb-1">Highly Accurate</h4>
                    <p className="text-sm text-neutral-600">95%+ recognition accuracy</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Recipe Generation */}
          {activeTab === 'recipes' && (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              {/* Header */}
              <div className="text-center">
                <h3 className="text-3xl font-bold text-neutral-800 mb-4">
                  AI-Generated Personalized Recipes
                </h3>
                <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                  Our AI creates custom recipes based on your dietary preferences, available ingredients, and health goals.
                </p>
              </div>

              {/* Recipe Cards Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {sampleRecipes.map((recipe, index) => (
                  <RecipeCard
                    key={recipe.title}
                    {...recipe}
                    isActive={selectedRecipe === index}
                    delay={index * 0.2}
                  />
                ))}
              </div>

              {/* Interactive Controls */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h4 className="text-xl font-semibold mb-6 text-center">Customize Your Recipe Generation</h4>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Dietary Preferences */}
                  <div>
                    <h5 className="font-medium mb-3">Dietary Preferences</h5>
                    <div className="space-y-2">
                      {['Vegetarian', 'Vegan', 'Keto', 'Paleo'].map((diet) => (
                        <label key={diet} className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-neutral-300" />
                          <span className="text-sm">{diet}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Cooking Time */}
                  <div>
                    <h5 className="font-medium mb-3">Max Cooking Time</h5>
                    <div className="space-y-2">
                      {['15 min', '30 min', '1 hour', '2+ hours'].map((time) => (
                        <label key={time} className="flex items-center space-x-2 cursor-pointer">
                          <input type="radio" name="time" className="border-neutral-300" />
                          <span className="text-sm">{time}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Level */}
                  <div>
                    <h5 className="font-medium mb-3">Difficulty Level</h5>
                    <div className="space-y-2">
                      {['Beginner', 'Intermediate', 'Advanced'].map((level, index) => (
                        <motion.div
                          key={level}
                          className="flex items-center space-x-3"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex space-x-1">
                            {Array.from({ length: 3 }, (_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "w-2 h-2 rounded-full",
                                  i <= index ? "bg-primary-500" : "bg-neutral-300"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm">{level}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Nutrition Analysis */}
          {activeTab === 'nutrition' && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-12"
            >
              {/* Feature Demonstration Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                {/* AI Dashboard Visualization */}
                <motion.div
                  variants={itemVariants}
                  className="order-2 lg:order-1"
                >
                  <FeatureAIImage
                    imageKey="nutritionDashboard"
                    className="rounded-2xl shadow-2xl"
                  />
                </motion.div>
                
                <motion.div
                  variants={itemVariants}
                  className="order-1 lg:order-2 space-y-6"
                >
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Smart Analytics
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900">
                    Visualize Your Nutrition Journey
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Get comprehensive insights into your nutrition patterns with AI-generated reports. 
                    Track progress, identify trends, and receive personalized recommendations based on your data.
                  </p>
                  
                  <ul className="space-y-3">
                    {[
                      "Real-time nutrition tracking",
                      "Macro and micronutrient analysis",
                      "Health goal progress monitoring",
                      "Personalized improvement suggestions"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Family Planning Feature */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <motion.div
                  variants={itemVariants}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <Users className="w-4 h-4 mr-2" />
                    Family Planning
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900">
                    Simplify Family Meal Planning
                  </h3>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Plan nutritious meals that work for everyone in your family. 
                    Our AI considers dietary restrictions, preferences, and nutritional needs for each family member.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: Calendar, text: "Weekly meal planning", color: "text-blue-500" },
                      { icon: ShoppingCart, text: "Smart shopping lists", color: "text-green-500" },
                      { icon: Clock, text: "Prep time optimization", color: "text-orange-500" },
                      { icon: Heart, text: "Dietary accommodations", color: "text-red-500" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span className="text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                <motion.div
                  variants={itemVariants}
                  className="relative"
                >
                  <FeatureAIImage
                    imageKey="familyMealPlanning"
                    className="rounded-2xl shadow-2xl"
                  />
                  
                  {/* Overlay badges */}
                  <motion.div
                    className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Trust and Credibility Section */}
              <motion.div
                variants={itemVariants}
                className="text-center space-y-12"
              >
                <div className="max-w-3xl mx-auto">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Trusted by Healthcare Professionals
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Our platform is developed in collaboration with registered dietitians, 
                    nutritionists, and healthcare providers to ensure evidence-based recommendations.
                  </p>
                </div>
                
                <TrustAIImage
                  imageKey="healthcareProfessionals"
                  className="max-w-4xl mx-auto rounded-2xl shadow-2xl"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className="text-center mt-16"
        >
          <HealthcareButton
            variant="primary"
            size="lg"
            className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-xl transition-all duration-300"
            icon={<span className="text-xl">🚀</span>}
          >
            Experience AI-Powered Nutrition
          </HealthcareButton>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AIFeatureShowcase; 