/**
 * Micro Survey Component
 * Interactive survey for audience identification and engagement
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Users, BarChart3, Heart } from 'lucide-react';

interface MicroSurveyProps {
  onResponse: (audience: string) => void;
  problemData: any;
}

interface SurveyOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const MicroSurvey: React.FC<MicroSurveyProps> = ({ onResponse, problemData }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const surveyOptions: SurveyOption[] = [
    {
      id: 'fitness',
      label: 'I want to optimize my athletic performance',
      icon: <BarChart3 className="w-6 h-6" />,
      description: 'Macro tracking, workout nutrition, body composition goals',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'family',
      label: 'I need to simplify meal planning for my family',
      icon: <Users className="w-6 h-6" />,
      description: 'Kid-friendly meals, dietary accommodations, time-saving solutions',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'health',
      label: 'I want evidence-based nutrition guidance',
      icon: <Heart className="w-6 h-6" />,
      description: 'Wellness goals, dietary requirements, health outcomes',
      color: 'from-orange-500 to-amber-600'
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onResponse(selectedOption);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      {/* Survey Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <span className="text-2xl">🎯</span>
          <span className="text-sm font-semibold text-teal-700">Quick Survey</span>
        </motion.div>
        
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Which Challenge Resonates Most With You?
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help us personalize your experience by identifying your primary nutrition challenge. 
          This takes less than 10 seconds.
        </p>
      </div>

      {/* Survey Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {surveyOptions.map((option, index) => (
          <motion.button
            key={option.id}
            className={`
              relative p-6 rounded-xl border-2 transition-all duration-300 text-left
              ${selectedOption === option.id 
                ? 'border-teal-500 bg-teal-50 shadow-lg scale-105' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }
            `}
            onClick={() => handleOptionSelect(option.id)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selection indicator */}
            <AnimatePresence>
              {selectedOption === option.id && (
                <motion.div
                  className="absolute top-4 right-4 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", duration: 0.3 }}
                >
                  <div className="w-3 h-3 bg-white rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Icon */}
            <div className={`
              inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
              bg-gradient-to-r ${option.color} text-white
            `}>
              {option.icon}
            </div>

            {/* Content */}
            <h4 className="font-semibold text-gray-900 mb-2 leading-tight">
              {option.label}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {option.description}
            </p>

            {/* Hover indicator */}
            <motion.div
              className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100"
              initial={{ x: -10 }}
              whileHover={{ x: 0 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <motion.button
          className={`
            inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold
            transition-all duration-300 min-w-[200px]
            ${selectedOption 
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
          onClick={handleSubmit}
          disabled={!selectedOption || isSubmitting}
          whileHover={selectedOption ? { scale: 1.05 } : {}}
          whileTap={selectedOption ? { scale: 0.95 } : {}}
        >
          <AnimatePresence mode="wait">
            {isSubmitting ? (
              <motion.div
                key="submitting"
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Personalizing...</span>
              </motion.div>
            ) : (
              <motion.div
                key="submit"
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span>Show My Personalized Solution</span>
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <p className="text-xs text-gray-500 mt-3">
          No signup required • Get instant personalized insights
        </p>
      </div>

      {/* Progress indicator */}
      <motion.div
        className="mt-6 bg-gray-200 rounded-full h-1"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <motion.div
          className="bg-gradient-to-r from-teal-500 to-cyan-500 h-1 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: selectedOption ? 1 : 0.7 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export { MicroSurvey }; 