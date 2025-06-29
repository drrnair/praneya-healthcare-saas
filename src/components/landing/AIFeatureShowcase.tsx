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
import { VibrantAIGeneratedImage } from '@/components/images/AIGeneratedImages';
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
 * VIBRANT AI FEATURE SHOWCASE 2025
 * =======================================================================
 * 
 * Interactive demonstration of Praneya's AI capabilities through:
 * - Vibrant, animated AI-generated images
 * - Modern glassmorphism design with colorful shadows
 * - Interactive hotspots with engaging tooltips
 * - Real-time AI processing animations with flair
 * - Dynamic recipe generation displays
 * - Advanced nutrition analysis dashboard
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

// Recipe Card Component with Vibrant Styling
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
    Easy: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Hard: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: isActive ? 1.05 : 1 }}
      transition={{ delay, type: "spring", stiffness: 300 }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: 'var(--shadow-purple)' }}
      className={cn(
        "card-vibrant cursor-pointer transition-all duration-300",
        isActive && "ring-2 ring-purple-500 shadow-purple"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-neutral-800">{title}</h3>
        <div className={cn("px-2 py-1 text-xs font-semibold rounded-full", difficultyColors[difficulty])}>
          {difficulty}
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
        <div className="flex items-center space-x-1">
          <Clock size={16} />
          <span>{cookTime}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Heart size={16} />
          <span>{calories} kcal</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <div key={tag} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
            {tag}
          </div>
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
  const [activeTab, setActiveTab] = useState('scan');
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      trackConversion({
        event: 'view_ai_feature_showcase',
        section: 'AIFeatureShowcase',
        timestamp: new Date(),
      });
    }
  }, [isInView, controls]);

  const tabs = [
    { id: 'scan', label: 'Scan & Analyze', icon: 'camera' },
    { id: 'insights', label: 'AI Insights', icon: 'brain' },
    { id: 'plan', label: 'Generate Plan', icon: 'calendar' }
  ];

  return (
    <motion.section
      ref={ref}
      className={cn("py-24 bg-gradient-page", className)}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
      }}
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
          }}
        >
          <h2 className="text-5xl font-bold mb-4 text-gradient-hero">The Future of Nutrition is Here</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Our powerful AI understands your unique health needs, delivering hyper-personalized nutrition plans with clinical precision.
          </p>
        </motion.div>
        
        {/* Main Showcase */}
        <div className="bg-gradient-card p-8 rounded-3xl shadow-xl backdrop-blur-2xl border border-white/20">
          <TabSystem tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="mt-8 grid lg:grid-cols-2 gap-8 items-center">
            {/* Left Column: Interactive Visuals */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="relative h-[500px]"
              >
                {activeTab === 'scan' && (
                  <VibrantAIGeneratedImage
                    config={{ id: 'scan-demo', prompt: 'Scan', category: 'feature', aspectRatio: '4/5', alt: 'Scan' }}
                    className="w-full h-full"
                  />
                )}
                {activeTab === 'insights' && (
                  <VibrantAIGeneratedImage
                    config={{ id: 'insights-demo', prompt: 'Insights', category: 'feature', aspectRatio: '4/5', alt: 'Insights' }}
                    className="w-full h-full"
                  />
                )}
                {activeTab === 'plan' && (
                  <VibrantAIGeneratedImage
                    config={{ id: 'plan-demo', prompt: 'Plan', category: 'feature', aspectRatio: '4/5', alt: 'Plan' }}
                    className="w-full h-full"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Right Column: Explanations */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-content`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-6"
              >
                {activeTab === 'scan' && (
                  <div>
                    <h3 className="text-3xl font-bold text-gradient-feature mb-4">1. Snap a Photo, Get Instant Analysis</h3>
                    <p className="text-lg text-neutral-700 mb-4">
                      Our cutting-edge AI analyzes meals from a single photo, identifying ingredients, portion sizes, and micronutrients in seconds.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2"><Check className="text-green-500" /><span>99.7% ingredient accuracy</span></li>
                      <li className="flex items-center space-x-2"><Check className="text-green-500" /><span>Detects 500+ allergens</span></li>
                      <li className="flex items-center space-x-2"><Check className="text-green-500" /><span>Works with complex dishes</span></li>
                    </ul>
                  </div>
                )}
                 {activeTab === 'insights' && (
                  <div>
                    <h3 className="text-3xl font-bold text-gradient-feature mb-4">2. Unlock Actionable Health Insights</h3>
                    <p className="text-lg text-neutral-700 mb-4">
                      We connect your dietary intake to your health goals, providing clear, actionable insights to improve your well-being.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="card-vibrant p-4"><h4 className="font-bold text-purple-600">Personalized Glycemic Index</h4><p className="text-sm text-neutral-600">Track your blood sugar impact.</p></div>
                      <div className="card-vibrant p-4"><h4 className="font-bold text-pink-600">Micronutrient Gap Analysis</h4><p className="text-sm text-neutral-600">Find what your body is missing.</p></div>
                    </div>
                  </div>
                )}
                {activeTab === 'plan' && (
                  <div>
                    <h3 className="text-3xl font-bold text-gradient-feature mb-4">3. Receive Your Hyper-Personalized Plan</h3>
                    <p className="text-lg text-neutral-700 mb-4">
                      Get a dynamic, delicious meal plan generated just for you, adapting to your progress and preferences in real-time.
                    </p>
                    <RecipeCard title="AI-Generated Salmon Bowl" difficulty="Easy" cookTime="20 min" calories={450} tags={['High Protein', 'Omega-3']} isActive />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AIFeatureShowcase; 