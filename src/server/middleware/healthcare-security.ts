/**
 * Healthcare Security Middleware
 * Handles authentication, encryption, and HIPAA compliance for all API requests
 */

// Type definitions for missing modules (until packages are installed)
type Request = {
  path: string;
  headers: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string>;
};

type Response = {
  status: (code: number) => Response;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
};

type NextFunction = () => void;

// Mock verify function until jsonwebtoken is installed
const verify = (token: string, secret: string): any => {
  // Placeholder implementation
  return { id: 'mock', tenantId: 'mock', healthcareRole: 'end_user' };
};

import * as crypto from 'crypto';

// Healthcare-specific interfaces
interface HealthcareRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    healthcareRole: 'end_user' | 'clinical_advisor' | 'super_admin';
    mfaVerified: boolean;
    deviceFingerprint?: string;
    familyAccountId?: string;
  };
  healthcare?: {
    phiAccess: boolean;
    auditRequired: boolean;
    sensitivityLevel: 'public' | 'sensitive' | 'phi' | 'critical';
    clinicalContext?: string;
  };
}

interface SecurityConfig {
  jwtSecret: string;
  encryptionKey: string;
  hipaaCompliant: boolean;
  requireMFA: boolean;
  auditAllAccess: boolean;
}

// Security configuration
const securityConfig: SecurityConfig = {
  jwtSecret: process.env.JWT_SECRET || 'mock-secret',
  encryptionKey: process.env.HEALTHCARE_ENCRYPTION_KEY || 'mock-key',
  hipaaCompliant: process.env.HIPAA_COMPLIANCE_ENABLED === 'true',
  requireMFA: process.env.MFA_REQUIRED === 'true',
  auditAllAccess: process.env.AUDIT_ALL_ACCESS === 'true'
};

/**
 * Main healthcare security middleware
 */
export async function healthcareSecurityMiddleware(
  req: HealthcareRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Skip security for public endpoints
    if (isPublicEndpoint(req.path)) {
      return next();
    }

    // 2. Extract and verify JWT token
    const token = extractToken(req);
    if (!token) {
      return sendUnauthorized(res, 'Missing authentication token');
    }

    // 3. Verify token and extract user information
    const user = await verifyToken(token);
    if (!user) {
      return sendUnauthorized(res, 'Invalid or expired token');
    }

    // 4. Check device fingerprint for fraud prevention
    const deviceFingerprint = req.headers['x-device-fingerprint'] as string;
    if (securityConfig.hipaaCompliant && !await verifyDeviceFingerprint(user.id, deviceFingerprint)) {
      return sendUnauthorized(res, 'Device not recognized - additional verification required');
    }

    // 5. Determine healthcare context and sensitivity
    const healthcareContext = determineHealthcareContext(req);
    
    // 6. Check MFA requirement for sensitive operations
    if (shouldRequireMFA(healthcareContext) && !user.mfaVerified) {
      return sendMFARequired(res);
    }

    // 7. Check role-based access
    if (!hasRequiredRole(user, healthcareContext)) {
      return sendForbidden(res, 'Insufficient permissions for healthcare data access');
    }

    // 8. Set healthcare context
    req.user = user;
    req.healthcare = healthcareContext;

    // 9. Set security headers
    setSecurityHeaders(res, healthcareContext);

    next();
  } catch (error) {
    console.error('Healthcare security middleware error:', error);
    return sendServerError(res, 'Security validation failed');
  }
}

/**
 * Extract JWT token from request
 */
function extractToken(req: HealthcareRequest): string | null {
  const authHeader = req.headers.authorization;
  
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check for token in cookies (for web app)
  const cookieToken = req.cookies?.['praneya-auth-token'];
  if (cookieToken) {
    return cookieToken;
  }
  
  return null;
}

/**
 * Verify JWT token and return user information
 */
async function verifyToken(token: string): Promise<HealthcareRequest['user'] | null> {
  try {
    const decoded = verify(token, securityConfig.jwtSecret) as any;
    
    // Validate token structure
    if (!decoded.id || !decoded.tenantId || !decoded.healthcareRole) {
      return null;
    }

    // Additional healthcare-specific validations
    if (securityConfig.hipaaCompliant) {
      // Check if token is from a HIPAA-compliant session
      if (!decoded.hipaaCompliant) {
        return null;
      }
      
      // Verify token hasn't been issued too long ago (for PHI access)
      const tokenAge = Date.now() - (decoded.iat * 1000);
      const maxAge = 8 * 60 * 60 * 1000; // 8 hours for PHI access
      if (tokenAge > maxAge) {
        return null;
      }
    }

    return {
      id: decoded.id,
      tenantId: decoded.tenantId,
      healthcareRole: decoded.healthcareRole,
      mfaVerified: decoded.mfaVerified || false,
      deviceFingerprint: decoded.deviceFingerprint,
      familyAccountId: decoded.familyAccountId
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Verify device fingerprint for fraud prevention
 */
async function verifyDeviceFingerprint(userId: string, fingerprint?: string): Promise<boolean> {
  if (!fingerprint) return false;
  
  try {
    // This would check against stored device fingerprints in the database
    // For now, return true if fingerprint is provided
    return fingerprint.length > 10;
  } catch (error) {
    console.error('Device fingerprint verification failed:', error);
    return false;
  }
}

/**
 * Determine healthcare context and sensitivity level
 */
function determineHealthcareContext(req: HealthcareRequest): HealthcareRequest['healthcare'] {
  const path = req.path.toLowerCase();
  let sensitivityLevel: 'public' | 'sensitive' | 'phi' | 'critical' = 'public';
  let phiAccess = false;
  let auditRequired = false;

  // Determine sensitivity based on endpoint
  if (path.includes('/health-profiles') || path.includes('/allergies') || path.includes('/medications')) {
    sensitivityLevel = 'phi';
    phiAccess = true;
    auditRequired = true;
  } else if (path.includes('/clinical') || path.includes('/emergency')) {
    sensitivityLevel = 'critical';
    phiAccess = true;
    auditRequired = true;
  } else if (path.includes('/family') || path.includes('/nutrition')) {
    sensitivityLevel = 'sensitive';
    auditRequired = true;
  }

  return {
    phiAccess,
    auditRequired: auditRequired || securityConfig.auditAllAccess,
    sensitivityLevel,
    clinicalContext: req.headers['x-clinical-context'] as string
  };
}

/**
 * Check if MFA is required for the operation
 */
function shouldRequireMFA(context: HealthcareRequest['healthcare']): boolean {
  if (!securityConfig.requireMFA) return false;
  
  // Always require MFA for PHI and critical operations
  return context?.sensitivityLevel === 'phi' || context?.sensitivityLevel === 'critical';
}

/**
 * Check if user has required role for the operation
 */
function hasRequiredRole(
  user: HealthcareRequest['user'],
  context: HealthcareRequest['healthcare']
): boolean {
  if (!user || !context) return false;

  switch (context.sensitivityLevel) {
    case 'critical':
      // Critical operations require clinical advisor or super admin
      return user.healthcareRole === 'clinical_advisor' || user.healthcareRole === 'super_admin';
    
    case 'phi':
      // PHI access allowed for all authenticated users (with proper consent)
      return true;
    
    case 'sensitive':
      // Sensitive operations for authenticated users
      return true;
    
    case 'public':
      return true;
    
    default:
      return false;
  }
}

/**
 * Check if endpoint is public (no authentication required)
 */
function isPublicEndpoint(path: string): boolean {
  const publicPaths = [
    '/health',
    '/api/health',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/webhooks',
    '/api/emergency/public' // Emergency public information
  ];
  
  return publicPaths.some(publicPath => path.startsWith(publicPath));
}

/**
 * Set security headers based on healthcare context
 */
function setSecurityHeaders(res: Response, context: HealthcareRequest['healthcare']): void {
  // Basic security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Healthcare-specific headers
  if (context?.phiAccess) {
    res.setHeader('X-Healthcare-Sensitive', 'true');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  if (context?.auditRequired) {
    res.setHeader('X-Audit-Required', 'true');
  }
  
  if (securityConfig.hipaaCompliant) {
    res.setHeader('X-HIPAA-Compliant', 'true');
    res.setHeader('X-Data-Classification', context?.sensitivityLevel || 'unknown');
  }
}

/**
 * Error response functions
 */
function sendUnauthorized(res: Response, message: string): void {
  res.status(401).json({
    error: 'Unauthorized',
    message,
    code: 'HEALTHCARE_AUTH_REQUIRED',
    timestamp: new Date().toISOString()
  });
}

function sendMFARequired(res: Response): void {
  res.status(403).json({
    error: 'MFA Required',
    message: 'Multi-factor authentication required for healthcare data access',
    code: 'MFA_REQUIRED',
    timestamp: new Date().toISOString()
  });
}

function sendForbidden(res: Response, message: string): void {
  res.status(403).json({
    error: 'Forbidden',
    message,
    code: 'HEALTHCARE_ACCESS_DENIED',
    timestamp: new Date().toISOString()
  });
}

function sendServerError(res: Response, message: string): void {
  res.status(500).json({
    error: 'Internal Server Error',
    message,
    code: 'HEALTHCARE_SECURITY_ERROR',
    timestamp: new Date().toISOString()
  });
}

/**
 * Healthcare data encryption utilities
 */
export class HealthcareEncryption {
  private static algorithm = 'aes-256-gcm';
  private static key = Buffer.from((securityConfig.encryptionKey || 'default-key-for-dev').padEnd(32, '0').slice(0, 32));

  /**
   * Encrypt sensitive healthcare data
   */
  static encryptPHI(data: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      console.error('PHI encryption failed:', error);
      throw new Error('Failed to encrypt healthcare data');
    }
  }

  /**
   * Decrypt sensitive healthcare data
   */
  static decryptPHI(encryptedData: string): string {
    try {
      const parts = encryptedData.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format');
      }
      const iv = Buffer.from(parts[0], 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
      let decrypted = decipher.update(parts[1], 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      console.error('PHI decryption failed:', error);
      throw new Error('Failed to decrypt healthcare data');
    }
  }

  /**
   * Create hash for data integrity verification
   */
  static createDataIntegrityHash(data: string): string {
    return crypto.createHash('sha256').update(data + this.key.toString()).digest('hex');
  }

  /**
   * Verify data integrity
   */
  static verifyDataIntegrity(data: string, hash: string): boolean {
    const computedHash = this.createDataIntegrityHash(data);
    return computedHash === hash;
  }

  /**
   * Instance method for backward compatibility
   */
  async encrypt(data: string): Promise<string> {
    return HealthcareEncryption.encryptPHI(data);
  }

  /**
   * Instance method for backward compatibility
   */
  async decrypt(encryptedData: string): Promise<string> {
    return HealthcareEncryption.decryptPHI(encryptedData);
  }
}

/**
 * Export types for use in other modules
 */
export type { HealthcareRequest, SecurityConfig }; 