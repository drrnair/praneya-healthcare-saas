/**
 * Clinical Oversight Middleware
 * Detects medical advice and ensures clinical safety compliance
 */

import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports } from 'winston';

// Clinical oversight logger
const clinicalLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'logs/clinical-oversight.log' }),
    new transports.Console({ level: 'error' })
  ]
});

// Medical advice detection patterns
const MEDICAL_ADVICE_PATTERNS = [
  // Direct medical advice
  /you\s+should\s+(take|stop|start|increase|decrease)\s+.*(medication|drug|pill|dose)/i,
  /i\s+(recommend|suggest|advise)\s+.*(treatment|medication|therapy)/i,
  /(take|don't\s+take|stop\s+taking)\s+.*(medication|drug|pill)/i,
  
  // Diagnostic statements
  /you\s+(have|don't\s+have|might\s+have)\s+.*(disease|condition|disorder|syndrome)/i,
  /(this|that)\s+is\s+(definitely|probably|likely)\s+.*(cancer|diabetes|heart|kidney)/i,
  /your\s+(symptoms|condition)\s+(indicate|suggest|mean)/i,
  
  // Treatment recommendations
  /you\s+(need|should|must)\s+(surgery|operation|procedure)/i,
  /i\s+would\s+(prescribe|recommend)\s+/i,
  /(increase|decrease|change)\s+your\s+(dosage|dose|medication)/i,
  
  // Emergency medical advice
  /go\s+to\s+the\s+(emergency|hospital|doctor)\s+(immediately|right\s+away|now)/i,
  /call\s+(911|ambulance|emergency)/i,
  /(this|that)\s+is\s+a\s+medical\s+emergency/i,
  
  // Contraindications and warnings
  /(don't|never)\s+(mix|combine|take\s+together)\s+.*(medication|drug|supplement)/i,
  /(avoid|stop)\s+.*(food|activity|medication)\s+(while|when|if)/i,
  
  // Lab interpretation
  /your\s+(lab|test)\s+(results|values)\s+(show|indicate|mean)/i,
  /(normal|abnormal|high|low)\s+(blood|urine|cholesterol)/i
];

// Clinical terminology that should be flagged
const CLINICAL_TERMS = [
  'diagnosis', 'prognosis', 'treatment', 'therapy', 'prescription',
  'medication', 'dosage', 'side effects', 'contraindications',
  'symptoms', 'disease', 'condition', 'disorder', 'syndrome',
  'laboratory', 'test results', 'blood work', 'biopsy',
  'surgery', 'procedure', 'operation', 'medical emergency'
];

// Severity levels for clinical oversight
enum ClinicalSeverity {
  LOW = 'LOW',           // General health information
  MEDIUM = 'MEDIUM',     // Health recommendations
  HIGH = 'HIGH',         // Medical advice
  CRITICAL = 'CRITICAL'  // Emergency medical advice
}

interface ClinicalAlert {
  severity: ClinicalSeverity;
  type: 'MEDICAL_ADVICE' | 'DIAGNOSTIC_STATEMENT' | 'TREATMENT_RECOMMENDATION' | 'EMERGENCY_ADVICE' | 'CLINICAL_TERMINOLOGY';
  detected_patterns: string[];
  content_snippet: string;
  confidence_score: number;
  requires_review: boolean;
  auto_block: boolean;
}

// Detect medical advice in text content
function detectMedicalAdvice(text: string): ClinicalAlert | null {
  if (!text || typeof text !== 'string') return null;
  
  const lowerText = text.toLowerCase();
  const detectedPatterns: string[] = [];
  let maxSeverity = ClinicalSeverity.LOW;
  let alertType: ClinicalAlert['type'] = 'CLINICAL_TERMINOLOGY';
  
  // Check for medical advice patterns
  MEDICAL_ADVICE_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      detectedPatterns.push(matches[0]);
      
      // Determine severity based on pattern type
      if (pattern.source.includes('emergency|911|ambulance')) {
        maxSeverity = ClinicalSeverity.CRITICAL;
        alertType = 'EMERGENCY_ADVICE';
      } else if (pattern.source.includes('should|recommend|advise|prescribe')) {
        if (maxSeverity < ClinicalSeverity.HIGH) {
          maxSeverity = ClinicalSeverity.HIGH;
          alertType = 'MEDICAL_ADVICE';
        }
      } else if (pattern.source.includes('have|indicate|suggest|mean')) {
        if (maxSeverity < ClinicalSeverity.MEDIUM) {
          maxSeverity = ClinicalSeverity.MEDIUM;
          alertType = 'DIAGNOSTIC_STATEMENT';
        }
      }
    }
  });
  
  // Check for clinical terminology
  CLINICAL_TERMS.forEach(term => {
    if (lowerText.includes(term.toLowerCase())) {
      detectedPatterns.push(term);
      if (maxSeverity === ClinicalSeverity.LOW) {
        alertType = 'CLINICAL_TERMINOLOGY';
      }
    }
  });
  
  if (detectedPatterns.length === 0) return null;
  
  // Calculate confidence score
  const confidenceScore = Math.min(detectedPatterns.length * 0.2 + 0.3, 1.0);
  
  return {
    severity: maxSeverity,
    type: alertType,
    detected_patterns: [...new Set(detectedPatterns)],
    content_snippet: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
    confidence_score: confidenceScore,
    requires_review: maxSeverity >= ClinicalSeverity.MEDIUM,
    auto_block: maxSeverity === ClinicalSeverity.CRITICAL
  };
}

// Analyze request/response for clinical content
function analyzeClinicalContent(data: any): ClinicalAlert[] {
  const alerts: ClinicalAlert[] = [];
  
  if (!data) return alerts;
  
  // Handle different data types
  const textContent: string[] = [];
  
  if (typeof data === 'string') {
    textContent.push(data);
  } else if (typeof data === 'object') {
    // Extract text from common fields
    const fieldsToCheck = [
      'message', 'content', 'description', 'notes', 'advice',
      'recommendation', 'instructions', 'summary', 'analysis',
      'response', 'answer', 'explanation', 'feedback'
    ];
    
    function extractText(obj: any, path: string[] = []): void {
      if (typeof obj === 'string') {
        textContent.push(obj);
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => extractText(item, [...path, index.toString()]));
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          if (fieldsToCheck.includes(key.toLowerCase()) || path.length < 3) {
            extractText(value, [...path, key]);
          }
        });
      }
    }
    
    extractText(data);
  }
  
  // Analyze each piece of text content
  textContent.forEach(text => {
    const alert = detectMedicalAdvice(text);
    if (alert) {
      alerts.push(alert);
    }
  });
  
  return alerts;
}

export const clinicalOversightMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Skip oversight for certain endpoints that don't contain user-generated content
  const skipEndpoints = ['/health', '/status', '/auth/', '/static/', '/api/auth/'];
  if (skipEndpoints.some(endpoint => req.path.includes(endpoint))) {
    return next();
  }
  
  // Analyze request content
  let requestAlerts: ClinicalAlert[] = [];
  if (req.body && Object.keys(req.body).length > 0) {
    requestAlerts = analyzeClinicalContent(req.body);
  }
  
  // Log request alerts
  if (requestAlerts.length > 0) {
    const criticalAlerts = requestAlerts.filter(alert => alert.severity === ClinicalSeverity.CRITICAL);
    const highAlerts = requestAlerts.filter(alert => alert.severity === ClinicalSeverity.HIGH);
    
    clinicalLogger.warn('Clinical Content Detected in Request', {
      endpoint: req.originalUrl,
      method: req.method,
      userId: (req as any).user?.id,
      alerts: requestAlerts,
      timestamp: new Date().toISOString()
    });
    
    // Block critical medical advice automatically
    if (criticalAlerts.length > 0) {
      return res.status(403).json({
        error: 'Clinical Review Required',
        code: 'CLINICAL_OVERSIGHT_BLOCKED',
        message: 'This content has been flagged for clinical review due to potential medical advice.',
        clinical_alert: {
          severity: 'CRITICAL',
          requires_review: true,
          contact_support: 'Please contact our clinical team for medical questions.'
        }
      });
    }
    
    // Add warning headers for high-severity content
    if (highAlerts.length > 0) {
      res.setHeader('X-Clinical-Review-Required', 'true');
      res.setHeader('X-Healthcare-Warning', 'Content flagged for clinical review');
    }
  }
  
  // Override res.json to analyze response content
  const originalJson = res.json;
  res.json = function(data: any) {
    const responseAlerts = analyzeClinicalContent(data);
    
    if (responseAlerts.length > 0) {
      const processingTime = Date.now() - startTime;
      
      clinicalLogger.warn('Clinical Content Detected in Response', {
        endpoint: req.originalUrl,
        method: req.method,
        userId: (req as any).user?.id,
        alerts: responseAlerts,
        processing_time: processingTime,
        timestamp: new Date().toISOString()
      });
      
      // Add clinical disclaimer to responses with medical content
      const highSeverityAlerts = responseAlerts.filter(
        alert => alert.severity >= ClinicalSeverity.MEDIUM
      );
      
      if (highSeverityAlerts.length > 0) {
        // Add medical disclaimer wrapper
        const responseWithDisclaimer = {
          ...data,
          _clinical_disclaimer: {
            message: 'This information is for educational purposes only and does not constitute medical advice. Please consult with a healthcare professional for medical decisions.',
            alerts_detected: highSeverityAlerts.length,
            requires_professional_review: true,
            emergency_notice: 'If this is a medical emergency, please call 911 or contact emergency services immediately.'
          }
        };
        
        res.setHeader('X-Clinical-Disclaimer', 'included');
        res.setHeader('X-Medical-Content-Detected', 'true');
        
        return originalJson.call(this, responseWithDisclaimer);
      }
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Export clinical analysis functions for external use
export const clinicalAnalysis = {
  detectMedicalAdvice,
  analyzeClinicalContent,
  ClinicalSeverity
};

// Clinical review queue functions
export const clinicalReview = {
  async addToReviewQueue(content: any, alerts: ClinicalAlert[], userId?: string) {
    // This would integrate with your review system
    clinicalLogger.info('Content Added to Clinical Review Queue', {
      userId,
      alerts,
      content_hash: Buffer.from(JSON.stringify(content)).toString('base64').substring(0, 32),
      timestamp: new Date().toISOString()
    });
    
    return {
      review_id: `clinical_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'PENDING_REVIEW',
      estimated_review_time: '2-4 hours',
      priority: alerts.some(a => a.severity === ClinicalSeverity.CRITICAL) ? 'HIGH' : 'MEDIUM'
    };
  }
}; 