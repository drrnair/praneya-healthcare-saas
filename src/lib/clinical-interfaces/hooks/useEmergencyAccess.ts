/**
 * Emergency Access Hook - Critical Healthcare Information
 * Emergency health access with audit logging and compliance
 */

import { useState, useCallback } from 'react';
import { useClinicalInterface } from '../ClinicalInterfaceProvider';
import { EmergencyProfile } from '@/types/clinical';

export interface UseEmergencyAccessOptions {
  patientId: string;
  emergencyProfile?: EmergencyProfile;
}

export const useEmergencyAccess = (options: UseEmergencyAccessOptions) => {
  const { setEmergencyProfile, addAlert, logAuditEntry } = useClinicalInterface();
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [accessReason, setAccessReason] = useState<string>('');
  const [accessStartTime, setAccessStartTime] = useState<string | null>(null);

  // Activate emergency access
  const activateEmergencyAccess = useCallback((reason: string, accessorId?: string) => {
    const timestamp = new Date().toISOString();
    
    setEmergencyMode(true);
    setAccessReason(reason);
    setAccessStartTime(timestamp);
    
    // Log emergency access
    logAuditEntry({
      action: 'view',
      resource: 'emergency_profile',
      resourceId: options.patientId,
      userId: accessorId || 'emergency_accessor',
      userRole: 'emergency_responder',
      patientId: options.patientId,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      sessionId: 'emergency_' + Date.now(),
      justification: reason,
      dataAccessed: ['critical_allergies', 'medications', 'emergency_contacts', 'medical_conditions'],
      compliance_flags: ['emergency_access', 'break_glass', 'critical_care']
    });
    
    // Generate emergency access alert
    addAlert({
      id: `emergency_access_${Date.now()}`,
      type: 'system_generated',
      severity: 'high',
      title: 'Emergency Health Information Access',
      description: `Emergency access granted for: ${reason}`,
      patientId: options.patientId,
      triggeredBy: {
        source: 'emergency_access_system',
        data: { reason, accessorId, timestamp },
        timestamp
      },
      recommendations: {
        immediate_actions: ['Review access logs', 'Verify emergency legitimacy'],
        follow_up_required: true,
        provider_notification: true,
        patient_notification: true
      },
      status: 'active',
      escalation: {
        rules: [
          {
            condition: 'Emergency access active > 4 hours',
            action: 'Notify compliance officer',
            delay: '4 hours'
          }
        ],
        history: []
      }
    });
    
    return timestamp;
  }, [options.patientId, logAuditEntry, addAlert]);

  // Deactivate emergency access
  const deactivateEmergencyAccess = useCallback((notes?: string) => {
    const endTime = new Date().toISOString();
    const duration = accessStartTime 
      ? new Date(endTime).getTime() - new Date(accessStartTime).getTime()
      : 0;
    
    setEmergencyMode(false);
    
    // Log emergency access end
    logAuditEntry({
      action: 'view',
      resource: 'emergency_access_end',
      resourceId: options.patientId,
      userId: 'emergency_accessor',
      userRole: 'emergency_responder',
      patientId: options.patientId,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      sessionId: 'emergency_' + Date.now(),
      justification: `Emergency access ended. Duration: ${Math.round(duration / 1000 / 60)} minutes. Notes: ${notes || 'None'}`,
      compliance_flags: ['emergency_access_end', 'audit_trail']
    });
    
    setAccessReason('');
    setAccessStartTime(null);
  }, [accessStartTime, options.patientId, logAuditEntry]);

  // Emergency contact notification
  const notifyEmergencyContact = useCallback((contactId: string, method: 'call' | 'sms' | 'email') => {
    logAuditEntry({
      action: 'create',
      resource: 'emergency_notification',
      resourceId: contactId,
      userId: 'emergency_system',
      userRole: 'system',
      patientId: options.patientId,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      sessionId: 'emergency_' + Date.now(),
      justification: `Emergency contact notification via ${method}`,
      compliance_flags: ['emergency_notification', 'family_contact']
    });
    
    // In real implementation, this would trigger actual notification
    return Promise.resolve({
      notificationId: `notification_${Date.now()}`,
      method,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
  }, [options.patientId, logAuditEntry]);

  // Healthcare provider emergency notification
  const notifyHealthcareProvider = useCallback((providerId: string, urgency: 'stat' | 'urgent' | 'routine') => {
    logAuditEntry({
      action: 'create',
      resource: 'provider_emergency_notification',
      resourceId: providerId,
      userId: 'emergency_system',
      userRole: 'system',
      patientId: options.patientId,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      sessionId: 'emergency_' + Date.now(),
      justification: `Healthcare provider emergency notification - ${urgency}`,
      compliance_flags: ['provider_notification', 'clinical_escalation']
    });
    
    return Promise.resolve({
      notificationId: `provider_notification_${Date.now()}`,
      urgency,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
  }, [options.patientId, logAuditEntry]);

  // Call 911 integration
  const call911 = useCallback((location?: string, additionalInfo?: string) => {
    logAuditEntry({
      action: 'create',
      resource: 'emergency_services_call',
      resourceId: '911',
      userId: 'emergency_caller',
      userRole: 'emergency_responder',
      patientId: options.patientId,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      sessionId: 'emergency_' + Date.now(),
      justification: `911 emergency call initiated. Location: ${location || 'Unknown'}. Info: ${additionalInfo || 'None'}`,
      compliance_flags: ['emergency_services', '911_call', 'critical_incident']
    });
    
    // In real implementation, this would integrate with emergency services
    // For demo, we'll just open the tel: link
    window.open('tel:911');
    
    return Promise.resolve({
      callId: `call_911_${Date.now()}`,
      timestamp: new Date().toISOString(),
      location,
      additionalInfo
    });
  }, [options.patientId, logAuditEntry]);

  // Generate emergency medical summary
  const generateEmergencyMedicalSummary = useCallback(() => {
    if (!options.emergencyProfile) {
      return null;
    }
    
    const summary = {
      patientId: options.patientId,
      timestamp: new Date().toISOString(),
      criticalAllergies: options.emergencyProfile.criticalInformation.allergies
        .filter(allergy => allergy.severity === 'life_threatening' || allergy.severity === 'severe'),
      criticalMedications: options.emergencyProfile.criticalInformation.medications
        .filter(med => med.critical),
      activeMedicalConditions: options.emergencyProfile.criticalInformation.conditions
        .filter(condition => condition.status === 'active'),
      primaryEmergencyContact: options.emergencyProfile.emergencyContacts
        .find(contact => contact.isPrimary),
      primaryHealthcareProvider: options.emergencyProfile.healthcareProviders
        .find(provider => provider.isPrimary),
      emergencyPreferences: options.emergencyProfile.preferences
    };
    
    logAuditEntry({
      action: 'create',
      resource: 'emergency_medical_summary',
      resourceId: `summary_${Date.now()}`,
      userId: 'emergency_system',
      userRole: 'system',
      patientId: options.patientId,
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      sessionId: 'emergency_' + Date.now(),
      justification: 'Emergency medical summary generated for first responders',
      compliance_flags: ['emergency_summary', 'first_responder_data']
    });
    
    return summary;
  }, [options.emergencyProfile, options.patientId, logAuditEntry]);

  return {
    // State
    emergencyMode,
    accessReason,
    accessStartTime,
    
    // Methods
    activateEmergencyAccess,
    deactivateEmergencyAccess,
    notifyEmergencyContact,
    notifyHealthcareProvider,
    call911,
    generateEmergencyMedicalSummary,
    
    // Computed values
    accessDuration: accessStartTime 
      ? new Date().getTime() - new Date(accessStartTime).getTime()
      : 0,
    isActive: emergencyMode
  };
};
