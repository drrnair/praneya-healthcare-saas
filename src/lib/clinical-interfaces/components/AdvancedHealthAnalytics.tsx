/**
 * Advanced Health Analytics Interface - Premium Clinical Interface
 * Predictive modeling visualizations with clinical decision support
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClinicalMetric, PredictiveModel } from '@/types/clinical';

interface AdvancedHealthAnalyticsProps {
  patientId: string;
  providerId?: string;
  timeRange?: '1month' | '3months' | '6months' | '1year';
  onInsightGenerated?: (insight: any) => void;
  theme?: 'standard' | 'premium' | 'clinical';
}

export const AdvancedHealthAnalytics: React.FC<AdvancedHealthAnalyticsProps> = ({
  patientId,
  providerId,
  timeRange = '3months',
  onInsightGenerated,
  theme = 'premium'
}) => {
  const [activeAnalysis, setActiveAnalysis] = useState('predictive');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<ClinicalMetric[]>([]);
  const [models, setModels] = useState<PredictiveModel[]>([]);

  // Mock clinical metrics
  const mockMetrics: ClinicalMetric[] = [
    {
      id: 'metric_001',
      name: 'Cardiovascular Risk Score',
      category: 'cardiovascular',
      value: 12.5,
      unit: '%',
      timestamp: new Date().toISOString(),
      calculation: {
        formula: 'Framingham Risk Score + Lifestyle Factors',
        inputs: {
          age: 45,
          cholesterol: 220,
          hdl: 45,
          systolic_bp: 135,
          smoking: false,
          diabetes: false
        },
        confidence_interval: { lower: 10.2, upper: 14.8 }
      },
      interpretation: {
        status: 'concerning',
        trend: 'stable',
        clinical_significance: 'Moderate cardiovascular risk requiring lifestyle intervention',
        recommendations: [
          'Increase physical activity to 150 minutes/week',
          'Reduce sodium intake to <2300mg/day',
          'Consider statin therapy evaluation'
        ]
      },
      benchmarks: {
        population_average: 8.5,
        target_value: 5.0,
        percentile_rank: 75
      }
    },
    {
      id: 'metric_002',
      name: 'Nutritional Adequacy Score',
      category: 'nutritional',
      value: 78,
      unit: '/100',
      timestamp: new Date().toISOString(),
      calculation: {
        formula: 'Weighted sum of micronutrient adequacy ratios',
        inputs: {
          vitamins: 82,
          minerals: 74,
          macronutrients: 85,
          fiber: 65
        },
        confidence_interval: { lower: 75, upper: 81 }
      },
      interpretation: {
        status: 'good',
        trend: 'improving',
        clinical_significance: 'Adequate nutrition with room for improvement in fiber intake',
        recommendations: [
          'Increase fiber-rich foods (target: 25g/day)',
          'Add more leafy green vegetables',
          'Consider magnesium supplementation'
        ]
      },
      benchmarks: {
        population_average: 65,
        target_value: 85,
        percentile_rank: 68
      }
    }
  ];

  // Mock predictive models
  const mockModels: PredictiveModel[] = [
    {
      id: 'model_001',
      modelName: 'T2DM Risk Prediction',
      type: 'risk_prediction',
      predictions: [
        {
          outcome: 'Type 2 Diabetes Development',
          probability: 0.18,
          confidence_interval: { lower: 0.12, upper: 0.24 },
          time_horizon: '5 years',
          factors: [
            { factor: 'BMI > 30', contribution: 0.35, importance: 'high' },
            { factor: 'Family History', contribution: 0.25, importance: 'high' },
            { factor: 'Age > 45', contribution: 0.20, importance: 'medium' },
            { factor: 'Sedentary Lifestyle', contribution: 0.15, importance: 'medium' },
            { factor: 'High Carb Diet', contribution: 0.05, importance: 'low' }
          ]
        }
      ],
      lastUpdated: new Date().toISOString(),
      modelVersion: '2.1.0',
      validation: {
        accuracy: 0.84,
        sensitivity: 0.79,
        specificity: 0.87,
        sample_size: 15420
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'concerning':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (probability: number) => {
    if (probability < 0.1) return 'text-green-600 bg-green-50';
    if (probability < 0.2) return 'text-yellow-600 bg-yellow-50';
    if (probability < 0.3) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const runAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setMetrics(mockMetrics);
      setModels(mockModels);
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    runAnalysis();
  }, [timeRange, activeAnalysis]);

  return (
    <div className="advanced-health-analytics bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Advanced Health Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered clinical decision support and predictive modeling
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setLoading(true)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            {theme === 'premium' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AI Analytics
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Analytics">
          {[
            { id: 'predictive', label: 'Predictive Models', icon: '🔮' },
            { id: 'correlation', label: 'Correlation Analysis', icon: '📊' },
            { id: 'risk', label: 'Risk Stratification', icon: '⚠️' },
            { id: 'population', label: 'Population Health', icon: '👥' },
            { id: 'trends', label: 'Clinical Trends', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAnalysis(tab.id)}
              className={`inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeAnalysis === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg text-gray-700">Running AI Analysis...</span>
            </div>
          </div>
        ) : (
          <>
            {activeAnalysis === 'predictive' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {models.map((model) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{model.modelName}</h3>
                        <span className="text-xs text-gray-500">v{model.modelVersion}</span>
                      </div>

                      {model.predictions.map((prediction, index) => (
                        <div key={index} className="space-y-4">
                          <div className={`rounded-lg p-4 ${getRiskColor(prediction.probability)}`}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{prediction.outcome}</h4>
                              <span className="text-2xl font-bold">
                                {(prediction.probability * 100).toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-sm opacity-80">
                              Risk over {prediction.time_horizon} 
                              (CI: {(prediction.confidence_interval.lower * 100).toFixed(1)}% - {(prediction.confidence_interval.upper * 100).toFixed(1)}%)
                            </p>
                          </div>

                          <div>
                            <h5 className="font-medium text-gray-900 mb-3">Contributing Factors</h5>
                            <div className="space-y-2">
                              {prediction.factors.map((factor, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                      factor.importance === 'high' ? 'bg-red-400' :
                                      factor.importance === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                                    }`}></div>
                                    <span className="text-sm text-gray-700">{factor.factor}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${factor.contribution * 100}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 w-8">
                                      {(factor.contribution * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                            <h6 className="text-sm font-medium text-blue-900 mb-1">Model Performance</h6>
                            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                              <div>Accuracy: {(model.validation.accuracy * 100).toFixed(1)}%</div>
                              <div>Sensitivity: {(model.validation.sensitivity * 100).toFixed(1)}%</div>
                              <div>Specificity: {(model.validation.specificity * 100).toFixed(1)}%</div>
                              <div>Sample: {model.validation.sample_size.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeAnalysis === 'correlation' && (
              <div className="space-y-6">
                {metrics.map((metric) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
                        <p className="text-sm text-gray-600">{metric.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {metric.value}{metric.unit}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(metric.interpretation.status)}`}>
                          {metric.interpretation.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Clinical Interpretation</h4>
                        <p className="text-sm text-gray-700 mb-3">
                          {metric.interpretation.clinical_significance}
                        </p>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">Trend: {metric.interpretation.trend}</div>
                          {metric.calculation.confidence_interval && (
                            <div className="text-xs text-gray-500">
                              CI: {metric.calculation.confidence_interval.lower} - {metric.calculation.confidence_interval.upper}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Population Comparison</h4>
                        {metric.benchmarks && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Your Value:</span>
                              <span className="font-medium">{metric.value}{metric.unit}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Population Average:</span>
                              <span>{metric.benchmarks.population_average}{metric.unit}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Target Value:</span>
                              <span className="text-green-600 font-medium">{metric.benchmarks.target_value}{metric.unit}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Percentile Rank:</span>
                              <span className="font-medium">{metric.benchmarks.percentile_rank}th</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-md p-3">
                      <h5 className="text-sm font-medium text-amber-900 mb-2">Recommendations</h5>
                      <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
                        {metric.interpretation.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {['risk', 'population', 'trends'].includes(activeAnalysis) && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {activeAnalysis.charAt(0).toUpperCase() + activeAnalysis.slice(1)} Analysis
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Advanced {activeAnalysis} analytics interface coming in next implementation.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            Powered by Clinical AI • Evidence-Based Insights
          </div>
          <div className="text-sm text-gray-500">
            Last analysis: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
