'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  content: string;
  required: boolean;
  category: 'legal' | 'privacy' | 'healthcare' | 'marketing';
  version: string;
}

export function ConsentStep() {
  const { formData, updateFormData, unlockAchievement, completeOnboarding } = useOnboarding();
  
  const [activeConsent, setActiveConsent] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<Record<string, number>>({});
  const [consents, setConsents] = useState<Record<string, boolean>>({
    termsOfService: false,
    privacyPolicy: false,
    hipaaAuthorization: false,
    dataSharing: false,
    marketingCommunications: false
  });

  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const consentItems: ConsentItem[] = [
    {
      id: 'termsOfService',
      title: 'Terms of Service',
      description: 'Our terms of service and user agreement',
      content: `
        <h3>Praneya Healthcare Terms of Service</h3>
        <p><strong>Last Updated: January 2024</strong></p>
        
        <h4>1. Acceptance of Terms</h4>
        <p>By accessing and using Praneya Healthcare ("Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h4>2. Use License</h4>
        <p>Permission is granted to temporarily download one copy of Praneya Healthcare for personal, non-commercial transitory viewing only.</p>
        
        <h4>3. Health Information</h4>
        <p>You understand that Praneya Healthcare is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.</p>
        
        <h4>4. User Account</h4>
        <p>You are responsible for safeguarding the password and for maintaining the confidentiality of your account.</p>
        
        <h4>5. Privacy and Data Protection</h4>
        <p>Your privacy is important to us. We collect, use, and protect your information in accordance with our Privacy Policy and applicable healthcare privacy laws including HIPAA.</p>
        
        <h4>6. Prohibited Uses</h4>
        <p>You may not use our service for any unlawful purpose or to solicit others to perform unlawful acts.</p>
        
        <h4>7. Termination</h4>
        <p>We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion.</p>
        
        <h4>8. Changes to Terms</h4>
        <p>We reserve the right to modify these terms at any time. We will notify users of any material changes.</p>
        
        <h4>9. Contact Information</h4>
        <p>Questions about the Terms of Service should be sent to legal@praneya.com</p>
      `,
      required: true,
      category: 'legal',
      version: '1.0'
    },
    {
      id: 'privacyPolicy',
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your information',
      content: `
        <h3>Praneya Healthcare Privacy Policy</h3>
        <p><strong>Last Updated: January 2024</strong></p>
        
        <h4>1. Information We Collect</h4>
        <p>We collect information you provide directly to us, information we obtain automatically when you use our services, and information from third parties.</p>
        
        <h4>2. Health Information</h4>
        <p>Your health information is protected under HIPAA and other applicable laws. We use this information to provide healthcare services and improve your experience.</p>
        
        <h4>3. How We Use Your Information</h4>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices and support messages</li>
          <li>Respond to comments, questions, and requests</li>
        </ul>
        
        <h4>4. Information Sharing</h4>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy.</p>
        
        <h4>5. Data Security</h4>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h4>6. Your Rights</h4>
        <p>You have the right to access, update, or delete your personal information. You may also opt out of certain communications.</p>
        
        <h4>7. Children's Privacy</h4>
        <p>Our service is not intended for children under 13, and we do not knowingly collect personal information from children under 13.</p>
        
        <h4>8. Contact Us</h4>
        <p>Questions about this Privacy Policy should be sent to privacy@praneya.com</p>
      `,
      required: true,
      category: 'privacy',
      version: '1.0'
    },
    {
      id: 'hipaaAuthorization',
      title: 'HIPAA Authorization',
      description: 'Authorization for use and disclosure of health information',
      content: `
        <h3>HIPAA Authorization for Use and Disclosure of Health Information</h3>
        <p><strong>Patient Rights Notice</strong></p>
        
        <h4>1. Right to Revoke</h4>
        <p>You have the right to revoke this authorization at any time by sending written notice to privacy@praneya.com. Revocation will not affect information already used or disclosed.</p>
        
        <h4>2. Information to be Used or Disclosed</h4>
        <p>This authorization covers health information including:</p>
        <ul>
          <li>Medical history and current health conditions</li>
          <li>Medication information and allergies</li>
          <li>Laboratory and diagnostic test results</li>
          <li>Treatment plans and healthcare provider notes</li>
        </ul>
        
        <h4>3. Purpose of Use and Disclosure</h4>
        <p>Your health information will be used for:</p>
        <ul>
          <li>Treatment coordination and care management</li>
          <li>Health analytics and personalized recommendations</li>
          <li>Communication with your healthcare providers (with your consent)</li>
          <li>Emergency situations where you cannot provide consent</li>
        </ul>
        
        <h4>4. Who May Use or Disclose This Information</h4>
        <p>Praneya Healthcare and our authorized business associates may use this information as described above.</p>
        
        <h4>5. Who May Receive This Information</h4>
        <p>Your information may be shared with:</p>
        <ul>
          <li>Your designated family members or caregivers</li>
          <li>Healthcare providers involved in your care</li>
          <li>Emergency responders when medically necessary</li>
        </ul>
        
        <h4>6. Expiration</h4>
        <p>This authorization remains in effect until you revoke it or until the purpose has been achieved.</p>
        
        <h4>7. Re-disclosure</h4>
        <p>Information disclosed under this authorization may be subject to re-disclosure and may no longer be protected by federal privacy regulations.</p>
      `,
      required: true,
      category: 'healthcare',
      version: '1.0'
    },
    {
      id: 'dataSharing',
      title: 'Data Sharing Preferences',
      description: 'Control how your data is shared for research and improvement',
      content: `
        <h3>Data Sharing and Research Participation</h3>
        <p><strong>Optional Participation</strong></p>
        
        <h4>1. Anonymized Health Research</h4>
        <p>Your de-identified health data may contribute to medical research that could benefit others with similar conditions.</p>
        
        <h4>2. Service Improvement</h4>
        <p>Anonymous usage data helps us improve our platform and develop new features.</p>
        
        <h4>3. What Information May Be Shared</h4>
        <ul>
          <li>De-identified health metrics and trends</li>
          <li>Anonymous usage patterns</li>
          <li>Aggregated demographic information</li>
        </ul>
        
        <h4>4. Your Control</h4>
        <p>You can opt out of data sharing at any time in your privacy settings. This will not affect your use of Praneya Healthcare services.</p>
        
        <h4>5. Benefits</h4>
        <p>Participation helps advance healthcare research and improves our ability to provide personalized recommendations.</p>
      `,
      required: false,
      category: 'privacy',
      version: '1.0'
    },
    {
      id: 'marketingCommunications',
      title: 'Marketing Communications',
      description: 'Receive helpful health tips and product updates',
      content: `
        <h3>Marketing Communications Preferences</h3>
        <p><strong>Optional Communications</strong></p>
        
        <h4>1. Health Tips and Educational Content</h4>
        <p>Receive personalized health tips, articles, and educational content relevant to your health goals.</p>
        
        <h4>2. Product Updates</h4>
        <p>Stay informed about new features, improvements, and services that might benefit you.</p>
        
        <h4>3. Frequency</h4>
        <p>Communications will be sent no more than 2-3 times per week and can be customized based on your preferences.</p>
        
        <h4>4. Unsubscribe Anytime</h4>
        <p>You can unsubscribe from marketing communications at any time using the unsubscribe link in emails or through your account settings.</p>
        
        <h4>5. Privacy</h4>
        <p>Marketing communications will never include sensitive health information and will respect your privacy preferences.</p>
      `,
      required: false,
      category: 'marketing',
      version: '1.0'
    }
  ];

  // Handle scroll tracking for consent documents
  const handleScroll = (consentId: string, element: HTMLDivElement) => {
    const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setScrollProgress(prev => ({ ...prev, [consentId]: Math.min(scrollPercentage, 100) }));
  };

  // Check if user has scrolled through document
  const hasScrolledThrough = (consentId: string) => {
    return (scrollProgress[consentId] || 0) >= 80; // 80% scroll threshold
  };

  const handleConsentChange = (consentId: string, accepted: boolean) => {
    setConsents(prev => ({ ...prev, [consentId]: accepted }));
    
    // Update form data
    const timestamp = new Date();
    const consentItem = consentItems.find(item => item.id === consentId);
    
    updateFormData('consents', {
      ...formData.consents,
      [consentId]: {
        accepted,
        timestamp,
        version: consentItem?.version || '1.0'
      }
    });

    if (accepted) {
      unlockAchievement('consent_accepted');
    }
  };

  const canProceed = () => {
    const requiredConsents = consentItems.filter(item => item.required);
    return requiredConsents.every(item => 
      consents[item.id as keyof typeof consents] && hasScrolledThrough(item.id)
    );
  };

  const renderConsentModal = (consent: ConsentItem) => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-neutral-800">{consent.title}</h3>
              <p className="text-sm text-neutral-600">{consent.description}</p>
            </div>
            <button
              onClick={() => setActiveConsent(null)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              ✕
            </button>
          </div>
          
          {/* Scroll Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
              <span>Reading progress</span>
              <span>{Math.round(scrollProgress[consent.id] || 0)}%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <motion.div
                className="bg-primary-500 h-2 rounded-full"
                animate={{ width: `${scrollProgress[consent.id] || 0}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div
          ref={(el) => (scrollRefs.current[consent.id] = el)}
          className="flex-1 p-6 overflow-y-auto"
          onScroll={(e) => handleScroll(consent.id, e.currentTarget)}
        >
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: consent.content }}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`consent-${consent.id}`}
                checked={consents[consent.id as keyof typeof consents]}
                onChange={(e) => handleConsentChange(consent.id, e.target.checked)}
                disabled={consent.required && !hasScrolledThrough(consent.id)}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <label 
                htmlFor={`consent-${consent.id}`}
                className="text-sm font-medium text-neutral-700"
              >
                I have read and agree to the {consent.title}
                {consent.required && (
                  <span className="text-error-600 ml-1">*</span>
                )}
              </label>
            </div>
            
            <button
              onClick={() => setActiveConsent(null)}
              disabled={consent.required && (!hasScrolledThrough(consent.id) || !consents[consent.id as keyof typeof consents])}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
          
          {consent.required && !hasScrolledThrough(consent.id) && (
            <p className="text-xs text-neutral-500 mt-2">
              Please scroll through the entire document to continue
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <span className="text-2xl">🛡️</span>
        </motion.div>
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">
          Privacy & Consent
        </h2>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Your privacy and data security are our top priorities. Please review and accept the required agreements below.
        </p>
      </div>

      {/* HIPAA Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-blue-600 text-xl">🏥</span>
          <h3 className="font-semibold text-blue-800">HIPAA Compliance Notice</h3>
        </div>
        <p className="text-sm text-blue-700">
          Praneya Healthcare is fully HIPAA compliant. Your health information is encrypted, secured, and never shared without your explicit consent. You have full control over your data at all times.
        </p>
      </div>

      {/* Consent Items */}
      <div className="space-y-4 mb-8">
        {consentItems.map((consent, index) => {
          const isAccepted = consents[consent.id as keyof typeof consents];
          const hasScrolled = hasScrolledThrough(consent.id);
          
          return (
            <motion.div
              key={consent.id}
              className={`
                border-2 rounded-lg p-4 transition-all duration-200
                ${isAccepted 
                  ? 'border-green-300 bg-green-50' 
                  : consent.required 
                  ? 'border-orange-300 bg-orange-50' 
                  : 'border-neutral-200 bg-white'
                }
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-neutral-800">
                      {consent.title}
                      {consent.required && (
                        <span className="text-error-600 ml-1">*</span>
                      )}
                    </h3>
                    <span className={`
                      px-2 py-1 text-xs rounded-full
                      ${consent.required 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-blue-100 text-blue-700'
                      }
                    `}>
                      {consent.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600">{consent.description}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {isAccepted && (
                    <span className="text-green-600 text-xl">✅</span>
                  )}
                  <button
                    onClick={() => setActiveConsent(consent.id)}
                    className="px-4 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
              
              {hasScrolled && (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={consent.id}
                    checked={isAccepted}
                    onChange={(e) => handleConsentChange(consent.id, e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor={consent.id} className="text-sm text-neutral-700">
                    I agree to the {consent.title}
                  </label>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Complete Setup Button */}
      <motion.button
        onClick={completeOnboarding}
        disabled={!canProceed()}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200
          ${canProceed()
            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md hover:shadow-lg'
            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }
        `}
        whileHover={canProceed() ? { scale: 1.02 } : {}}
        whileTap={canProceed() ? { scale: 0.98 } : {}}
      >
        {canProceed() ? 'Complete Setup & Enter Praneya' : 'Please review and accept required agreements'}
      </motion.button>

      {/* Privacy Assurance */}
      <div className="text-center mt-6 text-sm text-neutral-500">
        <p>🔒 Your information is encrypted and secure</p>
        <p>You can modify these preferences anytime in your settings</p>
      </div>

      {/* Consent Modal */}
      <AnimatePresence>
        {activeConsent && (
          renderConsentModal(consentItems.find(item => item.id === activeConsent)!)
        )}
      </AnimatePresence>
    </div>
  );
} 