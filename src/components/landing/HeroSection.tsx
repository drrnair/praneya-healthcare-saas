/**
 * Praneya Landing Page Hero Section
 * Multi-audience targeting component with AI-powered nutrition focus
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { trackConversion, initializeABTest } from '@/lib/analytics/conversion-tracking';
import { AudienceValueCard } from './AudienceValueCard';
import { TrustIndicators } from './TrustIndicators';
import { HeroBackground } from './HeroBackground';
import { HeroAIImage } from '@/components/images/AIGeneratedImages';
import { AnimatedButton } from '@/components/animations/MicroInteractions';
import { 
  Dumbbell, 
  Calendar, 
  Heart, 
  Users, 
  Shield, 
  Award,
  DollarSign
} from 'lucide-react';

// TypeScript interfaces
interface HeroSectionProps {
  variant?: 'A' | 'B' | 'C';
  userId?: string;
  referralSource?: string;
}

interface AudienceCard {
  id: string;
  audience: 'fitness' | 'family' | 'health';
  icon: React.ReactNode;
  headline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  features: string[];
  color: string;
}

interface TrustIndicator {
  id: string;
  icon: React.ReactNode;
  text: string;
  metric?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  variant = 'A', 
  userId,
  referralSource 
}) => {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInViewport = useInView(ref, { once: true });

  // A/B Test Headlines
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

  // Audience-specific value propositions
  const audienceCards: AudienceCard[] = [
    {
      id: 'fitness',
      audience: 'fitness',
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
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 'family',
      audience: 'family',
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
      color: "from-green-500 to-emerald-600"
    },
    {
      id: 'health',
      audience: 'health',
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
      color: "from-orange-500 to-amber-600"
    }
  ];

  const trustIndicators: TrustIndicator[] = [
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

  // Initialize A/B testing
  useEffect(() => {
    initializeABTest('hero-section', variant, userId);
  }, [variant, userId]);

  // Animation controls
  useEffect(() => {
    if (isInViewport) {
      setIsVisible(true);
      controls.start('visible');
    }
  }, [isInViewport, controls]);

  // Handle CTA clicks with conversion tracking
  const handleCTAClick = (audience: string, ctaText: string) => {
    trackConversion({
      event: 'hero_cta_click',
      audience,
      ctaText,
      variant,
      userId: userId || 'anonymous',
      referralSource: referralSource || 'direct',
      timestamp: new Date(),
      section: 'hero'
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as any
      }
    }
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut" as any
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 overflow-hidden"
      aria-label="Praneya Hero Section"
    >
      {/* Background Elements */}
      <HeroBackground />
      
      {/* Main Hero Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="relative z-10 container mx-auto px-4 py-16 lg:py-24"
      >
        {/* Primary Headline Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center max-w-5xl mx-auto mb-16"
        >
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            variants={itemVariants}
          >
            <span className="block">
              {headlines[variant]}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto"
            variants={itemVariants}
          >
            {subheadlines[variant]}
          </motion.p>

          {/* Hero Image */}
          <motion.div
            variants={itemVariants}
            className="relative w-full max-w-4xl mx-auto mb-12"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <HeroAIImage
                imageKey="heroFamilyCooking"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
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
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {audienceCards.map((card, index) => (
            <motion.div
              key={card.id}
              variants={cardHoverVariants}
              whileHover="hover"
              className="relative"
              onHoverStart={() => setActiveCard(card.id)}
              onHoverEnd={() => setActiveCard(null)}
            >
              <AudienceValueCard
                {...card}
                isActive={activeCard === card.id}
                onCTAClick={handleCTAClick}
                index={index}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div variants={itemVariants}>
          <TrustIndicators indicators={trustIndicators} />
        </motion.div>

        {/* Secondary CTA Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center mt-16"
        >
          <motion.div
            className="inline-flex flex-col sm:flex-row gap-4 items-center justify-center"
            variants={itemVariants}
          >
            <Link
              href="/signup?source=hero-primary"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/50"
              onClick={() => handleCTAClick('general', 'Get Started Free')}
              aria-label="Sign up for Praneya nutrition guidance"
            >
              Get Started Free
              <motion.span 
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
            
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:border-teal-500 hover:text-teal-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-500/50"
              onClick={() => handleCTAClick('general', 'Watch Demo')}
              aria-label="Watch Praneya product demonstration"
            >
              Watch Demo
            </Link>
          </motion.div>
          
          <motion.p 
            className="text-sm text-gray-500 mt-4"
            variants={itemVariants}
          >
            No credit card required • 7-day free trial • Cancel anytime
          </motion.p>
        </motion.div>
      </motion.div>

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

export default HeroSection; 