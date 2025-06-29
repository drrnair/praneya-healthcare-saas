/**
 * Simplified Praneya Landing Page Hero Section
 * Multi-audience targeting component with simplified animations
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Dumbbell, 
  Calendar, 
  Heart, 
  Users, 
  Shield, 
  Award,
  DollarSign,
  Check,
  ArrowRight
} from 'lucide-react';

interface HeroSectionProps {
  variant?: 'A' | 'B' | 'C';
  userId?: string;
  referralSource?: string;
}

const SimplifiedHeroSection: React.FC<HeroSectionProps> = ({ 
  variant = 'A', 
  userId,
  referralSource 
}) => {
  const headlines = {
    A: "Stop Struggling with Complex Nutrition Decisions",
    B: "Transform Your Health with AI-Powered Nutrition",
    C: "End Nutrition Confusion Once and For All"
  };

  const subheadlines = {
    A: "Transform from overwhelmed to empowered with AI-powered nutrition guidance that understands your unique fitness goals, family needs, and dietary requirements.",
    B: "Get personalized nutrition plans that adapt to your lifestyle, whether you're training for performance, managing family meals, or supporting your wellness journey.",
    C: "Join thousands who've simplified their nutrition with intelligent meal planning that works for every family member and fitness goal."
  };

  const audienceCards = [
    {
      id: 'fitness',
      icon: <Dumbbell className="w-8 h-8" />,
      headline: "Optimize Your Performance",
      description: "Whether you're cutting, bulking, or maintaining, get precision nutrition plans that align with your training goals. Track macros, time nutrients around workouts, and achieve your physique goals faster.",
      ctaText: "Start My Fitness Journey",
      ctaLink: "/signup?audience=fitness",
      features: [
        "Precision macro tracking",
        "Workout nutrition timing",
        "Performance optimization",
        "Body composition goals"
      ],
      colorScheme: {
        gradient: 'from-blue-500 to-cyan-600',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        border: 'border-blue-200',
        ctaBg: 'bg-blue-600 hover:bg-blue-700',
        accent: 'text-blue-600'
      }
    },
    {
      id: 'family',
      icon: <Calendar className="w-8 h-8" />,
      headline: "Simplify Family Nutrition",
      description: "End the daily struggle of 'what's for dinner?' Get AI-generated meal plans that work for everyone's dietary needs, with smart shopping lists and prep-ahead strategies.",
      ctaText: "Plan Family Meals",
      ctaLink: "/signup?audience=family",
      features: [
        "Family meal planning",
        "Smart shopping lists",
        "Dietary accommodations",
        "Prep-ahead strategies"
      ],
      colorScheme: {
        gradient: 'from-green-500 to-emerald-600',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        border: 'border-green-200',
        ctaBg: 'bg-green-600 hover:bg-green-700',
        accent: 'text-green-600'
      }
    },
    {
      id: 'health',
      icon: <Heart className="w-8 h-8" />,
      headline: "Support Your Wellness Journey",
      description: "Take control of your nutrition with evidence-based guidance. Monitor how food choices align with your wellness goals and dietary requirements.",
      ctaText: "Improve My Nutrition",
      ctaLink: "/signup?audience=health",
      features: [
        "Evidence-based guidance",
        "Wellness goal tracking",
        "Dietary requirement support",
        "Health outcome monitoring"
      ],
      colorScheme: {
        gradient: 'from-orange-500 to-amber-600',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        border: 'border-orange-200',
        ctaBg: 'bg-orange-600 hover:bg-orange-700',
        accent: 'text-orange-600'
      }
    }
  ];

  const trustIndicators = [
    {
      id: 'users',
      icon: <Users className="w-6 h-6" />,
      text: "Trusted by 10,000+ families",
      metric: "10,000+"
    },
    {
      id: 'privacy',
      icon: <Shield className="w-6 h-6" />,
      text: "Privacy-focused data protection"
    },
    {
      id: 'evidence',
      icon: <Award className="w-6 h-6" />,
      text: "Evidence-based nutrition recommendations"
    },
    {
      id: 'pricing',
      icon: <DollarSign className="w-6 h-6" />,
      text: "Family plans starting at $12.99/month",
      metric: "$12.99"
    }
  ];

  const handleCTAClick = (audience: string, ctaText: string) => {
    console.log('CTA clicked:', { audience, ctaText, variant, userId, referralSource });
  };

  return (
    <section 
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 overflow-hidden"
      aria-label="Praneya Hero Section"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-green-500/5" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/3 to-orange-500/5" />
        
        {/* Animated shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-xl"
          animate={{ y: [-20, 20, -20], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-lg"
          animate={{ y: [20, -20, 20], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      {/* Main Hero Container */}
      <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
        {/* Primary Headline Section */}
        <motion.div 
          className="text-center max-w-5xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {headlines[variant]}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
            {subheadlines[variant]}
          </p>

          {/* Hero Image Placeholder */}
          <motion.div
            className="relative w-full max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-teal-100 to-green-100 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
                <p className="text-gray-600 font-medium">
                  Diverse families cooking healthy meals together
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  [Hero image placeholder - Add actual image in production]
                </p>
              </div>
              
              {/* Floating AI Indicator */}
              <motion.div
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-sm font-semibold text-teal-600">
                  🤖 AI-Powered
                </span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Audience Value Proposition Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {audienceCards.map((card, index) => (
            <motion.div
              key={card.id}
              className={`
                relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300
                border-gray-100 hover:border-gray-200 hover:shadow-xl hover:-translate-y-2
                group overflow-hidden
              `}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              role="article"
            >
              {/* Gradient Background Accent */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.colorScheme.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Card Content */}
              <div className="relative p-6 lg:p-8">
                {/* Icon Header */}
                <div className="flex items-center mb-6">
                  <div className={`
                    flex items-center justify-center w-16 h-16 rounded-2xl
                    ${card.colorScheme.iconBg} ${card.colorScheme.iconColor}
                    group-hover:shadow-lg transition-shadow duration-300
                  `}>
                    {card.icon}
                  </div>
                  
                  <div className="ml-4">
                    <span className={`
                      inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                      ${card.colorScheme.iconBg} ${card.colorScheme.accent}
                    `}>
                      {card.id === 'fitness' && 'For Athletes'}
                      {card.id === 'family' && 'For Families'}
                      {card.id === 'health' && 'For Wellness'}
                    </span>
                  </div>
                </div>

                {/* Headline */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                  {card.headline}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {card.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {card.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700">
                      <div className={`
                        flex items-center justify-center w-5 h-5 rounded-full mr-3 flex-shrink-0
                        ${card.colorScheme.iconBg}
                      `}>
                        <Check className={`w-3 h-3 ${card.colorScheme.iconColor}`} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href={card.ctaLink}
                  className={`
                    inline-flex items-center justify-center w-full px-6 py-4 
                    text-white font-semibold rounded-xl transition-all duration-300
                    ${card.colorScheme.ctaBg}
                    transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500/50
                    shadow-lg hover:shadow-xl
                  `}
                  onClick={() => handleCTAClick(card.id, card.ctaText)}
                >
                  <span>{card.ctaText}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>

                {/* Social Proof Badge */}
                <div className="mt-4 text-center">
                  <span className="text-xs text-gray-500">
                    {card.id === 'fitness' && 'Trusted by 5,000+ athletes'}
                    {card.id === 'family' && 'Used by 3,000+ families'}
                    {card.id === 'health' && 'Supporting 2,000+ wellness journeys'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Trusted by Thousands
              </h2>
              <p className="text-sm text-gray-600">
                Join a community of health-conscious individuals and families
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustIndicators.map((indicator, index) => (
                <div
                  key={indicator.id}
                  className="group flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/50 transition-colors duration-300"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-3 group-hover:bg-teal-200 transition-colors duration-300">
                    {indicator.icon}
                  </div>

                  {indicator.metric && (
                    <div className="mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {indicator.metric}
                      </span>
                    </div>
                  )}

                  <p className="text-sm font-medium text-gray-700 leading-tight">
                    {indicator.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional Trust Elements */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded-full" />
                  <span>Registered Dietitian Approved</span>
                </div>
              </div>
            </div>

            {/* Money-back Guarantee */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
                <span className="text-sm font-medium text-green-700">
                  30-day money-back guarantee
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Secondary CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/signup?source=hero-primary"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/50"
              onClick={() => handleCTAClick('general', 'Get Started Free')}
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-teal-500 hover:text-teal-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/50"
              onClick={() => handleCTAClick('general', 'Watch Demo')}
            >
              Watch Demo
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>

      {/* Accessibility Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-teal-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
    </section>
  );
};

export default SimplifiedHeroSection; 