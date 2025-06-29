/**
 * CTA Manager - Dynamic Call-to-Action System
 * Audience-adaptive CTAs with A/B testing and conversion tracking
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  Play,
  Calculator,
  Users,
  Heart,
  Dumbbell,
  Clock,
  Shield,
  Star,
  Zap,
  Target,
  TrendingUp,
  CheckCircle,
  Gift,
  Timer,
  Sparkles,
  Phone,
  MessageSquare,
  Eye,
  Download
} from 'lucide-react';

interface CTAConfig {
  id: string;
  audience: 'unknown' | 'fitness' | 'families' | 'health';
  type: 'primary' | 'secondary' | 'micro';
  text: string;
  subtext?: string;
  icon?: React.ReactNode;
  color: string;
  urgency?: string;
  guarantee?: string;
  onClick: () => void;
  variant?: 'default' | 'urgent' | 'social' | 'risk-free';
}

interface CTAManagerProps {
  placement: 'hero' | 'problem' | 'solution' | 'social-proof' | 'pricing' | 'final';
  audience: 'unknown' | 'fitness' | 'families' | 'health';
  userBehavior?: {
    scrollDepth: number;
    timeOnPage: number;
    engagementScore: number;
  };
  onCTAClick: (ctaId: string, audience: string, placement: string) => void;
  onMicroConversion?: (type: string, data: any) => void;
}

interface ABTestVariant {
  id: string;
  weight: number;
  config: Partial<CTAConfig>;
}

const CTAManager: React.FC<CTAManagerProps> = ({
  placement,
  audience,
  userBehavior,
  onCTAClick,
  onMicroConversion
}) => {
  const [activeVariant, setActiveVariant] = useState<string>('control');
  const [showUrgency, setShowUrgency] = useState(false);
  const [userCount, setUserCount] = useState(2847);
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours in seconds
  const [isVisible, setIsVisible] = useState(false);
  
  const ref = useRef<HTMLDivElement>(null);

  // Simulate real-time user counter
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show urgency based on user behavior
  useEffect(() => {
    if (userBehavior?.timeOnPage && userBehavior.timeOnPage > 30000) {
      setShowUrgency(true);
    }
  }, [userBehavior]);

  // A/B Test Variants
  const abTestVariants: Record<string, ABTestVariant[]> = {
    hero: [
      {
        id: 'control',
        weight: 50,
        config: {
          text: 'Start Free Trial',
          color: 'from-teal-500 to-cyan-600'
        }
      },
      {
        id: 'transformation',
        weight: 25,
        config: {
          text: 'Begin My Transformation',
          color: 'from-orange-500 to-amber-600'
        }
      },
      {
        id: 'personalized',
        weight: 25,
        config: {
          text: 'Get Personalized Plan',
          color: 'from-green-500 to-emerald-600'
        }
      }
    ]
  };

  // Base CTA configurations for each audience and placement
  const ctaConfigs: Record<string, Record<string, CTAConfig[]>> = {
    unknown: {
      hero: [
        {
          id: 'discover-path',
          audience: 'unknown',
          type: 'primary',
          text: 'Discover Your Nutrition Path',
          subtext: 'Free 2-minute assessment',
          icon: <Target className="w-5 h-5" />,
          color: 'from-teal-500 to-cyan-600',
          onClick: () => handleCTAClick('discover-path')
        },
        {
          id: 'watch-demo',
          audience: 'unknown',
          type: 'secondary',
          text: 'Watch Demo',
          icon: <Play className="w-4 h-4" />,
          color: 'from-gray-600 to-gray-700',
          onClick: () => handleCTAClick('watch-demo')
        }
      ],
      final: [
        {
          id: 'start-journey',
          audience: 'unknown',
          type: 'primary',
          text: 'Start Your Nutrition Journey Today',
          subtext: 'Join thousands of successful users',
          icon: <ArrowRight className="w-5 h-5" />,
          color: 'from-teal-500 to-cyan-600',
          guarantee: '30-day money-back guarantee',
          onClick: () => handleCTAClick('start-journey')
        }
      ]
    },
    fitness: {
      hero: [
        {
          id: 'start-transformation',
          audience: 'fitness',
          type: 'primary',
          text: 'Start My Transformation',
          subtext: 'Precision nutrition for peak performance',
          icon: <Dumbbell className="w-5 h-5" />,
          color: 'from-blue-500 to-cyan-600',
          onClick: () => handleCTAClick('start-transformation')
        },
        {
          id: 'macro-calculator',
          audience: 'fitness',
          type: 'secondary',
          text: 'See My Macro Calculator',
          icon: <Calculator className="w-4 h-4" />,
          color: 'from-gray-600 to-gray-700',
          onClick: () => handleCTAClick('macro-calculator')
        }
      ],
      problem: [
        {
          id: 'solve-fitness-problems',
          audience: 'fitness',
          type: 'primary',
          text: 'Optimize My Performance',
          subtext: 'Stop guessing, start achieving',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'from-blue-500 to-cyan-600',
          onClick: () => handleCTAClick('solve-fitness-problems')
        }
      ]
    },
    families: {
      hero: [
        {
          id: 'plan-meals',
          audience: 'families',
          type: 'primary',
          text: 'Plan This Week\'s Meals',
          subtext: 'Save 8+ hours on meal planning',
          icon: <Users className="w-5 h-5" />,
          color: 'from-green-500 to-emerald-600',
          onClick: () => handleCTAClick('plan-meals')
        },
        {
          id: 'family-savings',
          audience: 'families',
          type: 'secondary',
          text: 'Calculate Family Savings',
          icon: <Calculator className="w-4 h-4" />,
          color: 'from-gray-600 to-gray-700',
          onClick: () => handleCTAClick('family-savings')
        }
      ],
      problem: [
        {
          id: 'end-meal-chaos',
          audience: 'families',
          type: 'primary',
          text: 'End the Meal Planning Chaos',
          subtext: 'Happy families, healthy meals',
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'from-green-500 to-emerald-600',
          onClick: () => handleCTAClick('end-meal-chaos')
        }
      ]
    },
    health: {
      hero: [
        {
          id: 'improve-nutrition',
          audience: 'health',
          type: 'primary',
          text: 'Improve My Nutrition Today',
          subtext: 'Evidence-based approach to wellness',
          icon: <Heart className="w-5 h-5" />,
          color: 'from-orange-500 to-amber-600',
          onClick: () => handleCTAClick('improve-nutrition')
        },
        {
          id: 'check-interactions',
          audience: 'health',
          type: 'secondary',
          text: 'Check Food Interactions',
          icon: <Shield className="w-4 h-4" />,
          color: 'from-gray-600 to-gray-700',
          onClick: () => handleCTAClick('check-interactions')
        }
      ],
      problem: [
        {
          id: 'evidence-based-solution',
          audience: 'health',
          type: 'primary',
          text: 'Get Evidence-Based Guidance',
          subtext: 'Trusted by healthcare professionals',
          icon: <Star className="w-5 h-5" />,
          color: 'from-orange-500 to-amber-600',
          onClick: () => handleCTAClick('evidence-based-solution')
        }
      ]
    }
  };

  const handleCTAClick = (ctaId: string) => {
    onCTAClick(ctaId, audience, placement);
    
    // Track micro-conversions
    if (onMicroConversion) {
      onMicroConversion('cta_click', {
        ctaId,
        audience,
        placement,
        variant: activeVariant,
        userBehavior
      });
    }
  };

  const getCurrentCTAs = (): CTAConfig[] => {
    const audienceCTAs = ctaConfigs[audience]?.[placement] || ctaConfigs['unknown']?.[placement] || [];
    
    // Apply A/B test variant if available
    const variants = abTestVariants[placement];
    if (variants && activeVariant !== 'control') {
      const variant = variants.find(v => v.id === activeVariant);
      if (variant) {
        return audienceCTAs.map(cta => ({
          ...cta,
          ...variant.config
        }));
      }
    }
    
    return audienceCTAs;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentCTAs = getCurrentCTAs();
  const primaryCTA = currentCTAs.find(cta => cta.type === 'primary');
  const secondaryCTAs = currentCTAs.filter(cta => cta.type === 'secondary');
  const microCTAs = currentCTAs.filter(cta => cta.type === 'micro');

  return (
    <div ref={ref} className="relative">
      {/* Primary CTA */}
      {primaryCTA && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Urgency Banner */}
          {showUrgency && placement === 'hero' && (
            <motion.div
              className="mb-4 p-3 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 text-orange-800">
                <Timer className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Limited Time: 50% off first month expires in {formatTime(timeLeft)}
                </span>
              </div>
            </motion.div>
          )}

          {/* Primary CTA Button */}
          <motion.button
            onClick={primaryCTA.onClick}
            className={`
              group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r ${primaryCTA.color} 
              text-white font-semibold text-lg rounded-xl shadow-lg
              transform hover:scale-105 hover:shadow-xl transition-all duration-300
              focus:outline-none focus:ring-4 focus:ring-teal-500/20
            `}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <div className="flex items-center justify-center gap-3">
              {primaryCTA.icon}
              <div className="text-center">
                <div>{primaryCTA.text}</div>
                {primaryCTA.subtext && (
                  <div className="text-sm opacity-90">{primaryCTA.subtext}</div>
                )}
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Sparkle animation */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="absolute top-2 right-2 w-4 h-4 text-white animate-pulse" />
              <Sparkles className="absolute bottom-2 left-2 w-3 h-3 text-white animate-pulse delay-300" />
            </div>
          </motion.button>

          {/* Trust indicators below primary CTA */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
            {primaryCTA.guarantee && (
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>{primaryCTA.guarantee}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span>No credit card required</span>
            </div>
            {placement === 'hero' && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span>{userCount.toLocaleString()}+ active users</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Secondary CTAs */}
      {secondaryCTAs.length > 0 && (
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {secondaryCTAs.map((cta, index) => (
            <motion.button
              key={cta.id}
              onClick={cta.onClick}
              className={`
                flex items-center justify-center gap-2 px-6 py-3 
                bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg
                hover:border-gray-400 hover:bg-gray-50 transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-gray-500/20
              `}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              {cta.icon}
              <span>{cta.text}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Micro CTAs */}
      {microCTAs.length > 0 && (
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {microCTAs.map((cta, index) => (
            <motion.button
              key={cta.id}
              onClick={cta.onClick}
              className="
                flex items-center gap-2 px-4 py-2 text-sm text-gray-600 
                hover:text-gray-900 underline hover:no-underline transition-all duration-300
              "
              whileHover={{ scale: 1.05 }}
            >
              {cta.icon}
              <span>{cta.text}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Social Proof Floating Bar (for certain placements) */}
      {placement === 'hero' && audience !== 'unknown' && (
        <motion.div
          className="mt-8 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-800">Live Activity</span>
            </div>
            <p className="text-teal-700">
              <motion.span
                key={userCount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="font-semibold"
              >
                {Math.floor(userCount / 100)}
              </motion.span> users started their nutrition journey in the last hour
            </p>
          </div>
        </motion.div>
      )}

      {/* Mobile-Specific Elements */}
      <div className="block sm:hidden mt-6">
        {/* Mobile CTA Bar */}
        <div className="flex gap-2 text-xs text-gray-500 justify-center">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span>Tap to start</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>Get instant help</span>
          </div>
        </div>
      </div>

      {/* A/B Test Debug (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
          <div>Audience: {audience}</div>
          <div>Placement: {placement}</div>
          <div>Variant: {activeVariant}</div>
          <div>Scroll: {userBehavior?.scrollDepth}%</div>
          <div>Time: {Math.floor((userBehavior?.timeOnPage || 0) / 1000)}s</div>
        </div>
      )}
    </div>
  );
};

export { CTAManager };
export type { CTAConfig, CTAManagerProps }; 