'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualization, NutritionData, colorPalettes } from '../VisualizationProvider';

interface NutritionBalanceWheelProps {
  data: NutritionData;
  showGoals?: boolean;
  enableInteraction?: boolean;
  size?: number;
  className?: string;
}

interface MacroSegment {
  name: string;
  value: number;
  goal: number;
  color: string;
  percentage: number;
  goalPercentage: number;
  angle: number;
  goalAngle: number;
}

export function NutritionBalanceWheel({
  data,
  showGoals = true,
  enableInteraction = true,
  size = 300,
  className = ''
}: NutritionBalanceWheelProps) {
  const { 
    isReducedMotion, 
    colorTheme, 
    getAlternativeText,
    announceDataChange 
  } = useVisualization();
  
  const [hoveredSegment, setHoveredSegment] = useState<MacroSegment | null>(null);
  const [selectedView, setSelectedView] = useState<'current' | 'goals'>('current');
  
  const colors = colorPalettes[colorTheme];
  const radius = size / 2 - 20;
  const innerRadius = radius * 0.6;
  const center = size / 2;
  
  // Calculate macronutrient segments
  const calculateSegments = (): MacroSegment[] => {
    const proteinCals = data.protein * 4;
    const carbsCals = data.carbs * 4;
    const fatCals = data.fat * 9;
    const totalCals = proteinCals + carbsCals + fatCals;
    
    const proteinGoalCals = data.goals.protein * 4;
    const carbsGoalCals = data.goals.carbs * 4;
    const fatGoalCals = data.goals.fat * 9;
    const totalGoalCals = proteinGoalCals + carbsGoalCals + fatGoalCals;
    
    const segments: MacroSegment[] = [
      {
        name: 'Protein',
        value: data.protein,
        goal: data.goals.protein,
        color: '#10B981', // Green
        percentage: (proteinCals / totalCals) * 100,
        goalPercentage: (proteinGoalCals / totalGoalCals) * 100,
        angle: (proteinCals / totalCals) * 360,
        goalAngle: (proteinGoalCals / totalGoalCals) * 360
      },
      {
        name: 'Carbohydrates',
        value: data.carbs,
        goal: data.goals.carbs,
        color: '#3B82F6', // Blue
        percentage: (carbsCals / totalCals) * 100,
        goalPercentage: (carbsGoalCals / totalGoalCals) * 100,
        angle: (carbsCals / totalCals) * 360,
        goalAngle: (carbsGoalCals / totalGoalCals) * 360
      },
      {
        name: 'Fat',
        value: data.fat,
        goal: data.goals.fat,
        color: '#F59E0B', // Amber
        percentage: (fatCals / totalCals) * 100,
        goalPercentage: (fatGoalCals / totalGoalCals) * 100,
        angle: (fatCals / totalCals) * 360,
        goalAngle: (fatGoalCals / totalGoalCals) * 360
      }
    ];
    
    return segments;
  };
  
  const segments = calculateSegments();
  
  // Create SVG path for donut segment
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number
  ): string => {
    const start = polarToCartesian(center, center, outerRadius, endAngle);
    const end = polarToCartesian(center, center, outerRadius, startAngle);
    const innerStart = polarToCartesian(center, center, innerRadius, endAngle);
    const innerEnd = polarToCartesian(center, center, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", start.x, start.y,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ");
  };
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  // Handle segment hover
  const handleSegmentHover = (segment: MacroSegment | null) => {
    if (!enableInteraction) return;
    
    setHoveredSegment(segment);
    
    if (segment) {
      const message = `${segment.name}: ${segment.value}g (${Math.round(segment.percentage)}% of calories)`;
      announceDataChange(message);
    }
  };
  
  // Toggle between current and goals view
  const toggleView = () => {
    if (!enableInteraction) return;
    
    const newView = selectedView === 'current' ? 'goals' : 'current';
    setSelectedView(newView);
    announceDataChange(`Switched to ${newView} view`);
  };
  
  // Calculate progress towards goals
  const overallProgress = segments.reduce((acc, segment) => {
    return acc + Math.min(segment.value / segment.goal, 1);
  }, 0) / segments.length;
  
  const altText = getAlternativeText('nutrition-wheel', {
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fat: data.fat
  });
  
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: isReducedMotion ? 0.1 : 0.5 }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Nutrition Balance</h3>
          {showGoals && (
            <motion.button
              onClick={toggleView}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedView === 'goals' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={isReducedMotion ? {} : { scale: 1.02 }}
              whileTap={isReducedMotion ? {} : { scale: 0.98 }}
            >
              {selectedView === 'current' ? 'Show Goals' : 'Show Current'}
            </motion.button>
          )}
        </div>
        
        {/* Progress indicator */}
        {showGoals && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Overall Goal Progress</span>
              <span className="text-sm font-medium text-gray-800">{Math.round(overallProgress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress * 100}%` }}
                transition={{ duration: isReducedMotion ? 0.1 : 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
        
        {/* Total calories */}
        <div className="text-center">
          <span className="text-3xl font-bold text-gray-800">{data.calories}</span>
          <span className="text-sm text-gray-500 ml-1">calories</span>
          {showGoals && (
            <div className="text-sm text-gray-600">
              Goal: {data.goals.calories} calories
            </div>
          )}
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
            role="img"
            aria-label={altText}
          >
            <defs>
              {segments.map((segment) => (
                <linearGradient key={`gradient-${segment.name}`} id={`gradient-${segment.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={segment.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={segment.color} stopOpacity={1} />
                </linearGradient>
              ))}
            </defs>
            
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth={radius - innerRadius}
            />
            
            {/* Segments */}
            {segments.map((segment, index) => {
              const prevAngles = segments.slice(0, index).reduce((sum, s) => 
                sum + (selectedView === 'current' ? s.angle : s.goalAngle), 0
              );
              const currentAngle = selectedView === 'current' ? segment.angle : segment.goalAngle;
              const startAngle = prevAngles;
              const endAngle = prevAngles + currentAngle;
              
              return (
                <motion.path
                  key={`${segment.name}-${selectedView}`}
                  d={createArcPath(startAngle, endAngle, radius, innerRadius)}
                  fill={`url(#gradient-${segment.name})`}
                  stroke="white"
                  strokeWidth={2}
                  className="cursor-pointer"
                  onMouseEnter={() => handleSegmentHover(segment)}
                  onMouseLeave={() => handleSegmentHover(null)}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ 
                    pathLength: 1, 
                    opacity: hoveredSegment === segment ? 0.8 : 1,
                    scale: hoveredSegment === segment ? 1.02 : 1
                  }}
                  transition={{ 
                    duration: isReducedMotion ? 0.1 : 0.8, 
                    delay: isReducedMotion ? 0 : index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={isReducedMotion ? {} : { scale: 1.02 }}
                />
              );
            })}
            
            {/* Center label */}
            <text
              x={center}
              y={center}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-800 text-sm font-medium transform rotate-90"
              style={{ transformOrigin: `${center}px ${center}px` }}
            >
              {selectedView === 'current' ? 'Current' : 'Goals'}
            </text>
          </svg>
          
          {/* Hover tooltip */}
          <AnimatePresence>
            {hoveredSegment && (
              <motion.div
                className="absolute bg-gray-800 text-white p-3 rounded-lg shadow-lg pointer-events-none z-10"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-center">
                  <div className="font-semibold">{hoveredSegment.name}</div>
                  <div className="text-lg">{hoveredSegment.value}g</div>
                  <div className="text-sm text-gray-300">
                    {Math.round(hoveredSegment.percentage)}% of calories
                  </div>
                  {showGoals && (
                    <div className="text-sm text-gray-300 mt-1">
                      Goal: {hoveredSegment.goal}g
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-3 gap-4">
        {segments.map((segment) => (
          <motion.div
            key={segment.name}
            className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
            onMouseEnter={() => handleSegmentHover(segment)}
            onMouseLeave={() => handleSegmentHover(null)}
            whileHover={isReducedMotion ? {} : { scale: 1.02 }}
          >
            <div className="flex items-center justify-center mb-2">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-sm font-medium text-gray-700">{segment.name}</span>
            </div>
            <div className="text-lg font-bold text-gray-800">{segment.value}g</div>
            <div className="text-sm text-gray-500">
              {Math.round(selectedView === 'current' ? segment.percentage : segment.goalPercentage)}%
            </div>
            {showGoals && (
              <div className="text-xs text-gray-400 mt-1">
                Goal: {segment.goal}g
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Deficiency alerts */}
      <AnimatePresence>
        {segments.some(s => s.value < s.goal * 0.8) && (
          <motion.div
            className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-2">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <span className="text-sm font-medium text-yellow-800">Nutritional Guidance</span>
            </div>
            <div className="text-sm text-yellow-700">
              {segments
                .filter(s => s.value < s.goal * 0.8)
                .map(s => `Consider adding more ${s.name.toLowerCase()}-rich foods`)
                .join('. ')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Screen reader description */}
      <div className="sr-only">
        {altText}. Breakdown: {segments.map(s => 
          `${s.name} ${s.value}g (${Math.round(s.percentage)}%)`
        ).join(', ')}.
      </div>
    </motion.div>
  );
} 