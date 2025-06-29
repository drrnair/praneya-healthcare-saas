/**
 * Trust Indicators Component
 * Social proof and credibility elements for the hero section
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TrustIndicator {
  id: string;
  icon: React.ReactNode;
  text: string;
  metric?: string;
}

interface TrustIndicatorsProps {
  indicators: TrustIndicator[];
}

const TrustIndicators: React.FC<TrustIndicatorsProps> = ({ indicators }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

    const indicatorVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as any
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        ease: "easeOut" as any
      }
    }
  };

  const metricVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg">
      <div className="px-6 py-8">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Trusted by Thousands
          </h2>
          <p className="text-sm text-gray-600">
            Join a community of health-conscious individuals and families
          </p>
        </motion.div>

        {/* Trust Indicators Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="Trust indicators and social proof"
        >
          {indicators.map((indicator, index) => (
            <motion.div
              key={indicator.id}
              variants={indicatorVariants}
              whileHover={{ y: -5 }}
              className="group flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/50 transition-colors duration-300"
              role="listitem"
            >
              {/* Icon */}
              <motion.div
                variants={iconVariants}
                whileHover="hover"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-3 group-hover:bg-teal-200 transition-colors duration-300"
              >
                {indicator.icon}
              </motion.div>

              {/* Metric (if present) */}
              {indicator.metric && (
                <motion.div
                  variants={metricVariants}
                  whileHover="hover"
                  className="mb-2"
                >
                  <span className="text-2xl font-bold text-gray-900">
                    {indicator.metric}
                  </span>
                </motion.div>
              )}

              {/* Text */}
              <p className="text-sm font-medium text-gray-700 leading-tight">
                {indicator.text}
              </p>

              {/* Hover Effect Indicator */}
              <motion.div
                className="w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 mt-2 group-hover:w-8 transition-all duration-300"
                initial={{ width: 0 }}
                whileHover={{ width: 32 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Trust Elements */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-200/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            {/* Security Badges */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <span>HIPAA Compliant</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full ml-0.5" />
              </div>
              <span>256-bit SSL Encryption</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-1 bg-white rounded-sm" />
              </div>
              <span>GDPR Compliant</span>
            </div>

            {/* Certifications */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">RD</span>
              </div>
              <span>Registered Dietitian Approved</span>
            </div>
          </div>
        </motion.div>

        {/* Money-back Guarantee */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <span className="text-sm font-medium text-green-700">
              30-day money-back guarantee
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export { TrustIndicators }; 