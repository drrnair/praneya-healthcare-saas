/**
 * Healthcare Conflict Detection System
 * Automatic detection and resolution of clinical data conflicts with safety measures
 */

import { 
  AllergyType, 
  MedicationType, 
  HealthConflictType, 
  DrugInteractionSeverityEnum, 
  AllergenSeverityEnum 
} from '@/types/healthcare';

// ===========================================
// CONFLICT DETECTION INTERFACES
// ===========================================

export interface ConflictDetectionConfig {
  readonly enableMedicationInteractions: boolean;
  readonly enableAllergyConflicts: boolean;
  readonly enableConditionCompatibility: boolean;
  readonly autoResolveMinorConflicts: boolean;
  readonly emergencyOverrideEnabled: boolean;
  readonly clinicalOversightRequired: boolean;
}

export interface ConflictDetectionResult {
  readonly hasConflicts: boolean;
  readonly conflictCount: number;
  readonly criticalConflicts: HealthConflictType[];
  readonly warnings: HealthConflictType[];
  readonly autoResolutionApplied: boolean;
  readonly requiresClinicalReview: boolean;
  readonly safetyScore: number; // 0-100, lower is higher risk
}

export interface DrugInteractionDatabase {
  readonly [drugName: string]: {
    readonly interactions: Array<{
      readonly interactingDrug: string;
      readonly severity: DrugInteractionSeverityEnum;
      readonly description: string;
      readonly mechanism: string;
      readonly clinicalRecommendation: string;
      readonly evidenceLevel: 'high' | 'medium' | 'low';
    }>;
    readonly foodInteractions: Array<{
      readonly food: string;
      readonly effect: string;
      readonly avoidanceRequired: boolean;
    }>;
  };
}

export interface AllergenConflictRule {
  readonly allergen: string;
  readonly crossReactiveAllergens: string[];
  readonly riskLevel: 'low' | 'medium' | 'high' | 'critical';
  readonly avoidanceRecommendations: string[];
}

// ===========================================
// CORE CONFLICT DETECTION ENGINE
// ===========================================

export class HealthcareConflictDetector {
  private readonly config: ConflictDetectionConfig;
  private readonly drugDatabase: DrugInteractionDatabase;
  private readonly allergenRules: AllergenConflictRule[];

  constructor(
    config: ConflictDetectionConfig,
    drugDatabase: DrugInteractionDatabase,
    allergenRules: AllergenConflictRule[]
  ) {
    this.config = config;
    this.drugDatabase = drugDatabase;
    this.allergenRules = allergenRules;
  }

  /**
   * Main conflict detection entry point
   */
  public async detectConflicts(
    userId: string,
    allergies: AllergyType[],
    medications: MedicationType[] = [],
    proposedChanges?: Partial<{ allergies: AllergyType[]; medications: MedicationType[] }>
  ): Promise<ConflictDetectionResult> {
    const detectedConflicts: HealthConflictType[] = [];
    let safetyScore = 100;

    // Use proposed changes if provided, otherwise use current data
    const effectiveAllergies = proposedChanges?.allergies ?? allergies;
    const effectiveMedications = proposedChanges?.medications ?? medications;

    try {
      // 1. Check medication interactions
      if (this.config.enableMedicationInteractions && effectiveMedications.length > 0) {
        const medicationConflicts = await this.detectMedicationInteractions(
          userId,
          effectiveMedications
        );
        detectedConflicts.push(...medicationConflicts);
        safetyScore -= medicationConflicts.length * 15;
      }

      // 2. Check allergy conflicts
      if (this.config.enableAllergyConflicts && effectiveAllergies.length > 0) {
        const allergyConflicts = await this.detectAllergyConflicts(
          userId,
          effectiveAllergies,
          effectiveMedications
        );
        detectedConflicts.push(...allergyConflicts);
        safetyScore -= allergyConflicts.length * 10;
      }

      // 3. Check condition compatibility (if premium tier)
      if (this.config.enableConditionCompatibility) {
        const conditionConflicts = await this.detectConditionConflicts(
          userId,
          effectiveMedications,
          effectiveAllergies
        );
        detectedConflicts.push(...conditionConflicts);
        safetyScore -= conditionConflicts.length * 12;
      }

      // 4. Categorize conflicts by severity
      const criticalConflicts = detectedConflicts.filter(
        conflict => conflict.severity === 'critical'
      );
      const warnings = detectedConflicts.filter(
        conflict => conflict.severity !== 'critical'
      );

      // 5. Check if clinical review is required
      const requiresClinicalReview = this.shouldRequireClinicalReview(detectedConflicts);

      // 6. Apply auto-resolution if configured and safe
      const autoResolutionApplied = this.config.autoResolveMinorConflicts 
        && await this.applyAutoResolution(detectedConflicts);

      return {
        hasConflicts: detectedConflicts.length > 0,
        conflictCount: detectedConflicts.length,
        criticalConflicts,
        warnings,
        autoResolutionApplied,
        requiresClinicalReview,
        safetyScore: Math.max(0, safetyScore)
      };

    } catch (error) {
      // In case of detection failure, assume maximum risk
      console.error('Conflict detection failed:', error);
      return {
        hasConflicts: true,
        conflictCount: 999,
        criticalConflicts: [],
        warnings: [],
        autoResolutionApplied: false,
        requiresClinicalReview: true,
        safetyScore: 0
      };
    }
  }

  /**
   * Detect medication interactions
   */
  private async detectMedicationInteractions(
    userId: string,
    medications: MedicationType[]
  ): Promise<HealthConflictType[]> {
    const conflicts: HealthConflictType[] = [];

    // Check all medication pairs for interactions
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];

        if (!med1 || !med2) continue;

        const interaction = this.findDrugInteraction(med1.genericName, med2.genericName);
        if (interaction) {
          conflicts.push({
            id: `drug-${med1.id}-${med2.id}`,
            type: 'medication_interaction',
            severity: this.mapDrugSeverityToConflictSeverity(interaction.severity),
            description: `Interaction between ${med1.genericName} and ${med2.genericName}: ${interaction.description}`,
            affectedUserId: userId,
            conflictingData: {
              medication1: med1,
              medication2: med2,
              interaction: interaction
            },
            detectedAt: new Date(),
            resolved: false
          });
        }
      }
    }

    return conflicts;
  }

  /**
   * Detect allergy conflicts with medications and food cross-reactions
   */
  private async detectAllergyConflicts(
    userId: string,
    allergies: AllergyType[],
    medications: MedicationType[]
  ): Promise<HealthConflictType[]> {
    const conflicts: HealthConflictType[] = [];

    for (const allergy of allergies) {
      // Check medication conflicts with allergies
      for (const medication of medications) {
        if (this.isMedicationAllergenic(medication, allergy)) {
          conflicts.push({
            id: `allergy-med-${allergy.id}-${medication.id}`,
            type: 'allergy_conflict',
            severity: this.mapAllergySeverityToConflictSeverity(allergy.severity),
            description: `Medication ${medication.genericName} may cause allergic reaction due to ${allergy.allergen} allergy`,
            affectedUserId: userId,
            conflictingData: {
              allergy: allergy,
              medication: medication
            },
            detectedAt: new Date(),
            resolved: false
          });
        }
      }

      // Check cross-reactive allergens
      const crossReactiveRule = this.allergenRules.find(
        rule => rule.allergen.toLowerCase() === allergy.allergen.toLowerCase()
      );

      if (crossReactiveRule) {
        for (const otherAllergy of allergies) {
          if (otherAllergy.id !== allergy.id && 
              crossReactiveRule.crossReactiveAllergens.some(
                crossAllergen => otherAllergy.allergen.toLowerCase().includes(crossAllergen.toLowerCase())
              )) {
            conflicts.push({
              id: `cross-allergy-${allergy.id}-${otherAllergy.id}`,
              type: 'allergy_conflict',
              severity: crossReactiveRule.riskLevel,
              description: `Cross-reactive allergies detected: ${allergy.allergen} and ${otherAllergy.allergen}`,
              affectedUserId: userId,
              conflictingData: {
                primaryAllergy: allergy,
                crossReactiveAllergy: otherAllergy,
                rule: crossReactiveRule
              },
              detectedAt: new Date(),
              resolved: false
            });
          }
        }
      }
    }

    return conflicts;
  }

  /**
   * Detect condition compatibility issues
   */
  private async detectConditionConflicts(
    userId: string,
    medications: MedicationType[],
    allergies: AllergyType[]
  ): Promise<HealthConflictType[]> {
    const conflicts: HealthConflictType[] = [];

    // Check for contraindicated medication combinations based on conditions
    // This would integrate with clinical databases for condition-specific rules
    
    // Example: Check for diabetes medication conflicts
    const diabeticMeds = medications.filter(med => 
      med.indication?.toLowerCase().includes('diabetes') ||
      this.isDiabeticMedication(med.genericName)
    );

    if (diabeticMeds.length > 1) {
      // Check for dangerous combinations
      const hasInsulin = diabeticMeds.some(med => 
        med.genericName.toLowerCase().includes('insulin')
      );
      const hasSulfonylurea = diabeticMeds.some(med => 
        this.isSulfonylurea(med.genericName)
      );

      if (hasInsulin && hasSulfonylurea) {
        conflicts.push({
          id: `diabetes-hypoglycemia-risk-${userId}`,
          type: 'condition_compatibility',
          severity: 'high',
          description: 'High risk of hypoglycemia with concurrent insulin and sulfonylurea use',
          affectedUserId: userId,
          conflictingData: {
            condition: 'diabetes',
            riskType: 'hypoglycemia',
            medications: diabeticMeds
          },
          detectedAt: new Date(),
          resolved: false
        });
      }
    }

    return conflicts;
  }

  /**
   * Determine if clinical review is required
   */
  private shouldRequireClinicalReview(conflicts: HealthConflictType[]): boolean {
    if (!this.config.clinicalOversightRequired) return false;

    return conflicts.some(conflict => 
      conflict.severity === 'critical' || 
      conflict.severity === 'high'
    ) || conflicts.length >= 3;
  }

  /**
   * Apply automatic resolution to minor conflicts
   */
  private async applyAutoResolution(conflicts: HealthConflictType[]): Promise<boolean> {
    let resolutionsApplied = false;

    for (const conflict of conflicts) {
      if (conflict.severity === 'low' || conflict.severity === 'medium') {
        // Apply safe auto-resolution strategies
        switch (conflict.type) {
          case 'medication_interaction':
            // Could suggest timing separation or dose adjustments
            resolutionsApplied = true;
            break;
          case 'allergy_conflict':
            // Could suggest alternative medications
            if (conflict.severity === 'low') {
              resolutionsApplied = true;
            }
            break;
        }
      }
    }

    return resolutionsApplied;
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  private findDrugInteraction(
    drug1: string, 
    drug2: string
  ): { severity: DrugInteractionSeverityEnum; description: string } | null {
    const drug1Data = this.drugDatabase[drug1.toLowerCase()];
    if (!drug1Data) return null;

    const interaction = drug1Data.interactions.find(
      interaction => interaction.interactingDrug.toLowerCase() === drug2.toLowerCase()
    );

    return interaction ? {
      severity: interaction.severity,
      description: interaction.description
    } : null;
  }

  private isMedicationAllergenic(medication: MedicationType, allergy: AllergyType): boolean {
    const medName = medication.genericName.toLowerCase();
    const allergen = allergy.allergen.toLowerCase();

    // Direct name matching
    if (medName.includes(allergen)) return true;

    // Check for common drug allergy patterns
    if (allergen.includes('penicillin') && medName.includes('cillin')) return true;
    if (allergen.includes('sulfa') && medName.includes('sulfa')) return true;
    if (allergen.includes('aspirin') && medName.includes('salicylate')) return true;

    return false;
  }

  private isDiabeticMedication(drugName: string): boolean {
    const diabeticDrugs = [
      'metformin', 'glipizide', 'glyburide', 'pioglitazone', 'sitagliptin',
      'linagliptin', 'empagliflozin', 'canagliflozin', 'insulin'
    ];
    return diabeticDrugs.some(drug => drugName.toLowerCase().includes(drug));
  }

  private isSulfonylurea(drugName: string): boolean {
    const sulfonylureas = ['glipizide', 'glyburide', 'glimepiride', 'chlorpropamide'];
    return sulfonylureas.some(drug => drugName.toLowerCase().includes(drug));
  }

  private mapDrugSeverityToConflictSeverity(
    drugSeverity: DrugInteractionSeverityEnum
  ): 'low' | 'medium' | 'high' | 'critical' {
    switch (drugSeverity) {
      case DrugInteractionSeverityEnum.MINOR: return 'low';
      case DrugInteractionSeverityEnum.MODERATE: return 'medium';
      case DrugInteractionSeverityEnum.MAJOR: return 'high';
      case DrugInteractionSeverityEnum.CONTRAINDICATED: return 'critical';
      default: return 'medium';
    }
  }

  private mapAllergySeverityToConflictSeverity(
    allergySeverity: AllergenSeverityEnum
  ): 'low' | 'medium' | 'high' | 'critical' {
    switch (allergySeverity) {
      case AllergenSeverityEnum.MILD: return 'low';
      case AllergenSeverityEnum.MODERATE: return 'medium';
      case AllergenSeverityEnum.SEVERE: return 'high';
      case AllergenSeverityEnum.ANAPHYLACTIC: return 'critical';
      default: return 'medium';
    }
  }
}

// ===========================================
// CLINICAL SAFETY MEASURES
// ===========================================

export class ClinicalSafetyMonitor {
  /**
   * Emergency conflict detection for immediate safety assessment
   */
  public static async emergencyConflictCheck(
    allergies: AllergyType[],
    medications: MedicationType[],
    proposedIngredients: string[]
  ): Promise<{
    isSafe: boolean;
    emergencyWarnings: string[];
    actionRequired: 'block' | 'warn' | 'proceed';
  }> {
    const emergencyWarnings: string[] = [];
    let actionRequired: 'block' | 'warn' | 'proceed' = 'proceed';

    // Check for anaphylactic allergies in ingredients
    for (const allergy of allergies) {
      if (allergy.severity === AllergenSeverityEnum.ANAPHYLACTIC) {
        for (const ingredient of proposedIngredients) {
          if (ingredient.toLowerCase().includes(allergy.allergen.toLowerCase())) {
            emergencyWarnings.push(
              `CRITICAL: ${ingredient} contains ${allergy.allergen} - ANAPHYLACTIC RISK`
            );
            actionRequired = 'block';
          }
        }
      }
    }

    // Check for medication contraindications with food
    for (const medication of medications) {
      if (medication.isActive) {
        const foodContraindications = this.getMedicationFoodContraindications(medication);
        for (const contraindication of foodContraindications) {
          if (proposedIngredients.some(ingredient => 
            ingredient.toLowerCase().includes(contraindication.toLowerCase())
          )) {
            emergencyWarnings.push(
              `WARNING: ${contraindication} may interact with ${medication.genericName}`
            );
            if (actionRequired !== 'block') {
              actionRequired = 'warn';
            }
          }
        }
      }
    }

    return {
      isSafe: actionRequired !== 'block',
      emergencyWarnings,
      actionRequired
    };
  }

  private static getMedicationFoodContraindications(medication: MedicationType): string[] {
    const contraindications: { [key: string]: string[] } = {
      'warfarin': ['vitamin k', 'spinach', 'kale', 'broccoli'],
      'monoamine oxidase inhibitor': ['tyramine', 'aged cheese', 'wine'],
      'tetracycline': ['dairy', 'calcium', 'iron'],
      'digoxin': ['licorice', 'ginseng'],
      'statins': ['grapefruit']
    };

    const medName = medication.genericName.toLowerCase();
    for (const [drugClass, foods] of Object.entries(contraindications)) {
      if (medName.includes(drugClass)) {
        return foods;
      }
    }

    return [];
  }
}

// ===========================================
// DEFAULT CONFIGURATIONS
// ===========================================

export const DEFAULT_CONFLICT_DETECTION_CONFIG: ConflictDetectionConfig = {
  enableMedicationInteractions: true,
  enableAllergyConflicts: true,
  enableConditionCompatibility: true,
  autoResolveMinorConflicts: false, // Conservative default
  emergencyOverrideEnabled: true,
  clinicalOversightRequired: true
};

export const SAMPLE_DRUG_DATABASE: DrugInteractionDatabase = {
  'warfarin': {
    interactions: [
      {
        interactingDrug: 'aspirin',
        severity: DrugInteractionSeverityEnum.MAJOR,
        description: 'Increased bleeding risk',
        mechanism: 'Additive anticoagulant effects',
        clinicalRecommendation: 'Monitor INR closely, consider dose adjustment',
        evidenceLevel: 'high'
      }
    ],
    foodInteractions: [
      {
        food: 'vitamin k rich foods',
        effect: 'Decreased warfarin effectiveness',
        avoidanceRequired: false
      }
    ]
  },
  'lisinopril': {
    interactions: [
      {
        interactingDrug: 'potassium',
        severity: DrugInteractionSeverityEnum.MODERATE,
        description: 'Risk of hyperkalemia',
        mechanism: 'ACE inhibitor reduces potassium excretion',
        clinicalRecommendation: 'Monitor serum potassium levels',
        evidenceLevel: 'high'
      }
    ],
    foodInteractions: []
  }
};

export const SAMPLE_ALLERGEN_RULES: AllergenConflictRule[] = [
  {
    allergen: 'peanuts',
    crossReactiveAllergens: ['tree nuts', 'legumes'],
    riskLevel: 'high',
    avoidanceRecommendations: ['Avoid all peanut products', 'Check for cross-contamination']
  },
  {
    allergen: 'shellfish',
    crossReactiveAllergens: ['crustaceans', 'mollusks'],
    riskLevel: 'critical',
    avoidanceRecommendations: ['Avoid all shellfish', 'Carry epinephrine if prescribed']
  }
]; 