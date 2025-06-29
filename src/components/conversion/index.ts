/**
 * Conversion Components Index
 * Exports all conversion optimization and funnel components
 */

export { CTAManager } from './CTAManager';
export type { CTAConfig, CTAManagerProps } from './CTAManager';

export { LeadMagnets } from './LeadMagnets';
export type { LeadMagnetProps, LeadMagnetOffer } from './LeadMagnets';

export { ConversionFunnelOrchestrator } from './ConversionFunnelOrchestrator';
export type { ConversionFunnelOrchestratorProps } from './ConversionFunnelOrchestrator';

// Re-export utility functions
export { 
  trackCTAClick, 
  trackMicroConversion, 
  trackTrialStart, 
  trackSubscription,
  conversionTracker 
} from '../../utils/conversionTracking';

export type { 
  ConversionEvent, 
  FunnelStep, 
  ABTestResult, 
  ConversionMetrics 
} from '../../utils/conversionTracking';

// Re-export user behavior hook
export { useUserBehavior } from '../../hooks/useUserBehavior'; 