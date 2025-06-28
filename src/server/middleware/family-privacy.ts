/**
 * Family Privacy Middleware
 * Manages access controls and data sharing permissions for family members
 */

import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports } from 'winston';

const familyLogger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: 'logs/family-privacy.log' }),
    new transports.Console({ level: 'warn' })
  ]
});

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age?: number;
  isMinor: boolean;
  role: 'parent' | 'guardian' | 'adult' | 'teen' | 'child';
}

interface PrivacySettings {
  memberId: string;
  dataSharing: {
    health_metrics: boolean;
    medications: boolean;
    lab_results: boolean;
    meal_plans: boolean;
    allergies: boolean;
    emergency_info: boolean;
  };
  accessLevel: 'full' | 'limited' | 'emergency_only' | 'none';
  allowedViewers: string[];
  allowedEditors: string[];
}

// Mock family data (integrate with your database)
const familyMembers = new Map<string, FamilyMember>();
const privacySettings = new Map<string, PrivacySettings>();

function getFamilyMember(memberId: string): FamilyMember | null {
  return familyMembers.get(memberId) || null;
}

function getPrivacySettings(memberId: string): PrivacySettings | null {
  return privacySettings.get(memberId) || null;
}

function isParentOrGuardian(requesterId: string, targetMemberId: string): boolean {
  const requester = getFamilyMember(requesterId);
  const target = getFamilyMember(targetMemberId);
  
  if (!requester || !target) return false;
  
  return (requester.role === 'parent' || requester.role === 'guardian') && target.isMinor;
}

function checkDataAccess(
  requesterId: string,
  targetMemberId: string,
  dataType: string,
  accessType: 'read' | 'write' | 'delete'
): { allowed: boolean; reason?: string; requiresApproval?: boolean } {
  
  // Self-access is always allowed
  if (requesterId === targetMemberId) {
    return { allowed: true };
  }
  
  const settings = getPrivacySettings(targetMemberId);
  
  if (!settings) {
    return { allowed: false, reason: 'Privacy settings not configured' };
  }
  
  // Check if requester is in allowed list
  const isAllowedViewer = settings.allowedViewers.includes(requesterId);
  const isAllowedEditor = settings.allowedEditors.includes(requesterId);
  
  if (accessType === 'read' && !isAllowedViewer) {
    return { allowed: false, reason: 'Not authorized to view this data' };
  }
  
  if ((accessType === 'write' || accessType === 'delete') && !isAllowedEditor) {
    return { allowed: false, reason: 'Not authorized to modify this data' };
  }
  
  // Check data-specific permissions
  const dataSharing = settings.dataSharing as any;
  if (dataType in dataSharing && !dataSharing[dataType]) {
    return { allowed: false, reason: `${dataType} sharing is disabled` };
  }
  
  // Parental control checks
  if (isParentOrGuardian(requesterId, targetMemberId)) {
    return { allowed: true }; // Parents can access minor children's data
  }
  
  return { allowed: true };
}

function extractDataTypes(req: Request): string[] {
  const path = req.path.toLowerCase();
  const dataTypes: string[] = [];
  
  if (path.includes('health') || path.includes('metrics')) dataTypes.push('health_metrics');
  if (path.includes('medication')) dataTypes.push('medications');
  if (path.includes('lab') || path.includes('results')) dataTypes.push('lab_results');
  if (path.includes('meal') || path.includes('nutrition')) dataTypes.push('meal_plans');
  if (path.includes('allergy') || path.includes('allergen')) dataTypes.push('allergies');
  if (path.includes('emergency') || path.includes('contact')) dataTypes.push('emergency_info');
  
  return dataTypes.length > 0 ? dataTypes : ['general'];
}

export const familyPrivacyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const requesterId = (req as any).user?.id;
    const targetMemberId = req.params.memberId || req.headers['x-family-member-id'] || req.body?.memberId;
    
    // Skip privacy checks for non-family endpoints
    const familyEndpoints = ['/family', '/health-profile', '/medications', '/emergency'];
    const isFamilyEndpoint = familyEndpoints.some(endpoint => req.path.includes(endpoint));
    
    if (!isFamilyEndpoint || !targetMemberId || !requesterId) {
      return next();
    }
    
    const dataTypes = extractDataTypes(req);
    const accessType = req.method === 'GET' ? 'read' : (req.method === 'DELETE' ? 'delete' : 'write');
    
    // Emergency access bypass
    if (req.headers['x-emergency-access'] === 'true') {
      familyLogger.warn('Emergency Family Data Access', {
        requesterId,
        targetMemberId,
        dataTypes,
        endpoint: req.originalUrl,
        timestamp: new Date().toISOString()
      });
      
      res.setHeader('X-Emergency-Access', 'granted');
      return next();
    }
    
    // Check access for each data type
    const accessResults = dataTypes.map(dataType => ({
      dataType,
      result: checkDataAccess(requesterId, targetMemberId, dataType, accessType)
    }));
    
    const deniedAccess = accessResults.filter(ar => !ar.result.allowed);
    
    // Log access attempt
    familyLogger.info('Family Data Access Attempt', {
      requesterId,
      targetMemberId,
      dataTypes,
      accessType,
      endpoint: req.originalUrl,
      allowed: deniedAccess.length === 0,
      timestamp: new Date().toISOString()
    });
    
    // Block denied access
    if (deniedAccess.length > 0) {
      const reasons = deniedAccess.map(da => `${da.dataType}: ${da.result.reason}`);
      
      return res.status(403).json({
        error: 'Family Privacy Violation',
        code: 'ACCESS_DENIED',
        message: 'Access to family member data denied by privacy settings',
        denied_data_types: deniedAccess.map(da => da.dataType),
        reasons
      });
    }
    
    // Set privacy context headers
    res.setHeader('X-Family-Member-Access', targetMemberId);
    res.setHeader('X-Data-Types-Accessed', dataTypes.join(','));
    
    next();
  } catch (error) {
    familyLogger.error('Family Privacy Middleware Error', {
      error: error.message,
      endpoint: req.originalUrl,
      requesterId: (req as any).user?.id
    });
    
    // Don't block requests if privacy check fails
    next();
  }
};

export const familyPrivacyManagement = {
  async updatePrivacySettings(memberId: string, settings: Partial<PrivacySettings>) {
    const existing = getPrivacySettings(memberId);
    const updated = { ...existing, ...settings, memberId };
    
    privacySettings.set(memberId, updated as PrivacySettings);
    
    familyLogger.info('Privacy Settings Updated', {
      memberId,
      changes: Object.keys(settings),
      timestamp: new Date().toISOString()
    });
    
    return updated;
  }
}; 