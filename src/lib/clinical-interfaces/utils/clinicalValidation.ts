/**
 * Clinical Validation Utilities
 * Validation rules and functions for clinical data
 */

import { ClinicalValidationRule } from '@/types/clinical';

// Laboratory value validation
export const validateLabValue = (value: number, referenceRange: { min: number; max: number; criticalMin?: number; criticalMax?: number }) => {
  if (referenceRange.criticalMin && value < referenceRange.criticalMin) return 'critical_low';
  if (referenceRange.criticalMax && value > referenceRange.criticalMax) return 'critical_high';
  if (value < referenceRange.min) return 'abnormal_low';
  if (value > referenceRange.max) return 'abnormal_high';
  return 'normal';
};

// Biometric validation rules
export const biometricValidationRules = {
  blood_pressure: {
    systolic: { min: 60, max: 250, criticalMin: 70, criticalMax: 200 },
    diastolic: { min: 40, max: 150, criticalMin: 50, criticalMax: 120 }
  },
  heart_rate: { min: 40, max: 200, criticalMin: 50, criticalMax: 150 },
  glucose: { min: 40, max: 600, criticalMin: 70, criticalMax: 400 },
  temperature: { min: 95, max: 110, criticalMin: 97, criticalMax: 102 }
};

// Clinical validation rules factory
export const createValidationRule = (
  field: string,
  type: 'required' | 'range' | 'format' | 'custom',
  message: string,
  params?: any
): ClinicalValidationRule => ({
  field,
  type,
  message,
  severity: 'error',
  params
});
