/**
 * Pricing Section - "Choose Your Path to Better Nutrition"
 * Conversion-optimized pricing with audience-specific value propositions
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
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
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

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

  return (
    <section 
      ref={ref}
      className="relative py-20 bg-gradient-to-b from-white to-gray-50"
      aria-label="Pricing Plans"
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
            <Crown className="w-6 h-6 text-teal-600" />
            <span className="font-semibold text-teal-800">Choose Your Path</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Choose Your Path to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
              Better Nutrition
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Investment in your nutrition is investment in your future. Choose the level of support 
            that matches your goals and see the transformation begin immediately.
          </p>
        </motion.div>

        {/* Billing & Plan Type Controls */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Billing Cycle Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">Monthly</span>
            <button
              onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-16 h-8 rounded-full transition-colors ${
                billingCycle === 'annual' ? 'bg-teal-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle billing cycle"
            >
              <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-transform ${
                billingCycle === 'annual' ? 'translate-x-9' : 'translate-x-1'
              }`} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">Annual</span>
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                Save 20%
              </span>
            </div>
          </div>

          {/* Plan Type Toggle */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setPlanType('individual')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                planType === 'individual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Individual
            </button>
            <button
              onClick={() => setPlanType('family')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                planType === 'family'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Family
            </button>
          </div>
        </motion.div>

        {/* Audience Filter */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 p-2 bg-white rounded-xl shadow-lg border border-gray-200">
            {[
              { id: 'all', label: 'All Features', icon: <Target className="w-4 h-4" /> },
              { id: 'fitness', label: 'Fitness', icon: <Dumbbell className="w-4 h-4" /> },
              { id: 'families', label: 'Families', icon: <Users className="w-4 h-4" /> },
              { id: 'health', label: 'Health', icon: <Heart className="w-4 h-4" /> }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedAudience(filter.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                  ${selectedAudience === filter.id
                    ? 'bg-teal-100 text-teal-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              className={`relative bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden ${
                tier.popular ? 'ring-2 ring-teal-500 scale-105' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 + (index * 0.1) }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            >
              {/* Badge */}
              {tier.badge && (
                <div className={`absolute top-6 left-6 right-6 text-center`}>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${tier.color}`}>
                    {tier.popular && <Sparkles className="w-4 h-4" />}
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="p-8 pt-16">
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {tier.tagline}
                  </p>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {formatPrice(calculatePrice(tier))}
                      </span>
                      {tier.id !== 'basic' && (
                        <span className="text-gray-600">
                          /{billingCycle === 'monthly' ? 'month' : 'month*'}
                        </span>
                      )}
                    </div>
                    
                    {tier.id !== 'basic' && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">
                          {getDailyPrice(tier)} per day
                        </p>
                        {planType === 'family' && (
                          <p className="text-sm text-teal-600">
                            ${(calculatePrice(tier) / 6).toFixed(2)} per family member
                          </p>
                        )}
                        {billingCycle === 'annual' && calculateAnnualSavings(tier) > 0 && (
                          <p className="text-sm text-green-600 font-medium">
                            Save ${calculateAnnualSavings(tier).toFixed(0)} annually
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Trust Indicators */}
                  {tier.id === 'basic' && (
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>No Credit Card Required</span>
                      </div>
                    </div>
                  )}

                  {tier.guarantee && (
                    <div className="flex items-center justify-center gap-2 text-sm text-teal-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>{tier.guarantee}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {tier.features.basic.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                    
                    {/* Audience-Specific Features */}
                    {selectedAudience !== 'all' && tier.features.audienceSpecific[selectedAudience] && (
                      <>
                        <li className="border-t border-gray-200 pt-3 mt-4">
                          <div className={`flex items-center gap-2 mb-2 text-sm font-medium bg-gradient-to-r ${getAudienceColor(selectedAudience)} bg-clip-text text-transparent`}>
                            {getAudienceIcon(selectedAudience)}
                            <span className="capitalize">{selectedAudience} Benefits:</span>
                          </div>
                        </li>
                        {tier.features.audienceSpecific[selectedAudience].map((feature, featureIndex) => (
                          <li key={`${selectedAudience}-${featureIndex}`} className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>

                {/* Social Proof */}
                <div className="mb-8">
                  <div className="space-y-2">
                    {tier.socialProof.map((proof, proofIndex) => (
                      <div key={proofIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <UserCheck className="w-4 h-4 text-blue-500" />
                        <span>{proof}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Urgency */}
                {tier.urgency && (
                  <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-800">
                      <Timer className="w-4 h-4" />
                      <span className="text-sm font-medium">{tier.urgency}</span>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => onTierSelect?.(tier.id, billingCycle, planType)}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 bg-gradient-to-r ${tier.color} hover:shadow-lg`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Secondary Info */}
                {tier.id !== 'basic' && (
                  <p className="text-center text-xs text-gray-500 mt-3">
                    Cancel anytime • No setup fees
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="text-center mb-8">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Compare All Features</span>
              {showComparison ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Detailed Feature Comparison
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                          <th className="text-center py-4 px-4 font-semibold text-gray-900">Basic</th>
                          <th className="text-center py-4 px-4 font-semibold text-gray-900">Enhanced</th>
                          <th className="text-center py-4 px-4 font-semibold text-gray-900">Premium</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ['Recipe Generation', true, true, true],
                          ['Food Recognition', true, true, true],
                          ['Nutrition Tracking', true, true, true],
                          ['Allergy Screening', true, true, true],
                          ['Family Coordination', false, true, true],
                          ['Meal Planning', false, true, true],
                          ['Shopping Lists', false, true, true],
                          ['Progress Analytics', false, true, true],
                          ['Biometric Integration', false, false, true],
                          ['Healthcare Reports', false, false, true],
                          ['Specialist Access', false, false, true]
                        ].map(([feature, basic, enhanced, premium], index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-4 px-4 text-gray-700">{feature}</td>
                            <td className="py-4 px-4 text-center">
                              {basic ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {enhanced ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {premium ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Value Calculators */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Value
            </h3>
            <p className="text-xl text-gray-600">
              See how much Praneya can save you based on your current situation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueCalculators.map((calculator, index) => (
              <motion.div
                key={calculator.type}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.8 + (index * 0.1) }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${getAudienceColor(calculator.type)}`}>
                    {getAudienceIcon(calculator.type)}
                  </div>
                  <h4 className="font-bold text-gray-900">{calculator.title}</h4>
                </div>

                <p className="text-gray-600 mb-4">{calculator.question}</p>

                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {calculator.unit}
                    </span>
                    <input
                      type="number"
                      placeholder={calculator.placeholder}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        handleCalculatorSubmit(calculator.type, value);
                      }}
                    />
                  </div>

                  {calculatorValues[calculator.type] !== undefined && (
                    <motion.div
                      className="p-4 bg-teal-50 border border-teal-200 rounded-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-teal-600" />
                        <span className="font-semibold text-teal-800">Your Potential Value:</span>
                      </div>
                      <p className="text-teal-700">
                        {calculator.calculation(calculatorValues[calculator.type]!).description}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2.0 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 2.2 + (index * 0.05) }}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === `faq-${index}` ? null : `faq-${index}`)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFAQ === `faq-${index}` ? 
                    <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  }
                </button>
                
                <AnimatePresence>
                  {expandedFAQ === `faq-${index}` && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-4 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Money-Back Guarantee */}
        <motion.div
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 2.4 }}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Try Praneya Risk-Free
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                { icon: <Clock className="w-6 h-6" />, text: '30-day money-back guarantee on all paid plans' },
                { icon: <CheckCircle className="w-6 h-6" />, text: 'Cancel anytime with one click' },
                { icon: <Gift className="w-6 h-6" />, text: 'Keep all recipes and meal plans you\'ve created' },
                { icon: <Heart className="w-6 h-6" />, text: 'No questions asked refund policy' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="text-green-600 mb-2">{item.icon}</div>
                  <p className="text-gray-700 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Payment Options */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Secure Payment Options
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            {[
              { icon: <CreditCard className="w-8 h-8" />, label: 'Credit Cards' },
              { icon: <Smartphone className="w-8 h-8" />, label: 'PayPal' },
              { icon: <Smartphone className="w-8 h-8" />, label: 'Apple Pay' },
              { icon: <Smartphone className="w-8 h-8" />, label: 'Google Pay' }
            ].map((payment, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600">
                {payment.icon}
                <span>{payment.label}</span>
              </div>
            ))}
          </div>
          
          <p className="text-gray-600 mb-4">
            All payments are secured with 256-bit SSL encryption
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <span>• Annual plans receive 20% discount</span>
            <span>• Family plan payment splitting available</span>
            <span>• No setup fees or hidden charges</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { PricingSection }; 