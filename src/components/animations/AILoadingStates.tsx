'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_VARIANTS, SPRING_PRESETS, hapticFeedback } from '@/lib/animations/animation-system';
import { 
  Camera, 
  ChefHat, 
  BarChart3, 
  Search, 
  Brain, 
  Sparkles, 
  Loader2,
  CheckCircle,
  Utensils,
  TrendingUp,
  Scan,
  Activity
} from 'lucide-react';

// Food Recognition Scanning Animation
interface FoodScanningAnimationProps {
  isScanning: boolean;
  progress?: number;
  foodItem?: string;
  onComplete?: () => void;
}

export const FoodScanningAnimation: React.FC<FoodScanningAnimationProps> = ({
  isScanning,
  progress = 0,
  foodItem,
  onComplete
}) => {
  const [scanPhase, setScanPhase] = useState<'scanning' | 'analyzing' | 'complete'>('scanning');

  useEffect(() => {
    if (progress < 50) {
      setScanPhase('scanning');
    } else if (progress < 100) {
      setScanPhase('analyzing');
    } else {
      setScanPhase('complete');
      hapticFeedback.success();
      onComplete?.();
    }
  }, [progress, onComplete]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Scanning Frame */}
      <motion.div
        className="relative aspect-square bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl overflow-hidden border-2 border-teal-200"
        animate={isScanning ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Scanner Grid Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-teal-300"
                animate={isScanning ? {
                  opacity: [0.2, 0.8, 0.2],
                } : {}}
                transition={{
                  duration: 1.5,
                  delay: i * 0.02,
                  repeat: Infinity
                }}
              />
            ))}
          </div>
        </div>

        {/* Scanning Beam */}
        {isScanning && scanPhase === 'scanning' && (
          <motion.div
            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"
            animate={{
              y: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Corner Brackets */}
        {isScanning && (
          <>
            {[
              'top-4 left-4',
              'top-4 right-4',
              'bottom-4 left-4',
              'bottom-4 right-4'
            ].map((position, index) => (
              <motion.div
                key={index}
                className={cn('absolute w-8 h-8 border-2 border-teal-500', position)}
                style={{
                  borderTop: position.includes('top') ? '2px solid' : 'none',
                  borderLeft: position.includes('left') ? '2px solid' : 'none',
                  borderRight: position.includes('right') ? '2px solid' : 'none',
                  borderBottom: position.includes('bottom') ? '2px solid' : 'none',
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.1,
                  repeat: Infinity
                }}
              />
            ))}
          </>
        )}

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {scanPhase === 'scanning' && (
            <motion.div
              className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Camera className="w-8 h-8 text-teal-600" />
            </motion.div>
          )}

          {scanPhase === 'analyzing' && (
            <motion.div
              className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-8 h-8 text-teal-600" />
            </motion.div>
          )}

          {scanPhase === 'complete' && (
            <motion.div
              className="w-16 h-16 bg-green-500 rounded-full shadow-lg flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={SPRING_PRESETS.BOUNCY}
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScanning ? 1 : 0 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>

      {/* Status Text */}
      <motion.div
        className="mt-3 text-center"
        variants={ANIMATION_VARIANTS.fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {scanPhase === 'scanning' && (
            <motion.p
              key="scanning"
              className="text-lg font-medium text-gray-700"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Scanning food...
            </motion.p>
          )}
          {scanPhase === 'analyzing' && (
            <motion.p
              key="analyzing"
              className="text-lg font-medium text-teal-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Analyzing nutrition...
            </motion.p>
          )}
          {scanPhase === 'complete' && foodItem && (
            <motion.p
              key="complete"
              className="text-lg font-semibold text-green-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Found: {foodItem}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// Recipe Generation Animation with Cascading Cards
interface RecipeGenerationAnimationProps {
  isGenerating: boolean;
  recipes?: string[];
  onComplete?: () => void;
}

export const RecipeGenerationAnimation: React.FC<RecipeGenerationAnimationProps> = ({
  isGenerating,
  recipes = [],
  onComplete
}) => {
  const [visibleRecipes, setVisibleRecipes] = useState<string[]>([]);

  useEffect(() => {
    if (!isGenerating && recipes.length > 0) {
      const timer = setInterval(() => {
        setVisibleRecipes(prev => {
          if (prev.length < recipes.length) {
            hapticFeedback.light();
            return [...prev, recipes[prev.length]];
          } else {
            clearInterval(timer);
            hapticFeedback.success();
            onComplete?.();
            return prev;
          }
        });
      }, 500);

      return () => clearInterval(timer);
    }
  }, [isGenerating, recipes, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        variants={ANIMATION_VARIANTS.fadeInDown}
        initial="hidden"
        animate="visible"
      >
        <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl">
          {isGenerating ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ChefHat className="w-8 h-8 text-orange-600" />
            </motion.div>
          ) : (
            <ChefHat className="w-8 h-8 text-orange-600" />
          )}
          <h3 className="text-xl font-semibold text-gray-800">
            {isGenerating ? 'Generating Recipes...' : 'Recipe Suggestions'}
          </h3>
        </div>
      </motion.div>

      {/* Recipe Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loading Placeholders */}
        {isGenerating && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={`placeholder-${index}`}
                className="bg-white rounded-xl border-2 border-gray-200 p-6"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.2,
                  repeat: Infinity
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-3/5 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </>
        )}

        {/* Generated Recipe Cards */}
        <AnimatePresence>
          {visibleRecipes.map((recipe, index) => (
            <motion.div
              key={`recipe-${index}`}
              className="bg-white rounded-xl border-2 border-teal-200 p-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                ...SPRING_PRESETS.BOUNCY,
                delay: index * 0.1
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={SPRING_PRESETS.SNAPPY}
                >
                  <Utensils className="w-6 h-6 text-teal-600" />
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{recipe}</h4>
                  <p className="text-sm text-gray-500">AI-generated recipe</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-teal-600">
                <Sparkles className="w-4 h-4" />
                <span>Personalized for your preferences</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Nutrition Analysis Animation with Progressive Data Population
interface NutritionAnalysisAnimationProps {
  isAnalyzing: boolean;
  nutritionData?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  onComplete?: () => void;
}

export const NutritionAnalysisAnimation: React.FC<NutritionAnalysisAnimationProps> = ({
  isAnalyzing,
  nutritionData,
  onComplete
}) => {
  const [visibleMetrics, setVisibleMetrics] = useState<string[]>([]);
  
  const metrics = [
    { key: 'calories', label: 'Calories', value: nutritionData?.calories || 0, color: 'text-red-600', bg: 'bg-red-100' },
    { key: 'protein', label: 'Protein', value: nutritionData?.protein || 0, color: 'text-blue-600', bg: 'bg-blue-100' },
    { key: 'carbs', label: 'Carbs', value: nutritionData?.carbs || 0, color: 'text-green-600', bg: 'bg-green-100' },
    { key: 'fat', label: 'Fat', value: nutritionData?.fat || 0, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  useEffect(() => {
    if (!isAnalyzing && nutritionData) {
      const timer = setInterval(() => {
        setVisibleMetrics(prev => {
          if (prev.length < metrics.length) {
            hapticFeedback.light();
            return [...prev, metrics[prev.length].key];
          } else {
            clearInterval(timer);
            hapticFeedback.success();
            onComplete?.();
            return prev;
          }
        });
      }, 300);

      return () => clearInterval(timer);
    }
  }, [isAnalyzing, nutritionData, onComplete]);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        variants={ANIMATION_VARIANTS.fadeInDown}
        initial="hidden"
        animate="visible"
      >
        <div className="inline-flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl">
          {isAnalyzing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </motion.div>
          ) : (
            <BarChart3 className="w-8 h-8 text-blue-600" />
          )}
          <h3 className="text-xl font-semibold text-gray-800">
            {isAnalyzing ? 'Analyzing Nutrition...' : 'Nutrition Analysis'}
          </h3>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.key}
            className={cn(
              'p-6 rounded-xl border-2',
              isAnalyzing ? 'border-gray-200 bg-gray-50' : 'border-teal-200 bg-white shadow-lg'
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isAnalyzing ? [0.3, 0.7, 0.3] : visibleMetrics.includes(metric.key) ? 1 : 0,
              scale: visibleMetrics.includes(metric.key) ? 1 : 0.8,
            }}
            transition={
              isAnalyzing
                ? { duration: 1.5, delay: index * 0.2, repeat: Infinity }
                : SPRING_PRESETS.BOUNCY
            }
          >
            <div className="text-center">
              <div className={cn('w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center', metric.bg)}>
                <Activity className={cn('w-6 h-6', metric.color)} />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {visibleMetrics.includes(metric.key) ? metric.value : '---'}
              </div>
              <div className="text-sm text-gray-500">{metric.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Search Results Animation with Staggered Entrance
interface SearchResultsAnimationProps {
  isSearching: boolean;
  results?: string[];
  onComplete?: () => void;
}

export const SearchResultsAnimation: React.FC<SearchResultsAnimationProps> = ({
  isSearching,
  results = [],
  onComplete
}) => {
  const [visibleResults, setVisibleResults] = useState<string[]>([]);

  useEffect(() => {
    if (!isSearching && results.length > 0) {
      results.forEach((result, index) => {
        setTimeout(() => {
          setVisibleResults(prev => [...prev, result]);
          hapticFeedback.light();
          if (index === results.length - 1) {
            hapticFeedback.success();
            onComplete?.();
          }
        }, index * 100);
      });
    }
  }, [isSearching, results, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Header */}
      <motion.div
        className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 mb-6"
        variants={ANIMATION_VARIANTS.fadeInDown}
        initial="hidden"
        animate="visible"
      >
        <div className="relative">
          <Search className="w-6 h-6 text-gray-400" />
          {isSearching && (
            <motion.div
              className="absolute -inset-2 border-2 border-teal-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search nutrition database..."
            className="w-full border-none outline-none text-gray-800"
            disabled
          />
        </div>
        {isSearching && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-5 h-5 text-teal-500" />
          </motion.div>
        )}
      </motion.div>

      {/* Results List */}
      <div className="space-y-3">
        {isSearching && (
          <>
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={`loading-${index}`}
                className="p-4 bg-gray-100 rounded-lg"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  delay: index * 0.1,
                  repeat: Infinity
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-300 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        )}

        <AnimatePresence>
          {visibleResults.map((result, index) => (
            <motion.div
              key={`result-${index}`}
              className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{result}</h4>
                  <p className="text-sm text-gray-500">Nutrition information available</p>
                </div>
                <motion.button
                  className="text-teal-600 hover:text-teal-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}; 