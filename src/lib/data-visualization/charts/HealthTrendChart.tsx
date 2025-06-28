'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualization, HealthMetric, getHealthZone, formatHealthValue, colorPalettes } from '../VisualizationProvider';

interface HealthTrendChartProps {
  metrics: HealthMetric[];
  selectedMetricId?: string;
  height?: number;
  showGoals?: boolean;
  enableInteraction?: boolean;
  className?: string;
}

interface DataPoint {
  timestamp: Date;
  value: number;
  zone: 'optimal' | 'caution' | 'warning' | 'critical';
}

export function HealthTrendChart({
  metrics = [],
  selectedMetricId,
  height = 300,
  showGoals = true,
  enableInteraction = true,
  className = ''
}: HealthTrendChartProps) {
  const { 
    isReducedMotion, 
    colorTheme, 
    timeRange, 
    getAlternativeText,
    announceDataChange 
  } = useVisualization();
  
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(
    metrics.find(m => m.id === selectedMetricId) || metrics[0] || null
  );
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const colors = colorPalettes[colorTheme];
  
  // Generate sample historical data for demonstration
  const generateHistoricalData = (metric: HealthMetric): DataPoint[] => {
    const points: DataPoint[] = [];
    const now = new Date();
    const days = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    
    for (let i = days; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const baseValue = metric.value;
      const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
      const value = Math.max(metric.range.min, Math.min(metric.range.max, baseValue * (1 + variation)));
      const zone = getHealthZone(value, metric.range);
      
      points.push({
        timestamp,
        value: Math.round(value * 10) / 10,
        zone: zone as 'optimal' | 'caution' | 'warning' | 'critical'
      });
    }
    
    return points;
  };
  
  const dataPoints = selectedMetric ? generateHistoricalData(selectedMetric) : [];
  
  // Chart dimensions and scaling
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = 800 - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  const xScale = (index: number) => (index / (dataPoints.length - 1)) * chartWidth;
  const yScale = (value: number) => {
    if (!selectedMetric) return 0;
    const { min, max } = selectedMetric.range;
    return chartHeight - ((value - min) / (max - min)) * chartHeight;
  };
  
  // Create line path
  const createLinePath = (points: DataPoint[]): string => {
    if (points.length === 0) return '';
    
    return points.reduce((path, point, index) => {
      const x = xScale(index);
      const y = yScale(point.value);
      return index === 0 ? `M ${x} ${y}` : `${path} L ${x} ${y}`;
    }, '');
  };
  
  // Create area path for health zones
  const createAreaPath = (points: DataPoint[], baseline: number): string => {
    if (points.length === 0) return '';
    
    const linePath = createLinePath(points);
    const baselineY = yScale(baseline);
    const firstX = xScale(0);
    const lastX = xScale(points.length - 1);
    
    return `${linePath} L ${lastX} ${baselineY} L ${firstX} ${baselineY} Z`;
  };
  
  // Handle metric selection
  const handleMetricSelect = (metric: HealthMetric) => {
    if (!enableInteraction) return;
    
    setIsLoading(true);
    setSelectedMetric(metric);
    announceDataChange(`Selected ${metric.name} trend chart`);
    
    // Simulate loading time for smooth transition
    setTimeout(() => setIsLoading(false), isReducedMotion ? 100 : 500);
  };
  
  // Handle point hover
  const handlePointHover = (point: DataPoint | null, event?: React.MouseEvent) => {
    if (!enableInteraction) return;
    
    setHoveredPoint(point);
    
    if (point && selectedMetric) {
      const message = `${selectedMetric.name}: ${formatHealthValue(point.value, selectedMetric.unit)} on ${point.timestamp.toLocaleDateString()}`;
      announceDataChange(message);
    }
  };
  
  // Accessibility alternative text
  const altText = selectedMetric ? getAlternativeText('health-trend', {
    metrics: [selectedMetric],
    summary: `${selectedMetric.name} trending ${selectedMetric.trend} over ${timeRange}`
  }) : 'No health metrics available';
  
  if (!selectedMetric) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <span className="text-4xl mb-2 block">📊</span>
          <p>No health metrics available</p>
          <p className="text-sm">Start tracking your health data to see trends</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isReducedMotion ? 0.1 : 0.5 }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Health Trends</h3>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              selectedMetric.trend === 'improving' ? 'bg-green-100 text-green-800' :
              selectedMetric.trend === 'stable' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {selectedMetric.trend === 'improving' ? '📈' : 
               selectedMetric.trend === 'stable' ? '➡️' : '📉'} {selectedMetric.trend}
            </span>
          </div>
        </div>
        
        {/* Metric selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {metrics.map((metric) => (
            <motion.button
              key={metric.id}
              onClick={() => handleMetricSelect(metric)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric.id === metric.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={isReducedMotion ? {} : { scale: 1.02 }}
              whileTap={isReducedMotion ? {} : { scale: 0.98 }}
              disabled={isLoading}
            >
              {metric.name}
            </motion.button>
          ))}
        </div>
        
        {/* Current value display */}
        <div className="flex items-center gap-4">
          <div>
            <span className="text-3xl font-bold" style={{ color: colors.zones[getHealthZone(selectedMetric.value, selectedMetric.range)] }}>
              {formatHealthValue(selectedMetric.value, selectedMetric.unit)}
            </span>
            <span className="text-sm text-gray-500 ml-2">Current</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            getHealthZone(selectedMetric.value, selectedMetric.range) === 'optimal' ? 'bg-green-100 text-green-800' :
            getHealthZone(selectedMetric.value, selectedMetric.range) === 'caution' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {getHealthZone(selectedMetric.value, selectedMetric.range)}
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="flex items-center justify-center"
            style={{ height }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <motion.div
                className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-sm text-gray-500">Loading trend data...</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chart"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: isReducedMotion ? 0.1 : 0.3 }}
          >
            <svg
              ref={svgRef}
              width="100%"
              height={height}
              viewBox={`0 0 800 ${height}`}
              className="overflow-visible"
              role="img"
              aria-label={altText}
            >
              <defs>
                <linearGradient id="healthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors.primary} stopOpacity={0.05} />
                </linearGradient>
                
                {/* Health zone backgrounds */}
                <pattern id="optimalZone" patternUnits="userSpaceOnUse" width="4" height="4">
                  <rect width="4" height="4" fill={colors.zones.optimal} opacity={0.1} />
                </pattern>
                <pattern id="cautionZone" patternUnits="userSpaceOnUse" width="4" height="4">
                  <rect width="4" height="4" fill={colors.zones.caution} opacity={0.1} />
                </pattern>
                <pattern id="warningZone" patternUnits="userSpaceOnUse" width="4" height="4">
                  <rect width="4" height="4" fill={colors.zones.warning} opacity={0.1} />
                </pattern>
              </defs>
              
              <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Health zone backgrounds */}
                {showGoals && (
                  <>
                    <rect
                      x={0}
                      y={yScale(selectedMetric.range.optimal.max)}
                      width={chartWidth}
                      height={yScale(selectedMetric.range.optimal.min) - yScale(selectedMetric.range.optimal.max)}
                      fill="url(#optimalZone)"
                    />
                    <rect
                      x={0}
                      y={yScale(selectedMetric.range.caution.max)}
                      width={chartWidth}
                      height={yScale(selectedMetric.range.caution.min) - yScale(selectedMetric.range.caution.max)}
                      fill="url(#cautionZone)"
                    />
                  </>
                )}
                
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map((ratio) => (
                  <line
                    key={ratio}
                    x1={0}
                    y1={chartHeight * ratio}
                    x2={chartWidth}
                    y2={chartHeight * ratio}
                    stroke={colors.neutral}
                    strokeOpacity={0.2}
                    strokeDasharray="2,2"
                  />
                ))}
                
                {/* Area under curve */}
                <motion.path
                  d={createAreaPath(dataPoints, selectedMetric.range.min)}
                  fill="url(#healthGradient)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: isReducedMotion ? 0.1 : 1, ease: "easeOut" }}
                />
                
                {/* Main trend line */}
                <motion.path
                  d={createLinePath(dataPoints)}
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: isReducedMotion ? 0.1 : 1.2, ease: "easeOut" }}
                />
                
                {/* Data points */}
                {dataPoints.map((point, index) => (
                  <motion.circle
                    key={index}
                    cx={xScale(index)}
                    cy={yScale(point.value)}
                    r={hoveredPoint === point ? 6 : 4}
                    fill={colors.zones[point.zone]}
                    stroke="white"
                    strokeWidth={2}
                    className="cursor-pointer"
                    onMouseEnter={() => handlePointHover(point)}
                    onMouseLeave={() => handlePointHover(null)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      duration: isReducedMotion ? 0.1 : 0.3, 
                      delay: isReducedMotion ? 0 : index * 0.02 
                    }}
                    whileHover={isReducedMotion ? {} : { scale: 1.2 }}
                  />
                ))}
                
                {/* Y-axis labels */}
                {[selectedMetric.range.min, selectedMetric.range.optimal.min, selectedMetric.range.optimal.max, selectedMetric.range.max].map((value) => (
                  <text
                    key={value}
                    x={-10}
                    y={yScale(value)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="text-xs fill-gray-500"
                  >
                    {formatHealthValue(value, selectedMetric.unit)}
                  </text>
                ))}
                
                {/* X-axis labels */}
                {dataPoints.filter((_, i) => i % Math.ceil(dataPoints.length / 5) === 0).map((point, index) => (
                  <text
                    key={index}
                    x={xScale(index * Math.ceil(dataPoints.length / 5))}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    {point.timestamp.toLocaleDateString()}
                  </text>
                ))}
              </g>
            </svg>
            
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredPoint && (
                <motion.div
                  className="absolute bg-gray-800 text-white p-3 rounded-lg shadow-lg pointer-events-none z-10"
                  style={{
                    left: xScale(dataPoints.indexOf(hoveredPoint)) + margin.left,
                    top: yScale(hoveredPoint.value) + margin.top - 80
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-sm">
                    <div className="font-semibold">{selectedMetric.name}</div>
                    <div>{formatHealthValue(hoveredPoint.value, selectedMetric.unit)}</div>
                    <div className="text-gray-300">{hoveredPoint.timestamp.toLocaleDateString()}</div>
                    <div className={`text-xs mt-1 px-2 py-1 rounded ${
                      hoveredPoint.zone === 'optimal' ? 'bg-green-600' :
                      hoveredPoint.zone === 'caution' ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}>
                      {hoveredPoint.zone}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Alternative text for screen readers */}
      <div className="sr-only">
        {altText}. Current value: {formatHealthValue(selectedMetric.value, selectedMetric.unit)} in {getHealthZone(selectedMetric.value, selectedMetric.range)} zone.
      </div>
    </motion.div>
  );
} 