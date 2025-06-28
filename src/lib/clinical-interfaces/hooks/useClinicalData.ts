/**
 * Clinical Data Hook - Premium Healthcare Data Management
 * Custom hook for managing clinical data with HIPAA compliance
 */

import { useState, useEffect, useCallback } from 'react';
import { useClinicalInterface } from '../ClinicalInterfaceProvider';
import { LabValue, BiometricReading, Medication, SymptomEntry } from '@/types/clinical';

export interface UseClinicalDataOptions {
  patientId: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enableRealTime?: boolean;
}

export interface ClinicalDataFilters {
  dateRange?: { start: string; end: string };
  types?: string[];
  providerId?: string;
  verified?: boolean;
}

export const useClinicalData = (options: UseClinicalDataOptions) => {
  const { state, addLabValue, addBiometricReading, addMedication, addSymptom, logAuditEntry } = useClinicalInterface();
  const [filters, setFilters] = useState<ClinicalDataFilters>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter clinical data based on current filters
  const filteredLabValues = useCallback(() => {
    let filtered = state.labValues;
    
    if (filters.dateRange) {
      filtered = filtered.filter(value => 
        value.collectionDate >= filters.dateRange!.start &&
        value.collectionDate <= filters.dateRange!.end
      );
    }
    
    if (filters.providerId) {
      filtered = filtered.filter(value => value.providerId === filters.providerId);
    }
    
    return filtered;
  }, [state.labValues, filters]);

  const filteredBiometricReadings = useCallback(() => {
    let filtered = state.biometricReadings;
    
    if (filters.dateRange) {
      filtered = filtered.filter(reading => 
        reading.timestamp >= filters.dateRange!.start &&
        reading.timestamp <= filters.dateRange!.end
      );
    }
    
    if (filters.verified !== undefined) {
      filtered = filtered.filter(reading => reading.verified === filters.verified);
    }
    
    if (filters.types) {
      filtered = filtered.filter(reading => filters.types!.includes(reading.type));
    }
    
    return filtered;
  }, [state.biometricReadings, filters]);

  const filteredMedications = useCallback(() => {
    let filtered = state.medications;
    
    if (filters.dateRange) {
      filtered = filtered.filter(medication => 
        medication.startDate >= filters.dateRange!.start &&
        (!medication.endDate || medication.endDate <= filters.dateRange!.end)
      );
    }
    
    return filtered.filter(medication => medication.status === 'active');
  }, [state.medications, filters]);

  const filteredSymptoms = useCallback(() => {
    let filtered = state.symptoms;
    
    if (filters.dateRange) {
      filtered = filtered.filter(symptom => 
        symptom.timestamp >= filters.dateRange!.start &&
        symptom.timestamp <= filters.dateRange!.end
      );
    }
    
    if (filters.types) {
      filtered = filtered.filter(symptom => filters.types!.includes(symptom.category));
    }
    
    return filtered;
  }, [state.symptoms, filters]);

  // Clinical data submission methods
  const submitLabValue = useCallback(async (labValue: Omit<LabValue, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newLabValue: LabValue = {
        ...labValue,
        id: `lab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        collectionDate: labValue.collectionDate || new Date().toISOString(),
        resultDate: labValue.resultDate || new Date().toISOString(),
        flagged: false
      };
      
      addLabValue(newLabValue);
      
      // Log successful submission
      logAuditEntry({
        action: 'create',
        resource: 'lab_value',
        resourceId: newLabValue.id,
        userId: 'current_user', // Would come from auth context
        userRole: 'healthcare_provider',
        patientId: options.patientId,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        compliance_flags: ['clinical_data_entry', 'lab_results']
      });
      
      return newLabValue;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit lab value';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addLabValue, logAuditEntry, options.patientId]);

  const submitBiometricReading = useCallback(async (reading: Omit<BiometricReading, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newReading: BiometricReading = {
        ...reading,
        id: `biometric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: reading.timestamp || new Date().toISOString(),
        patientReported: reading.patientReported ?? true,
        verified: reading.verified ?? false
      };
      
      addBiometricReading(newReading);
      
      logAuditEntry({
        action: 'create',
        resource: 'biometric_reading',
        resourceId: newReading.id,
        userId: 'current_user',
        userRole: newReading.patientReported ? 'patient' : 'healthcare_provider',
        patientId: options.patientId,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        compliance_flags: ['biometric_data', 'patient_monitoring']
      });
      
      return newReading;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit biometric reading';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addBiometricReading, logAuditEntry, options.patientId]);

  // Data aggregation methods
  const getLatestBiometric = useCallback((type: BiometricReading['type']) => {
    const readings = filteredBiometricReadings().filter(reading => reading.type === type);
    return readings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }, [filteredBiometricReadings]);

  const getBiometricTrend = useCallback((type: BiometricReading['type'], days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const readings = filteredBiometricReadings()
      .filter(reading => 
        reading.type === type && 
        new Date(reading.timestamp) >= cutoffDate
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    return readings;
  }, [filteredBiometricReadings]);

  const getCriticalAlerts = useCallback(() => {
    return state.alerts.filter(alert => 
      alert.severity === 'critical' && 
      alert.status === 'active' &&
      alert.patientId === options.patientId
    );
  }, [state.alerts, options.patientId]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ClinicalDataFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    logAuditEntry({
      action: 'view',
      resource: 'clinical_data_filter',
      resourceId: 'filter_update',
      userId: 'current_user',
      userRole: 'healthcare_provider',
      patientId: options.patientId,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      sessionId: 'session_' + Date.now(),
      compliance_flags: ['data_filtering', 'clinical_view']
    });
  }, [logAuditEntry, options.patientId]);

  // Auto-refresh effect
  useEffect(() => {
    if (options.autoRefresh && options.refreshInterval) {
      const interval = setInterval(() => {
        // In real implementation, this would fetch fresh data
        // For now, we'll just log the refresh attempt
        logAuditEntry({
          action: 'view',
          resource: 'clinical_data_refresh',
          resourceId: 'auto_refresh',
          userId: 'system',
          userRole: 'system',
          patientId: options.patientId,
          ipAddress: '127.0.0.1',
          userAgent: navigator.userAgent,
          sessionId: 'session_' + Date.now(),
          compliance_flags: ['auto_refresh', 'data_synchronization']
        });
      }, options.refreshInterval);

      return () => clearInterval(interval);
    }
  }, [options.autoRefresh, options.refreshInterval, logAuditEntry, options.patientId]);

  return {
    // Filtered data
    labValues: filteredLabValues(),
    biometricReadings: filteredBiometricReadings(),
    medications: filteredMedications(),
    symptoms: filteredSymptoms(),
    alerts: state.alerts,
    
    // State
    loading,
    error,
    filters,
    
    // Methods
    submitLabValue,
    submitBiometricReading,
    updateFilters,
    getLatestBiometric,
    getBiometricTrend,
    getCriticalAlerts,
    
    // Clear error
    clearError: () => setError(null)
  };
};
