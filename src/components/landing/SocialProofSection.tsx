/**
 * Social Proof Section - "Trusted by Thousands, Built on Evidence"
 * Comprehensive testimonials, endorsements, and trust indicators for all audiences
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Star,
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Users,
  TrendingUp,
  CheckCircle,
  Quote,
  Filter,
  Share2,
  Clock,
  Lock,
  Database,
  Zap,
  Heart,
  Dumbbell,
  UserCheck,
  Globe,
  BarChart3
} from 'lucide-react';

interface Testimonial {
  id: string;
  type: 'featured' | 'micro';
  audience: 'fitness' | 'families' | 'health';
  name: string;
  title: string;
  quote: string;
  results: string[];
  verification: string[];
  image: string;
  rating: number;
  timeframe?: string;
}

interface ProfessionalEndorsement {
  name: string;
  title: string;
  credentials: string;
  quote: string;
  image: string;
  organization?: string;
}

interface TrustIndicator {
  category: 'security' | 'credibility' | 'technology' | 'satisfaction';
  icon: React.ReactNode;
  title: string;
  description: string;
  metric?: string;
}

interface Award {
  title: string;
  organization: string;
  year: string;
  description: string;
  icon: React.ReactNode;
}

interface SocialProofSectionProps {
  onTestimonialClick?: (testimonial: Testimonial) => void;
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({
  onTestimonialClick
}) => {
  const [activeAudience, setActiveAudience] = useState<'all' | 'fitness' | 'families' | 'health'>('all');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState({
    activeFamilies: 2847,
    totalPoundsLost: 125000,
    energyImproved: 85,
    hoursSaved: 2300000,
    dollarsSaved: 12500000
  });
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  // Simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        activeFamilies: prev.activeFamilies + Math.floor(Math.random() * 3)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonials: Testimonial[] = [
    // Featured Success Stories
    {
      id: 'jake-martinez',
      type: 'featured',
      audience: 'fitness',
      name: 'Jake Martinez',
      title: 'Competitive Bodybuilder',
      quote: 'As a competitive bodybuilder, precision matters. Praneya\'s AI helped me dial in my nutrition better than any approach I\'ve tried. I achieved my best competition results using their systematic approach.',
      results: [
        '8% body fat achieved',
        'Personal best competition performance',
        'Improved recovery times',
        'Precise macro tracking'
      ],
      verification: [
        'Competition photos verified',
        'Before/after progress photos',
        'Coach endorsement',
        'Competition placement records'
      ],
      image: '💪',
      rating: 5,
      timeframe: '6 months'
    },
    {
      id: 'jennifer-walsh',
      type: 'featured',
      audience: 'families',
      name: 'Jennifer Walsh',
      title: 'Marketing Director & Mom of 3',
      quote: 'Praneya saved our family dinners and our sanity. With three kids, two careers, and endless activities, meal planning was chaos. Now we spend 15 minutes on Sunday and have healthy meals all week.',
      results: [
        '25% grocery savings',
        '5 hours/week time savings',
        'Improved family nutrition',
        'Reduced meal stress'
      ],
      verification: [
        'Grocery receipt comparisons',
        'Family progress photos',
        'Time tracking data',
        'Kids\' health improvements'
      ],
      image: '👩‍👧‍👦',
      rating: 5,
      timeframe: '3 months'
    },
    {
      id: 'robert-kim',
      type: 'featured',
      audience: 'health',
      name: 'Robert Kim',
      title: 'Wellness Enthusiast',
      quote: 'My energy levels and overall wellness improved dramatically in 8 months using Praneya\'s evidence-based meal plans. For the first time in years, I feel confident about my nutrition choices.',
      results: [
        'Improved energy levels',
        'Better sleep quality',
        '30 lb weight loss',
        'Increased confidence'
      ],
      verification: [
        'Progress photos',
        'Wellness tracking data',
        'Energy level reports',
        'Sleep quality metrics'
      ],
      image: '❤️',
      rating: 5,
      timeframe: '8 months'
    },
    // Micro Testimonials
    {
      id: 'lisa-chen',
      type: 'micro',
      audience: 'fitness',
      name: 'Lisa Chen',
      title: 'Powerlifter',
      quote: 'Finally hit my strength goals after Praneya optimized my nutrition timing',
      results: ['Strength PR achieved'],
      verification: ['Competition records'],
      image: '🏋️‍♀️',
      rating: 5
    },
    {
      id: 'marcus-thompson',
      type: 'micro',
      audience: 'fitness',
      name: 'Marcus Thompson',
      title: 'Personal Trainer',
      quote: 'Gained 12 pounds of lean muscle in 6 months without the guesswork',
      results: ['12 lbs muscle gain'],
      verification: ['Body composition scans'],
      image: '💪',
      rating: 5
    },
    {
      id: 'david-park',
      type: 'micro',
      audience: 'families',
      name: 'David Park',
      title: 'Father of 2',
      quote: 'My picky 8-year-old now asks for vegetables thanks to Praneya\'s kid-friendly adaptations',
      results: ['Improved kid nutrition'],
      verification: ['Parent photos'],
      image: '👨‍👧‍👦',
      rating: 5
    },
    {
      id: 'mary-johnson',
      type: 'micro',
      audience: 'health',
      name: 'Mary Johnson',
      title: 'Health-Conscious Individual',
      quote: 'Praneya\'s heart-healthy recipes helped me feel more energetic than I have in years',
      results: ['Increased energy'],
      verification: ['Wellness tracking'],
      image: '❤️',
      rating: 5
    }
  ];

  const professionalEndorsements: ProfessionalEndorsement[] = [
    {
      name: 'Dr. Michael Chen',
      title: 'Registered Dietitian',
      credentials: 'RD, PhD Nutrition Science',
      quote: 'I appreciate Praneya\'s evidence-based approach to nutrition education. It helps bridge the gap between nutritional science and practical meal planning for everyday families.',
      image: '👨‍⚕️',
      organization: 'National Dietetic Association'
    },
    {
      name: 'Sarah Williams',
      title: 'Certified Nutrition Specialist',
      credentials: 'CNS, MS Clinical Nutrition',
      quote: 'As a nutrition professional, I value tools that help people make informed food choices. Praneya provides accessible nutrition education in an engaging format.',
      image: '👩‍⚕️',
      organization: 'Board for Certification of Nutrition Specialists'
    }
  ];

  const trustIndicators: TrustIndicator[] = [
    // Security & Privacy
    {
      category: 'security',
      icon: <Lock className="w-6 h-6" />,
      title: 'Privacy-Focused Data Protection',
      description: 'Your family\'s nutrition data is encrypted and protected',
      metric: '256-bit SSL'
    },
    {
      category: 'security',
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Cloud Infrastructure',
      description: 'Enterprise-grade security with regular audits',
      metric: '99.9% Secure'
    },
    // Educational Credibility
    {
      category: 'credibility',
      icon: <Award className="w-6 h-6" />,
      title: 'Evidence-Based Nutrition Information',
      description: 'All content reviewed by registered dietitians',
      metric: 'RD Reviewed'
    },
    {
      category: 'credibility',
      icon: <Database className="w-6 h-6" />,
      title: 'Comprehensive Food Database',
      description: 'Access to 900,000+ verified food items',
      metric: '900k+ Foods'
    },
    // Technology Excellence
    {
      category: 'technology',
      icon: <Zap className="w-6 h-6" />,
      title: 'AI Powered by Advanced Machine Learning',
      description: 'Cutting-edge nutrition analysis technology',
      metric: 'ML Powered'
    },
    {
      category: 'technology',
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Real-Time Nutrition Analysis',
      description: 'Instant nutritional insights and recommendations',
      metric: '<1s Response'
    },
    // User Satisfaction
    {
      category: 'satisfaction',
      icon: <Star className="w-6 h-6" />,
      title: '4.8/5 App Store Rating',
      description: 'Thousands of satisfied users love Praneya',
      metric: '4.8★ Rating'
    },
    {
      category: 'satisfaction',
      icon: <Users className="w-6 h-6" />,
      title: '50,000+ Active Families',
      description: 'Growing community of nutrition-focused families',
      metric: '50k+ Users'
    }
  ];

  const awards: Award[] = [
    {
      title: 'Best Nutrition App 2024',
      organization: 'Tech Innovation Awards',
      year: '2024',
      description: 'Recognized for innovation in nutrition technology',
      icon: <Award className="w-8 h-8 text-yellow-500" />
    },
    {
      title: 'Top Family Planning Platform',
      organization: 'Family Tech Review',
      year: '2024',
      description: 'Leading solution for family meal planning',
      icon: <Users className="w-8 h-8 text-blue-500" />
    },
    {
      title: 'Innovation in Nutrition Education',
      organization: 'EdTech Excellence',
      year: '2024',
      description: 'Excellence in educational technology',
      icon: <TrendingUp className="w-8 h-8 text-green-500" />
    },
    {
      title: 'User Choice Award',
      organization: 'Nutrition Category',
      year: '2024',
      description: 'Voted by users as the preferred nutrition app',
      icon: <Heart className="w-8 h-8 text-red-500" />
    }
  ];

  const filteredTestimonials = activeAudience === 'all' 
    ? testimonials 
    : testimonials.filter(t => t.audience === activeAudience);

  const handleTestimonialNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentTestimonialIndex((prev) => 
        prev >= filteredTestimonials.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentTestimonialIndex((prev) => 
        prev <= 0 ? filteredTestimonials.length - 1 : prev - 1
      );
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'fitness': return <Dumbbell className="w-5 h-5" />;
      case 'families': return <Users className="w-5 h-5" />;
      case 'health': return <Heart className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
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

  return (
    <section 
      ref={ref}
      className="relative py-20 bg-gradient-to-b from-gray-50 to-white"
      aria-label="Social Proof and Trust Indicators"
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
            className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <UserCheck className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-green-800">Trusted by Thousands</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Trusted by Thousands,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Built on Evidence
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Over{' '}
            <span className="font-semibold text-green-600">50,000 families</span>{' '}
            trust Praneya to guide their nutrition decisions. From fitness competitors to busy parents 
            to individuals managing dietary requirements, real people are achieving real results.
          </p>
        </motion.div>

        {/* Real-Time Usage Counter */}
        <motion.div
          className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 mb-16 border border-teal-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-lg font-semibold text-gray-800">Live Now</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              Right now,{' '}
              <motion.span
                className="text-teal-600"
                key={liveMetrics.activeFamilies}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {liveMetrics.activeFamilies.toLocaleString()}
              </motion.span>{' '}
              families are using Praneya to plan healthier meals
            </p>
          </div>
        </motion.div>

        {/* Testimonial Filter */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 p-2 bg-white rounded-xl shadow-lg border border-gray-200">
            <Filter className="w-5 h-5 text-gray-500 ml-2" />
            {[
              { id: 'all', label: 'All Stories', icon: <Globe className="w-4 h-4" /> },
              { id: 'fitness', label: 'Fitness', icon: <Dumbbell className="w-4 h-4" /> },
              { id: 'families', label: 'Families', icon: <Users className="w-4 h-4" /> },
              { id: 'health', label: 'Health', icon: <Heart className="w-4 h-4" /> }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveAudience(filter.id as any);
                  setCurrentTestimonialIndex(0);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                  ${activeAudience === filter.id
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

        {/* Main Testimonial Showcase */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeAudience}-${currentTestimonialIndex}`}
                className="p-8 md:p-12"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                {filteredTestimonials[currentTestimonialIndex] && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Testimonial Content */}
                    <div>
                      {/* Quote Icon */}
                      <Quote className="w-12 h-12 text-teal-600 mb-6" />
                      
                      {/* Quote Text */}
                      <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 leading-relaxed mb-8">
                        "{filteredTestimonials[currentTestimonialIndex].quote}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="text-4xl">
                          {filteredTestimonials[currentTestimonialIndex].image}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {filteredTestimonials[currentTestimonialIndex].name}
                          </h4>
                          <p className="text-gray-600">
                            {filteredTestimonials[currentTestimonialIndex].title}
                          </p>
                          {filteredTestimonials[currentTestimonialIndex].timeframe && (
                            <p className="text-sm text-gray-500">
                              Results in {filteredTestimonials[currentTestimonialIndex].timeframe}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className="w-6 h-6 text-yellow-400 fill-current" 
                          />
                        ))}
                        <span className="text-gray-600 ml-2">
                          5.0 out of 5 stars
                        </span>
                      </div>

                      {/* Audience Badge */}
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getAudienceColor(filteredTestimonials[currentTestimonialIndex].audience)} text-white`}>
                          {getAudienceIcon(filteredTestimonials[currentTestimonialIndex].audience)}
                          <span className="text-sm font-medium capitalize">
                            {filteredTestimonials[currentTestimonialIndex].audience}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Results & Verification */}
                    <div className="space-y-8">
                      {/* Results */}
                      <div>
                        <h5 className="text-xl font-bold text-gray-900 mb-4">
                          Results Achieved:
                        </h5>
                        <ul className="space-y-3">
                          {filteredTestimonials[currentTestimonialIndex].results.map((result, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Verification */}
                      <div>
                        <h5 className="text-xl font-bold text-gray-900 mb-4">
                          Verification:
                        </h5>
                        <ul className="space-y-3">
                          {filteredTestimonials[currentTestimonialIndex].verification.map((item, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <UserCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Share Button */}
                      <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>Share Story</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <button
                onClick={() => handleTestimonialNavigation('prev')}
                className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-teal-600 transition-colors"
                disabled={filteredTestimonials.length <= 1}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
              <button
                onClick={() => handleTestimonialNavigation('next')}
                className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-teal-600 transition-colors"
                disabled={filteredTestimonials.length <= 1}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Testimonial Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2">
                {filteredTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonialIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonialIndex
                        ? 'bg-teal-600'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Metrics Dashboard */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {[
            {
              icon: <TrendingUp className="w-8 h-8 text-green-600" />,
              title: 'Total pounds lost by users',
              value: `${(liveMetrics.totalPoundsLost / 1000).toFixed(0)}k+`,
              description: 'Combined weight loss success'
            },
            {
              icon: <Zap className="w-8 h-8 text-yellow-600" />,
              title: 'Improved energy levels reported',
              value: `${liveMetrics.energyImproved}%`,
              description: 'Users reporting better energy'
            },
            {
              icon: <Clock className="w-8 h-8 text-blue-600" />,
              title: 'Hours saved on meal planning',
              value: `${(liveMetrics.hoursSaved / 1000000).toFixed(1)}M+`,
              description: 'Time saved across all users'
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
              title: 'Grocery dollars saved',
              value: `$${(liveMetrics.dollarsSaved / 1000000).toFixed(1)}M+`,
              description: 'Total savings by our community'
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 + (index * 0.1) }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            >
              <div className="flex justify-center mb-4">
                {metric.icon}
              </div>
              <h4 className="text-3xl font-bold text-gray-900 mb-2">
                {metric.value}
              </h4>
              <p className="font-medium text-gray-800 mb-1">
                {metric.title}
              </p>
              <p className="text-sm text-gray-600">
                {metric.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Professional Endorsements */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Endorsed by Nutrition Professionals
            </h3>
            <p className="text-xl text-gray-600">
              Trusted by registered dietitians and certified nutrition specialists
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {professionalEndorsements.map((endorsement, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.6 + (index * 0.1) }}
                whileHover={{ y: -5 }}
              >
                <Quote className="w-8 h-8 text-teal-600 mb-4" />
                <blockquote className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                  "{endorsement.quote}"
                </blockquote>
                
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {endorsement.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {endorsement.name}
                    </h4>
                    <p className="text-gray-600">
                      {endorsement.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {endorsement.credentials}
                    </p>
                    {endorsement.organization && (
                      <p className="text-sm text-teal-600">
                        {endorsement.organization}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators Grid */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Trust is Our Priority
            </h3>
            <p className="text-xl text-gray-600">
              Security, credibility, and excellence in every aspect
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 text-center group hover:border-teal-300 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 2.0 + (index * 0.05) }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4 text-teal-600 group-hover:text-teal-700">
                  {indicator.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {indicator.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {indicator.description}
                </p>
                {indicator.metric && (
                  <div className="bg-teal-100 text-teal-800 text-xs font-semibold px-3 py-1 rounded-full inline-block">
                    {indicator.metric}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Awards and Recognition */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Awards & Recognition
            </h3>
            <p className="text-xl text-gray-600">
              Industry recognition for innovation and excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 2.4 + (index * 0.1) }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-center mb-4">
                  {award.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {award.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {award.organization}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {award.description}
                </p>
                <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full inline-block">
                  {award.year}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Verification Badges */}
        <motion.div
          className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 2.6 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Verified & Certified
            </h3>
            <p className="text-gray-600">
              Compliance and integration with trusted organizations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Better Business Bureau', rating: 'A+ Rating', icon: '🏆' },
              { name: 'Google Cloud Security', rating: 'Certified', icon: '🔒' },
              { name: 'FDA Nutrition Labeling', rating: 'Compliant', icon: '✅' },
              { name: 'USDA Food Database', rating: 'Integrated', icon: '🌾' }
            ].map((badge, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-4 text-center border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 2.8 + (index * 0.1) }}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {badge.name}
                </h4>
                <p className="text-xs text-gray-600">
                  {badge.rating}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Compliance Disclaimer */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 3.0 }}
        >
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-4xl mx-auto">
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>Educational Disclaimer:</strong> Praneya is a nutrition education tool designed to help users make informed food choices. 
              Individual results may vary based on personal factors including dietary adherence, lifestyle, and individual health conditions. 
              Testimonials represent individual experiences and do not guarantee similar results. Always consult with healthcare professionals 
              for personalized nutrition advice, especially if you have specific health conditions or dietary requirements.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { SocialProofSection }; 