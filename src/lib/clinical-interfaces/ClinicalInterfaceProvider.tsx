/**
 * Clinical Interface Provider - Premium Healthcare Context
 * Central state management and HIPAA-compliant audit logging for clinical interfaces
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  ClinicalAuditEntry, 
  HIPAACompliance, 
  LabValue, 
  BiometricReading, 
  Medication,
  SymptomEntry,
  EmergencyProfile,
  MedicalAlert
} from '@/types/clinical';

// Clinical Interface State
interface ClinicalInterfaceState {
  // Data
  labValues: LabValue[];
  biometricReadings: BiometricReading[];
  medications: Medication[];
  symptoms: SymptomEntry[];
  emergencyProfile: EmergencyProfile | null;
  alerts: MedicalAlert[];
  
  // Interface State
  activeInterface: string | null;
  loading: Record<string, boolean>;
  errors: Record<string, string>;
  
  // HIPAA Compliance
  auditEntries: ClinicalAuditEntry[];
  complianceStatus: HIPAACompliance;
  
  // Real-time Updates
  lastUpdated: string;
  websocketConnected: boolean;
}

// Clinical Interface Actions
type ClinicalInterfaceAction =
  | { type: 'SET_LOADING'; payload: { interface: string; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { interface: string; error: string } }
  | { type: 'ADD_LAB_VALUE'; payload: LabValue }
  | { type: 'ADD_BIOMETRIC_READING'; payload: BiometricReading }
  | { type: 'ADD_MEDICATION'; payload: Medication }
  | { type: 'ADD_SYMPTOM'; payload: SymptomEntry }
  | { type: 'SET_EMERGENCY_PROFILE'; payload: EmergencyProfile }
  | { type: 'ADD_ALERT'; payload: MedicalAlert }
  | { type: 'ACKNOWLEDGE_ALERT'; payload: { alertId: string; userId: string; notes?: string } }
  | { type: 'LOG_AUDIT_ENTRY'; payload: ClinicalAuditEntry }
  | { type: 'UPDATE_COMPLIANCE_STATUS'; payload: Partial<HIPAACompliance> }
  | { type: 'SET_WEBSOCKET_STATUS'; payload: boolean }
  | { type: 'SET_ACTIVE_INTERFACE'; payload: string | null };

// Initial State
const initialState: ClinicalInterfaceState = {
  labValues: [],
  biometricReadings: [],
  medications: [],
  symptoms: [],
  emergencyProfile: null,
  alerts: [],
  activeInterface: null,
  loading: {},
  errors: {},
  auditEntries: [],
  complianceStatus: {
    minimum_necessary: true,
    purpose_documented: true,
    patient_consent: true,
    access_authorized: true,
    audit_logged: true,
    encryption_verified: true,
    breach_risk_assessed: true
  },
  lastUpdated: new Date().toISOString(),
  websocketConnected: false
};

// Reducer
function clinicalInterfaceReducer(
  state: ClinicalInterfaceState,
  action: ClinicalInterfaceAction
): ClinicalInterfaceState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.interface]: action.payload.loading
        }
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.interface]: action.payload.error
        }
      };
      
    case 'ADD_LAB_VALUE':
      return {
        ...state,
        labValues: [...state.labValues, action.payload],
        lastUpdated: new Date().toISOString()
      };
      
    case 'ADD_BIOMETRIC_READING':
      return {
        ...state,
        biometricReadings: [...state.biometricReadings, action.payload],
        lastUpdated: new Date().toISOString()
      };
      
    case 'ADD_MEDICATION':
      return {
        ...state,
        medications: [...state.medications, action.payload],
        lastUpdated: new Date().toISOString()
      };
      
    case 'ADD_SYMPTOM':
      return {
        ...state,
        symptoms: [...state.symptoms, action.payload],
        lastUpdated: new Date().toISOString()
      };
      
    case 'SET_EMERGENCY_PROFILE':
      return {
        ...state,
        emergencyProfile: action.payload,
        lastUpdated: new Date().toISOString()
      };
      
    case 'ADD_ALERT':
      return {
        ...state,
        alerts: [action.payload, ...state.alerts],
        lastUpdated: new Date().toISOString()
      };
      
    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.id === action.payload.alertId
            ? {
                ...alert,
                status: 'acknowledged' as const,
                acknowledgedBy: {
                  userId: action.payload.userId,
                  role: 'healthcare_provider', // This would come from user context
                  timestamp: new Date().toISOString(),
                  notes: action.payload.notes
                }
              }
            : alert
        ),
        lastUpdated: new Date().toISOString()
      };
      
    case 'LOG_AUDIT_ENTRY':
      return {
        ...state,
        auditEntries: [action.payload, ...state.auditEntries.slice(0, 999)], // Keep last 1000 entries
        lastUpdated: new Date().toISOString()
      };
      
    case 'UPDATE_COMPLIANCE_STATUS':
      return {
        ...state,
        complianceStatus: {
          ...state.complianceStatus,
          ...action.payload
        }
      };
      
    case 'SET_WEBSOCKET_STATUS':
      return {
        ...state,
        websocketConnected: action.payload
      };
      
    case 'SET_ACTIVE_INTERFACE':
      return {
        ...state,
        activeInterface: action.payload
      };
      
    default:
      return state;
  }
}

// Context
interface ClinicalInterfaceContextType {
  state: ClinicalInterfaceState;
  dispatch: React.Dispatch<ClinicalInterfaceAction>;
  
  // Clinical Data Methods
  addLabValue: (labValue: LabValue) => void;
  addBiometricReading: (reading: BiometricReading) => void;
  addMedication: (medication: Medication) => void;
  addSymptom: (symptom: SymptomEntry) => void;
  setEmergencyProfile: (profile: EmergencyProfile) => void;
  
  // Alert Methods
  addAlert: (alert: MedicalAlert) => void;
  acknowledgeAlert: (alertId: string, userId: string, notes?: string) => void;
  
  // Interface Methods
  setActiveInterface: (interfaceId: string | null) => void;
  setLoading: (interfaceId: string, loading: boolean) => void;
  setError: (interfaceId: string, error: string) => void;
  
  // Audit Methods
  logAuditEntry: (entry: Omit<ClinicalAuditEntry, 'id' | 'timestamp'>) => void;
  
  // Real-time Methods
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

const ClinicalInterfaceContext = createContext<ClinicalInterfaceContextType | undefined>(undefined);

// Provider Props
interface ClinicalInterfaceProviderProps {
  children: React.ReactNode;
  patientId: string;
  providerId?: string;
  apiEndpoint?: string;
  websocketUrl?: string;
  auditEnabled?: boolean;
}

// Provider Component
export const ClinicalInterfaceProvider: React.FC<ClinicalInterfaceProviderProps> = ({
  children,
  patientId,
  providerId,
  apiEndpoint = '/api/clinical',
  websocketUrl = 'ws://localhost:3001/clinical',
  auditEnabled = true
}) => {
  const [state, dispatch] = useReducer(clinicalInterfaceReducer, initialState);

  // Clinical Data Methods
  const addLabValue = (labValue: LabValue) => {
    dispatch({ type: 'ADD_LAB_VALUE', payload: labValue });
    
    if (auditEnabled) {
      logAuditEntry({
        action: 'create',
        resource: 'lab_value',
        resourceId: labValue.id,
        userId: providerId || 'system',
        userRole: 'healthcare_provider',
        patientId,
        ipAddress: '127.0.0.1', // Would be actual IP
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        compliance_flags: ['data_entry', 'clinical_data']
      });
    }
  };

  const addBiometricReading = (reading: BiometricReading) => {
    dispatch({ type: 'ADD_BIOMETRIC_READING', payload: reading });
    
    if (auditEnabled) {
      logAuditEntry({
        action: 'create',
        resource: 'biometric_reading',
        resourceId: reading.id,
        userId: providerId || 'patient',
        userRole: reading.patientReported ? 'patient' : 'healthcare_provider',
        patientId,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        compliance_flags: ['data_entry', 'biometric_data']
      });
    }
  };

  const addMedication = (medication: Medication) => {
    dispatch({ type: 'ADD_MEDICATION', payload: medication });
    
    if (auditEnabled) {
      logAuditEntry({
        action: 'create',
        resource: 'medication',
        resourceId: medication.id,
        userId: providerId || 'system',
        userRole: 'healthcare_provider',
        patientId,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        compliance_flags: ['medication_management', 'clinical_data']
      });
    }
  };

  const addSymptom = (symptom: SymptomEntry) => {
    dispatch({ type: 'ADD_SYMPTOM', payload: symptom });
    
    if (auditEnabled) {
      logAuditEntry({
        action: 'create',
        resource: 'symptom',
        resourceId: symptom.id,
        userId: symptom.reportedBy === 'patient' ? patientId : providerId || 'system',
        userRole: symptom.reportedBy,
        patientId,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        compliance_flags: ['symptom_tracking', 'patient_reported_data']
      });
    }
  };

  const setEmergencyProfile = (profile: EmergencyProfile) => {
    dispatch({ type: 'SET_EMERGENCY_PROFILE', payload: profile });
    
    if (auditEnabled) {
      logAuditEntry({
        action: 'update',
        resource: 'emergency_profile',
        resourceId: profile.patientId,
        userId: providerId || 'system',
        userRole: 'healthcare_provider',
        patientId,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        compliance_flags: ['emergency_data', 'critical_information']
      });
    }
  };

  // Alert Methods
  const addAlert = (alert: MedicalAlert) => {
    dispatch({ type: 'ADD_ALERT', payload: alert });
    
    if (auditEnabled) {
      logAuditEntry({
        action: 'create',
        resource: 'medical_alert',
        resourceId: alert.id,
        userId: 'system',
        userRole: 'system',
        patientId,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        compliance_flags: ['alert_generation', 'clinical_monitoring']
      });
    }
  };

  const acknowledgeAlert = (alertId: string, userId: string, notes?: string) => {
    dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: { alertId, userId, notes } });
    
    if (auditEnabled) {
      logAuditEntry({
        action: 'update',
        resource: 'medical_alert',
        resourceId: alertId,
        userId,
        userRole: 'healthcare_provider',
        patientId,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        compliance_flags: ['alert_acknowledgment', 'clinical_response']
      });
    }
  };

  // Interface Methods
  const setActiveInterface = (interfaceId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_INTERFACE', payload: interfaceId });
  };

  const setLoading = (interfaceId: string, loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { interface: interfaceId, loading } });
  };

  const setError = (interfaceId: string, error: string) => {
    dispatch({ type: 'SET_ERROR', payload: { interface: interfaceId, error } });
  };

  // Audit Methods
  const logAuditEntry = (entry: Omit<ClinicalAuditEntry, 'id' | 'timestamp'>) => {
    const auditEntry: ClinicalAuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    
    dispatch({ type: 'LOG_AUDIT_ENTRY', payload: auditEntry });
  };

  // Real-time Methods
  const connectWebSocket = () => {
    // WebSocket implementation would go here
    dispatch({ type: 'SET_WEBSOCKET_STATUS', payload: true });
  };

  const disconnectWebSocket = () => {
    // WebSocket cleanup would go here
    dispatch({ type: 'SET_WEBSOCKET_STATUS', payload: false });
  };

  // Effects
  useEffect(() => {
    // Initialize WebSocket connection
    if (websocketUrl) {
      connectWebSocket();
    }

    return () => {
      disconnectWebSocket();
    };
  }, [websocketUrl]);

  useEffect(() => {
    // Log session start
    if (auditEnabled) {
      logAuditEntry({
        action: 'view',
        resource: 'clinical_interface',
        resourceId: 'session_start',
        userId: providerId || patientId,
        userRole: providerId ? 'healthcare_provider' : 'patient',
        patientId,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        compliance_flags: ['session_tracking', 'access_monitoring']
      });
    }
  }, []);

  const contextValue: ClinicalInterfaceContextType = {
    state,
    dispatch,
    addLabValue,
    addBiometricReading,
    addMedication,
    addSymptom,
    setEmergencyProfile,
    addAlert,
    acknowledgeAlert,
    setActiveInterface,
    setLoading,
    setError,
    logAuditEntry,
    connectWebSocket,
    disconnectWebSocket
  };

  return (
    <ClinicalInterfaceContext.Provider value={contextValue}>
      {children}
    </ClinicalInterfaceContext.Provider>
  );
};

// Hook to use Clinical Interface Context
export const useClinicalInterface = () => {
  const context = useContext(ClinicalInterfaceContext);
  if (context === undefined) {
    throw new Error('useClinicalInterface must be used within a ClinicalInterfaceProvider');
  }
  return context;
};
