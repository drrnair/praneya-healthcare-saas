/**
 * Conflict Detection Middleware
 * Detects conflicts in health data changes and medication interactions
 */

import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports } from 'winston';

const conflictLogger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: 'logs/conflict-detection.log' }),
    new transports.Console({ level: 'warn' })
  ]
});

interface HealthConflict {
  type: 'MEDICATION_INTERACTION' | 'DIETARY_RESTRICTION' | 'ALLERGY_CONFLICT' | 'CONDITION_CONFLICT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  affectedFields: string[];
  recommendations: string[];
  requiresApproval: boolean;
}

// Common drug interactions (simplified - use proper medical database in production)
const DRUG_INTERACTIONS = {
  'warfarin': ['aspirin', 'ibuprofen', 'vitamin-k'],
  'metformin': ['alcohol', 'contrast-dye'],
  'lisinopril': ['potassium', 'lithium'],
  'simvastatin': ['grapefruit', 'cyclosporine'],
  'digoxin': ['quinidine', 'verapamil']
};

// Allergy-ingredient mappings
const ALLERGY_INGREDIENTS = {
  'nuts': ['peanuts', 'almonds', 'walnuts', 'cashews', 'pistachios'],
  'dairy': ['milk', 'cheese', 'butter', 'yogurt', 'lactose'],
  'gluten': ['wheat', 'barley', 'rye', 'oats'],
  'shellfish': ['shrimp', 'crab', 'lobster', 'clams', 'mussels']
};

function detectMedicationConflicts(currentMeds: string[], newMed: string): HealthConflict[] {
  const conflicts: HealthConflict[] = [];
  const newMedLower = newMed.toLowerCase();
  
  // Check against existing medications
  for (const med of currentMeds) {
    const medLower = med.toLowerCase();
    const interactions = DRUG_INTERACTIONS[medLower] || [];
    
    if (interactions.includes(newMedLower)) {
      conflicts.push({
        type: 'MEDICATION_INTERACTION',
        severity: 'HIGH',
        description: `Potential interaction between ${med} and ${newMed}`,
        affectedFields: ['medications'],
        recommendations: ['Consult healthcare provider before combining these medications'],
        requiresApproval: true
      });
    }
  }
  
  return conflicts;
}

function detectAllergyConflicts(allergies: string[], ingredients: string[]): HealthConflict[] {
  const conflicts: HealthConflict[] = [];
  
  for (const allergy of allergies) {
    const allergyLower = allergy.toLowerCase();
    const allergenIngredients = ALLERGY_INGREDIENTS[allergyLower] || [allergyLower];
    
    for (const ingredient of ingredients) {
      const ingredientLower = ingredient.toLowerCase();
      
      if (allergenIngredients.some(allergen => ingredientLower.includes(allergen))) {
        conflicts.push({
          type: 'ALLERGY_CONFLICT',
          severity: 'CRITICAL',
          description: `Ingredient ${ingredient} conflicts with ${allergy} allergy`,
          affectedFields: ['ingredients', 'allergies'],
          recommendations: ['Remove ingredient or substitute with safe alternative'],
          requiresApproval: false // Block immediately
        });
      }
    }
  }
  
  return conflicts;
}

function detectDietaryConflicts(restrictions: string[], ingredients: string[]): HealthConflict[] {
  const conflicts: HealthConflict[] = [];
  const restrictionMap = {
    'vegetarian': ['beef', 'pork', 'chicken', 'fish', 'meat'],
    'vegan': ['beef', 'pork', 'chicken', 'fish', 'meat', 'dairy', 'eggs', 'honey'],
    'kosher': ['pork', 'shellfish', 'mixing-meat-dairy'],
    'halal': ['pork', 'alcohol'],
    'low-sodium': ['salt', 'soy-sauce', 'processed-foods'],
    'diabetic': ['sugar', 'high-carb', 'processed-sugar']
  };
  
  for (const restriction of restrictions) {
    const restrictionLower = restriction.toLowerCase();
    const restrictedItems = restrictionMap[restrictionLower] || [];
    
    for (const ingredient of ingredients) {
      const ingredientLower = ingredient.toLowerCase();
      
      if (restrictedItems.some(item => ingredientLower.includes(item))) {
        conflicts.push({
          type: 'DIETARY_RESTRICTION',
          severity: 'MEDIUM',
          description: `Ingredient ${ingredient} conflicts with ${restriction} dietary restriction`,
          affectedFields: ['dietary_restrictions', 'ingredients'],
          recommendations: [`Consider ${restriction}-friendly alternative for ${ingredient}`],
          requiresApproval: false
        });
      }
    }
  }
  
  return conflicts;
}

function analyzeHealthDataConflicts(data: any, existingProfile?: any): HealthConflict[] {
  const conflicts: HealthConflict[] = [];
  
  if (!data) return conflicts;
  
  // Medication conflicts
  if (data.medications && existingProfile?.medications) {
    const currentMeds = existingProfile.medications || [];
    const newMeds = Array.isArray(data.medications) ? data.medications : [data.medications];
    
    for (const newMed of newMeds) {
      if (typeof newMed === 'string') {
        conflicts.push(...detectMedicationConflicts(currentMeds, newMed));
      }
    }
  }
  
  // Allergy conflicts with ingredients
  if (data.ingredients && existingProfile?.allergies) {
    const allergies = existingProfile.allergies || [];
    const ingredients = Array.isArray(data.ingredients) ? data.ingredients : [data.ingredients];
    
    conflicts.push(...detectAllergyConflicts(allergies, ingredients));
  }
  
  // Dietary restriction conflicts
  if (data.ingredients && existingProfile?.dietary_restrictions) {
    const restrictions = existingProfile.dietary_restrictions || [];
    const ingredients = Array.isArray(data.ingredients) ? data.ingredients : [data.ingredients];
    
    conflicts.push(...detectDietaryConflicts(restrictions, ingredients));
  }
  
  // BMI and weight consistency checks
  if (data.weight && data.height && existingProfile?.weight) {
    const weightChange = Math.abs(data.weight - existingProfile.weight);
    const weightChangePercent = (weightChange / existingProfile.weight) * 100;
    
    if (weightChangePercent > 20) {
      conflicts.push({
        type: 'CONDITION_CONFLICT',
        severity: 'MEDIUM',
        description: `Significant weight change detected: ${weightChangePercent.toFixed(1)}%`,
        affectedFields: ['weight', 'bmi'],
        recommendations: ['Verify weight measurement accuracy', 'Consider medical evaluation'],
        requiresApproval: true
      });
    }
  }
  
  return conflicts;
}

export const conflictDetectionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only analyze health-related endpoints
  const healthEndpoints = ['/health-profile', '/medications', '/recipes', '/meal-plans', '/nutrition'];
  const isHealthEndpoint = healthEndpoints.some(endpoint => req.path.includes(endpoint));
  
  if (!isHealthEndpoint || !req.body) {
    return next();
  }
  
  try {
    // Get existing user profile (mock - integrate with your database)
    const userId = (req as any).user?.id;
    const existingProfile = userId ? {} : null; // Fetch from database
    
    // Analyze for conflicts
    const conflicts = analyzeHealthDataConflicts(req.body, existingProfile);
    
    if (conflicts.length > 0) {
      const criticalConflicts = conflicts.filter(c => c.severity === 'CRITICAL');
      const highConflicts = conflicts.filter(c => c.severity === 'HIGH');
      
      conflictLogger.warn('Health Data Conflicts Detected', {
        userId,
        endpoint: req.originalUrl,
        method: req.method,
        conflictCount: conflicts.length,
        conflicts: conflicts.map(c => ({
          type: c.type,
          severity: c.severity,
          description: c.description
        })),
        timestamp: new Date().toISOString()
      });
      
      // Block critical conflicts (allergies)
      if (criticalConflicts.length > 0) {
        return res.status(400).json({
          error: 'Critical Health Conflict Detected',
          code: 'ALLERGY_CONFLICT',
          message: 'This action conflicts with your allergy profile and has been blocked for safety.',
          conflicts: criticalConflicts,
          support: 'Please review your allergy profile or contact support.'
        });
      }
      
      // Require approval for high-severity conflicts
      if (highConflicts.length > 0) {
        const requiresApproval = highConflicts.some(c => c.requiresApproval);
        
        if (requiresApproval) {
          res.setHeader('X-Conflict-Detected', 'true');
          res.setHeader('X-Approval-Required', 'true');
          
          return res.status(409).json({
            error: 'Health Conflict Requires Approval',
            code: 'MEDICATION_INTERACTION',
            message: 'Potential medication interactions detected. Clinical review recommended.',
            conflicts: highConflicts,
            actions: {
              proceed_anyway: '/api/health-conflicts/override',
              request_review: '/api/clinical-review/request',
              modify_request: 'Update your request to resolve conflicts'
            }
          });
        }
      }
      
      // Add warnings for medium/low conflicts
      if (conflicts.some(c => c.severity === 'MEDIUM' || c.severity === 'LOW')) {
        res.setHeader('X-Health-Warnings', JSON.stringify(
          conflicts
            .filter(c => c.severity === 'MEDIUM' || c.severity === 'LOW')
            .map(c => c.description)
        ));
      }
    }
    
    // Store conflicts in request for downstream middleware
    (req as any).healthConflicts = conflicts;
    
    next();
  } catch (error) {
    conflictLogger.error('Conflict Detection Error', {
      error: error.message,
      stack: error.stack,
      endpoint: req.originalUrl,
      userId: (req as any).user?.id
    });
    
    // Don't block requests if conflict detection fails
    next();
  }
};

// Export conflict analysis functions
export const conflictAnalysis = {
  detectMedicationConflicts,
  detectAllergyConflicts,
  detectDietaryConflicts,
  analyzeHealthDataConflicts
};

// Conflict resolution helpers
export const conflictResolution = {
  async overrideConflict(conflictId: string, userId: string, reason: string) {
    conflictLogger.info('Conflict Override', {
      conflictId,
      userId,
      reason,
      timestamp: new Date().toISOString()
    });
    
    return {
      override_id: `override_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'APPROVED',
      approver: userId,
      reason,
      timestamp: new Date().toISOString()
    };
  }
}; 