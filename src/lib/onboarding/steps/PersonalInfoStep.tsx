'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboarding } from '../OnboardingProvider';

interface FormErrors {
  [key: string]: string;
}

export function PersonalInfoStep() {
  const { formData, updateFormData, unlockAchievement, celebrateCompletion } = useOnboarding();
  
  const [localData, setLocalData] = useState({
    firstName: formData.personalInfo?.firstName || '',
    lastName: formData.personalInfo?.lastName || '',
    dateOfBirth: formData.personalInfo?.dateOfBirth || '',
    gender: formData.personalInfo?.gender || '',
    phone: formData.personalInfo?.phone || '',
    emergencyContact: {
      name: formData.personalInfo?.emergencyContact?.name || '',
      phone: formData.personalInfo?.emergencyContact?.phone || '',
      relationship: formData.personalInfo?.emergencyContact?.relationship || ''
    }
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [completedFields, setCompletedFields] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState<string | null>(null);

  // Calculate completion percentage
  const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender'];
  const optionalFields = ['phone', 'emergencyContact.name', 'emergencyContact.phone', 'emergencyContact.relationship'];
  const allFields = [...requiredFields, ...optionalFields];
  
  const getFieldValue = (fieldPath: string) => {
    if (fieldPath.includes('.')) {
      const [parent, child] = fieldPath.split('.');
      return (localData as any)[parent]?.[child];
    }
    return (localData as any)[fieldPath];
  };

  const filledFields = allFields.filter(field => {
    const value = getFieldValue(field);
    return value && value.trim() !== '';
  });

  const completionPercentage = (filledFields.length / allFields.length) * 100;

  // Validation functions
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return value.trim().length >= 2 ? '' : 'Must be at least 2 characters';
      case 'dateOfBirth':
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        return age >= 0 && age <= 120 ? '' : 'Please enter a valid date';
              case 'phone': {
          return /^\+?[\d\s\-()]{10,}$/.test(value) ? '' : 'Please enter a valid phone number';
        }
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Please enter a valid email address';
      }
      default:
        return '';
    }
  };

  // Handle field changes with celebrations
  const handleFieldChange = (field: string, value: string) => {
    const fieldPath = field.split('.');
    
    if (fieldPath.length === 2) {
      setLocalData(prev => ({
        ...prev,
        [fieldPath[0]]: {
          ...prev[fieldPath[0] as keyof typeof prev],
          [fieldPath[1]]: value
        }
      }));
    } else {
      setLocalData(prev => ({ ...prev, [field]: value }));
    }

    // Validate field
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));

    // Check for field completion celebration
    if (value.trim() && !error && !completedFields.includes(field)) {
      setCompletedFields(prev => [...prev, field]);
      setShowCelebration(field);
      setTimeout(() => setShowCelebration(null), 1000);

      // Trigger achievements
      if (requiredFields.includes(field) && requiredFields.every(f => getFieldValue(f))) {
        unlockAchievement('profile_basic_complete');
      }
      
      if (filledFields.length >= allFields.length * 0.8) {
        unlockAchievement('profile_advanced_complete');
      }
    }
  };

  // Save to context
  useEffect(() => {
    updateFormData('personalInfo', localData);
  }, [localData, updateFormData]);

  // Field completion icons
  const getFieldIcon = (field: string) => {
    const hasValue = getFieldValue(field)?.trim();
    const hasError = errors[field];
    
    if (hasError) return '❌';
    if (hasValue) return '✅';
    if (requiredFields.includes(field)) return '⭐';
    return '💡';
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
      {/* Header with progress */}
      <div className="mb-6">
        <motion.div
          className="flex items-center gap-4 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">👤</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Personal Information</h2>
            <p className="text-neutral-600">Let's get to know you better</p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="bg-neutral-200 rounded-full h-3 relative overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-full rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
        <div className="flex justify-between text-xs text-neutral-500 mt-1">
          <span>{Math.round(completionPercentage)}% complete</span>
          <span>{filledFields.length}/{allFields.length} fields</span>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* Basic Information */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              First Name {getFieldIcon('firstName')}
            </label>
            <motion.input
              type="text"
              value={localData.firstName}
              onChange={(e) => handleFieldChange('firstName', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg transition-all duration-200
                ${errors.firstName 
                  ? 'border-error-300 bg-error-50' 
                  : localData.firstName 
                  ? 'border-success-300 bg-success-50' 
                  : 'border-neutral-300 focus:border-primary-500'
                }
                focus:outline-none focus:ring-2 focus:ring-primary-200
              `}
              placeholder="Enter your first name"
              whileFocus={{ scale: 1.02 }}
            />
            {errors.firstName && (
              <motion.p
                className="text-error-600 text-xs mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.firstName}
              </motion.p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Last Name {getFieldIcon('lastName')}
            </label>
            <motion.input
              type="text"
              value={localData.lastName}
              onChange={(e) => handleFieldChange('lastName', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg transition-all duration-200
                ${errors.lastName 
                  ? 'border-error-300 bg-error-50' 
                  : localData.lastName 
                  ? 'border-success-300 bg-success-50' 
                  : 'border-neutral-300 focus:border-primary-500'
                }
                focus:outline-none focus:ring-2 focus:ring-primary-200
              `}
              placeholder="Enter your last name"
              whileFocus={{ scale: 1.02 }}
            />
            {errors.lastName && (
              <motion.p
                className="text-error-600 text-xs mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.lastName}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Date of Birth and Gender */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Date of Birth {getFieldIcon('dateOfBirth')}
            </label>
            <motion.input
              type="date"
              value={localData.dateOfBirth}
              onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg transition-all duration-200
                ${localData.dateOfBirth 
                  ? 'border-success-300 bg-success-50' 
                  : 'border-neutral-300 focus:border-primary-500'
                }
                focus:outline-none focus:ring-2 focus:ring-primary-200
              `}
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Gender {getFieldIcon('gender')}
            </label>
            <motion.select
              value={localData.gender}
              onChange={(e) => handleFieldChange('gender', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg transition-all duration-200
                ${localData.gender 
                  ? 'border-success-300 bg-success-50' 
                  : 'border-neutral-300 focus:border-primary-500'
                }
                focus:outline-none focus:ring-2 focus:ring-primary-200
              `}
              whileFocus={{ scale: 1.02 }}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </motion.select>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-neutral-800 mb-3">Contact Information</h3>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Phone Number {getFieldIcon('phone')} <span className="text-neutral-400">(Optional)</span>
            </label>
            <motion.input
              type="tel"
              value={localData.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              className={`
                w-full px-4 py-3 border rounded-lg transition-all duration-200
                ${errors.phone 
                  ? 'border-error-300 bg-error-50' 
                  : localData.phone 
                  ? 'border-success-300 bg-success-50' 
                  : 'border-neutral-300 focus:border-primary-500'
                }
                focus:outline-none focus:ring-2 focus:ring-primary-200
              `}
              placeholder="+1 (555) 123-4567"
              whileFocus={{ scale: 1.02 }}
            />
            {errors.phone && (
              <motion.p
                className="text-error-600 text-xs mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.phone}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-neutral-800 mb-3">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name {getFieldIcon('emergencyContact.name')}
              </label>
              <motion.input
                type="text"
                value={localData.emergencyContact.name}
                onChange={(e) => handleFieldChange('emergencyContact.name', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg transition-all duration-200
                  ${localData.emergencyContact.name 
                    ? 'border-success-300 bg-success-50' 
                    : 'border-neutral-300 focus:border-primary-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary-200
                `}
                placeholder="Full name"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone {getFieldIcon('emergencyContact.phone')}
              </label>
              <motion.input
                type="tel"
                value={localData.emergencyContact.phone}
                onChange={(e) => handleFieldChange('emergencyContact.phone', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg transition-all duration-200
                  ${localData.emergencyContact.phone 
                    ? 'border-success-300 bg-success-50' 
                    : 'border-neutral-300 focus:border-primary-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary-200
                `}
                placeholder="Phone number"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Relationship {getFieldIcon('emergencyContact.relationship')}
              </label>
              <motion.select
                value={localData.emergencyContact.relationship}
                onChange={(e) => handleFieldChange('emergencyContact.relationship', e.target.value)}
                className={`
                  w-full px-4 py-3 border rounded-lg transition-all duration-200
                  ${localData.emergencyContact.relationship 
                    ? 'border-success-300 bg-success-50' 
                    : 'border-neutral-300 focus:border-primary-500'
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary-200
                `}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="">Select relationship</option>
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="sibling">Sibling</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </motion.select>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Field completion celebrations */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <div className="bg-white rounded-full p-4 shadow-lg">
              <motion.div
                className="text-4xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.5 }}
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 