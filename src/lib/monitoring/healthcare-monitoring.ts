/**
 * Healthcare Monitoring System
 * Comprehensive monitoring for medical applications with compliance tracking
 */

interface HealthcareMetrics {
  // Performance metrics
  pageLoadTime: number;
  healthDataLoadTime: number;
  emergencyAccessTime: number;
  clinicalFeatureResponseTime: number;
  
  // Healthcare-specific metrics
  phiAccessCount: number;
  clinicalDecisionSupportUsage: number;
  familyCollaborationEvents: number;
  medicationInteractionChecks: number;
  
  // Compliance metrics
  hipaaAuditEvents: number;
  dataEncryptionStatus: boolean;
  accessControlViolations: number;
  consentManagementEvents: number;
  
  // User experience metrics
  accessibilityCompliance: number;
  userSatisfactionScore: number;
  clinicalWorkflowEfficiency: number;
  errorRate: number;
}

interface HealthcareAlert {
  type: 'performance' | 'security' | 'compliance' | 'clinical' | 'accessibility';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  metadata: Record<string, any>;
  healthcareImpact: string;
  requiredActions: string[];
}

class HealthcareMonitoringService {
  private metrics: HealthcareMetrics;
  private alerts: HealthcareAlert[] = [];
  private observers: PerformanceObserver[] = [];
  
  constructor() {
    this.metrics = this.initializeMetrics();
    this.setupPerformanceMonitoring();
    this.setupHealthcareSpecificMonitoring();
    this.setupComplianceMonitoring();
  }

  private initializeMetrics(): HealthcareMetrics {
    return {
      pageLoadTime: 0,
      healthDataLoadTime: 0,
      emergencyAccessTime: 0,
      clinicalFeatureResponseTime: 0,
      phiAccessCount: 0,
      clinicalDecisionSupportUsage: 0,
      familyCollaborationEvents: 0,
      medicationInteractionChecks: 0,
      hipaaAuditEvents: 0,
      dataEncryptionStatus: true,
      accessControlViolations: 0,
      consentManagementEvents: 0,
      accessibilityCompliance: 100,
      userSatisfactionScore: 0,
      clinicalWorkflowEfficiency: 0,
      errorRate: 0
    };
  }

  /**
   * Setup performance monitoring with healthcare-specific metrics
   */
  private setupPerformanceMonitoring(): void {
    this.observeWebVitals();
    this.monitorHealthDataLoading();
    this.monitorEmergencyAccess();
    this.monitorClinicalFeatures();
  }

  private observeWebVitals(): void {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      const lcp = lastEntry.startTime;
      
      if (lcp > 2500) {
        this.createAlert({
          type: 'performance',
          severity: lcp > 4000 ? 'critical' : 'high',
          message: `Slow page load: ${lcp}ms (Healthcare threshold: 2500ms)`,
          timestamp: new Date(),
          metadata: { lcp, threshold: 2500 },
          healthcareImpact: 'Delayed access to critical health information',
          requiredActions: ['Optimize critical rendering path', 'Review healthcare data loading']
        });
      }
      
      this.metrics.pageLoadTime = lcp;
      this.reportMetric('core_web_vitals_lcp', lcp);
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.warn('LCP observer not supported');
    }
  }

  /**
   * Monitor healthcare data loading performance
   */
  private monitorHealthDataLoading(): void {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0] as string;
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Monitor healthcare-specific endpoints
        if (url.includes('/api/health-profile') || url.includes('/api/clinical-data')) {
          this.metrics.healthDataLoadTime = duration;
          
          if (duration > 3000) {
            this.createAlert({
              type: 'performance',
              severity: duration > 5000 ? 'critical' : 'high',
              message: `Slow healthcare data loading: ${duration}ms`,
              timestamp: new Date(),
              metadata: { duration, url, threshold: 3000 },
              healthcareImpact: 'Delayed access to patient health information',
              requiredActions: ['Optimize database queries', 'Implement caching strategy']
            });
          }
        }
        
        // Monitor emergency access endpoints
        if (url.includes('/api/emergency')) {
          this.metrics.emergencyAccessTime = duration;
          
          if (duration > 2000) {
            this.createAlert({
              type: 'performance',
              severity: 'critical',
              message: `CRITICAL: Emergency access too slow: ${duration}ms`,
              timestamp: new Date(),
              metadata: { duration, url, threshold: 2000 },
              healthcareImpact: 'Delayed emergency medical information access',
              requiredActions: ['Immediate optimization required', 'Cache emergency data']
            });
          }
        }
        
        return response;
      } catch (error) {
        this.createAlert({
          type: 'performance',
          severity: 'high',
          message: `Healthcare API request failed: ${url}`,
          timestamp: new Date(),
          metadata: { url, error: error.message },
          healthcareImpact: 'Healthcare service unavailable',
          requiredActions: ['Check service status', 'Implement fallback mechanisms']
        });
        throw error;
      }
    };
  }

  /**
   * Monitor emergency access performance
   */
  private monitorEmergencyAccess(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.dataset.testid === 'emergency-access-button') {
        const startTime = performance.now();
        
        const checkEmergencyData = () => {
          const emergencyData = document.querySelector('[data-testid="emergency-data-accessible"]');
          if (emergencyData) {
            const accessTime = performance.now() - startTime;
            this.metrics.emergencyAccessTime = accessTime;
            
            if (accessTime > 2000) {
              this.createAlert({
                type: 'performance',
                severity: 'critical',
                message: `CRITICAL: Emergency access exceeds 2-second requirement: ${accessTime}ms`,
                timestamp: new Date(),
                metadata: { accessTime, threshold: 2000 },
                healthcareImpact: 'Life-threatening delay in emergency medical access',
                requiredActions: ['Immediate emergency system optimization', 'Escalate to healthcare operations']
              });
            }
            
            this.reportMetric('emergency_access_response', accessTime);
          } else {
            setTimeout(checkEmergencyData, 100);
          }
        };
        
        checkEmergencyData();
      }
    });
  }

  private monitorClinicalFeatures(): void {
    // Monitor drug interaction checking
    this.monitorAPIEndpoint('/api/clinical/drug-interactions', (duration) => {
      this.metrics.medicationInteractionChecks++;
      this.metrics.clinicalFeatureResponseTime = duration;
      
      if (duration > 5000) {
        this.createAlert({
          type: 'clinical',
          severity: 'high',
          message: `Slow drug interaction check: ${duration}ms`,
          timestamp: new Date(),
          metadata: { duration, feature: 'drug-interactions' },
          healthcareImpact: 'Delayed clinical decision support',
          requiredActions: ['Optimize clinical algorithms', 'Cache interaction data']
        });
      }
    });
  }

  private setupHealthcareSpecificMonitoring(): void {
    // Monitor PHI access
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-phi-protected]')) {
        this.metrics.phiAccessCount++;
        this.metrics.hipaaAuditEvents++;
        
        this.reportMetric('phi_access_event', {
          timestamp: new Date(),
          element: target.tagName,
          dataType: target.dataset.phiType || 'unknown'
        });
      }
    });
  }

  private setupComplianceMonitoring(): void {
    // Monitor HIPAA compliance events
    const auditEvents = [
      'health-profile-viewed',
      'clinical-data-accessed',
      'emergency-override-used',
      'family-data-shared'
    ];

    auditEvents.forEach(eventType => {
      document.addEventListener(eventType, (event: CustomEvent) => {
        this.metrics.hipaaAuditEvents++;
        
        this.reportMetric('hipaa_audit_event', {
          eventType,
          timestamp: new Date(),
          userId: event.detail.userId,
          dataAccessed: event.detail.dataType
        });
      });
    });
  }

  private createAlert(alert: HealthcareAlert): void {
    this.alerts.push(alert);
    this.sendAlert(alert);
    
    if (alert.severity === 'critical') {
      this.handleCriticalAlert(alert);
    }
  }

  private async sendAlert(alert: HealthcareAlert): Promise<void> {
    try {
      await fetch('/api/monitoring/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  private handleCriticalAlert(alert: HealthcareAlert): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Critical Healthcare System Alert', {
        body: alert.message,
        icon: '/icons/medical-alert.png',
        tag: 'healthcare-critical'
      });
    }
    console.error('🚨 CRITICAL HEALTHCARE ALERT:', alert);
  }

  private async reportMetric(name: string, value: any): Promise<void> {
    try {
      await fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          value,
          timestamp: new Date(),
          type: 'healthcare'
        })
      });
    } catch (error) {
      console.warn('Failed to report metric:', error);
    }
  }

  private monitorAPIEndpoint(endpoint: string, callback: (duration: number) => void): void {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const url = args[0] as string;
      
      if (url.includes(endpoint)) {
        const startTime = performance.now();
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        callback(duration);
        return response;
      }
      
      return originalFetch(...args);
    };
  }

  public getMetrics(): HealthcareMetrics {
    return { ...this.metrics };
  }

  public getAlerts(limit: number = 50): HealthcareAlert[] {
    return this.alerts.slice(-limit);
  }

  public generateComplianceReport(): any {
    return {
      timestamp: new Date(),
      metrics: this.getMetrics(),
      alerts: this.getAlerts(100),
      complianceScore: this.calculateComplianceScore(),
      recommendations: this.generateRecommendations()
    };
  }

  private calculateComplianceScore(): number {
    const scores = {
      performance: this.metrics.pageLoadTime < 2500 ? 100 : 50,
      accessibility: this.metrics.accessibilityCompliance,
      security: this.metrics.dataEncryptionStatus ? 100 : 0,
      emergencyAccess: this.metrics.emergencyAccessTime < 2000 ? 100 : 0
    };

    return Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
  }

  private generateRecommendations(): string[] {
    const recommendations = [];

    if (this.metrics.pageLoadTime > 2500) {
      recommendations.push('Optimize page load performance for healthcare workflows');
    }

    if (this.metrics.emergencyAccessTime > 2000) {
      recommendations.push('CRITICAL: Optimize emergency access to meet 2-second requirement');
    }

    if (this.metrics.accessibilityCompliance < 90) {
      recommendations.push('Improve accessibility compliance for healthcare users');
    }

    return recommendations;
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const healthcareMonitoring = new HealthcareMonitoringService();

// Global error handling
window.addEventListener('error', (event) => {
  healthcareMonitoring['createAlert']({
    type: 'performance',
    severity: 'high',
    message: `JavaScript error: ${event.error?.message || 'Unknown error'}`,
    timestamp: new Date(),
    metadata: {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack
    },
    healthcareImpact: 'Potential healthcare feature malfunction',
    requiredActions: ['Debug JavaScript error', 'Verify healthcare functionality']
  });
});

export default healthcareMonitoring; 