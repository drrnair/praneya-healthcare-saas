/**
 * HIPAA Audit Logging Middleware
 * Tracks all access to Protected Health Information (PHI) for compliance
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createLogger, format, transports } from 'winston';

// HIPAA-compliant audit logger
const hipaaLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        audit_type: 'HIPAA_ACCESS',
        ...meta
      });
    })
  ),
  transports: [
    new transports.File({ 
      filename: 'logs/hipaa-audit.log',
      maxsize: 50 * 1024 * 1024, // 50MB
      maxFiles: 10,
      tailable: true
    }),
    new transports.File({ 
      filename: 'logs/hipaa-error.log', 
      level: 'error',
      maxsize: 50 * 1024 * 1024,
      maxFiles: 10
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  hipaaLogger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

interface HIPAAAuditLog {
  auditId: string;
  timestamp: string;
  userId?: string;
  patientId?: string;
  familyMemberId?: string;
  action: string;
  resource: string;
  method: string;
  endpoint: string;
  ipAddress: string;
  userAgent: string;
  deviceFingerprint?: string;
  sessionId?: string;
  dataAccessed?: string[];
  phiFields?: string[];
  accessReason?: string;
  consentStatus?: string;
  clinicalContext?: string;
  emergencyAccess?: boolean;
  auditResult: 'SUCCESS' | 'FAILURE' | 'UNAUTHORIZED' | 'BLOCKED';
  errorMessage?: string;
  responseTime?: number;
  dataSize?: number;
}

// PHI field detection patterns
const PHI_PATTERNS = [
  /ssn|social[_\s]security/i,
  /medical[_\s]record[_\s]number|mrn/i,
  /health[_\s]plan[_\s]beneficiary/i,
  /account[_\s]number/i,
  /certificate[_\s]license[_\s]number/i,
  /vehicle[_\s]identifier/i,
  /device[_\s]identifier/i,
  /web[_\s]url/i,
  /ip[_\s]address/i,
  /biometric[_\s]identifier/i,
  /photograph/i,
  /diagnosis|condition|medication|treatment/i,
  /lab[_\s]result|test[_\s]result/i,
  /prescription|dosage/i,
  /blood[_\s]pressure|heart[_\s]rate|weight|height/i,
  /allergy|allergen/i,
  /emergency[_\s]contact/i,
  /insurance|coverage/i
];

// Detect PHI fields in request/response data
function detectPHIFields(data: any): string[] {
  if (!data || typeof data !== 'object') return [];
  
  const phiFields: string[] = [];
  const jsonString = JSON.stringify(data).toLowerCase();
  
  PHI_PATTERNS.forEach(pattern => {
    if (pattern.test(jsonString)) {
      const match = jsonString.match(pattern);
      if (match) {
        phiFields.push(match[0]);
      }
    }
  });
  
  return [...new Set(phiFields)]; // Remove duplicates
}

// Extract relevant data for audit logging
function extractAuditData(req: Request): Partial<HIPAAAuditLog> {
  const userId = (req as any).user?.id || req.headers['x-user-id'];
  const patientId = req.params.patientId || req.body?.patientId || req.query?.patientId;
  const familyMemberId = req.headers['x-family-member-id'] || req.body?.familyMemberId;
  const deviceFingerprint = req.headers['x-device-fingerprint'];
  const sessionId = req.sessionID || req.headers['x-session-id'];
  const clinicalContext = req.headers['x-clinical-context'];
  const emergencyAccess = req.headers['x-emergency-access'] === 'true';
  
  return {
    userId: userId as string,
    patientId: patientId as string,
    familyMemberId: familyMemberId as string,
    deviceFingerprint: deviceFingerprint as string,
    sessionId: sessionId as string,
    clinicalContext: clinicalContext as string,
    emergencyAccess,
    ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent') || 'unknown'
  };
}

// Determine if endpoint contains PHI
function containsPHI(endpoint: string): boolean {
  const phiEndpoints = [
    '/health-profile',
    '/medical-records',
    '/prescriptions',
    '/lab-results',
    '/clinical-notes',
    '/family-health',
    '/emergency-contacts',
    '/insurance',
    '/billing',
    '/appointments',
    '/providers'
  ];
  
  return phiEndpoints.some(pattern => endpoint.includes(pattern));
}

export const hipaaAuditMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const auditId = uuidv4();
  
  // Skip audit for non-PHI endpoints in production (to reduce log volume)
  if (process.env.NODE_ENV === 'production' && !containsPHI(req.path)) {
    return next();
  }
  
  const auditData: HIPAAAuditLog = {
    auditId,
    timestamp: new Date().toISOString(),
    action: 'API_ACCESS',
    resource: req.path,
    method: req.method,
    endpoint: req.originalUrl,
    auditResult: 'SUCCESS',
    ...extractAuditData(req)
  };
  
  // Detect PHI in request data
  if (req.body && Object.keys(req.body).length > 0) {
    auditData.phiFields = detectPHIFields(req.body);
    auditData.dataSize = JSON.stringify(req.body).length;
  }
  
  // Store audit ID for response logging
  (req as any).auditId = auditId;
  
  // Override res.json to capture response data
  const originalJson = res.json;
  res.json = function(data: any) {
    const responseTime = Date.now() - startTime;
    
    // Detect PHI in response data
    const responsePhiFields = detectPHIFields(data);
    if (responsePhiFields.length > 0) {
      auditData.phiFields = [...(auditData.phiFields || []), ...responsePhiFields];
    }
    
    auditData.responseTime = responseTime;
    auditData.auditResult = res.statusCode >= 400 ? 'FAILURE' : 'SUCCESS';
    
    if (res.statusCode >= 400) {
      auditData.errorMessage = data?.message || data?.error || 'Unknown error';
    }
    
    // Log the audit event
    try {
      hipaaLogger.info('HIPAA Access Audit', auditData);
    } catch (error) {
      console.error('Failed to log HIPAA audit:', error);
    }
    
    return originalJson.call(this, data);
  };
  
  // Handle errors
  res.on('error', (error) => {
    auditData.auditResult = 'FAILURE';
    auditData.errorMessage = error.message;
    auditData.responseTime = Date.now() - startTime;
    
    try {
      hipaaLogger.error('HIPAA Access Error', { ...auditData, error: error.stack });
    } catch (logError) {
      console.error('Failed to log HIPAA audit error:', logError);
    }
  });
  
  // Handle response finish (for cases where res.json wasn't called)
  res.on('finish', () => {
    if (!(res as any).headersSent || !auditData.responseTime) {
      auditData.responseTime = Date.now() - startTime;
      auditData.auditResult = res.statusCode >= 400 ? 'FAILURE' : 'SUCCESS';
      
      try {
        hipaaLogger.info('HIPAA Access Complete', auditData);
      } catch (error) {
        console.error('Failed to log HIPAA audit completion:', error);
      }
    }
  });
  
  next();
};

// Export logger for external use
export { hipaaLogger };

// Audit log query functions for compliance reports
export const queryAuditLogs = {
  // Get access logs for a specific patient
  async getPatientAccessLogs(patientId: string, startDate?: Date, endDate?: Date) {
    // This would integrate with your log aggregation system
    // For now, returning a placeholder
    return {
      patientId,
      accessCount: 0,
      logs: [],
      dateRange: { start: startDate, end: endDate }
    };
  },
  
  // Get access logs for a specific user
  async getUserAccessLogs(userId: string, startDate?: Date, endDate?: Date) {
    return {
      userId,
      accessCount: 0,
      logs: [],
      dateRange: { start: startDate, end: endDate }
    };
  },
  
  // Get failed access attempts
  async getFailedAccessAttempts(startDate?: Date, endDate?: Date) {
    return {
      failedAttempts: 0,
      logs: [],
      dateRange: { start: startDate, end: endDate }
    };
  }
}; 