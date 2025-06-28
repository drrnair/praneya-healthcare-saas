/**
 * Clinical Audit Logging Utilities
 * HIPAA-compliant audit logging functions
 */

import { ClinicalAuditEntry } from '@/types/clinical';

// Create audit entry
export const createAuditEntry = (
  action: ClinicalAuditEntry['action'],
  resource: string,
  resourceId: string,
  userId: string,
  userRole: string,
  patientId?: string,
  additionalData?: Partial<ClinicalAuditEntry>
): ClinicalAuditEntry => ({
  id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  action,
  resource,
  resourceId,
  userId,
  userRole,
  patientId,
  timestamp: new Date().toISOString(),
  ipAddress: '127.0.0.1', // Would be actual IP
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server',
  sessionId: `session_${Date.now()}`,
  compliance_flags: ['audit_logged'],
  ...additionalData
});

// Log clinical data access
export const logClinicalDataAccess = (
  userId: string,
  userRole: string,
  patientId: string,
  dataType: string,
  justification?: string
) => {
  return createAuditEntry(
    'view',
    'clinical_data',
    `${dataType}_${patientId}`,
    userId,
    userRole,
    patientId,
    {
      justification,
      dataAccessed: [dataType],
      compliance_flags: ['clinical_access', 'data_view']
    }
  );
};

// Log emergency access
export const logEmergencyAccess = (
  accessorId: string,
  patientId: string,
  reason: string,
  dataAccessed: string[]
) => {
  return createAuditEntry(
    'view',
    'emergency_profile',
    patientId,
    accessorId,
    'emergency_responder',
    patientId,
    {
      justification: `Emergency access: ${reason}`,
      dataAccessed,
      compliance_flags: ['emergency_access', 'break_glass', 'critical_care']
    }
  );
};
