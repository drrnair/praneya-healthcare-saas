'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  VisualizationProvider,
  HealthTrendChart,
  NutritionBalanceWheel,
  FamilyHealthOverview,
  MedicationAdherenceTracker,
  AIRecipeAnalysis,
  createHealthMetric,
  createNutritionData,
  presetConfigurations
} from '@/lib/data-visualization';

// Sample data
const sampleHealthMetrics = [
  createHealthMetric('Blood Pressure (Systolic)', 128, 'mmHg', presetConfigurations.bloodPressure.systolic.range),
  createHealthMetric('Blood Glucose', 95, 'mg/dL', presetConfigurations.bloodGlucose.range),
  createHealthMetric('Weight', 165, 'lbs', presetConfigurations.weight.range),
  createHealthMetric('Heart Rate', 72, 'bpm', presetConfigurations.heartRate.range)
];

const sampleNutritionData = createNutritionData(1850, 125, 220, 65, {
  calories: 2000,
  protein: 130,
  carbs: 250,
  fat: 70
});

const sampleFamilyMembers = [
  {
    id: 'user1',
    name: 'John Doe',
    relationship: 'Self',
    avatar: '👨',
    healthScore: 85,
    privacyLevel: 'full' as const,
    lastActivity: new Date(),
    achievements: [
      {
        id: 'streak-7',
        title: '7-Day Streak',
        description: 'Logged meals for 7 consecutive days',
        icon: '🔥',
        date: new Date(),
        category: 'nutrition' as const,
        rarity: 'common' as const
      }
    ]
  },
  {
    id: 'user2',
    name: 'Jane Doe',
    relationship: 'Spouse',
    avatar: '👩',
    healthScore: 92,
    privacyLevel: 'summary' as const,
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    achievements: [
      {
        id: 'fitness-master',
        title: 'Fitness Master',
        description: 'Completed 30 workouts this month',
        icon: '💪',
        date: new Date(),
        category: 'exercise' as const,
        rarity: 'rare' as const
      }
    ]
  }
];

const sampleMedications = [
  {
    medicationId: 'med1',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Daily',
    adherenceRate: 92,
    streakDays: 12,
    missedDoses: [new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)],
    nextDue: new Date(Date.now() + 2 * 60 * 60 * 1000),
    interactions: ['Avoid potassium supplements']
  },
  {
    medicationId: 'med2',
    medicationName: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    adherenceRate: 88,
    streakDays: 8,
    missedDoses: [new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)],
    nextDue: new Date(Date.now() + 4 * 60 * 60 * 1000),
    interactions: []
  }
];

export default function DataVisualizationDemo() {
  const [activeDemo, setActiveDemo] = useState<string>('health-trends');

  const demos = [
    { id: 'health-trends', title: 'Health Trends', icon: '📈', description: 'Interactive biometric trend tracking' },
    { id: 'nutrition-wheel', title: 'Nutrition Balance', icon: '🥗', description: 'Macronutrient balance visualization' },
    { id: 'family-health', title: 'Family Health', icon: '👨‍👩‍👧‍👦', description: 'Multi-member health dashboard' },
    { id: 'medication-tracking', title: 'Medication Adherence', icon: '💊', description: 'Calendar heatmap for medications' },
    { id: 'ai-recipe', title: 'AI Recipe Analysis', icon: '🤖', description: 'Interactive recipe analysis' }
  ];

  return (
    <VisualizationProvider initialTheme="healthcare">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📊 Praneya Data Visualization Suite
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Transform complex health data into intuitive, actionable insights
            </p>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">6</div>
                  <div className="text-sm text-gray-500">Chart Types</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-500">WCAG 2.2 AA</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">Real-time</div>
                  <div className="text-sm text-gray-500">Updates</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">HIPAA</div>
                  <div className="text-sm text-gray-500">Compliant</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Demo selector */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {demos.map((demo) => (
                <motion.button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`p-4 rounded-lg text-left transition-all ${
                    activeDemo === demo.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mb-2">{demo.icon}</div>
                  <h3 className="font-semibold mb-1">{demo.title}</h3>
                  <p className="text-sm opacity-80">{demo.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Demo content */}
          <motion.div
            key={activeDemo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {activeDemo === 'health-trends' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Health Trend Dashboard</h2>
                <p className="text-gray-600 mb-6">
                  Interactive line charts for biometric trends with color-coded health zones and milestone markers.
                </p>
                <HealthTrendChart
                  metrics={sampleHealthMetrics}
                  selectedMetricId="blood_pressure_systolic"
                  height={400}
                  showGoals={true}
                  enableInteraction={true}
                />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Features</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Animated trend lines with smooth transitions</li>
                      <li>• Health zone background indicators</li>
                      <li>• Interactive data point hover effects</li>
                      <li>• Time range selection (day/week/month/year)</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🎯 Use Cases</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Blood pressure monitoring</li>
                      <li>• Weight loss tracking</li>
                      <li>• Glucose level management</li>
                      <li>• Heart rate trend analysis</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">♿ Accessibility</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Screen reader compatible</li>
                      <li>• Keyboard navigation support</li>
                      <li>• High contrast mode</li>
                      <li>• Reduced motion preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'nutrition-wheel' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nutrition Balance Wheel</h2>
                <p className="text-gray-600 mb-6">
                  Interactive donut charts for macronutrient balance with real-time updates and goal tracking.
                </p>
                <div className="flex justify-center">
                  <NutritionBalanceWheel
                    data={sampleNutritionData}
                    showGoals={true}
                    enableInteraction={true}
                    size={350}
                  />
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">🎨 Visual Features</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Color-coded macronutrient segments</li>
                      <li>• Smooth morphing animations between views</li>
                      <li>• Interactive hover tooltips</li>
                      <li>• Progress indicators for goal achievement</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚡ Smart Alerts</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Gentle deficiency notifications</li>
                      <li>• Non-judgmental guidance messages</li>
                      <li>• Personalized nutrition recommendations</li>
                      <li>• Goal adjustment suggestions</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'family-health' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Family Health Overview</h2>
                <p className="text-gray-600 mb-6">
                  Multi-member health dashboard with privacy controls and collaborative goal tracking.
                </p>
                <FamilyHealthOverview
                  members={sampleFamilyMembers}
                  currentUserId="user1"
                  showPrivacyControls={true}
                  enableChallenges={true}
                />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">🔒 Privacy Features</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Granular privacy level controls</li>
                      <li>• Age-appropriate data filtering</li>
                      <li>• Emergency access protocols</li>
                      <li>• Consent management system</li>
                    </ul>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-800 mb-2">🏆 Gamification</h4>
                    <ul className="text-sm text-indigo-700 space-y-1">
                      <li>• Family challenge leaderboards</li>
                      <li>• Achievement sharing system</li>
                      <li>• Milestone celebration animations</li>
                      <li>• Encouraging competition mechanics</li>
                    </ul>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-pink-800 mb-2">🚨 Safety Features</h4>
                    <ul className="text-sm text-pink-700 space-y-1">
                      <li>• Emergency health alerts</li>
                      <li>• Critical value notifications</li>
                      <li>• Healthcare provider integration</li>
                      <li>• Emergency contact system</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'medication-tracking' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Medication Adherence Tracker</h2>
                <p className="text-gray-600 mb-6">
                  Calendar heatmap visualization for medication consistency with streak tracking and recovery guidance.
                </p>
                <MedicationAdherenceTracker
                  medications={sampleMedications}
                  selectedMedicationId="med1"
                  showStreaks={true}
                  showRecoveryTips={true}
                />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-cyan-800 mb-2">📅 Calendar Features</h4>
                    <ul className="text-sm text-cyan-700 space-y-1">
                      <li>• Color-coded adherence heatmap</li>
                      <li>• Interactive day-by-day tracking</li>
                      <li>• Streak visualization and celebration</li>
                      <li>• Future dose scheduling display</li>
                    </ul>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-800 mb-2">💡 Smart Guidance</h4>
                    <ul className="text-sm text-teal-700 space-y-1">
                      <li>• Gentle missed dose recovery tips</li>
                      <li>• Drug interaction warnings</li>
                      <li>• Personalized reminder suggestions</li>
                      <li>• Refill schedule optimization</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeDemo === 'ai-recipe' && (
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Recipe & Nutrition Analysis</h2>
                <p className="text-gray-600 mb-6">
                  Interactive nutritional breakdown with ingredient substitutions and allergen highlighting.
                </p>
                <AIRecipeAnalysis
                  recipe={null as any} // Will use sample data
                  userAllergens={['sesame']}
                  userDietaryRestrictions={['vegetarian']}
                  showSubstitutions={true}
                  enableRating={true}
                />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-emerald-800 mb-2">🤖 AI Features</h4>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      <li>• Automated nutritional analysis</li>
                      <li>• Intelligent ingredient substitutions</li>
                      <li>• Health goal alignment scoring</li>
                      <li>• Recipe optimization suggestions</li>
                    </ul>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-rose-800 mb-2">⚠️ Safety Alerts</h4>
                    <ul className="text-sm text-rose-700 space-y-1">
                      <li>• Real-time allergen detection</li>
                      <li>• Clear safety indicator highlighting</li>
                      <li>• Alternative ingredient suggestions</li>
                      <li>• Dietary restriction compliance</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">📊 Analytics</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Detailed nutritional breakdowns</li>
                      <li>• Macro and micronutrient tracking</li>
                      <li>• Health score calculations</li>
                      <li>• Recipe rating and feedback</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Technical specifications */}
          <motion.div
            className="mt-8 bg-gray-800 text-white rounded-lg p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-bold mb-4">🛠️ Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h4 className="font-semibold text-blue-300 mb-2">Libraries</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• D3.js for complex visualizations</li>
                  <li>• Framer Motion for animations</li>
                  <li>• React 18+ with TypeScript</li>
                  <li>• WebSocket for real-time updates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-green-300 mb-2">Performance</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• GPU-accelerated animations</li>
                  <li>• Optimized rendering pipelines</li>
                  <li>• Lazy loading for large datasets</li>
                  <li>• Memory-efficient data structures</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-300 mb-2">Accessibility</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• WCAG 2.2 AA compliance</li>
                  <li>• Screen reader optimization</li>
                  <li>• Keyboard navigation support</li>
                  <li>• High contrast mode</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-300 mb-2">Healthcare</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• HIPAA-compliant data handling</li>
                  <li>• Clinical accuracy indicators</li>
                  <li>• Emergency state protocols</li>
                  <li>• Provider integration APIs</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500">
            <p>Praneya Healthcare Data Visualization Suite - Transforming Health Data into Insights</p>
          </div>
        </div>
      </div>
    </VisualizationProvider>
  );
} 