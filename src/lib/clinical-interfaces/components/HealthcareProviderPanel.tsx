/**
 * Healthcare Provider Integration Panel - Premium Clinical Interface
 * Provider dashboard with patient nutrition monitoring and clinical reports
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HealthcareProvider, ProviderPatientRelationship, ClinicalNote } from '@/types/clinical';

interface HealthcareProviderPanelProps {
  patientId: string;
  providerId?: string;
  relationship?: ProviderPatientRelationship;
  onReportGenerated?: (report: any) => void;
  onMessageSent?: (message: any) => void;
  theme?: 'standard' | 'premium' | 'clinical';
}

export const HealthcareProviderPanel: React.FC<HealthcareProviderPanelProps> = ({
  patientId,
  providerId,
  relationship,
  onReportGenerated,
  onMessageSent,
  theme = 'premium'
}) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [providers, setProviders] = useState<HealthcareProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<HealthcareProvider | null>(null);
  const [reportType, setReportType] = useState('comprehensive');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Mock provider data
  const mockProviders: HealthcareProvider[] = [
    {
      id: 'prov_001',
      name: { first: 'Dr. Sarah', last: 'Johnson', suffix: 'MD' },
      credentials: ['MD', 'Board Certified Internal Medicine'],
      specialty: 'Internal Medicine',
      subSpecialty: ['Diabetes Management', 'Preventive Care'],
      licenseNumber: 'MD12345',
      npiNumber: '1234567890',
      contactInfo: {
        email: 'dr.johnson@healthcenter.com',
        phone: '(555) 123-4567',
        secure_messaging: true
      },
      practice: {
        name: 'Metro Health Center',
        address: {
          street: '123 Medical Ave',
          city: 'Healthcare City',
          state: 'HC',
          zipCode: '12345',
          country: 'USA'
        },
        phone: '(555) 123-4567',
        website: 'www.metrohealthcenter.com'
      },
      availability: {
        schedule: {},
        timezone: 'EST',
        bookingPreferences: []
      },
      preferences: {
        communication_methods: ['secure_message', 'phone'],
        notification_frequency: 'daily',
        report_format: 'detailed'
      }
    }
  ];

  const reportTypes = [
    { value: 'comprehensive', label: 'Comprehensive Nutrition Report', description: 'Complete nutritional analysis with recommendations' },
    { value: 'progress', label: 'Progress Summary', description: 'Patient progress since last visit' },
    { value: 'medication_nutrition', label: 'Medication-Nutrition Interactions', description: 'Drug-food interaction analysis' },
    { value: 'emergency', label: 'Emergency Health Summary', description: 'Critical health information for emergencies' }
  ];

  const generateClinicalReport = async () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      const report = {
        id: `report_${Date.now()}`,
        type: reportType,
        patientId,
        providerId: selectedProvider?.id,
        generatedAt: new Date().toISOString(),
        format: 'pdf',
        sections: [
          'Patient Demographics',
          'Nutritional Assessment',
          'Lab Value Trends',
          'Medication Review',
          'Risk Factors',
          'Recommendations'
        ]
      };
      
      onReportGenerated?.(report);
      setIsGeneratingReport(false);
    }, 3000);
  };

  useEffect(() => {
    setProviders(mockProviders);
    if (mockProviders.length > 0) {
      setSelectedProvider(mockProviders[0]);
    }
  }, []);

  return (
    <div className="healthcare-provider-panel bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Healthcare Provider Integration</h2>
            <p className="text-sm text-gray-600 mt-1">
              Professional clinical collaboration platform
            </p>
          </div>
          {theme === 'premium' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Provider Certified
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {[
            { id: 'dashboard', label: 'Provider Dashboard', icon: '📊' },
            { id: 'reports', label: 'Clinical Reports', icon: '📋' },
            { id: 'messaging', label: 'Secure Messaging', icon: '💬' },
            { id: 'telemedicine', label: 'Telemedicine', icon: '🎥' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeView === tab.id
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
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Provider Selection */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-900 mb-3">Connected Healthcare Providers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedProvider?.id === provider.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProvider(provider)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {provider.name.first[0]}{provider.name.last[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">
                          {provider.name.first} {provider.name.last}, {provider.name.suffix}
                        </h4>
                        <p className="text-sm text-gray-500">{provider.specialty}</p>
                        <p className="text-xs text-gray-400">{provider.practice.name}</p>
                      </div>
                      {provider.contactInfo.secure_messaging && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Secure
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Monitoring Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Nutrition Score</p>
                    <p className="text-2xl font-semibold text-gray-900">85/100</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Adherence Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">92%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-amber-100 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Alerts</p>
                    <p className="text-2xl font-semibold text-gray-900">2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Clinical Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {reportTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {reportTypes.find(t => t.value === reportType)?.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Provider
                  </label>
                  <select
                    value={selectedProvider?.id || ''}
                    onChange={(e) => {
                      const provider = providers.find(p => p.id === e.target.value);
                      setSelectedProvider(provider || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {providers.map((provider) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name.first} {provider.name.last} - {provider.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={generateClinicalReport}
                  disabled={isGeneratingReport || !selectedProvider}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingReport ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === 'messaging' && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">HIPAA-Compliant Messaging</h3>
            <p className="mt-1 text-sm text-gray-500">
              Secure messaging interface coming in next implementation.
            </p>
          </div>
        )}

        {activeView === 'telemedicine' && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Telemedicine Integration</h3>
            <p className="mt-1 text-sm text-gray-500">
              Video consultation with nutrition data sharing coming soon.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            HIPAA-Compliant • End-to-End Encrypted
          </div>
          <div className="text-sm text-gray-500">
            Last sync: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
