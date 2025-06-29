/**
 * Conversion Tracking and A/B Testing Analytics
 * Praneya Hero Section Analytics System
 */

export interface ConversionEvent {
  event: string;
  audience?: string;
  ctaText?: string;
  variant?: string;
  userId?: string;
  referralSource?: string;
  timestamp: Date;
  section: string;
  properties?: Record<string, any>;
}

export interface ABTestConfig {
  testId: string;
  variant: string;
  userId?: string;
}

// Mock analytics provider for development
const ANALYTICS_ENABLED = process.env.NODE_ENV === 'production';

/**
 * Track conversion events
 */
export const trackConversion = (event: ConversionEvent): void => {
  if (!ANALYTICS_ENABLED) {
    console.log('🔥 Conversion Event:', event);
    return;
  }

  // Google Analytics 4 tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.event, {
      event_category: 'hero_section',
      event_label: event.audience || 'general',
      custom_parameters: {
        cta_text: event.ctaText,
        variant: event.variant,
        section: event.section,
        referral_source: event.referralSource,
        ...event.properties
      }
    });
  }

  // Facebook Pixel tracking
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', {
      content_category: event.audience,
      content_name: event.ctaText,
      variant: event.variant
    });
  }

  // Custom analytics endpoint
  if (typeof window !== 'undefined') {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event)
    }).catch(err => console.warn('Analytics tracking failed:', err));
  }
};

/**
 * Initialize A/B test variant
 */
export const initializeABTest = (testId: string, variant: string, userId?: string): void => {
  if (!ANALYTICS_ENABLED) {
    console.log('🧪 A/B Test:', { testId, variant, userId });
    return;
  }

  const config: ABTestConfig = {
    testId,
    variant,
    ...(userId && { userId })
  };

  // Store A/B test configuration
  if (typeof window !== 'undefined') {
    localStorage.setItem(`ab_test_${testId}`, JSON.stringify(config));
    
    // Track A/B test exposure
    trackConversion({
      event: 'ab_test_exposure',
      variant,
      ...(userId && { userId }),
      timestamp: new Date(),
      section: 'hero',
      properties: {
        test_id: testId
      }
    });
  }
};

/**
 * Get current A/B test variant
 */
export const getABTestVariant = (testId: string): string => {
  if (typeof window === 'undefined') return 'A';
  
  const stored = localStorage.getItem(`ab_test_${testId}`);
  if (stored) {
    try {
      const config: ABTestConfig = JSON.parse(stored);
      return config.variant;
    } catch {
      return 'A';
    }
  }
  
  // Randomly assign variant for new users
  const variants = ['A', 'B', 'C'];
  const randomVariant = variants[Math.floor(Math.random() * variants.length)] || 'A';
  
  initializeABTest(testId, randomVariant);
  return randomVariant;
};

// Type declarations for global analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
} 