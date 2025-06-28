/**
 * Device Fingerprinting Middleware
 * Fraud prevention and security monitoring through device identification
 */

import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { createLogger, format, transports } from 'winston';

// Device fingerprinting logger
const deviceLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/device-fingerprint.log' }),
    new transports.Console({ level: 'warn' })
  ]
});

interface DeviceFingerprint {
  fingerprintId: string;
  ipAddress: string;
  userAgent: string;
  acceptLanguage?: string;
  acceptEncoding?: string;
  timezone?: string;
  screenResolution?: string;
  colorDepth?: string;
  platform?: string;
  cookieEnabled?: boolean;
  doNotTrack?: string;
  plugins?: string[];
  fonts?: string[];
  canvas?: string;
  webgl?: string;
  audioContext?: string;
  touchSupport?: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  connection?: string;
  timestamp: string;
  confidence: number;
  riskScore: number;
  flags: string[];
}

interface DeviceSession {
  fingerprintId: string;
  userId?: string;
  sessionCount: number;
  firstSeen: string;
  lastSeen: string;
  ipAddresses: string[];
  userAgents: string[];
  locations?: string[];
  riskEvents: RiskEvent[];
  trustScore: number;
  status: 'TRUSTED' | 'SUSPICIOUS' | 'BLOCKED';
}

interface RiskEvent {
  type: 'IP_CHANGE' | 'USER_AGENT_CHANGE' | 'RAPID_REQUESTS' | 'SUSPICIOUS_BEHAVIOR' | 'MULTIPLE_ACCOUNTS';
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: any;
}

// In-memory device sessions (in production, use Redis or database)
const deviceSessions = new Map<string, DeviceSession>();
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

// Generate device fingerprint from request headers
function generateDeviceFingerprint(req: Request): DeviceFingerprint {
  const userAgent = req.get('User-Agent') || 'unknown';
  const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
  const acceptLanguage = req.get('Accept-Language');
  const acceptEncoding = req.get('Accept-Encoding');
  
  // Client-provided fingerprint data
  const clientFingerprint = req.headers['x-device-fingerprint'] as string;
  let clientData: any = {};
  
  try {
    if (clientFingerprint) {
      clientData = JSON.parse(Buffer.from(clientFingerprint, 'base64').toString());
    }
  } catch (error) {
    // Invalid client fingerprint data
  }
  
  // Create base fingerprint string
  const baseString = [
    ipAddress,
    userAgent,
    acceptLanguage,
    acceptEncoding,
    clientData.timezone,
    clientData.screenResolution,
    clientData.platform,
    clientData.plugins?.join(','),
    clientData.canvas,
    clientData.webgl
  ].join('|');
  
  const fingerprintId = crypto
    .createHash('sha256')
    .update(baseString)
    .digest('hex')
    .substring(0, 32);
  
  // Calculate confidence score based on available data
  let confidence = 0.3; // Base confidence for IP + User Agent
  if (acceptLanguage) confidence += 0.1;
  if (clientData.timezone) confidence += 0.1;
  if (clientData.screenResolution) confidence += 0.1;
  if (clientData.canvas) confidence += 0.2;
  if (clientData.webgl) confidence += 0.1;
  if (clientData.plugins?.length > 0) confidence += 0.1;
  
  // Calculate initial risk score
  const riskScore = calculateRiskScore(req, clientData);
  const flags = generateRiskFlags(req, clientData, riskScore);
  
  return {
    fingerprintId,
    ipAddress,
    userAgent,
    acceptLanguage,
    acceptEncoding,
    timezone: clientData.timezone,
    screenResolution: clientData.screenResolution,
    colorDepth: clientData.colorDepth,
    platform: clientData.platform,
    cookieEnabled: clientData.cookieEnabled,
    doNotTrack: req.get('DNT'),
    plugins: clientData.plugins,
    fonts: clientData.fonts,
    canvas: clientData.canvas,
    webgl: clientData.webgl,
    audioContext: clientData.audioContext,
    touchSupport: clientData.touchSupport,
    hardwareConcurrency: clientData.hardwareConcurrency,
    deviceMemory: clientData.deviceMemory,
    connection: clientData.connection,
    timestamp: new Date().toISOString(),
    confidence: Math.min(confidence, 1.0),
    riskScore,
    flags
  };
}

// Calculate risk score based on various factors
function calculateRiskScore(req: Request, clientData: any): number {
  let risk = 0;
  
  // IP-based risk factors
  const ipAddress = req.ip || req.connection.remoteAddress || '';
  
  // Check for common proxy/VPN patterns
  if (ipAddress.includes('10.') || ipAddress.includes('192.168.') || ipAddress.includes('172.')) {
    risk += 0.1; // Private IP (might be behind proxy)
  }
  
  // User Agent analysis
  const userAgent = req.get('User-Agent') || '';
  if (!userAgent || userAgent.length < 20) {
    risk += 0.3; // Missing or suspicious user agent
  }
  
  if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent.includes('spider')) {
    risk += 0.5; // Bot detection
  }
  
  // Browser inconsistencies
  if (clientData.platform && userAgent) {
    const uaPlatform = userAgent.toLowerCase();
    const fingerPlatform = clientData.platform.toLowerCase();
    
    if (
      (fingerPlatform.includes('win') && !uaPlatform.includes('windows')) ||
      (fingerPlatform.includes('mac') && !uaPlatform.includes('mac')) ||
      (fingerPlatform.includes('linux') && !uaPlatform.includes('linux'))
    ) {
      risk += 0.2; // Platform mismatch
    }
  }
  
  // Suspicious client capabilities
  if (!clientData.cookieEnabled) {
    risk += 0.1; // Cookies disabled
  }
  
  if (clientData.doNotTrack === '1') {
    risk += 0.05; // DNT enabled (privacy-conscious but worth noting)
  }
  
  // Headless browser detection
  if (
    !clientData.plugins ||
    clientData.plugins.length === 0 ||
    !clientData.fonts ||
    clientData.fonts.length < 5
  ) {
    risk += 0.2; // Might be headless browser
  }
  
  // Hardware inconsistencies
  if (clientData.hardwareConcurrency > 32) {
    risk += 0.1; // Unusually high CPU count
  }
  
  if (clientData.deviceMemory && clientData.deviceMemory > 32) {
    risk += 0.1; // Unusually high memory
  }
  
  return Math.min(risk, 1.0);
}

// Generate risk flags based on analysis
function generateRiskFlags(req: Request, clientData: any, riskScore: number): string[] {
  const flags: string[] = [];
  
  if (riskScore > 0.7) flags.push('HIGH_RISK');
  if (riskScore > 0.5) flags.push('MEDIUM_RISK');
  
  const userAgent = req.get('User-Agent') || '';
  if (userAgent.includes('bot') || userAgent.includes('crawler')) {
    flags.push('BOT_DETECTED');
  }
  
  if (!clientData.canvas || !clientData.webgl) {
    flags.push('POSSIBLE_HEADLESS');
  }
  
  if (!userAgent || userAgent.length < 20) {
    flags.push('SUSPICIOUS_USER_AGENT');
  }
  
  const ipAddress = req.ip || req.connection.remoteAddress || '';
  if (ipAddress.includes('10.') || ipAddress.includes('192.168.')) {
    flags.push('PRIVATE_IP');
  }
  
  return flags;
}

// Update device session tracking
function updateDeviceSession(fingerprint: DeviceFingerprint, userId?: string): DeviceSession {
  const existing = deviceSessions.get(fingerprint.fingerprintId);
  
  if (existing) {
    // Update existing session
    existing.sessionCount++;
    existing.lastSeen = fingerprint.timestamp;
    existing.userId = userId || existing.userId;
    
    // Track IP changes
    if (!existing.ipAddresses.includes(fingerprint.ipAddress)) {
      existing.ipAddresses.push(fingerprint.ipAddress);
      existing.riskEvents.push({
        type: 'IP_CHANGE',
        timestamp: fingerprint.timestamp,
        severity: existing.ipAddresses.length > 3 ? 'HIGH' : 'MEDIUM',
        details: { newIp: fingerprint.ipAddress, previousIps: existing.ipAddresses.slice(0, -1) }
      });
    }
    
    // Track User Agent changes
    if (!existing.userAgents.includes(fingerprint.userAgent)) {
      existing.userAgents.push(fingerprint.userAgent);
      existing.riskEvents.push({
        type: 'USER_AGENT_CHANGE',
        timestamp: fingerprint.timestamp,
        severity: 'MEDIUM',
        details: { newUserAgent: fingerprint.userAgent }
      });
    }
    
    // Update trust score
    existing.trustScore = calculateTrustScore(existing, fingerprint);
    
    return existing;
  } else {
    // Create new session
    const newSession: DeviceSession = {
      fingerprintId: fingerprint.fingerprintId,
      userId,
      sessionCount: 1,
      firstSeen: fingerprint.timestamp,
      lastSeen: fingerprint.timestamp,
      ipAddresses: [fingerprint.ipAddress],
      userAgents: [fingerprint.userAgent],
      riskEvents: [],
      trustScore: fingerprint.riskScore < 0.3 ? 0.7 : 0.3,
      status: fingerprint.riskScore > 0.7 ? 'SUSPICIOUS' : 'TRUSTED'
    };
    
    deviceSessions.set(fingerprint.fingerprintId, newSession);
    return newSession;
  }
}

// Calculate trust score based on device history
function calculateTrustScore(session: DeviceSession, currentFingerprint: DeviceFingerprint): number {
  let trust = session.trustScore;
  
  // Increase trust over time for consistent devices
  const daysSinceFirstSeen = (Date.now() - new Date(session.firstSeen).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceFirstSeen > 7) {
    trust += 0.1; // Week of consistent usage
  }
  if (daysSinceFirstSeen > 30) {
    trust += 0.2; // Month of consistent usage
  }
  
  // Decrease trust for risk events
  const recentRiskEvents = session.riskEvents.filter(
    event => (Date.now() - new Date(event.timestamp).getTime()) < (24 * 60 * 60 * 1000)
  );
  
  trust -= recentRiskEvents.length * 0.1;
  
  // Factor in current fingerprint risk
  trust -= currentFingerprint.riskScore * 0.3;
  
  return Math.max(0, Math.min(trust, 1.0));
}

// Check for rapid requests (potential abuse)
function checkRapidRequests(ipAddress: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 100; // Max requests per minute
  
  const current = ipRequestCounts.get(ipAddress);
  
  if (!current || now > current.resetTime) {
    // Reset or create new counter
    ipRequestCounts.set(ipAddress, {
      count: 1,
      resetTime: now + windowMs
    });
    return false;
  }
  
  current.count++;
  
  if (current.count > maxRequests) {
    return true; // Rapid requests detected
  }
  
  return false;
}

export const deviceFingerprintMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Generate device fingerprint
    const fingerprint = generateDeviceFingerprint(req);
    const userId = (req as any).user?.id;
    
    // Check for rapid requests
    const rapidRequests = checkRapidRequests(fingerprint.ipAddress);
    if (rapidRequests) {
      fingerprint.flags.push('RAPID_REQUESTS');
      fingerprint.riskScore = Math.min(fingerprint.riskScore + 0.3, 1.0);
    }
    
    // Update device session
    const session = updateDeviceSession(fingerprint, userId);
    
    // Add to request context
    (req as any).deviceFingerprint = fingerprint;
    (req as any).deviceSession = session;
    
    // Set response headers
    res.setHeader('X-Device-ID', fingerprint.fingerprintId);
    res.setHeader('X-Trust-Score', session.trustScore.toFixed(2));
    
    // Log high-risk devices
    if (fingerprint.riskScore > 0.5 || session.status === 'SUSPICIOUS') {
      deviceLogger.warn('High-Risk Device Detected', {
        fingerprintId: fingerprint.fingerprintId,
        ipAddress: fingerprint.ipAddress,
        riskScore: fingerprint.riskScore,
        flags: fingerprint.flags,
        trustScore: session.trustScore,
        sessionCount: session.sessionCount,
        endpoint: req.originalUrl,
        method: req.method,
        userId,
        timestamp: fingerprint.timestamp
      });
      
      res.setHeader('X-Security-Alert', 'high-risk-device');
    }
    
    // Block extremely high-risk devices
    if (fingerprint.riskScore > 0.9 || session.status === 'BLOCKED') {
      deviceLogger.error('Device Blocked', {
        fingerprintId: fingerprint.fingerprintId,
        ipAddress: fingerprint.ipAddress,
        riskScore: fingerprint.riskScore,
        flags: fingerprint.flags,
        endpoint: req.originalUrl,
        userId
      });
      
      return res.status(403).json({
        error: 'Device Security Check Failed',
        code: 'DEVICE_BLOCKED',
        message: 'This device has been flagged for security review.',
        support: 'Please contact support if you believe this is an error.'
      });
    }
    
    next();
  } catch (error) {
    deviceLogger.error('Device Fingerprinting Error', {
      error: error.message,
      stack: error.stack,
      endpoint: req.originalUrl,
      ipAddress: req.ip
    });
    
    // Don't block requests if fingerprinting fails
    next();
  }
};

// Export device session management functions
export const deviceManagement = {
  getDeviceSession(fingerprintId: string): DeviceSession | undefined {
    return deviceSessions.get(fingerprintId);
  },
  
  blockDevice(fingerprintId: string, reason: string): void {
    const session = deviceSessions.get(fingerprintId);
    if (session) {
      session.status = 'BLOCKED';
      session.riskEvents.push({
        type: 'SUSPICIOUS_BEHAVIOR',
        timestamp: new Date().toISOString(),
        severity: 'CRITICAL',
        details: { reason, blocked: true }
      });
    }
  },
  
  trustDevice(fingerprintId: string): void {
    const session = deviceSessions.get(fingerprintId);
    if (session) {
      session.status = 'TRUSTED';
      session.trustScore = Math.min(session.trustScore + 0.3, 1.0);
    }
  },
  
  getDeviceStats(): { total: number; trusted: number; suspicious: number; blocked: number } {
    const stats = { total: 0, trusted: 0, suspicious: 0, blocked: 0 };
    
    for (const session of deviceSessions.values()) {
      stats.total++;
      switch (session.status) {
        case 'TRUSTED':
          stats.trusted++;
          break;
        case 'SUSPICIOUS':
          stats.suspicious++;
          break;
        case 'BLOCKED':
          stats.blocked++;
          break;
      }
    }
    
    return stats;
  }
}; 