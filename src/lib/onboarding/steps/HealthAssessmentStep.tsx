'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';

interface HealthCondition {
  id: string;
  name: string;
  icon: string;
  category: 'chronic' | 'acute' | 'mental' | 'preventive';
  severity?: 'mild' | 'moderate' | 'severe';
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  interactions?: string[];
}

interface Allergy {
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reactions: string[];
}

export function HealthAssessmentStep() {
  const { formData, updateFormData, unlockAchievement } = useOnboarding();
  
  const [currentSection, setCurrentSection] = useState<'intro' | 'vitals' | 'conditions' | 'medications' | 'allergies' | 'summary'>('intro');
  const [chatMessages, setChatMessages] = useState<Array<{
    type: 'bot' | 'user';
    content: string;
    timestamp: Date;
  }>>([]);

  const [localData, setLocalData] = useState({
    height: formData.healthProfile?.height || 0,
    weight: formData.healthProfile?.weight || 0,
    bloodType: formData.healthProfile?.bloodType || '',
    conditions: formData.healthProfile?.conditions || [],
    medications: formData.healthProfile?.medications || [],
    allergies: formData.healthProfile?.allergies || []
  });

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({});
  const [newAllergy, setNewAllergy] = useState<Partial<Allergy>>({});

  // Health conditions database
  const healthConditions: HealthCondition[] = [
    { id: 'diabetes', name: 'Diabetes', icon: '🩸', category: 'chronic' },
    { id: 'hypertension', name: 'High Blood Pressure', icon: '💓', category: 'chronic' },
    { id: 'asthma', name: 'Asthma', icon: '🫁', category: 'chronic' },
    { id: 'arthritis', name: 'Arthritis', icon: '🦴', category: 'chronic' },
    { id: 'depression', name: 'Depression', icon: '🧠', category: 'mental' },
    { id: 'anxiety', name: 'Anxiety', icon: '😰', category: 'mental' },
    { id: 'migraine', name: 'Migraine', icon: '🤕', category: 'acute' },
    { id: 'heart_disease', name: 'Heart Disease', icon: '❤️', category: 'chronic' }
  ];

  // Common allergens
  const commonAllergens = [
    'Peanuts', 'Tree nuts', 'Shellfish', 'Fish', 'Milk', 'Eggs', 'Soy', 'Wheat',
    'Penicillin', 'Sulfa drugs', 'Aspirin', 'Latex', 'Pollen', 'Dust mites'
  ];

  // Initialize conversation
  useEffect(() => {
    setChatMessages([
      {
        type: 'bot',
        content: "Hi! I'm your health assessment assistant. I'll help you set up your health profile safely and securely. Everything you share is protected by HIPAA compliance.",
        timestamp: new Date()
      },
      {
        type: 'bot',
        content: "Let's start with some basic health information. This helps us provide better recommendations and ensures your safety.",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Save to context
  useEffect(() => {
    updateFormData('healthProfile', localData);
  }, [localData, updateFormData]);

  const addChatMessage = (type: 'bot' | 'user', content: string) => {
    setChatMessages(prev => [...prev, {
      type,
      content,
      timestamp: new Date()
    }]);
  };

  const handleSectionComplete = (section: string) => {
    const nextSections = {
      'intro': 'vitals',
      'vitals': 'conditions',
      'conditions': 'medications',
      'medications': 'allergies',
      'allergies': 'summary'
    };

    addChatMessage('bot', `Great job completing the ${section} section! Let's move on.`);
    setCurrentSection(nextSections[section as keyof typeof nextSections] as any);
  };

  const renderChatInterface = () => (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 h-96 flex flex-col">
      {/* Chat header */}
      <div className="p-4 border-b border-neutral-200 bg-primary-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🏥</span>
          </div>
          <div>
            <h3 className="font-medium text-primary-800">Health Assistant</h3>
            <p className="text-xs text-primary-600">HIPAA Compliant • Secure</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        <AnimatePresence>
          {chatMessages.map((message, index) => (
            <motion.div
              key={index}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`
                max-w-xs p-3 rounded-lg
                ${message.type === 'user' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-neutral-100 text-neutral-800'
                }
              `}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderVitalsSection = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Height (cm)
          </label>
          <motion.input
            type="number"
            value={localData.height || ''}
            onChange={(e) => setLocalData(prev => ({ ...prev, height: Number(e.target.value) }))}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            placeholder="170"
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Weight (kg)
          </label>
          <motion.input
            type="number"
            value={localData.weight || ''}
            onChange={(e) => setLocalData(prev => ({ ...prev, weight: Number(e.target.value) }))}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            placeholder="70"
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Blood Type
          </label>
          <motion.select
            value={localData.bloodType}
            onChange={(e) => setLocalData(prev => ({ ...prev, bloodType: e.target.value }))}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Select blood type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </motion.select>
        </div>
      </div>

      <motion.button
        onClick={() => handleSectionComplete('vitals')}
        disabled={!localData.height || !localData.weight}
        className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-medium disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-primary-600 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue to Health Conditions
      </motion.button>
    </motion.div>
  );

  const renderConditionsSection = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
          Do you have any of these health conditions?
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          Select all that apply. This information helps us provide safer recommendations.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {healthConditions.map((condition) => (
            <motion.button
              key={condition.id}
              onClick={() => {
                setSelectedConditions(prev => 
                  prev.includes(condition.id)
                    ? prev.filter(id => id !== condition.id)
                    : [...prev, condition.id]
                );
              }}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-center
                ${selectedConditions.includes(condition.id)
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-2">{condition.icon}</div>
              <div className="text-sm font-medium">{condition.name}</div>
            </motion.button>
          ))}
        </div>

        <div className="mt-4">
          <button
            onClick={() => setSelectedConditions([])}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            I don't have any of these conditions
          </button>
        </div>
      </div>

      <motion.button
        onClick={() => handleSectionComplete('conditions')}
        className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-600 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue to Medications
      </motion.button>
    </motion.div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'intro':
        return (
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🏥</span>
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-neutral-800">Health Assessment</h2>
            <p className="text-neutral-600 max-w-md mx-auto">
              Let's build your comprehensive health profile. This helps us provide personalized recommendations and keep you safe.
            </p>
            <motion.button
              onClick={() => setCurrentSection('vitals')}
              className="bg-primary-500 text-white py-3 px-8 rounded-lg font-medium hover:bg-primary-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Assessment
            </motion.button>
          </div>
        );
      
      case 'vitals':
        return renderVitalsSection();
      
      case 'conditions':
        return renderConditionsSection();
      
      default:
        return renderVitalsSection();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Chat interface */}
        <div>
          {renderChatInterface()}
        </div>

        {/* Right side - Current section */}
        <div>
          {renderCurrentSection()}
        </div>
      </div>
    </div>
  );
} 