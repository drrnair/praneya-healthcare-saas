/**
 * Solution Presentation Section - "Meet Your Personal AI Nutrition Guide"
 * Comprehensive demonstration of Praneya's three-tier solution with interactive demos
 */

'use client';

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Brain, 
  Users, 
  CheckCircle, 
  Star,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowRight,
  Play,
  Heart,
  BarChart3
} from 'lucide-react';

interface SolutionTier {
  id: 'basic' | 'enhanced' | 'premium';
  name: string;
  tagline: string;
  price: { monthly: number; annual: number };
  originalPrice?: number;
  description: string;
  perfectFor: string[];
  coreFeatures: string[];
  audienceSpecificBenefits: {
    fitness: string;
    families: string;
    health: string;
  };
  icon: React.ReactNode;
  gradient: string;
  recommended?: boolean;
  popular?: boolean;
}

interface SuccessStory {
  name: string;
  audience: 'fitness' | 'families' | 'health';
  result: string;
  quote: string;
  metrics: { label: string; value: string }[];
  image: string;
}

interface SolutionPresentationSectionProps {
  onTierSelect?: (tier: string) => void;
}

const SolutionPresentationSection: React.FC<SolutionPresentationSectionProps> = ({
  onTierSelect
}) => {
  const [activeTier, setActiveTier] = useState<'basic' | 'enhanced' | 'premium'>('enhanced');
  const [showComparison, setShowComparison] = useState(false);
  const [demoStep, setDemoStep] = useState(0);
  const [showPricing, setShowPricing] = useState('monthly');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const subscriptionTiers: SolutionTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      tagline: 'Get Started with Confidence',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for individuals beginning their nutrition journey',
      perfectFor: [
        'Fitness enthusiasts beginning their journey',
        'Families exploring healthier options', 
        'Individuals taking first steps'
      ],
      coreFeatures: [
        'AI Recipe Generation - Upload ingredients, get personalized recipes instantly',
        'Visual Food Recognition - Point your camera, know exactly what you\'re eating',
        'Comprehensive Nutrition Analysis - Track 28 essential nutrients automatically',
        'Allergy Management - Never worry about problematic foods again',
        'Simple Meal Logging - Effortless tracking that actually works'
      ],
      audienceSpecificBenefits: {
        fitness: 'Perfect macros without the complex calculations',
        families: 'Kid-friendly recipes that adults love too',
        health: 'Safe food choices with dietary awareness'
      },
      icon: <Heart className="w-8 h-8" />,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 'enhanced',
      name: 'Enhanced',
      tagline: 'Transform Your Routine',
      price: { monthly: 12.99, annual: 129.99 },
      originalPrice: 14.99,
      description: 'Comprehensive nutrition management for serious progress',
      perfectFor: [
        'Serious fitness enthusiasts',
        'Busy families needing coordination',
        'Individuals ready for lifestyle change'
      ],
      coreFeatures: [
        'Family Account Management - Coordinate up to 6 family members with individual preferences',
        'Smart Meal Planning - AI generates weekly plans that minimize waste and maximize nutrition',
        'Advanced Progress Tracking - Monitor how food affects your energy and goals',
        'Shopping List Optimization - Organized by store layout, never forget ingredients again',
        'Recipe Collections - Build your family\'s personalized cookbook',
        'Nutritional Goal Tracking - Visual progress toward your specific targets'
      ],
      audienceSpecificBenefits: {
        fitness: 'Periodized nutrition that matches your training phases',
        families: 'Meal coordination that respects everyone\'s preferences and schedules',
        health: 'Track how dietary changes support your wellness journey'
      },
      icon: <Users className="w-8 h-8" />,
      gradient: 'from-blue-500 to-cyan-600',
      recommended: true,
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      tagline: 'Advanced Nutrition Intelligence',
      price: { monthly: 29.99, annual: 299.99 },
      originalPrice: 39.99,
      description: 'Professional-grade nutrition optimization and health integration',
      perfectFor: [
        'Elite athletes',
        'Families with complex dietary needs',
        'Individuals with specific health considerations'
      ],
      coreFeatures: [
        'Comprehensive Safety Screening - Real-time alerts for food-medication interactions',
        'Biometric Integration - See how nutrition affects your wellness metrics',
        'Therapeutic Recipe Optimization - Meals designed for your specific dietary requirements',
        'Professional Reporting - Share progress reports with your healthcare team',
        'Advanced Analytics - Comprehensive tracking and trend analysis',
        'Evidence-Based Citations - Understand the science behind every recommendation'
      ],
      audienceSpecificBenefits: {
        fitness: 'Performance optimization based on comprehensive data analysis',
        families: 'Manage multiple family dietary requirements with coordinated guidance',
        health: 'Evidence-based nutrition support that complements your wellness plan'
      },
      icon: <Brain className="w-8 h-8" />,
      gradient: 'from-purple-500 to-indigo-600'
    }
  ];

  const successStories: SuccessStory[] = [
    {
      name: 'Sarah M.',
      audience: 'fitness',
      result: 'Lost 15 pounds of fat while gaining 8 pounds of muscle',
      quote: 'It\'s like having a nutrition expert in my pocket. The periodized nutrition approach changed everything.',
      metrics: [
        { label: 'Fat Loss', value: '15 lbs' },
        { label: 'Muscle Gain', value: '8 lbs' },
        { label: 'Time to Results', value: '4 months' }
      ],
      image: '💪'
    },
    {
      name: 'The Johnson Family',
      audience: 'families',
      result: 'Reduced grocery bill by 30% while improving nutrition',
      quote: 'Meal planning went from 3 hours of stress to 15 minutes of excitement. Our kids actually ask for vegetables now!',
      metrics: [
        { label: 'Grocery Savings', value: '30%' },
        { label: 'Planning Time Reduced', value: '90%' },
        { label: 'Family Members', value: '5' }
      ],
      image: '👨‍👩‍👧‍👦'
    },
    {
      name: 'Mark T.',
      audience: 'health',
      result: 'Improved energy levels and overall wellness in 6 months',
      quote: 'The evidence-based meal plans and health tracking gave me confidence in my nutrition choices. The results speak for themselves.',
      metrics: [
        { label: 'Energy Improvement', value: '85%' },
        { label: 'Health Score', value: '+42 pts' },
        { label: 'Consistency', value: '95%' }
      ],
      image: '❤️'
    }
  ];

  const demoSteps = [
    {
      title: 'Upload Ingredients Photo',
      description: 'Snap a photo of your available ingredients',
      icon: <Camera className="w-12 h-12 text-teal-600" />,
      visual: '📱📸'
    },
    {
      title: 'AI Food Recognition',
      description: 'AI instantly identifies all foods and quantities',
      icon: <Brain className="w-12 h-12 text-purple-600" />,
      visual: '🤖🔍'
    },
    {
      title: 'Personalized Recipe Suggestions',
      description: 'Get recipes tailored to your profile and goals',
      icon: <Sparkles className="w-12 h-12 text-blue-600" />,
      visual: '✨🍽️'
    },
    {
      title: 'Real-time Nutrition Analysis',
      description: 'See complete nutritional breakdown instantly',
      icon: <BarChart3 className="w-12 h-12 text-green-600" />,
      visual: '📊⚡'
    },
    {
      title: 'Family-Adapted Versions',
      description: 'Everyone gets their perfect version of the meal',
      icon: <Users className="w-12 h-12 text-orange-600" />,
      visual: '👨‍👩‍👧‍👦🍽️'
    }
  ];

  const handleTierSelect = (tier: 'basic' | 'enhanced' | 'premium') => {
    setActiveTier(tier);
    onTierSelect?.(tier);
  };

  const calculateSavings = (tier: SolutionTier) => {
    if (showPricing === 'annual' && tier.price.monthly > 0) {
      const monthlyCost = tier.price.monthly * 12;
      const annualCost = tier.price.annual;
      return monthlyCost - annualCost;
    }
    return 0;
  };

  const getDisplayPrice = (tier: SolutionTier) => {
    if (tier.price.monthly === 0) return 'Free';
    
    if (showPricing === 'monthly') {
      return `$${tier.price.monthly}`;
    } else {
      const monthlyEquivalent = (tier.price.annual / 12).toFixed(2);
      return `$${monthlyEquivalent}`;
    }
  };

  const getCostPerDay = (tier: SolutionTier) => {
    if (tier.price.monthly === 0) return 'Free';
    const dailyCost = tier.price.monthly / 30;
    return `$${dailyCost.toFixed(2)}/day`;
  };

  return (
    <section 
      ref={ref}
      className="relative py-20 bg-gradient-to-b from-white to-gray-50"
      aria-label="Praneya Solution Presentation"
    >
      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="w-6 h-6 text-teal-600" />
            <span className="font-semibold text-teal-800">The Solution You've Been Waiting For</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Meet Your Personal{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
              AI Nutrition Guide
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Praneya combines comprehensive nutrition databases{' '}
            <span className="font-semibold text-teal-600">(900,000+ foods)</span>{' '}
            with advanced AI to give you personalized guidance that understands your fitness goals, 
            family dynamics, and dietary requirements.
          </p>
        </motion.div>

        {/* Interactive Demo Section */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              See How It Works in 30 Seconds
            </h3>
            <p className="text-gray-600 text-lg">
              Watch Praneya transform your nutrition experience in real-time
            </p>
          </div>

          {/* Demo Steps */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            {demoSteps.map((step, index) => (
              <motion.div
                key={index}
                className={`
                  relative text-center p-6 rounded-2xl cursor-pointer transition-all duration-300
                  ${demoStep >= index 
                    ? 'bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 shadow-lg' 
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }
                `}
                onClick={() => setDemoStep(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Step Number */}
                <div className={`
                  absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${demoStep >= index 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                  }
                `}>
                  {index + 1}
                </div>

                {/* Visual Element */}
                <div className="text-4xl mb-4">
                  {step.visual}
                </div>

                {/* Icon */}
                <div className="mb-4">
                  {step.icon}
                </div>

                {/* Content */}
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-600">
                  {step.description}
                </p>

                {/* Active indicator */}
                {demoStep === index && (
                  <motion.div
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-teal-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Demo Control */}
          <div className="text-center">
            <motion.button
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300"
              onClick={() => setDemoStep((prev) => (prev + 1) % demoSteps.length)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              <span>See Interactive Demo</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Three-Tier Solution Mapping */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Pricing Toggle */}
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Choose Your Perfect Plan
            </h3>
            
            <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  showPricing === 'monthly'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setShowPricing('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  showPricing === 'annual'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setShowPricing('annual')}
              >
                Annual
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {subscriptionTiers.map((tier, index) => {
              const isSelected = activeTier === tier.id;
              const savings = calculateSavings(tier);
              
              return (
                <motion.div
                  key={tier.id}
                  className={`
                    relative bg-white rounded-3xl shadow-xl border-2 p-8 cursor-pointer transition-all duration-300
                    ${isSelected
                      ? 'border-teal-500 shadow-2xl scale-105 bg-gradient-to-br from-teal-50/50 to-cyan-50/50'
                      : tier.recommended
                      ? 'border-blue-300 shadow-lg hover:shadow-xl hover:scale-102'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg hover:scale-102'
                    }
                  `}
                  onClick={() => handleTierSelect(tier.id)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                  whileHover={{ y: -5 }}
                >
                  {/* Popular Badge */}
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Recommended Badge */}
                  {tier.recommended && (
                    <div className="absolute top-6 right-6">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Recommended
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${tier.gradient} text-white mb-4`}>
                      {tier.icon}
                    </div>
                    
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {tier.name}
                    </h4>
                    
                    <p className="text-lg font-semibold text-gray-600 mb-4">
                      {tier.tagline}
                    </p>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-4xl font-bold text-gray-900">
                          {getDisplayPrice(tier)}
                        </span>
                        {tier.price.monthly > 0 && (
                          <span className="text-lg text-gray-500">
                            /{showPricing === 'monthly' ? 'month' : 'month'}
                          </span>
                        )}
                      </div>
                      
                      {tier.originalPrice && (
                        <div className="text-sm text-gray-500 line-through mb-1">
                          ${tier.originalPrice}/month
                        </div>
                      )}
                      
                      {savings > 0 && (
                        <div className="text-sm text-green-600 font-semibold">
                          Save ${savings.toFixed(0)} annually
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500">
                        {getCostPerDay(tier)} • {tier.price.monthly === 0 ? 'Forever free' : 'Less than your daily coffee'}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                      {tier.description}
                    </p>
                  </div>

                  {/* Perfect For */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Perfect for:</h5>
                    <ul className="space-y-2">
                      {tier.perfectFor.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Core Features */}
                  <div className="mb-8">
                    <h5 className="font-semibold text-gray-900 mb-3">Core Features:</h5>
                    <ul className="space-y-3">
                      {tier.coreFeatures.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {tier.coreFeatures.length > 3 && (
                        <li className="text-sm text-gray-500 italic">
                          +{tier.coreFeatures.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    className={`
                      w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
                      ${isSelected
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                        : `bg-gradient-to-r ${tier.gradient} text-white hover:shadow-lg`
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tier.price.monthly === 0 ? 'Start Free' : 'Start 14-Day Free Trial'}
                  </motion.button>

                  {/* Free Trial Note */}
                  {tier.price.monthly > 0 && (
                    <p className="text-center text-xs text-gray-500 mt-3">
                      No credit card required • Cancel anytime
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Feature Comparison Toggle */}
          <div className="text-center mb-12">
            <motion.button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-teal-500 hover:text-teal-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <BarChart3 className="w-5 h-5" />
              <span>{showComparison ? 'Hide' : 'Show'} Detailed Feature Comparison</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real People
            </h3>
            <p className="text-xl text-gray-600">
              See how Praneya transformed lives across all three audiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.2 + (index * 0.1) }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                {/* Story Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{story.image}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {story.name}
                  </h4>
                  <p className="text-teal-600 font-semibold text-lg">
                    {story.result}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {story.metrics.map((metric, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{metric.label}</span>
                      <span className="font-bold text-gray-900">{metric.value}</span>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 italic text-center">
                  "{story.quote}"
                </blockquote>

                {/* Rating */}
                <div className="flex justify-center mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ROI Calculator Section */}
        <motion.div
          className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 md:p-12 border border-teal-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Your Investment Pays for Itself
            </h3>
            <p className="text-xl text-gray-600">
              See how much you'll save with smarter nutrition decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Grocery Savings */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">$200+</h4>
              <p className="text-gray-600">Monthly savings on grocery waste and impulse purchases</p>
            </div>

            {/* Time Savings */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">15 Hours</h4>
              <p className="text-gray-600">Weekly time saved on meal planning and decision-making</p>
            </div>

            {/* Health ROI */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Priceless</h4>
              <p className="text-gray-600">Long-term health benefits and improved quality of life</p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <motion.button
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start Your Transformation Today</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <p className="text-sm text-gray-600 mt-3">
              Join 50,000+ people who've already transformed their nutrition
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { SolutionPresentationSection }; 