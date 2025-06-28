/**
 * Drug-Food Interaction Dashboard - Premium Clinical Interface
 * Real-time interaction scanning with clinical evidence display
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DrugFoodInteraction, DrugInteraction, ClinicalCitation } from '@/types/clinical';

interface DrugFoodInteractionDashboardProps {
  patientId: string;
  medications: string[];
  foods: string[];
  onInteractionDetected?: (interaction: DrugFoodInteraction) => void;
  showEvidence?: boolean;
  theme?: 'standard' | 'premium' | 'clinical';
}

export const DrugFoodInteractionDashboard: React.FC<DrugFoodInteractionDashboardProps> = ({
  patientId,
  medications = [],
  foods = [],
  onInteractionDetected,
  showEvidence = true,
  theme = 'premium'
}) => {
  const [interactions, setInteractions] = useState<DrugFoodInteraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanMode, setScanMode] = useState<'realtime' | 'manual'>('realtime');

  // Mock interaction data - replace with real clinical database
  const mockInteractions: DrugFoodInteraction[] = [
    {
      medicationName: 'Warfarin',
      foodItem: 'Vitamin K Rich Foods (Spinach, Kale)',
      interactionType: 'metabolism_altered',
      severity: 'major',
      clinicalEffect: 'Decreased anticoagulation effectiveness',
      recommendations: {
        timing: 'Maintain consistent vitamin K intake',
        alternatives: ['Monitor INR more frequently', 'Consider vitamin K-restricted diet'],
        monitoring: ['Weekly INR checks for 2 weeks after dietary changes']
      },
      evidence: []
    },
    {
      medicationName: 'Levothyroxine',
      foodItem: 'Calcium-rich foods, Coffee',
      interactionType: 'absorption_decreased',
      severity: 'moderate',
      clinicalEffect: 'Reduced thyroid hormone absorption',
      recommendations: {
        timing: 'Take medication 4 hours before or after calcium-rich foods',
        alternatives: ['Take on empty stomach', 'Separate from coffee by 1 hour'],
        monitoring: ['TSH levels after 6-8 weeks of dietary changes']
      },
      evidence: []
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'contraindicated':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'major':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'minor':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const scanForInteractions = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInteractions(mockInteractions);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (scanMode === 'realtime' && medications.length > 0) {
      scanForInteractions();
    }
  }, [medications, foods, scanMode]);

  return (
    <div className="drug-food-interaction-dashboard bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Drug-Food Interactions</h2>
            <p className="text-sm text-gray-600 mt-1">
              Real-time clinical interaction analysis
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={scanForInteractions}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
              {loading ? 'Scanning...' : 'Scan Interactions'}
            </button>
            {theme === 'premium' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                Premium Clinical
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Scan Mode Toggle */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="scanMode"
                value="realtime"
                checked={scanMode === 'realtime'}
                onChange={(e) => setScanMode(e.target.value as any)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Real-time Scanning</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="scanMode"
                value="manual"
                checked={scanMode === 'manual'}
                onChange={(e) => setScanMode(e.target.value as any)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Manual Scan</span>
            </label>
          </div>
          <div className="text-sm text-gray-500">
            {medications.length} medications • {foods.length} foods monitored
          </div>
        </div>
      </div>

      {/* Interactions Display */}
      <div className="p-6">
        {interactions.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Interactions Detected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Current medications and foods show no significant interactions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {interaction.medicationName} ↔ {interaction.foodItem}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(interaction.severity)}`}>
                        {interaction.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {interaction.clinicalEffect}
                    </p>
                  </div>
                </div>

                {/* Clinical Recommendations */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Clinical Recommendations</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-blue-800">Timing:</span>
                      <span className="text-sm text-blue-700 ml-2">{interaction.recommendations.timing}</span>
                    </div>
                    {interaction.recommendations.alternatives.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-blue-800">Alternatives:</span>
                        <ul className="list-disc list-inside text-sm text-blue-700 ml-2">
                          {interaction.recommendations.alternatives.map((alt, i) => (
                            <li key={i}>{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {interaction.recommendations.monitoring.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-blue-800">Monitoring:</span>
                        <ul className="list-disc list-inside text-sm text-blue-700 ml-2">
                          {interaction.recommendations.monitoring.map((monitor, i) => (
                            <li key={i}>{monitor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View Evidence
                  </button>
                  <button className="text-sm text-amber-600 hover:text-amber-800 font-medium">
                    Notify Provider
                  </button>
                  <button className="text-sm text-green-600 hover:text-green-800 font-medium">
                    Add to Care Plan
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Clinical Disclaimer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-amber-50">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              <strong>Clinical Disclaimer:</strong> This interaction screening is for informational purposes only. 
              Always consult with a healthcare professional or pharmacist before making medication or dietary changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
