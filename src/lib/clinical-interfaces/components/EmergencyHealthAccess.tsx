/**
 * Emergency Health Access Interface - Premium Clinical Interface
 * Critical health information display with immediate accessibility
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmergencyProfile, MedicalAlert } from '@/types/clinical';

interface EmergencyHealthAccessProps {
  patientId: string;
  emergencyProfile?: EmergencyProfile;
  onEmergencyAccess?: (accessLog: any) => void;
  onContactNotified?: (contact: any) => void;
  theme?: 'standard' | 'premium' | 'emergency';
}

export const EmergencyHealthAccess: React.FC<EmergencyHealthAccessProps> = ({
  patientId,
  emergencyProfile,
  onEmergencyAccess,
  onContactNotified,
  theme = 'emergency'
}) => {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [accessReason, setAccessReason] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [alerts, setAlerts] = useState<MedicalAlert[]>([]);
  const [countdown, setCountdown] = useState(0);

  // Mock emergency profile
  const mockProfile: EmergencyProfile = {
    patientId,
    criticalInformation: {
      allergies: [
        { allergen: 'Penicillin', severity: 'life_threatening', reaction: 'Anaphylaxis' },
        { allergen: 'Shellfish', severity: 'severe', reaction: 'Respiratory distress, hives' },
        { allergen: 'Latex', severity: 'moderate', reaction: 'Contact dermatitis' }
      ],
      medications: [
        { name: 'Lisinopril 10mg', dosage: 'Once daily', critical: true, lastTaken: '2024-01-15T08:00:00Z' },
        { name: 'Metformin 500mg', dosage: 'Twice daily', critical: true, lastTaken: '2024-01-15T12:00:00Z' },
        { name: 'Atorvastatin 20mg', dosage: 'Once daily', critical: false, lastTaken: '2024-01-15T20:00:00Z' }
      ],
      conditions: [
        { condition: 'Type 2 Diabetes', severity: 'moderate', status: 'controlled' },
        { condition: 'Hypertension', severity: 'moderate', status: 'controlled' },
        { condition: 'Hyperlipidemia', severity: 'mild', status: 'controlled' }
      ],
      devices: [
        { type: 'insulin_pump', model: 'MiniMed 770G', implantDate: '2023-06-15' }
      ]
    },
    emergencyContacts: [
      { name: 'Sarah Johnson', relationship: 'Spouse', phone: '(555) 123-4567', isPrimary: true, hasHealthcareProxy: true },
      { name: 'Michael Johnson', relationship: 'Son', phone: '(555) 987-6543', isPrimary: false, hasHealthcareProxy: false },
      { name: 'Mary Smith', relationship: 'Sister', phone: '(555) 456-7890', isPrimary: false, hasHealthcareProxy: false }
    ],
    healthcareProviders: [
      { name: 'Dr. Robert Chen', specialty: 'Primary Care', phone: '(555) 111-2222', isPrimary: true },
      { name: 'Dr. Lisa Park', specialty: 'Endocrinology', phone: '(555) 333-4444', isPrimary: false },
      { name: 'Dr. James Wilson', specialty: 'Cardiology', phone: '(555) 555-6666', isPrimary: false }
    ],
    preferences: {
      hospital_preference: 'Metro General Hospital',
      advance_directives: true,
      organ_donor: true,
      blood_type: 'O+'
    },
    lastUpdated: new Date().toISOString(),
    accessLog: []
  };

  const mockAlerts: MedicalAlert[] = [
    {
      id: 'alert_001',
      type: 'critical_value',
      severity: 'critical',
      title: 'Critical Blood Glucose Level',
      description: 'Blood glucose reading of 45 mg/dL indicates severe hypoglycemia',
      patientId,
      triggeredBy: {
        source: 'glucose_monitor',
        data: { value: 45, unit: 'mg/dL', timestamp: new Date().toISOString() },
        timestamp: new Date().toISOString()
      },
      recommendations: {
        immediate_actions: [
          'Administer 15g fast-acting carbohydrates immediately',
          'Check blood glucose again in 15 minutes',
          'If unconscious, administer glucagon or call 911'
        ],
        follow_up_required: true,
        provider_notification: true,
        patient_notification: true
      },
      status: 'active',
      escalation: {
        rules: [
          { condition: 'No response in 5 minutes', action: 'Call emergency contacts', delay: '5 minutes' },
          { condition: 'No response in 10 minutes', action: 'Call 911', delay: '10 minutes' }
        ],
        history: []
      }
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'life_threatening':
        return 'bg-red-600 text-white';
      case 'severe':
        return 'bg-red-500 text-white';
      case 'moderate':
        return 'bg-amber-500 text-white';
      case 'mild':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const activateEmergencyMode = (reason: string) => {
    setIsEmergencyMode(true);
    setAccessReason(reason);
    setCountdown(30); // 30 second countdown for emergency access
    
    const accessLog = {
      timestamp: new Date().toISOString(),
      accessedBy: 'emergency_user',
      reason,
      dataAccessed: ['critical_information', 'emergency_contacts', 'providers']
    };
    
    onEmergencyAccess?.(accessLog);
  };

  const notifyEmergencyContact = (contact: any) => {
    setSelectedContact(contact);
    onContactNotified?.(contact);
    // In real implementation, this would trigger SMS/call
  };

  const call911 = () => {
    // In real implementation, this would integrate with emergency services
    window.open('tel:911');
  };

  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className={`emergency-health-access ${theme === 'emergency' ? 'emergency-theme' : ''} bg-white rounded-lg shadow-xl border-l-4 border-red-500`}>
      {/* Emergency Header */}
      <div className="bg-red-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h2 className="text-xl font-bold">Emergency Health Access</h2>
              <p className="text-red-100 text-sm">Critical medical information and emergency contacts</p>
            </div>
          </div>
          {isEmergencyMode && countdown > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold">{countdown}</div>
              <div className="text-xs text-red-100">seconds remaining</div>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Action Buttons */}
      <div className="px-6 py-4 bg-red-50 border-b border-red-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={call911}
            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            CALL 911
          </button>
          
          <button
            onClick={() => activateEmergencyMode('Medical Emergency')}
            disabled={isEmergencyMode}
            className="flex items-center justify-center px-4 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {isEmergencyMode ? 'EMERGENCY ACTIVE' : 'EMERGENCY ACCESS'}
          </button>
          
          <button
            onClick={() => activateEmergencyMode('Provider Request')}
            disabled={isEmergencyMode}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            PROVIDER ACCESS
          </button>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
          <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Active Medical Alerts
          </h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'critical' ? 'bg-red-50 border-red-500' :
                alert.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                'bg-yellow-50 border-yellow-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                    alert.severity === 'critical' ? 'bg-red-600 text-white' :
                    alert.severity === 'high' ? 'bg-orange-600 text-white' :
                    'bg-yellow-600 text-white'
                  }`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                {alert.recommendations.immediate_actions.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-900">Immediate Actions:</h5>
                    <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                      {alert.recommendations.immediate_actions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-6">
        <AnimatePresence>
          {isEmergencyMode ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Critical Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Allergies */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    CRITICAL ALLERGIES
                  </h3>
                  <div className="space-y-2">
                    {mockProfile.criticalInformation.allergies.map((allergy, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-red-300">
                        <div>
                          <div className="font-medium text-gray-900">{allergy.allergen}</div>
                          <div className="text-sm text-gray-600">{allergy.reaction}</div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-bold rounded ${getSeverityColor(allergy.severity)}`}>
                          {allergy.severity.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Medications */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 12a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                    CRITICAL MEDICATIONS
                  </h3>
                  <div className="space-y-2">
                    {mockProfile.criticalInformation.medications.filter(med => med.critical).map((medication, i) => (
                      <div key={i} className="p-2 bg-white rounded border border-blue-300">
                        <div className="font-medium text-gray-900">{medication.name}</div>
                        <div className="text-sm text-gray-600">{medication.dosage}</div>
                        <div className="text-xs text-gray-500">
                          Last taken: {new Date(medication.lastTaken || '').toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  EMERGENCY CONTACTS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockProfile.emergencyContacts.map((contact, i) => (
                    <div key={i} className="p-3 bg-white rounded border border-green-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-600">{contact.relationship}</div>
                          <div className="text-sm font-mono text-gray-800">{contact.phone}</div>
                          {contact.hasHealthcareProxy && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                              Healthcare Proxy
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => notifyEmergencyContact(contact)}
                          className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors"
                        >
                          CALL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Healthcare Providers */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  HEALTHCARE PROVIDERS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockProfile.healthcareProviders.map((provider, i) => (
                    <div key={i} className="p-3 bg-white rounded border border-purple-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{provider.name}</div>
                          <div className="text-sm text-gray-600">{provider.specialty}</div>
                          <div className="text-sm font-mono text-gray-800">{provider.phone}</div>
                          {provider.isPrimary && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => window.open(`tel:${provider.phone}`)}
                          className="px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition-colors"
                        >
                          CALL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Emergency Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Emergency Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Blood Type:</span>
                    <div className="text-gray-900">{mockProfile.preferences.blood_type}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Organ Donor:</span>
                    <div className="text-gray-900">{mockProfile.preferences.organ_donor ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Advance Directives:</span>
                    <div className="text-gray-900">{mockProfile.preferences.advance_directives ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Preferred Hospital:</span>
                    <div className="text-gray-900">{mockProfile.preferences.hospital_preference}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <svg className="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Emergency Health Access</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                In case of emergency, use the buttons above to access critical health information,
                contact emergency services, or notify healthcare providers and emergency contacts.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-amber-800">
                  <strong>For life-threatening emergencies:</strong> Call 911 immediately.
                  This interface provides supporting medical information for first responders.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Emergency Access Logged • HIPAA Compliant
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(mockProfile.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};
