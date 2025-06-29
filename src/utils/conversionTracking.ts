/**
 * Conversion Tracking System
 * Advanced funnel analytics, A/B testing, and audience-specific conversion tracking
 */

interface ConversionEvent {
  type: 'page_view' | 'cta_click' | 'form_submit' | 'trial_start' | 'subscription' | 'micro_conversion' | 'page_blur' | 'session_end';
  data: {
    ctaId?: string;
    audience: 'unknown' | 'fitness' | 'families' | 'health';
    placement: string;
    variant?: string;
    userBehavior?: {
      scrollDepth: number;
      timeOnPage: number;
      engagementScore: number;
    };
    timestamp: number;
    sessionId: string;
    userId?: string;
    value?: number;
  };
}

interface FunnelStep {
  name: string;
  conversions: number;
  totalUsers: number;
  conversionRate: number;
  audienceBreakdown: Record<string, number>;
}

interface ABTestResult {
  variantId: string;
  conversions: number;
  visitors: number;
  conversionRate: number;
  statisticalSignificance: number;
}

interface ConversionMetrics {
  totalConversions: number;
  conversionRate: number;
  audienceBreakdown: Record<string, {
    conversions: number;
    visitors: number;
    conversionRate: number;
  }>;
  funnelSteps: FunnelStep[];
  abTestResults: Record<string, ABTestResult>;
  ltv: number;
  costPerAcquisition: number;
}

class ConversionTracker {
  private events: ConversionEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private startTime: number;
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    
    if (this.isClient) {
      this.initializeTracking();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking(): void {
    if (!this.isClient) return;

    // Track page view on initialization
    this.trackEvent('page_view', {
      audience: 'unknown',
      placement: 'landing',
      timestamp: Date.now(),
      sessionId: this.sessionId
    });

    // Track page unload for session duration
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.trackSessionEnd();
      });
    }

    // Track visibility changes
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.trackEvent('page_blur', {
            audience: 'unknown',
            placement: 'landing',
            timestamp: Date.now(),
            sessionId: this.sessionId
          });
        }
      });
    }
  }

  trackEvent(type: ConversionEvent['type'], data: Partial<ConversionEvent['data']>): void {
    const event: ConversionEvent = {
      type,
      data: {
        audience: 'unknown',
        placement: 'unknown',
        timestamp: Date.now(),
        sessionId: this.sessionId,
        ...data
      }
    };

    this.events.push(event);
    this.sendToAnalytics(event);
    this.updateLocalMetrics(event);
  }

  trackCTAClick(
    ctaId: string, 
    audience: 'unknown' | 'fitness' | 'families' | 'health',
    placement: string,
    variant?: string,
    userBehavior?: any
  ): void {
    const eventData: Partial<ConversionEvent['data']> = {
      ctaId,
      audience,
      placement,
      userBehavior,
      value: this.getCTAValue(ctaId, audience)
    };
    
    if (variant) {
      eventData.variant = variant;
    }
    
    this.trackEvent('cta_click', eventData);
  }

  trackMicroConversion(
    type: string,
    audience: 'unknown' | 'fitness' | 'families' | 'health',
    data?: any
  ): void {
    this.trackEvent('micro_conversion', {
      ctaId: type,
      audience,
      placement: 'micro',
      value: this.getMicroConversionValue(type),
      ...data
    });
  }

  trackTrialStart(
    tier: string,
    audience: 'unknown' | 'fitness' | 'families' | 'health',
    billing: 'monthly' | 'annual'
  ): void {
    this.trackEvent('trial_start', {
      ctaId: tier,
      audience,
      placement: 'pricing',
      value: this.getTrialValue(tier, billing)
    });
  }

  trackSubscription(
    tier: string,
    audience: 'unknown' | 'fitness' | 'families' | 'health',
    billing: 'monthly' | 'annual',
    amount: number
  ): void {
    this.trackEvent('subscription', {
      ctaId: tier,
      audience,
      placement: 'checkout',
      value: amount
    });
  }

  private getCTAValue(ctaId: string, audience: string): number {
    // Assign value based on CTA type and audience
    const baseValues: Record<string, number> = {
      'discover-path': 5,
      'start-transformation': 25,
      'plan-meals': 20,
      'improve-nutrition': 15,
      'macro-calculator': 10,
      'family-savings': 15,
      'check-interactions': 10
    };

    const audienceMultiplier: Record<string, number> = {
      'fitness': 1.2,
      'families': 1.1,
      'health': 1.0,
      'unknown': 0.8
    };

    return (baseValues[ctaId] || 5) * (audienceMultiplier[audience] || 1);
  }

  private getMicroConversionValue(type: string): number {
    const microValues: Record<string, number> = {
      'email_signup': 15,
      'calculator_use': 10,
      'video_watched': 8,
      'demo_requested': 20,
      'content_download': 12
    };

    return microValues[type] || 5;
  }

  private getTrialValue(tier: string, billing: string): number {
    const tierValues: Record<string, number> = {
      'basic': 0,
      'enhanced': 50,
      'premium': 100
    };

    const billingMultiplier = billing === 'annual' ? 1.5 : 1;
    return (tierValues[tier] || 25) * billingMultiplier;
  }

  private sendToAnalytics(event: ConversionEvent): void {
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.type, {
        event_category: 'conversion',
        event_label: event.data.ctaId,
        value: event.data.value,
        custom_parameters: {
          audience: event.data.audience,
          placement: event.data.placement,
          variant: event.data.variant,
          session_id: event.data.sessionId,
          engagement_score: event.data.userBehavior?.engagementScore
        }
      });
    }

    // Send to Facebook Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      if (event.type === 'trial_start') {
        window.fbq('track', 'InitiateCheckout', {
          value: event.data.value,
          currency: 'USD',
          content_category: event.data.audience
        });
      } else if (event.type === 'subscription') {
        window.fbq('track', 'Purchase', {
          value: event.data.value,
          currency: 'USD',
          content_category: event.data.audience
        });
      } else if (event.type === 'cta_click') {
        window.fbq('track', 'AddToCart', {
          value: event.data.value,
          currency: 'USD',
          content_name: event.data.ctaId
        });
      }
    }

    // Send to custom analytics endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      }).catch(console.error);
    }
  }

  private updateLocalMetrics(event: ConversionEvent): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    // Update local storage metrics for immediate UI feedback
    const metrics = this.getStoredMetrics();
    
    // Update conversion counts
    if (event.type === 'subscription') {
      metrics.totalConversions += 1;
      const audienceBreakdown = metrics.audienceBreakdown[event.data.audience];
      if (audienceBreakdown) {
        audienceBreakdown.conversions += 1;
      }
    }

    // Update visitor counts
    const audienceBreakdown = metrics.audienceBreakdown[event.data.audience];
    if (audienceBreakdown) {
      audienceBreakdown.visitors += 1;
    }

    // Recalculate conversion rates
    Object.keys(metrics.audienceBreakdown).forEach(audience => {
      const breakdown = metrics.audienceBreakdown[audience];
      if (breakdown) {
        breakdown.conversionRate = breakdown.visitors > 0 
          ? (breakdown.conversions / breakdown.visitors) * 100 
          : 0;
      }
    });

    localStorage.setItem('praneya_metrics', JSON.stringify(metrics));
  }

  private getStoredMetrics(): ConversionMetrics {
    const defaultMetrics = {
      totalConversions: 0,
      conversionRate: 0,
      audienceBreakdown: {
        unknown: { conversions: 0, visitors: 0, conversionRate: 0 },
        fitness: { conversions: 0, visitors: 0, conversionRate: 0 },
        families: { conversions: 0, visitors: 0, conversionRate: 0 },
        health: { conversions: 0, visitors: 0, conversionRate: 0 }
      },
      funnelSteps: [],
      abTestResults: {},
      ltv: 0,
      costPerAcquisition: 0
    };

    if (!this.isClient) {
      return defaultMetrics;
    }
    
    const stored = localStorage.getItem('praneya_metrics');
    if (stored) {
      return JSON.parse(stored);
    }

    return defaultMetrics;
  }

  getFunnelMetrics(): FunnelStep[] {
    const funnelSteps = [
      'page_view',
      'cta_click',
      'trial_start',
      'subscription'
    ];

    return funnelSteps.map((step, index) => {
      const stepEvents = this.events.filter(e => e.type === step);
      const previousStepEvents = index > 0 
        ? this.events.filter(e => e.type === funnelSteps[index - 1])
        : [{ data: { audience: 'all' } }];

      const conversions = stepEvents.length;
      const totalUsers = index === 0 ? conversions : previousStepEvents.length;
      const conversionRate = totalUsers > 0 ? (conversions / totalUsers) * 100 : 0;

      const audienceBreakdown: Record<string, number> = {};
      ['unknown', 'fitness', 'families', 'health'].forEach(audience => {
        audienceBreakdown[audience] = stepEvents.filter(
          e => e.data.audience === audience
        ).length;
      });

      return {
        name: step,
        conversions,
        totalUsers,
        conversionRate,
        audienceBreakdown
      };
    });
  }

  getABTestResults(testName: string): ABTestResult[] {
    const testEvents = this.events.filter(
      e => e.data.variant && e.type === 'cta_click'
    );

    const variantSet = new Set<string>();
    testEvents.forEach(e => {
      if (e.data.variant) {
        variantSet.add(e.data.variant);
      }
    });
    const variants = Array.from(variantSet);

    return variants.map(variant => {
      const variantEvents = testEvents.filter(e => e.data.variant === variant);
      const conversions = this.events.filter(
        e => e.type === 'trial_start' && e.data.variant === variant
      ).length;

      const visitors = variantEvents.length;
      const conversionRate = visitors > 0 ? (conversions / visitors) * 100 : 0;

      return {
        variantId: variant || 'control',
        conversions,
        visitors,
        conversionRate,
        statisticalSignificance: this.calculateStatisticalSignificance(
          conversions, visitors, testEvents.length
        )
      };
    });
  }

  private calculateStatisticalSignificance(
    conversions: number, 
    visitors: number, 
    totalVisitors: number
  ): number {
    // Simplified chi-square test for statistical significance
    if (visitors < 30 || totalVisitors < 100) return 0;
    
    const expected = (conversions / visitors) * totalVisitors;
    const chiSquare = Math.pow(conversions - expected, 2) / expected;
    
    // Convert to percentage (simplified)
    return Math.min(Math.max(chiSquare * 10, 0), 99);
  }

  private trackSessionEnd(): void {
    const sessionDuration = Date.now() - this.startTime;
    this.trackEvent('session_end', {
      audience: 'unknown',
      placement: 'session',
      value: Math.floor(sessionDuration / 1000) // Duration in seconds
    });
  }

  // Export data for analysis
  exportData(): {
    events: ConversionEvent[];
    metrics: ConversionMetrics;
    funnelSteps: FunnelStep[];
  } {
    return {
      events: this.events,
      metrics: this.getStoredMetrics(),
      funnelSteps: this.getFunnelMetrics()
    };
  }

  // Reset tracking data (for testing)
  reset(): void {
    this.events = [];
    if (this.isClient) {
      localStorage.removeItem('praneya_metrics');
    }
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
  }
}

// Global tracker instance - only create on client side
export const conversionTracker = typeof window !== 'undefined' ? new ConversionTracker() : null;

// Utility functions for easy access
export const trackCTAClick = (
  ctaId: string,
  audience: 'unknown' | 'fitness' | 'families' | 'health',
  placement: string,
  variant?: string,
  userBehavior?: any
) => {
  if (conversionTracker) {
    conversionTracker.trackCTAClick(ctaId, audience, placement, variant, userBehavior);
  }
};

export const trackMicroConversion = (
  type: string,
  audience: 'unknown' | 'fitness' | 'families' | 'health',
  data?: any
) => {
  if (conversionTracker) {
    conversionTracker.trackMicroConversion(type, audience, data);
  }
};

export const trackTrialStart = (
  tier: string,
  audience: 'unknown' | 'fitness' | 'families' | 'health',
  billing: 'monthly' | 'annual'
) => {
  if (conversionTracker) {
    conversionTracker.trackTrialStart(tier, audience, billing);
  }
};

export const trackSubscription = (
  tier: string,
  audience: 'unknown' | 'fitness' | 'families' | 'health',
  billing: 'monthly' | 'annual',
  amount: number
) => {
  if (conversionTracker) {
    conversionTracker.trackSubscription(tier, audience, billing, amount);
  }
};

// TypeScript module declarations for analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

export type { ConversionEvent, FunnelStep, ABTestResult, ConversionMetrics }; 