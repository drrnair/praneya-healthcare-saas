/**
 * Cost of Confusion Component
 * Unified consequences section highlighting the price of nutrition confusion
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, AlertCircle } from 'lucide-react';

interface Consequence {
  icon: React.ReactNode;
  text: string;
  stat: string;
}

interface CostOfConfusionProps {
  consequences: Consequence[];
}

const CostOfConfusion: React.FC<CostOfConfusionProps> = ({ consequences }) => {
  return (
    <motion.div
      className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-200/50 shadow-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
            The Cost of Confusion
          </h3>
        </motion.div>
        
        <motion.p
          className="text-lg text-gray-700 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Every day you struggle with nutrition decisions, these consequences pile up, 
          affecting not just your goals, but your overall quality of life.
        </motion.p>
      </div>

      {/* Consequences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {consequences.map((consequence, index) => (
          <motion.div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-red-200/30 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, shadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          >
            {/* Icon and Stat */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg text-red-600">
                {consequence.icon}
              </div>
              <span className="text-sm font-bold text-red-700 bg-red-100 px-2 py-1 rounded-full">
                {consequence.stat}
              </span>
            </div>

            {/* Consequence Text */}
            <p className="text-gray-800 font-medium leading-relaxed">
              {consequence.text}
            </p>

            {/* Impact indicator */}
            <motion.div
              className="mt-4 flex items-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <TrendingDown className="w-4 h-4 text-red-500" />
              <div className="flex-1 bg-red-200 rounded-full h-2">
                <motion.div
                  className="bg-red-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "75%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.7 }}
                />
              </div>
              <span className="text-xs text-red-600 font-semibold">High Impact</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Cumulative Effect Warning */}
      <motion.div
        className="bg-gradient-to-r from-red-100 to-orange-100 rounded-xl p-6 border-l-4 border-red-500"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <motion.div
              className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-2xl">⚠️</span>
            </motion.div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              The Cumulative Effect
            </h4>
            <p className="text-gray-700 leading-relaxed">
              These aren't just minor inconveniences—they compound daily, creating a cycle of 
              frustration that keeps you further from your health and wellness goals. 
              <span className="font-semibold text-red-700"> The longer you wait, the more it costs you.</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Monthly Cost Calculator */}
      <motion.div
        className="mt-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">
            Your Monthly "Confusion Tax"
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">$200+</div>
              <div className="text-xs text-gray-600">Wasted Food</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">12hrs</div>
              <div className="text-xs text-gray-600">Lost Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">Daily</div>
              <div className="text-xs text-gray-600">Stress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">Months</div>
              <div className="text-xs text-gray-600">Delayed Goals</div>
            </div>
          </div>
          
          <motion.p
            className="text-sm text-gray-600 mt-4 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
          >
            That's over <span className="font-bold text-red-600">$2,400 annually</span> in direct costs alone—
            not counting the opportunity cost of delayed health goals.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export { CostOfConfusion }; 