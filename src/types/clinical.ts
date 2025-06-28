/**
 * Clinical Interface Types for Praneya Premium Healthcare Platform
 * Comprehensive type definitions for clinical data management and provider interfaces
 */

// ===========================================
// LABORATORY DATA TYPES
// ===========================================

export interface LabValue {
  id: string;
  testName: string;
  value: number;
  unit: string;
  referenceRange: {
    min: number;
    max: number;
    criticalMin?: number;
    criticalMax?: number;
  };
  status: 'normal' | 'abnormal_low' | 'abnormal_high' | 'critical_low' | 'critical_high';
  collectionDate: string;
  resultDate: string;
  labFacility: string;
  providerId?: string;
  notes?: string;
  flagged: boolean;
  trendDirection?: 'improving' | 'stable' | 'declining';
}

export interface LabPanel {
  id: string;
  panelName: string;
  category: 'metabolic' | 'lipid' | 'thyroid' | 'cardiac' | 'hepatic' | 'renal' | 'complete_blood_count';
  values: LabValue[];
  orderDate: string;
  collectionDate: string;
  providerId: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'ordered' | 'collected' | 'processing' | 'resulted' | 'reviewed';
}

// ===========================================
// BIOMETRIC AND VITAL SIGNS
// ===========================================

export interface BiometricReading {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'weight' | 'height' | 'bmi' | 'body_fat' | 'glucose' | 'temperature' | 'oxygen_saturation';
  value: number | { systolic: number; diastolic: number }; // For BP
  unit: string;
  timestamp: string;
  deviceId?: string;
  methodOfMeasurement: 'manual' | 'digital_device' | 'wearable' | 'clinical_grade';
  context?: 'fasting' | 'post_meal' | 'exercise' | 'rest' | 'medication_related';
  providerId?: string;
  patientReported: boolean;
  verified: boolean;
  notes?: string;
}

export interface VitalSignsTrend {
  biometricType: BiometricReading['type'];
  readings: BiometricReading[];
  trendAnalysis: {
    direction: 'improving' | 'stable' | 'concerning' | 'critical';
    variability: 'low' | 'moderate' | 'high';
    clinicalSignificance: 'normal_variation' | 'requires_monitoring' | 'requires_intervention';
    recommendations: string[];
  };
  targetRange?: {
    optimal: { min: number; max: number };
    acceptable: { min: number; max: number };
    concerning: { min: number; max: number };
  };
}

// ===========================================
// MEDICATION MANAGEMENT
// ===========================================

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brandName?: string;
  dosage: {
    amount: number;
    unit: 'mg' | 'g' | 'ml' | 'mcg' | 'units' | 'drops';
    frequency: 'once_daily' | 'twice_daily' | 'three_times_daily' | 'four_times_daily' | 'as_needed' | 'weekly' | 'monthly';
    timing?: string[]; // e.g., ['morning', 'evening']
    withFood?: boolean;
  };
  indication: string;
  prescribedBy: string;
  prescriptionDate: string;
  startDate: string;
  endDate?: string;
  refillsRemaining: number;
  sideEffects?: string[];
  contraindications?: string[];
  interactions?: DrugInteraction[];
  adherenceTracking: {
    lastTaken?: string;
    missedDoses: number;
    adherencePercentage: number;
  };
  status: 'active' | 'discontinued' | 'on_hold' | 'completed';
}

export interface DrugInteraction {
  interactingMedication: string;
  interactionType: 'drug_drug' | 'drug_food' | 'drug_supplement' | 'drug_condition';
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  clinicalEffect: string;
  mechanism: string;
  management: string;
  evidence: 'theoretical' | 'case_reports' | 'clinical_studies' | 'established';
  sources: ClinicalCitation[];
  lastUpdated: string;
}

export interface DrugFoodInteraction {
  medicationName: string;
  foodItem: string;
  interactionType: 'absorption_decreased' | 'absorption_increased' | 'metabolism_altered' | 'side_effects_increased';
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  clinicalEffect: string;
  recommendations: {
    timing: string; // e.g., "Take 2 hours before meals"
    alternatives: string[];
    monitoring: string[];
  };
  evidence: ClinicalCitation[];
}

// ===========================================
// SYMPTOM TRACKING
// ===========================================

export interface SymptomEntry {
  id: string;
  symptom: string;
  category: 'gastrointestinal' | 'neurological' | 'cardiovascular' | 'respiratory' | 'musculoskeletal' | 'dermatological' | 'psychological' | 'other';
  severity: {
    scale: '1-10' | '1-5' | 'mild_moderate_severe';
    value: number;
    description?: string;
  };
  onset: string;
  duration?: string;
  frequency: 'constant' | 'intermittent' | 'daily' | 'weekly' | 'monthly' | 'rare';
  triggers?: string[];
  alleviatingFactors?: string[];
  associatedSymptoms?: string[];
  impact: {
    dailyActivities: 'none' | 'mild' | 'moderate' | 'severe';
    sleep: 'none' | 'mild' | 'moderate' | 'severe';
    mood: 'none' | 'mild' | 'moderate' | 'severe';
  };
  timestamp: string;
  reportedBy: 'patient' | 'caregiver' | 'provider';
  notes?: string;
}

// ===========================================
// CLINICAL NOTES AND DOCUMENTATION
// ===========================================

export interface ClinicalNote {
  id: string;
  type: 'progress_note' | 'assessment' | 'plan' | 'consultation' | 'discharge_summary' | 'nutrition_counseling';
  title: string;
  content: {
    subjective?: string; // Patient reported information
    objective?: string; // Observable/measurable data
    assessment?: string; // Clinical interpretation
    plan?: string; // Treatment plan
    structured_data?: Record<string, any>;
  };
  authorId: string;
  authorRole: 'physician' | 'nurse' | 'dietitian' | 'pharmacist' | 'case_manager' | 'other';
  patientId: string;
  encounterType: 'office_visit' | 'telemedicine' | 'phone_call' | 'secure_message' | 'routine_monitoring';
  timestamp: string;
  lastModified: string;
  reviewed: boolean;
  reviewedBy?: string;
  reviewDate?: string;
  confidentiality: 'standard' | 'restricted' | 'very_restricted';
  tags: string[];
}

// ===========================================
// HEALTHCARE PROVIDER INTERFACES
// ===========================================

export interface HealthcareProvider {
  id: string;
  name: {
    first: string;
    last: string;
    middle?: string;
    suffix?: string;
  };
  credentials: string[];
  specialty: string;
  subSpecialty?: string[];
  licenseNumber: string;
  npiNumber: string;
  contactInfo: {
    email: string;
    phone: string;
    fax?: string;
    secure_messaging?: boolean;
  };
  practice: {
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    phone: string;
    website?: string;
  };
  availability: {
    schedule: Record<string, { start: string; end: string }[]>;
    timezone: string;
    bookingPreferences: string[];
  };
  preferences: {
    communication_methods: ('secure_message' | 'phone' | 'video_call' | 'in_person')[];
    notification_frequency: 'immediate' | 'daily' | 'weekly';
    report_format: 'detailed' | 'summary' | 'custom';
  };
}

export interface ProviderPatientRelationship {
  providerId: string;
  patientId: string;
  relationship: 'primary_care' | 'specialist' | 'consultant' | 'dietitian' | 'pharmacist';
  startDate: string;
  endDate?: string;
  permissions: {
    view_nutrition_data: boolean;
    view_lab_results: boolean;
    view_medications: boolean;
    view_symptoms: boolean;
    edit_care_plan: boolean;
    prescribe_medications: boolean;
    order_labs: boolean;
  };
  communicationPreferences: {
    critical_alerts: boolean;
    routine_updates: boolean;
    medication_changes: boolean;
    lab_result_notifications: boolean;
  };
}

// ===========================================
// CLINICAL ANALYTICS AND REPORTING
// ===========================================

export interface ClinicalMetric {
  id: string;
  name: string;
  category: 'cardiovascular' | 'metabolic' | 'nutritional' | 'quality_of_life' | 'adherence' | 'safety';
  value: number;
  unit?: string;
  timestamp: string;
  calculation: {
    formula: string;
    inputs: Record<string, any>;
    confidence_interval?: { lower: number; upper: number };
  };
  interpretation: {
    status: 'optimal' | 'good' | 'concerning' | 'critical';
    trend: 'improving' | 'stable' | 'declining';
    clinical_significance: string;
    recommendations: string[];
  };
  benchmarks?: {
    population_average: number;
    target_value: number;
    percentile_rank: number;
  };
}

export interface PredictiveModel {
  id: string;
  modelName: string;
  type: 'risk_prediction' | 'outcome_forecasting' | 'treatment_response' | 'adherence_prediction';
  predictions: {
    outcome: string;
    probability: number;
    confidence_interval: { lower: number; upper: number };
    time_horizon: string; // e.g., "6 months", "1 year"
    factors: Array<{
      factor: string;
      contribution: number;
      importance: 'high' | 'medium' | 'low';
    }>;
  }[];
  lastUpdated: string;
  modelVersion: string;
  validation: {
    accuracy: number;
    sensitivity: number;
    specificity: number;
    sample_size: number;
  };
}

// ===========================================
// EMERGENCY ACCESS AND ALERTS
// ===========================================

export interface EmergencyProfile {
  patientId: string;
  criticalInformation: {
    allergies: Array<{
      allergen: string;
      severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
      reaction: string;
    }>;
    medications: Array<{
      name: string;
      dosage: string;
      critical: boolean;
      lastTaken?: string;
    }>;
    conditions: Array<{
      condition: string;
      severity: 'mild' | 'moderate' | 'severe' | 'life_threatening';
      status: 'active' | 'controlled' | 'resolved';
    }>;
    devices: Array<{
      type: 'pacemaker' | 'defibrillator' | 'insulin_pump' | 'other';
      model?: string;
      implantDate?: string;
    }>;
  };
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
    isPrimary: boolean;
    hasHealthcareProxy: boolean;
  }>;
  healthcareProviders: Array<{
    name: string;
    specialty: string;
    phone: string;
    isPrimary: boolean;
  }>;
  preferences: {
    hospital_preference?: string;
    advance_directives: boolean;
    organ_donor: boolean;
    blood_type?: string;
  };
  lastUpdated: string;
  accessLog: Array<{
    timestamp: string;
    accessedBy: string;
    reason: string;
    dataAccessed: string[];
  }>;
}

export interface MedicalAlert {
  id: string;
  type: 'critical_value' | 'drug_interaction' | 'allergy_exposure' | 'missed_medication' | 'trend_concerning' | 'system_generated';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  patientId: string;
  triggeredBy: {
    source: string;
    data: Record<string, any>;
    timestamp: string;
  };
  recommendations: {
    immediate_actions: string[];
    follow_up_required: boolean;
    provider_notification: boolean;
    patient_notification: boolean;
  };
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  acknowledgedBy?: {
    userId: string;
    role: string;
    timestamp: string;
    notes?: string;
  };
  escalation: {
    rules: Array<{
      condition: string;
      action: string;
      delay: string;
    }>;
    history: Array<{
      level: string;
      timestamp: string;
      notified: string[];
    }>;
  };
}

// ===========================================
// CLINICAL CITATIONS AND EVIDENCE
// ===========================================

export interface ClinicalCitation {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pmid?: string;
  url?: string;
  evidence_level: '1A' | '1B' | '2A' | '2B' | '3A' | '3B' | '4' | '5';
  study_type: 'rct' | 'cohort' | 'case_control' | 'cross_sectional' | 'case_series' | 'case_report' | 'expert_opinion' | 'guideline';
  summary: string;
  relevance_score: number;
  last_accessed: string;
}

// ===========================================
// COMPONENT INTERFACES
// ===========================================

export interface ClinicalComponentProps {
  patientId: string;
  providerId?: string;
  onDataChange?: (data: any) => void;
  onError?: (error: Error) => void;
  readonly?: boolean;
  compact?: boolean;
  theme?: 'standard' | 'premium' | 'clinical';
}

export interface ClinicalValidationRule {
  field: string;
  type: 'required' | 'range' | 'format' | 'custom';
  message: string;
  severity: 'error' | 'warning' | 'info';
  validator?: (value: any) => boolean;
  params?: Record<string, any>;
}

export interface ClinicalFormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
}

// ===========================================
// AUDIT AND COMPLIANCE
// ===========================================

export interface ClinicalAuditEntry {
  id: string;
  action: 'view' | 'create' | 'update' | 'delete' | 'export' | 'print';
  resource: string;
  resourceId: string;
  userId: string;
  userRole: string;
  patientId?: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  dataAccessed?: string[];
  changes?: Record<string, { from: any; to: any }>;
  justification?: string;
  approved_by?: string;
  compliance_flags: string[];
}

export interface HIPAACompliance {
  minimum_necessary: boolean;
  purpose_documented: boolean;
  patient_consent: boolean;
  access_authorized: boolean;
  audit_logged: boolean;
  encryption_verified: boolean;
  breach_risk_assessed: boolean;
}

// ===========================================
// WORKFLOW AND INTEGRATION
// ===========================================

export interface ClinicalWorkflow {
  id: string;
  name: string;
  type: 'assessment' | 'monitoring' | 'intervention' | 'documentation' | 'review';
  steps: Array<{
    id: string;
    name: string;
    type: 'data_entry' | 'review' | 'approval' | 'notification' | 'calculation';
    required: boolean;
    dependencies: string[];
    timeout?: string;
    assignment?: {
      role: string;
      specific_user?: string;
    };
  }>;
  triggers: Array<{
    event: string;
    conditions: Record<string, any>;
    action: string;
  }>;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  progress: {
    current_step: string;
    completed_steps: string[];
    pending_steps: string[];
  };
} 