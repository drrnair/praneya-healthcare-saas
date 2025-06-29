/**
 * Pricing Section - "Choose Your Path to Better Nutrition"
 * Conversion-optimized pricing with audience-specific value propositions
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Check,
  X,
  Star,
  Crown,
  Zap,
  Users,
  Shield,
  Calculator,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Heart,
  Dumbbell,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Smartphone,
  ArrowRight,
  Gift,
  Timer,
  UserCheck,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: {
    monthly: number;
    annual: number;
    family: {
      monthly: number;
      annual: number;
    };
  };
  popular?: boolean;
  badge?: string;
  color: string;
  features: {
    basic: string[];
    audienceSpecific: {
      fitness: string[];
      families: string[];
      health: string[];
    };
  };
  socialProof: string[];
  urgency?: string;
  guarantee?: string;
  cta: string;
}

interface ValueCalculator {
  type: 'fitness' | 'family' | 'health';
  title: string;
  question: string;
  placeholder: string;
  unit: string;
  calculation: (input: number) => {
    savings: number;
    description: string;
  };
}

interface FAQ {
  question: string;
  answer: string;
  category: 'pricing' | 'features' | 'guarantee';
}

interface PricingSectionProps {
  onTierSelect?: (tier: string, billing: 'monthly' | 'annual', plan: 'individual' | 'family') => void;
  onCalculatorUse?: (type: string, value: number) => void;
}

interface PricingFeature {
  text: string;
  included: boolean;
  tooltip?: string;
  premium?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  originalMonthlyPrice?: number;
  originalAnnualPrice?: number;
  features: PricingFeature[];
  ctaText: string;
  ctaSecondary?: string;
  popular?: boolean;
  colorScheme: 'basic' | 'enhanced' | 'premium';
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  badge?: string;
  urgency?: string;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

interface AnimatedPriceProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

interface PricingToggleProps {
  isAnnual: boolean;
  onToggle: (isAnnual: boolean) => void;
  savingsPercentage: number;
}

interface PricingCardProps {
  plan: PricingPlan;
  isAnnual: boolean;
  isPopular?: boolean;
  index: number;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          >
            <div className="bg-neutral-900 text-white text-sm px-3 py-2 rounded-lg shadow-xl max-w-xs">
              {content}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AnimatedPrice: React.FC<AnimatedPriceProps> = ({
  value,
  duration = 0.8,
  prefix = '$',
  suffix = '',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true);
      
      let startTime: number;
      const startValue = displayValue;
      const endValue = value;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Smooth easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setDisplayValue(Math.round(currentValue));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, duration, displayValue]);

  return (
    <span className={cn('inline-block', isAnimating && 'animate-pulse', className)}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

const PricingToggle: React.FC<PricingToggleProps> = ({ isAnnual, onToggle, savingsPercentage }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-12">
      <span className={cn(
        "text-lg font-medium transition-colors duration-200",
        !isAnnual ? "text-neutral-900" : "text-neutral-500"
      )}>
        Monthly
      </span>
      
      <div className="relative">
        <motion.button
          onClick={() => onToggle(!isAnnual)}
          className="relative w-16 h-8 bg-neutral-200 rounded-full focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-colors duration-300"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute top-1 w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg"
            animate={{
              x: isAnnual ? 32 : 4,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          />
        </motion.button>
        
        {/* Savings Badge */}
        <AnimatePresence>
          {isAnnual && (
            <motion.div
              initial={{ opacity: 0, scale: 0, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, y: 10 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            >
              <div className="bg-gradient-to-r from-success-500 to-success-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                Save {savingsPercentage}%
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <span className={cn(
        "text-lg font-medium transition-colors duration-200",
        isAnnual ? "text-neutral-900" : "text-neutral-500"
      )}>
        Annual
      </span>
    </div>
  );
};

const PricingCard: React.FC<PricingCardProps> = ({ plan, isAnnual, isPopular, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const currentPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
  const originalPrice = isAnnual ? plan.originalAnnualPrice : plan.originalMonthlyPrice;

  const colorSchemes = {
    basic: {
      gradient: 'from-neutral-50 to-neutral-100',
      border: 'border-neutral-200',
      accent: 'text-primary-600',
      button: 'bg-neutral-900 hover:bg-neutral-800 text-white',
      shadow: 'shadow-lg hover:shadow-xl'
    },
    enhanced: {
      gradient: 'from-primary-50 to-secondary-50',
      border: 'border-primary-200',
      accent: 'text-primary-600',
      button: 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white',
      shadow: 'shadow-xl hover:shadow-2xl'
    },
    premium: {
      gradient: 'from-primary-100 to-warning-50',
      border: 'border-primary-300',
      accent: 'text-primary-700',
      button: 'bg-gradient-to-r from-primary-600 to-primary-800 hover:from-primary-700 hover:to-primary-900 text-white',
      shadow: 'shadow-2xl hover:shadow-3xl'
    }
  };

  const scheme = colorSchemes[plan.colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative bg-white rounded-3xl p-8 border-2 transition-all duration-300",
        scheme.gradient,
        scheme.border,
        scheme.shadow,
        isPopular && "ring-4 ring-primary-500/20 scale-105"
      )}
      style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg"
          >
            Most Popular
          </motion.div>
        </motion.div>
      )}

      {/* Badge */}
      {plan.badge && (
        <div className="absolute top-4 right-4">
          <div className="bg-success-100 text-success-700 px-3 py-1 rounded-full text-xs font-bold border border-success-200">
            {plan.badge}
          </div>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
        <p className="text-neutral-600 mb-6">{plan.tagline}</p>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline justify-center space-x-2">
            <motion.span
              key={currentPrice}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={cn("text-5xl font-extrabold", scheme.accent)}
            >
              <AnimatedPrice value={currentPrice} />
            </motion.span>
            <span className="text-xl text-neutral-600 font-medium">
              /{isAnnual ? 'year' : 'month'}
            </span>
          </div>

          {/* Original Price */}
          {originalPrice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-2 mt-2"
            >
              <span className="text-lg text-neutral-400 line-through">
                ${originalPrice}/{isAnnual ? 'year' : 'month'}
              </span>
              <span className="bg-success-100 text-success-700 px-2 py-1 rounded text-xs font-bold">
                {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}% OFF
              </span>
            </motion.div>
          )}

          {/* Per User Calculation */}
          {isAnnual && (
            <p className="text-sm text-neutral-500 mt-2">
              ${Math.round(currentPrice / 12)}/month billed annually
            </p>
          )}
        </div>

        {/* Urgency */}
        {plan.urgency && (
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-warning-100 text-warning-800 px-4 py-2 rounded-lg text-sm font-medium border border-warning-200 mb-4"
          >
            ⚡ {plan.urgency}
          </motion.div>
        )}
      </div>

      {/* Features List */}
      <div className="mb-8">
        <div className="space-y-4">
          {plan.features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
              className="flex items-start space-x-3"
            >
              <div className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                feature.included
                  ? "bg-success-500 text-white"
                  : "bg-neutral-300 text-neutral-500"
              )}>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + idx * 0.1, type: "spring" }}
                  className="text-xs font-bold"
                >
                  {feature.included ? '✓' : '×'}
                </motion.span>
              </div>
              
              <div className="flex-1">
                {feature.tooltip ? (
                  <Tooltip content={feature.tooltip}>
                    <span className={cn(
                      "text-sm",
                      feature.included ? "text-neutral-700" : "text-neutral-400",
                      feature.premium && "font-semibold text-primary-700",
                      "border-b border-dashed border-neutral-300 cursor-help"
                    )}>
                      {feature.text}
                    </span>
                  </Tooltip>
                ) : (
                  <span className={cn(
                    "text-sm",
                    feature.included ? "text-neutral-700" : "text-neutral-400",
                    feature.premium && "font-semibold text-primary-700"
                  )}>
                    {feature.text}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200",
            scheme.button,
            "shadow-lg hover:shadow-xl"
          )}
        >
          {plan.ctaText}
        </motion.button>

        {plan.ctaSecondary && (
          <button className="w-full py-3 px-6 border-2 border-neutral-300 text-neutral-700 rounded-xl font-medium hover:bg-neutral-50 transition-colors duration-200">
            {plan.ctaSecondary}
          </button>
        )}

        {/* Trust Indicators */}
        <div className="text-center space-y-2">
          <p className="text-xs text-neutral-500">
            🔒 No credit card required • 30-day money-back guarantee
          </p>
          <div className="flex justify-center space-x-4">
            <span className="text-xs text-neutral-400">✅ HIPAA Compliant</span>
            <span className="text-xs text-neutral-400">🛡️ SOC 2 Certified</span>
          </div>
        </div>
      </div>

      {/* Testimonial */}
      {plan.testimonial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 p-4 bg-white/80 rounded-xl border border-neutral-200"
        >
          <p className="text-sm text-neutral-600 italic mb-2">
            "{plan.testimonial.text}"
          </p>
          <div className="text-xs text-neutral-500">
            <strong>{plan.testimonial.author}</strong>, {plan.testimonial.role}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const PricingSection: React.FC<PricingSectionProps> = ({
  onTierSelect,
  onCalculatorUse
}) => {
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'fitness' | 'families' | 'health'>('all');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [planType, setPlanType] = useState<'individual' | 'family'>('individual');
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const [calculatorValues, setCalculatorValues] = useState<Record<string, number>>({});
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const [socialProofCount, setSocialProofCount] = useState(1247);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const controls = useAnimation();

  const pricingTiers: PricingTier[] = [
    {
      id: 'basic',
      name: 'Start Your Journey',
      tagline: 'Perfect for exploring AI-powered nutrition without commitment',
      price: {
        monthly: 0,
        annual: 0,
        family: {
          monthly: 0,
          annual: 0
        }
      },
      badge: 'Popular for Beginners',
      color: 'from-green-500 to-emerald-600',
      features: {
        basic: [
          'Generate unlimited healthy recipes from your ingredients',
          'Instantly recognize food with your camera',
          'Track 28 essential nutrients automatically',
          'Protect your family with allergy screening',
          'Access basic meal logging and planning'
        ],
        audienceSpecific: {
          fitness: ['Calculate optimal macros for your goals'],
          families: ['Kid-friendly recipe adaptations'],
          health: ['Safe food choices with dietary awareness']
        }
      },
      socialProof: [
        'Join 25,000+ free users',
        'Upgrade anytime as your needs grow',
        'Risk-free way to experience AI nutrition'
      ],
      cta: 'Start Free Today'
    },
    {
      id: 'enhanced',
      name: 'Transform Your Routine',
      tagline: 'Everything you need to master family nutrition and achieve your wellness goals',
      price: {
        monthly: 12.99,
        annual: 124.99,
        family: {
          monthly: 14.99,
          annual: 143.99
        }
      },
      popular: true,
      badge: 'Most Popular',
      color: 'from-teal-500 to-cyan-600',
      features: {
        basic: [
          'Everything in Basic, plus:',
          'Coordinate nutrition for up to 6 family members',
          'AI-generated weekly meal plans that minimize waste',
          'Advanced progress tracking with insights',
          'Smart shopping lists organized by store layout',
          'Build your family\'s personalized recipe collection',
          'Track nutritional goals with visual progress',
          'Priority customer support'
        ],
        audienceSpecific: {
          fitness: ['Periodized nutrition matching your training cycles'],
          families: ['Meal coordination respecting everyone\'s preferences'],
          health: ['Monitor how dietary changes support your wellness']
        }
      },
      socialProof: [
        'Chosen by 15,000+ families',
        'Average user saves 8 hours/week on meal planning',
        '94% of users see improved nutrition within 30 days'
      ],
      urgency: 'Limited time: First month only $1',
      guarantee: '14-Day Free Trial',
      cta: 'Start 14-Day Free Trial'
    },
    {
      id: 'premium',
      name: 'Advanced Intelligence',
      tagline: 'Advanced nutrition intelligence that works with your wellness team',
      price: {
        monthly: 29.99,
        annual: 287.99,
        family: {
          monthly: 39.99,
          annual: 383.99
        }
      },
      badge: 'Advanced Features',
      color: 'from-amber-500 to-orange-600',
      features: {
        basic: [
          'Everything in Enhanced, plus:',
          'Real-time food-medication interaction screening',
          'Biometric integration and trend analysis',
          'Therapeutic recipe optimization for specific needs',
          'Professional progress reports for your healthcare team',
          'Advanced analytics and comprehensive tracking',
          'Evidence-based citations for all recommendations',
          'Priority access to nutrition specialist consultations',
          'Dedicated advanced support team'
        ],
        audienceSpecific: {
          fitness: ['Performance optimization based on comprehensive data'],
          families: ['Manage multiple family dietary requirements'],
          health: ['Evidence-based nutrition support integration']
        }
      },
      socialProof: [
        'Built with evidence-based nutrition science',
        'Integrated with wellness tracking systems',
        'Trusted by nutrition professionals'
      ],
      guarantee: '30-Day Money-Back Guarantee',
      cta: 'Start Premium Trial'
    }
  ];

  const valueCalculators: ValueCalculator[] = [
    {
      type: 'fitness',
      title: 'Fitness ROI Calculator',
      question: 'How much do you spend on supplements and meal prep monthly?',
      placeholder: 'Enter monthly amount',
      unit: '$',
      calculation: (input: number) => ({
        savings: Math.max(0, input - 30),
        description: `You could save $${Math.max(0, input - 30)} monthly with optimized nutrition planning`
      })
    },
    {
      type: 'family',
      title: 'Family Time Calculator',
      question: 'How many hours do you spend meal planning weekly?',
      placeholder: 'Enter hours per week',
      unit: 'hrs',
      calculation: (input: number) => ({
        savings: input * 0.75 * 4.33 * 25, // 75% time savings * weeks * hourly value
        description: `Save ${(input * 0.75).toFixed(1)} hours weekly, worth $${(input * 0.75 * 4.33 * 25).toFixed(0)} monthly`
      })
    },
    {
      type: 'health',
      title: 'Health Investment Calculator',
      question: 'How much do you spend on nutrition consultations monthly?',
      placeholder: 'Enter monthly amount',
      unit: '$',
      calculation: (input: number) => ({
        savings: Math.max(0, input - 30),
        description: `Get 24/7 advanced guidance for less than one consultation per month`
      })
    }
  ];

  const faqs: FAQ[] = [
    {
      question: 'Is this worth the cost compared to free apps?',
      answer: 'Free apps give you calorie counting. Praneya gives you personalized nutrition intelligence that adapts to your goals, family, and dietary requirements. Users save an average of $200/month on groceries and meal planning time.',
      category: 'pricing'
    },
    {
      question: 'Why is Premium significantly more expensive?',
      answer: 'Premium includes advanced features with evidence-based recommendations and integration with wellness tracking. It\'s less than one nutrition consultation per month but provides 24/7 access to advanced guidance.',
      category: 'pricing'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Absolutely. Upgrade or downgrade anytime. If you upgrade mid-month, you\'ll only pay the prorated difference.',
      category: 'features'
    },
    {
      question: 'What if I\'m not satisfied?',
      answer: 'We offer a 30-day money-back guarantee on all paid plans. Cancel anytime with one click. Keep all recipes and meal plans you\'ve created. No questions asked refund policy.',
      category: 'guarantee'
    },
    {
      question: 'Do you offer family plans?',
      answer: 'Yes! Our family plans allow up to 6 family members to share the account with individual profiles and preferences. Family plans are just $2-$10 more per month depending on the tier.',
      category: 'features'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay. Annual plans receive a 20% discount, and we offer payment splitting for family plans.',
      category: 'pricing'
    }
  ];

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'fitness': return <Dumbbell className="w-5 h-5" />;
      case 'families': return <Users className="w-5 h-5" />;
      case 'health': return <Heart className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'fitness': return 'from-blue-500 to-cyan-600';
      case 'families': return 'from-green-500 to-emerald-600';
      case 'health': return 'from-orange-500 to-amber-600';
      default: return 'from-teal-500 to-cyan-600';
    }
  };

  const calculatePrice = (tier: PricingTier) => {
    if (tier.id === 'basic') return 0;
    
    const basePrice = planType === 'family' 
      ? tier.price.family[billingCycle]
      : tier.price[billingCycle];
    
    return billingCycle === 'annual' ? basePrice / 12 : basePrice;
  };

  const calculateAnnualSavings = (tier: PricingTier) => {
    if (tier.id === 'basic') return 0;
    
    const monthlyTotal = planType === 'family' 
      ? tier.price.family.monthly * 12
      : tier.price.monthly * 12;
    
    const annualPrice = planType === 'family' 
      ? tier.price.family.annual
      : tier.price.annual;
    
    return monthlyTotal - annualPrice;
  };

  const handleCalculatorSubmit = (type: string, value: number) => {
    setCalculatorValues(prev => ({ ...prev, [type]: value }));
    onCalculatorUse?.(type, value);
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'FREE' : `$${price.toFixed(2)}`;
  };

  const getDailyPrice = (tier: PricingTier) => {
    const monthlyPrice = calculatePrice(tier);
    return monthlyPrice === 0 ? '$0' : `$${(monthlyPrice / 30).toFixed(2)}`;
  };

  const pricingPlans: PricingPlan[] = [
    {
      id: 'basic',
      name: 'Starter',
      tagline: 'Perfect for individuals getting started',
      monthlyPrice: 29,
      annualPrice: 290,
      originalMonthlyPrice: 39,
      originalAnnualPrice: 390,
      colorScheme: 'basic',
      ctaText: 'Start Free Trial',
      ctaSecondary: 'Learn More',
      features: [
        { text: 'AI-powered meal planning', included: true, tooltip: 'Get personalized meal plans based on your preferences and health goals' },
        { text: 'Basic nutrition tracking', included: true },
        { text: 'Recipe recommendations', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Email support', included: true },
        { text: 'Family sharing (up to 4)', included: false },
        { text: 'Advanced health analytics', included: false },
        { text: 'Clinical integration', included: false },
        { text: 'Priority support', included: false }
      ],
      testimonial: {
        text: "Great value for someone just starting their health journey!",
        author: "Sarah M.",
        role: "Health Enthusiast"
      }
    },
    {
      id: 'enhanced',
      name: 'Family',
      tagline: 'Ideal for families and health-conscious groups',
      monthlyPrice: 59,
      annualPrice: 590,
      originalMonthlyPrice: 79,
      originalAnnualPrice: 790,
      colorScheme: 'enhanced',
      ctaText: 'Start Family Plan',
      popular: true,
      badge: 'Most Popular',
      features: [
        { text: 'Everything in Starter', included: true, premium: true },
        { text: 'Family sharing (up to 6)', included: true, tooltip: 'Manage health plans for your entire family from one account' },
        { text: 'Advanced health analytics', included: true, premium: true },
        { text: 'Dietary restriction management', included: true },
        { text: 'Shopping list automation', included: true },
        { text: 'Progress tracking & goals', included: true },
        { text: 'Phone & chat support', included: true },
        { text: 'Clinical integration', included: false },
        { text: 'Dedicated success manager', included: false }
      ],
      testimonial: {
        text: "Perfect for our family of 5. The kids love the meal planning!",
        author: "Michael R.",
        role: "Parent & Health Coach"
      },
      urgency: "🔥 Limited time: 25% off first year"
    },
    {
      id: 'premium',
      name: 'Professional',
      tagline: 'For healthcare providers and enterprises',
      monthlyPrice: 129,
      annualPrice: 1290,
      originalMonthlyPrice: 179,
      originalAnnualPrice: 1790,
      colorScheme: 'premium',
      ctaText: 'Contact Sales',
      ctaSecondary: 'Book Demo',
      badge: 'Enterprise',
      features: [
        { text: 'Everything in Family', included: true, premium: true },
        { text: 'Clinical integration & HIPAA', included: true, tooltip: 'Full HIPAA compliance with clinical data integration for healthcare providers' },
        { text: 'Unlimited family members', included: true },
        { text: 'Advanced reporting & analytics', included: true, premium: true },
        { text: 'API access & integrations', included: true },
        { text: 'Custom branding options', included: true },
        { text: 'Dedicated success manager', included: true, premium: true },
        { text: 'Priority phone support', included: true },
        { text: 'Training & onboarding', included: true }
      ],
      testimonial: {
        text: "Essential for our clinic. The clinical integration is seamless.",
        author: "Dr. James T.",
        role: "Chief Medical Officer"
      }
    }
  ];

  const savingsPercentage = 25;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSocialProofCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-secondary-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_theme(colors.primary.500)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_theme(colors.secondary.500)_0%,_transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="text-center mb-16"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            className="mb-6"
          >
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent text-sm font-bold uppercase tracking-wider">
              Transparent Pricing
            </span>
          </motion.div>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-5xl lg:text-6xl font-extrabold mb-6"
          >
            <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Choose Your Plan
            </span>
            <br />
            <span className="text-neutral-800">Start Your Health Journey</span>
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8"
          >
            Join thousands of families and healthcare professionals who trust Praneya 
            for personalized nutrition guidance and evidence-based health outcomes.
          </motion.p>

          {/* Social Proof Counter */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 }
            }}
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-neutral-200 shadow-lg"
          >
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm text-neutral-600">
              <motion.span
                key={socialProofCount}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-bold text-primary-600"
              >
                {socialProofCount.toLocaleString()}
              </motion.span>
              {' '}people upgraded this week
            </span>
          </motion.div>
        </motion.div>

        {/* Pricing Toggle */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <PricingToggle
            isAnnual={isAnnual}
            onToggle={setIsAnnual}
            savingsPercentage={savingsPercentage}
          />
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isAnnual={isAnnual}
              isPopular={plan.popular || false}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Trust Indicators */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            {[
              { icon: '🔒', text: 'HIPAA Compliant' },
              { icon: '🛡️', text: 'SOC 2 Certified' },
              { icon: '✅', text: 'FDA Guidelines' },
              { icon: '💳', text: 'Secure Payments' },
              { icon: '↩️', text: '30-Day Guarantee' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-neutral-200"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium text-neutral-700">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-neutral-600 max-w-2xl mx-auto">
            All plans come with a 30-day money-back guarantee. No setup fees, no hidden costs. 
            Cancel anytime with just one click. Questions? Our support team is here to help 24/7.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export { PricingSection }; 