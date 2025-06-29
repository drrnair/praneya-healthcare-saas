/**
 * Lead Magnets - Audience-Specific Lead Capture
 * Progressive profiling and micro-conversion tracking
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download,
  Mail,
  Calculator,
  BookOpen,
  Users,
  Heart,
  Dumbbell,
  ChefHat,
  Clock,
  CheckCircle,
  X,
  ArrowRight,
  Gift,
  Star,
  Shield,
  Zap,
  Target,
  FileText,
  Video,
  Calendar
} from 'lucide-react';

interface LeadMagnetProps {
  audience: 'unknown' | 'fitness' | 'families' | 'health';
  trigger: 'scroll' | 'exit-intent' | 'time-based' | 'cta-click' | 'manual';
  onConversion: (type: string, data: any) => void;
  isVisible: boolean;
  onClose: () => void;
}

interface LeadMagnetOffer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  value: string;
  deliveryMethod: 'email' | 'instant' | 'scheduled';
  contentType: 'pdf' | 'calculator' | 'video' | 'template' | 'course';
  cta: string;
  audience: string[];
  urgency?: string;
  socialProof?: string;
}

const LeadMagnets: React.FC<LeadMagnetProps> = ({
  audience,
  trigger,
  onConversion,
  isVisible,
  onClose
}) => {
  const [selectedOffer, setSelectedOffer] = useState<LeadMagnetOffer | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [currentStep, setCurrentStep] = useState<'offer' | 'form' | 'thank-you'>('offer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState<{
    goal?: string;
    experience?: string;
    familySize?: string;
    healthConcerns?: string;
  }>({});

  // Define lead magnets for each audience
  const leadMagnets: LeadMagnetOffer[] = [
    // Fitness Audience
    {
      id: 'macro-calculator',
      title: 'Free Macro Calculator + 7-Day Performance Plan',
      subtitle: 'Precision nutrition for peak performance',
      description: 'Get your personalized macro targets and a complete 7-day meal plan designed for your fitness goals.',
      icon: <Calculator className="w-8 h-8 text-blue-500" />,
      value: '$47 Value - Yours FREE',
      deliveryMethod: 'instant',
      contentType: 'calculator',
      cta: 'Get My Macro Plan',
      audience: ['fitness', 'unknown'],
      socialProof: 'Downloaded by 15,000+ athletes'
    },
    {
      id: 'performance-nutrition-guide',
      title: 'The Performance Nutrition Blueprint',
      subtitle: 'Science-backed nutrition for serious athletes',
      description: '40-page comprehensive guide covering pre/post workout nutrition, supplement timing, and performance optimization.',
      icon: <BookOpen className="w-8 h-8 text-blue-500" />,
      value: '$67 Value - FREE',
      deliveryMethod: 'email',
      contentType: 'pdf',
      cta: 'Download Blueprint',
      audience: ['fitness'],
      urgency: 'Limited time offer'
    },

    // Family Audience
    {
      id: 'family-meal-planner',
      title: 'Quick Family Dinner Solutions + Shopping Template',
      subtitle: 'Save 8+ hours on meal planning every week',
      description: '30 family-friendly recipes with prep times under 30 minutes, plus automated shopping lists.',
      icon: <ChefHat className="w-8 h-8 text-green-500" />,
      value: '$29 Value - FREE',
      deliveryMethod: 'instant',
      contentType: 'template',
      cta: 'Get Meal Plans',
      audience: ['families', 'unknown'],
      socialProof: 'Trusted by 8,000+ families'
    },
    {
      id: 'picky-eater-solutions',
      title: 'The Picky Eater Transformation Guide',
      subtitle: 'End mealtime battles with proven strategies',
      description: 'Evidence-based techniques to expand your child\'s palate, plus 25 kid-approved healthy recipes.',
      icon: <Users className="w-8 h-8 text-green-500" />,
      value: '$39 Value - FREE',
      deliveryMethod: 'email',
      contentType: 'pdf',
      cta: 'End Mealtime Battles',
      audience: ['families'],
      urgency: 'Parents love this!'
    },

    // Health Audience
    {
      id: 'evidence-based-nutrition',
      title: 'Evidence-Based Recipe Collection + Nutrition Guide',
      subtitle: 'Science-backed nutrition for optimal health',
      description: '50 medically-reviewed recipes with nutritional analysis and health benefits for each ingredient.',
      icon: <Heart className="w-8 h-8 text-orange-500" />,
      value: '$59 Value - FREE',
      deliveryMethod: 'email',
      contentType: 'pdf',
      cta: 'Get Healthy Recipes',
      audience: ['health', 'unknown'],
      socialProof: 'Endorsed by nutrition professionals'
    },
    {
      id: 'anti-inflammatory-starter',
      title: 'Anti-Inflammatory Meal Plan Starter Kit',
      subtitle: 'Reduce inflammation naturally through nutrition',
      description: '14-day meal plan with anti-inflammatory foods, shopping lists, and meal prep guides.',
      icon: <Shield className="w-8 h-8 text-orange-500" />,
      value: '$49 Value - FREE',
      deliveryMethod: 'email',
      contentType: 'pdf',
      cta: 'Start Healing Today',
      audience: ['health'],
      urgency: 'Science-proven results'
    },

    // Universal/Unknown Audience
    {
      id: 'nutrition-assessment',
      title: '2-Minute Nutrition Assessment + Personalized Tips',
      subtitle: 'Discover your nutrition profile instantly',
      description: 'Quick assessment reveals your nutrition gaps and provides personalized recommendations.',
      icon: <Target className="w-8 h-8 text-teal-500" />,
      value: 'Personalized for you',
      deliveryMethod: 'instant',
      contentType: 'calculator',
      cta: 'Get My Assessment',
      audience: ['unknown'],
      socialProof: 'Completed by 25,000+ users'
    }
  ];

  // Get relevant offers for current audience
  const getRelevantOffers = (): LeadMagnetOffer[] => {
    return leadMagnets.filter(offer => 
      offer.audience.includes(audience) || offer.audience.includes('unknown')
    ).slice(0, 2); // Show max 2 offers
  };

  // Progressive profiling questions based on audience
  const getProgressiveQuestions = (audience: string) => {
    switch (audience) {
      case 'fitness':
        return [
          { key: 'goal', label: 'Primary Fitness Goal', options: ['Build Muscle', 'Lose Fat', 'Improve Performance', 'General Health'] },
          { key: 'experience', label: 'Training Experience', options: ['Beginner', 'Intermediate', 'Advanced', 'Professional'] }
        ];
      case 'families':
        return [
          { key: 'familySize', label: 'Family Size', options: ['2-3 people', '4-5 people', '6+ people'] },
          { key: 'goal', label: 'Main Challenge', options: ['Picky Eaters', 'Time Constraints', 'Budget Concerns', 'Health Issues'] }
        ];
      case 'health':
        return [
          { key: 'healthConcerns', label: 'Health Focus', options: ['Weight Management', 'Digestive Health', 'Heart Health', 'Energy Levels'] },
          { key: 'experience', label: 'Nutrition Knowledge', options: ['Beginner', 'Some Knowledge', 'Well-Informed', 'Expert'] }
        ];
      default:
        return [];
    }
  };

  const handleOfferSelect = (offer: LeadMagnetOffer) => {
    setSelectedOffer(offer);
    setCurrentStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Track conversion
      onConversion('lead_magnet_conversion', {
        offerId: selectedOffer?.id,
        email,
        name,
        audience,
        trigger,
        additionalInfo
      });

      setCurrentStep('thank-you');
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const relevantOffers = getRelevantOffers();
  const progressiveQuestions = getProgressiveQuestions(audience);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Free Resources</h2>
                <p className="text-teal-100">Get instant access to premium nutrition tools</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {currentStep === 'offer' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Choose Your Free Resource
                  </h3>
                  <p className="text-gray-600">
                    Select the resource that best matches your goals
                  </p>
                </div>

                <div className="space-y-4">
                  {relevantOffers.map((offer) => (
                    <motion.div
                      key={offer.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-md transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleOfferSelect(offer)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {offer.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {offer.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {offer.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-teal-600">
                              {offer.value}
                            </span>
                            {offer.socialProof && (
                              <span className="text-xs text-gray-500">
                                {offer.socialProof}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 'form' && selectedOffer && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {selectedOffer.icon}
                    <h3 className="text-xl font-semibold text-gray-800">
                      {selectedOffer.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    Enter your details to get instant access
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Progressive profiling questions */}
                  {progressiveQuestions.map((question, index) => (
                    <div key={question.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {question.label}
                      </label>
                      <select
                        value={additionalInfo[question.key as keyof typeof additionalInfo] || ''}
                        onChange={(e) => setAdditionalInfo(prev => ({
                          ...prev,
                          [question.key]: e.target.value
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        <option value="">Select an option</option>
                        {question.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      selectedOffer.cta
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              </motion.div>
            )}

            {currentStep === 'thank-you' && selectedOffer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Success! Check Your Email
                </h3>
                
                <p className="text-gray-600 mb-6">
                  Your <strong>{selectedOffer.title}</strong> is on its way to <strong>{email}</strong>
                </p>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-teal-800 mb-2">What's Next?</h4>
                  <ul className="text-sm text-teal-700 space-y-1">
                    <li>• Check your email (including spam folder)</li>
                    <li>• Download your free resource</li>
                    <li>• Start implementing the strategies</li>
                    <li>• Watch for additional tips via email</li>
                  </ul>
                </div>

                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Continue to Praneya
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export { LeadMagnets };
export type { LeadMagnetProps, LeadMagnetOffer }; 