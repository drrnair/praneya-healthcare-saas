/**
 * Drug Interactions Hook - Premium Clinical Safety
 * Real-time drug interaction monitoring and clinical decision support
 */

import { useState, useEffect, useCallback } from 'react';
import { useClinicalInterface } from '../ClinicalInterfaceProvider';
import { DrugInteraction, DrugFoodInteraction, Medication } from '@/types/clinical';

export interface UseDrugInteractionsOptions {
  patientId: string;
  medications: Medication[];
  foods?: string[];
  supplements?: string[];
  realTimeScanning?: boolean;
  includeTheoreticalInteractions?: boolean;
}

export const useDrugInteractions = (options: UseDrugInteractionsOptions) => {
  const { addAlert, logAuditEntry } = useClinicalInterface();
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [foodInteractions, setFoodInteractions] = useState<DrugFoodInteraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);

  // Mock drug interaction database
  const drugInteractionDatabase: DrugInteraction[] = [
    {
      interactingMedication: 'Warfarin + Aspirin',
      interactionType: 'drug_drug',
      severity: 'major',
      clinicalEffect: 'Increased bleeding risk',
      mechanism: 'Additive anticoagulant effects',
      management: 'Monitor INR closely, consider dose adjustment',
      evidence: 'established',
      sources: [],
      lastUpdated: new Date().toISOString()
    },
    {
      interactingMedication: 'Simvastatin + Clarithromycin',
      interactionType: 'drug_drug',
      severity: 'contraindicated',
      clinicalEffect: 'Severe myopathy and rhabdomyolysis risk',
      mechanism: 'CYP3A4 inhibition increases simvastatin levels',
      management: 'Contraindicated - use alternative statin or antibiotic',
      evidence: 'established',
      sources: [],
      lastUpdated: new Date().toISOString()
    }
  ];

  const foodInteractionDatabase: DrugFoodInteraction[] = [
    {
      medicationName: 'Warfarin',
      foodItem: 'Green leafy vegetables (Vitamin K)',
      interactionType: 'metabolism_altered',
      severity: 'moderate',
      clinicalEffect: 'Decreased anticoagulation effectiveness',
      recommendations: {
        timing: 'Maintain consistent vitamin K intake',
        alternatives: ['Monitor INR more frequently'],
        monitoring: ['Weekly INR checks after dietary changes']
      },
      evidence: []
    },
    {
      medicationName: 'Levothyroxine',
      foodItem: 'Coffee, calcium-rich foods',
      interactionType: 'absorption_decreased',
      severity: 'moderate',
      clinicalEffect: 'Reduced thyroid hormone absorption',
      recommendations: {
        timing: 'Take medication 4 hours before or after',
        alternatives: ['Take on empty stomach'],
        monitoring: ['TSH levels after 6-8 weeks']
      },
      evidence: []
    }
  ];

  // Scan for drug-drug interactions
  const scanDrugInteractions = useCallback(async () => {
    setLoading(true);
    
    try {
      const medicationNames = options.medications.map(med => med.name.toLowerCase());
      const foundInteractions: DrugInteraction[] = [];
      
      // Check each medication against others
      for (let i = 0; i < medicationNames.length; i++) {
        for (let j = i + 1; j < medicationNames.length; j++) {
          const med1 = medicationNames[i];
          const med2 = medicationNames[j];
          
          // Check if interaction exists in database
          const interaction = drugInteractionDatabase.find(interaction => {
            const interactionMeds = interaction.interactingMedication.toLowerCase();
            return (interactionMeds.includes(med1) && interactionMeds.includes(med2)) ||
                   (interactionMeds.includes(med2) && interactionMeds.includes(med1));
          });
          
          if (interaction) {
            foundInteractions.push(interaction);
            
            // Generate alert for high severity interactions
            if (interaction.severity === 'major' || interaction.severity === 'contraindicated') {
              addAlert({
                id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'drug_interaction',
                severity: interaction.severity === 'contraindicated' ? 'critical' : 'high',
                title: `Drug Interaction: ${med1} + ${med2}`,
                description: interaction.clinicalEffect,
                patientId: options.patientId,
                triggeredBy: {
                  source: 'drug_interaction_scanner',
                  data: { medications: [med1, med2], interaction },
                  timestamp: new Date().toISOString()
                },
                recommendations: {
                  immediate_actions: [interaction.management],
                  follow_up_required: true,
                  provider_notification: true,
                  patient_notification: interaction.severity === 'contraindicated'
                },
                status: 'active',
                escalation: {
                  rules: [
                    {
                      condition: 'No acknowledgment within 30 minutes',
                      action: 'Escalate to supervising physician',
                      delay: '30 minutes'
                    }
                  ],
                  history: []
                }
              });
            }
          }
        }
      }
      
      setInteractions(foundInteractions);
      
      // Log scan activity
      logAuditEntry({
        action: 'view',
        resource: 'drug_interaction_scan',
        resourceId: 'scan_' + Date.now(),
        userId: 'system',
        userRole: 'system',
        patientId: options.patientId,
        ipAddress: '127.0.0.1',
        userAgent: navigator.userAgent,
        sessionId: 'session_' + Date.now(),
        dataAccessed: ['medications', 'interaction_database'],
        compliance_flags: ['clinical_decision_support', 'drug_safety']
      });
      
    } catch (error) {
      console.error('Drug interaction scan failed:', error);
    } finally {
      setLoading(false);
      setLastScanTime(new Date().toISOString());
    }
  }, [options.medications, options.patientId, addAlert, logAuditEntry]);

  // Scan for drug-food interactions
  const scanFoodInteractions = useCallback(async () => {
    if (!options.foods || options.foods.length === 0) return;
    
    const foundFoodInteractions: DrugFoodInteraction[] = [];
    
    options.medications.forEach(medication => {
      options.foods?.forEach(food => {
        const interaction = foodInteractionDatabase.find(interaction => 
          interaction.medicationName.toLowerCase().includes(medication.name.toLowerCase()) &&
          food.toLowerCase().includes(interaction.foodItem.toLowerCase().split(' ')[0])
        );
        
        if (interaction) {
          foundFoodInteractions.push(interaction);
        }
      });
    });
    
    setFoodInteractions(foundFoodInteractions);
  }, [options.medications, options.foods]);

  // Get interaction by severity
  const getInteractionsBySeverity = useCallback((severity: DrugInteraction['severity']) => {
    return interactions.filter(interaction => interaction.severity === severity);
  }, [interactions]);

  // Get critical interactions requiring immediate attention
  const getCriticalInteractions = useCallback(() => {
    return interactions.filter(interaction => 
      interaction.severity === 'contraindicated' || interaction.severity === 'major'
    );
  }, [interactions]);

  // Check if specific medication has interactions
  const checkMedicationInteractions = useCallback((medicationName: string) => {
    return interactions.filter(interaction => 
      interaction.interactingMedication.toLowerCase().includes(medicationName.toLowerCase())
    );
  }, [interactions]);

  // Auto-scan when medications change
  useEffect(() => {
    if (options.realTimeScanning && options.medications.length > 0) {
      scanDrugInteractions();
    }
  }, [options.medications, options.realTimeScanning, scanDrugInteractions]);

  // Auto-scan food interactions when foods change
  useEffect(() => {
    if (options.realTimeScanning && options.foods && options.foods.length > 0) {
      scanFoodInteractions();
    }
  }, [options.foods, options.realTimeScanning, scanFoodInteractions]);

  return {
    // Interaction data
    interactions,
    foodInteractions,
    
    // State
    loading,
    lastScanTime,
    
    // Methods
    scanDrugInteractions,
    scanFoodInteractions,
    getInteractionsBySeverity,
    getCriticalInteractions,
    checkMedicationInteractions,
    
    // Computed values
    totalInteractions: interactions.length + foodInteractions.length,
    criticalCount: getCriticalInteractions().length,
    hasContraindications: interactions.some(i => i.severity === 'contraindicated'),
    hasCriticalFoodInteractions: foodInteractions.some(i => i.severity === 'major' || i.severity === 'contraindicated')
  };
};
