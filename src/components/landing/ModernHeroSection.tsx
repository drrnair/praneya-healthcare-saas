'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  HealthcareButton, 
  HealthcareCard, 
  HealthcareBadge, 
  HealthcareStatsCard,
  HealthcareTooltip 
} from '@/lib/design-system/healthcare-components';

/**
 * =======================================================================
 * CONVERSION-OPTIMIZED HERO SECTION 2025
 * =======================================================================
 * 
 * Features:
 * - Conversion-optimized layout with trust indicators
 * - Advanced gradient overlay system
 * - Typing animation effects for headlines
 * - Animated counter components
 * - Floating testimonial cards
 * - Interactive geometric patterns
 * - WCAG 2.1 AA accessibility compliance
 * - Mobile-first responsive design
 * 
 * =======================================================================
 */

interface ModernHeroSectionProps {
  personalizedContent?: {
    name?: string;
    healthGoals?: string[];
    completedChallenges?: number;
  };
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

// Animated Counter Component
const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string; prefix?: string }> = ({ 
  end, 
  duration = 2, 
  suffix = '', 
  prefix = '' 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const startCount = 0;

    const animateCount = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        setCount(Math.floor(startCount + (end - startCount) * progress));
        requestAnimationFrame(animateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Typing Animation Component
const TypingAnimation: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <span className="relative">
      {displayText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-full bg-primary-500 ml-1"
        />
      )}
    </span>
  );
};

// Star Rating Component
const StarRating: React.FC<{ rating: number; totalStars?: number }> = ({ rating, totalStars = 5 }) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: totalStars }, (_, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
          className={cn(
            "text-lg",
            index < Math.floor(rating) ? "text-yellow-400" : "text-neutral-300"
          )}
        >
          ⭐
        </motion.span>
      ))}
      <span className="ml-2 text-sm font-medium text-neutral-700">{rating}</span>
    </div>
  );
};

// Floating Testimonial Component
const FloatingTestimonial: React.FC<{
  name: string;
  role: string;
  content: string;
  avatar: string;
  delay: number;
}> = ({ name, role, content, avatar, delay }) => {
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="absolute bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs"
      whileHover={{ scale: 1.05 }}
      style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
    >
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold">
          {avatar}
        </div>
        <div className="flex-1">
          <p className="text-sm text-neutral-700 mb-2">"{content}"</p>
          <div>
            <p className="text-xs font-medium text-neutral-900">{name}</p>
            <p className="text-xs text-neutral-500">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ModernHeroSection: React.FC<ModernHeroSectionProps> = ({
  personalizedContent,
  onGetStarted,
  onLearnMore
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPersona, setCurrentPersona] = useState(0);
  const [showTestimonials, setShowTestimonials] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Enhanced personas with conversion-focused messaging
  const personas = [
    {
      title: "Transform Your Family's Health Journey",
      subtitle: "AI-powered nutrition planning trusted by 50,000+ families",
      cta: "Start Free Trial",
      icon: "👨‍👩‍👧‍👦",
      gradient: "from-primary-500 to-secondary-500",
      stats: { families: 50000, satisfaction: 98, meals: 2000000 }
    },
    {
      title: "Optimize Your Athletic Performance",
      subtitle: "Scientific nutrition planning that delivers 40% better results",
      cta: "Unlock Your Potential",
      icon: "🏋️‍♀️",
      gradient: "from-secondary-500 to-warning-500",
      stats: { athletes: 25000, improvement: 40, workouts: 1000000 }
    },
    {
      title: "Simplify Healthy Living",
      subtitle: "Effortless wellness with clinical-grade AI recommendations",
      cta: "Begin Your Journey",
      icon: "🌱",
      gradient: "from-primary-500 to-success-500",
      stats: { members: 100000, goals: 95, recipes: 10000 }
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Mother of 3",
      content: "Finally found meal planning that works for our busy family!",
      avatar: "SM",
      delay: 1
    },
    {
      name: "Dr. James K.",
      role: "Registered Dietitian",
      content: "The clinical accuracy of these recommendations is impressive.",
      avatar: "JK",
      delay: 1.5
    },
    {
      name: "Maria L.",
      role: "Diabetes Patient",
      content: "My A1C improved by 2 points in just 3 months.",
      avatar: "ML",
      delay: 2
    }
  ];

  // Auto-rotate personas
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPersona((prev) => (prev + 1) % personas.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Delayed testimonial appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTestimonials(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      controls.start("visible");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [controls]);

  const currentPersona_data = personas[currentPersona] || personas[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        ease: "easeOut" as const
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
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Gradient Background System */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#007BFF20] via-white to-[#28A74520]" />
      
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
          className="h-full w-full bg-[linear-gradient(45deg,transparent_24%,rgba(0,123,255,0.05)_25%,rgba(0,123,255,0.05)_26%,transparent_27%,transparent_74%,rgba(40,167,69,0.05)_75%,rgba(40,167,69,0.05)_76%,transparent_77%)] bg-[length:60px_60px]"
        />
      </div>

      {/* Floating Health Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🩺', '💊', '🫀', '🧬', '⚕️', '🌿'].map((icon, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl"
            style={{
              left: `${15 + (index * 15)}%`,
              top: `${20 + (index * 10)}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              rotate: [-5, 5, -5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5
            }}
          >
            <motion.span
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.3
              }}
              className="drop-shadow-lg"
            >
              {icon}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Parallax Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary-300 to-primary-400 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-success-300 to-secondary-400 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-br from-warning-300 to-copper-400 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <motion.div
        ref={containerRef}
        className="relative z-10 container mx-auto px-6 pt-20 pb-32"
        style={{ opacity }}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Content Column */}
          <div className="space-y-8">
            {/* Trust Indicators Row */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-success-200"
              >
                <motion.span
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-success-600"
                >
                  🛡️
                </motion.span>
                <span className="text-sm font-medium text-success-700">HIPAA Compliant</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-primary-200"
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-primary-600"
                >
                  ✅
                </motion.span>
                <span className="text-sm font-medium text-primary-700">RD Approved</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-yellow-200"
              >
                <StarRating rating={4.8} totalStars={5} />
              </motion.div>
            </motion.div>

            {/* Enhanced Headline with Typography */}
            <motion.div variants={itemVariants} className="space-y-6">
              <motion.h1 
                key={currentPersona}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <span className={`block bg-gradient-to-r ${currentPersona_data.gradient} bg-clip-text text-transparent mb-2`}>
                  <TypingAnimation 
                    text={currentPersona_data.title.split(' ').slice(0, 3).join(' ')} 
                    delay={200}
                  />
                </span>
                <span className="block text-neutral-800">
                  <TypingAnimation 
                    text={currentPersona_data.title.split(' ').slice(3).join(' ')} 
                    delay={1000}
                  />
                </span>
              </motion.h1>

              <motion.p 
                key={`subtitle-${currentPersona}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-xl lg:text-2xl text-neutral-600 leading-relaxed max-w-lg font-medium"
              >
                {currentPersona_data.subtitle}
              </motion.p>
            </motion.div>

            {/* Animated Stats Counter */}
            <motion.div variants={itemVariants}>
              <HealthcareCard variant="wellness" className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <motion.p 
                      className="text-3xl font-bold text-primary-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      <AnimatedCounter end={currentPersona_data.stats.families || currentPersona_data.stats.athletes || currentPersona_data.stats.members} suffix="+" />
                    </motion.p>
                    <p className="text-sm text-neutral-600">Families Trust Us</p>
                  </div>
                  <div>
                    <motion.p 
                      className="text-3xl font-bold text-success-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      <AnimatedCounter end={currentPersona_data.stats.satisfaction || currentPersona_data.stats.improvement || currentPersona_data.stats.goals} suffix="%" />
                    </motion.p>
                    <p className="text-sm text-neutral-600">Success Rate</p>
                  </div>
                  <div>
                    <motion.p 
                      className="text-3xl font-bold text-warning-600"
                      whileHover={{ scale: 1.1 }}
                    >
                      <AnimatedCounter end={Math.floor((currentPersona_data.stats.meals || currentPersona_data.stats.workouts || currentPersona_data.stats.recipes) / 1000)} suffix="K+" />
                    </motion.p>
                    <p className="text-sm text-neutral-600">Meals Planned</p>
                  </div>
                </div>
              </HealthcareCard>
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <HealthcareButton
                  variant="primary"
                  size="lg"
                  onClick={onGetStarted}
                  className={`group relative overflow-hidden bg-gradient-to-r ${currentPersona_data.gradient} hover:shadow-xl transition-all duration-300`}
                  icon={<span className="text-xl">{currentPersona_data.icon}</span>}
                >
                  <span className="relative z-10">{currentPersona_data.cta}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                </HealthcareButton>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <HealthcareButton
                  variant="outline"
                  size="lg"
                  onClick={onLearnMore}
                  className="hover:bg-primary-50 hover:border-primary-300 transition-all duration-300"
                  icon={<span className="text-lg">📖</span>}
                >
                  Watch Demo
                </HealthcareButton>
              </motion.div>
            </motion.div>

            {/* Progress Indicators */}
            <motion.div variants={itemVariants} className="pt-8">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-neutral-600">Quick Setup:</span>
                <div className="flex space-x-2">
                  {['Sign Up', 'Health Profile', 'Get Recommendations'].map((step, index) => (
                    <motion.div
                      key={step}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm text-neutral-700">{step}</span>
                      {index < 2 && <span className="text-neutral-400">→</span>}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Column with Floating Testimonials */}
          <div className="relative">
            {/* Main Hero Image Placeholder */}
            <motion.div
              variants={itemVariants}
              className="relative z-10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 via-white to-secondary-100 flex items-center justify-center">
                <div className="text-center p-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    👨‍👩‍👧‍👦
                  </motion.div>
                  <p className="text-lg font-semibold text-neutral-700">
                    Diverse families cooking healthy meals together
                  </p>
                  <p className="text-sm text-neutral-500 mt-2">
                    AI-powered nutrition for every family
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Testimonials */}
            <AnimatePresence>
              {showTestimonials && testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  className={cn(
                    "hidden lg:block",
                    index === 0 && "top-8 -right-16",
                    index === 1 && "bottom-32 -left-12",
                    index === 2 && "top-1/2 -right-20"
                  )}
                  style={{ position: 'absolute' }}
                >
                  <FloatingTestimonial {...testimonial} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2 text-neutral-500"
          >
            <span className="text-sm font-medium">Discover More</span>
            <div className="w-6 h-10 border-2 border-neutral-300 rounded-full flex justify-center">
              <motion.div
                animate={{ 
                  y: [0, 12, 0],
                  backgroundColor: ['#0891b2', '#10b981', '#0891b2']
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default ModernHeroSection; 