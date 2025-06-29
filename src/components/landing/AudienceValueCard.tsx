/**
 * Audience Value Proposition Card Component
 * Individual cards for fitness, family, and health audiences
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

interface AudienceValueCardProps {
  id: string;
  audience: 'fitness' | 'family' | 'health';
  icon: React.ReactNode;
  headline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  features: string[];
  color: string;
  isActive: boolean;
  onCTAClick: (audience: string, ctaText: string) => void;
  index: number;
}

const AudienceValueCard: React.FC<AudienceValueCardProps> = ({
  id,
  audience,
  icon,
  headline,
  description,
  ctaText,
  ctaLink,
  features,
  color,
  isActive,
  onCTAClick,
  index
}) => {
  // Color mappings for different audiences
  const colorSchemes = {
    fitness: {
      gradient: 'from-blue-500 to-cyan-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      border: 'border-blue-200',
      ctaBg: 'bg-blue-600 hover:bg-blue-700',
      accent: 'text-blue-600'
    },
    family: {
      gradient: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      border: 'border-green-200',
      ctaBg: 'bg-green-600 hover:bg-green-700',
      accent: 'text-green-600'
    },
    health: {
      gradient: 'from-orange-500 to-amber-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      border: 'border-orange-200',
      ctaBg: 'bg-orange-600 hover:bg-orange-700',
      accent: 'text-orange-600'
    }
  };

  const scheme = colorSchemes[audience];

  // Animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3 + (i * 0.1),
        duration: 0.4
      }
    })
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`
        relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300
        ${isActive ? `${scheme.border} shadow-xl scale-105` : 'border-gray-100 hover:border-gray-200'}
        group overflow-hidden
      `}
      role="article"
      aria-labelledby={`card-headline-${id}`}
    >
      {/* Gradient Background Accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${scheme.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Card Content */}
      <div className="relative p-6 lg:p-8">
        {/* Icon Header */}
        <motion.div 
          className="flex items-center mb-6"
          variants={iconVariants}
          whileHover="hover"
        >
          <div className={`
            flex items-center justify-center w-16 h-16 rounded-2xl
            ${scheme.iconBg} ${scheme.iconColor}
            group-hover:shadow-lg transition-shadow duration-300
          `}>
            {icon}
          </div>
          
          {/* Audience Label */}
          <div className="ml-4">
            <span className={`
              inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
              ${scheme.iconBg} ${scheme.accent}
            `}>
              {audience === 'fitness' && 'For Athletes'}
              {audience === 'family' && 'For Families'}
              {audience === 'health' && 'For Wellness'}
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <h3 
          id={`card-headline-${id}`}
          className="text-2xl font-bold text-gray-900 mb-4 leading-tight"
        >
          {headline}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Features List */}
        <ul className="space-y-3 mb-8" role="list" aria-label={`${audience} features`}>
          {features.map((feature, i) => (
            <motion.li
              key={i}
              custom={i}
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center text-sm text-gray-700"
            >
              <div className={`
                flex items-center justify-center w-5 h-5 rounded-full mr-3 flex-shrink-0
                ${scheme.iconBg}
              `}>
                <Check className={`w-3 h-3 ${scheme.iconColor}`} />
              </div>
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <Link
          href={ctaLink}
          className={`
            group/cta inline-flex items-center justify-center w-full px-6 py-4 
            text-white font-semibold rounded-xl transition-all duration-300
            ${scheme.ctaBg}
            transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500/50
            shadow-lg hover:shadow-xl
          `}
          onClick={() => onCTAClick(audience, ctaText)}
          aria-label={`${ctaText} for ${audience} audience`}
        >
          <span>{ctaText}</span>
          <motion.div
            className="ml-2"
            animate={{ x: [0, 5, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </Link>

        {/* Social Proof Badge */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-xs text-gray-500">
            {audience === 'fitness' && 'Trusted by 5,000+ athletes'}
            {audience === 'family' && 'Used by 3,000+ families'}
            {audience === 'health' && 'Supporting 2,000+ wellness journeys'}
          </span>
        </motion.div>
      </div>

      {/* Hover Glow Effect */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
        bg-gradient-to-br ${scheme.gradient} 
        blur-xl scale-110 -z-10
      `} style={{ filter: 'blur(20px)' }} />
    </motion.div>
  );
};

export { AudienceValueCard }; 