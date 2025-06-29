/**
 * Healthcare Monitoring Dashboard Configuration
 * Comprehensive dashboard for monitoring healthcare application performance and compliance
 */

interface DashboardMetric {
  id: string;
  name: string;
  description: string;
  type: 'gauge' | 'counter' | 'histogram' | 'line' | 'bar' | 'pie';
  category: 'performance' | 'security' | 'compliance' | 'healthcare' | 'user_experience';
  priority: 'low' | 'medium' | 'high' | 'critical';
  thresholds: {
    good: number;
    warning: number;
    critical: number;
  };
  unit: string;
  healthcareRelevance: string;
}

interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'alert' | 'status';
  metrics: string[];
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number; w: number; h: number };
  config: Record<string, any>;
  healthcareContext: string;
}

interface DashboardLayout {
  id: string;
  name: string;
  description: string;
  target: 'healthcare_admin' | 'clinical_staff' | 'technical_team' | 'compliance_officer';
  widgets: DashboardWidget[];
  autoRefresh: number; // seconds
  alerting: boolean;
}

class HealthcareDashboardConfig {
  private metrics: DashboardMetric[] = [];
  private widgets: DashboardWidget[] = [];
  private layouts: DashboardLayout[] = [];

  constructor() {
    this.initializeMetrics();
    this.initializeWidgets();
    this.initializeLayouts();
  }

  private initializeMetrics(): void {
    // Performance Metrics
    this.metrics.push(
      {
        id: 'page_load_time',
        name: 'Page Load Time',
        description: 'Time taken for healthcare pages to fully load',
        type: 'histogram',
        category: 'performance',
        priority: 'high',
        thresholds: { good: 2500, warning: 4000, critical: 6000 },
        unit: 'ms',
        healthcareRelevance: 'Critical for healthcare workflow efficiency'
      },
      {
        id: 'emergency_access_time',
        name: 'Emergency Access Time',
        description: 'Time to access emergency medical information',
        type: 'gauge',
        category: 'healthcare',
        priority: 'critical',
        thresholds: { good: 2000, warning: 3000, critical: 5000 },
        unit: 'ms',
        healthcareRelevance: 'Life-critical metric for emergency situations'
      },
      {
        id: 'health_data_load_time',
        name: 'Health Data Load Time',
        description: 'Time to load patient health information',
        type: 'histogram',
        category: 'healthcare',
        priority: 'high',
        thresholds: { good: 3000, warning: 5000, critical: 8000 },
        unit: 'ms',
        healthcareRelevance: 'Essential for clinical decision making'
      },
      {
        id: 'clinical_feature_response',
        name: 'Clinical Feature Response Time',
        description: 'Response time for clinical decision support features',
        type: 'histogram',
        category: 'healthcare',
        priority: 'high',
        thresholds: { good: 5000, warning: 10000, critical: 15000 },
        unit: 'ms',
        healthcareRelevance: 'Important for clinical workflow efficiency'
      },
      {
        id: 'api_response_time',
        name: 'API Response Time',
        description: 'Average response time for healthcare APIs',
        type: 'line',
        category: 'performance',
        priority: 'medium',
        thresholds: { good: 500, warning: 1000, critical: 2000 },
        unit: 'ms',
        healthcareRelevance: 'Affects overall application responsiveness'
      }
    );

    // Security Metrics
    this.metrics.push(
      {
        id: 'failed_login_attempts',
        name: 'Failed Login Attempts',
        description: 'Number of failed authentication attempts',
        type: 'counter',
        category: 'security',
        priority: 'high',
        thresholds: { good: 0, warning: 5, critical: 10 },
        unit: 'count',
        healthcareRelevance: 'Critical for protecting patient data access'
      },
      {
        id: 'phi_access_violations',
        name: 'PHI Access Violations',
        description: 'Unauthorized access attempts to protected health information',
        type: 'counter',
        category: 'security',
        priority: 'critical',
        thresholds: { good: 0, warning: 1, critical: 3 },
        unit: 'count',
        healthcareRelevance: 'HIPAA compliance requirement'
      },
      {
        id: 'security_threats_detected',
        name: 'Security Threats',
        description: 'Number of security threats detected',
        type: 'counter',
        category: 'security',
        priority: 'critical',
        thresholds: { good: 0, warning: 2, critical: 5 },
        unit: 'count',
        healthcareRelevance: 'Essential for healthcare data protection'
      },
      {
        id: 'encryption_status',
        name: 'Data Encryption Status',
        description: 'Status of healthcare data encryption',
        type: 'gauge',
        category: 'security',
        priority: 'critical',
        thresholds: { good: 100, warning: 95, critical: 90 },
        unit: '%',
        healthcareRelevance: 'HIPAA requirement for PHI protection'
      }
    );

    // Compliance Metrics
    this.metrics.push(
      {
        id: 'hipaa_compliance_score',
        name: 'HIPAA Compliance Score',
        description: 'Overall HIPAA compliance rating',
        type: 'gauge',
        category: 'compliance',
        priority: 'critical',
        thresholds: { good: 95, warning: 85, critical: 75 },
        unit: '%',
        healthcareRelevance: 'Legal requirement for healthcare applications'
      },
      {
        id: 'audit_trail_completeness',
        name: 'Audit Trail Completeness',
        description: 'Percentage of required audit events captured',
        type: 'gauge',
        category: 'compliance',
        priority: 'high',
        thresholds: { good: 98, warning: 90, critical: 80 },
        unit: '%',
        healthcareRelevance: 'Required for HIPAA compliance and investigations'
      },
      {
        id: 'consent_management_events',
        name: 'Consent Management Events',
        description: 'Number of consent-related events processed',
        type: 'counter',
        category: 'compliance',
        priority: 'medium',
        thresholds: { good: 100, warning: 50, critical: 0 },
        unit: 'count',
        healthcareRelevance: 'Required for patient privacy protection'
      }
    );

    // Healthcare-Specific Metrics
    this.metrics.push(
      {
        id: 'medication_interaction_checks',
        name: 'Drug Interaction Checks',
        description: 'Number of medication interaction checks performed',
        type: 'counter',
        category: 'healthcare',
        priority: 'high',
        thresholds: { good: 100, warning: 50, critical: 10 },
        unit: 'count',
        healthcareRelevance: 'Critical for patient safety'
      },
      {
        id: 'family_collaboration_events',
        name: 'Family Collaboration Events',
        description: 'Number of family health data sharing events',
        type: 'counter',
        category: 'healthcare',
        priority: 'medium',
        thresholds: { good: 50, warning: 20, critical: 5 },
        unit: 'count',
        healthcareRelevance: 'Indicates family engagement in health management'
      },
      {
        id: 'clinical_decision_support_usage',
        name: 'Clinical Decision Support Usage',
        description: 'Usage of AI-powered clinical decision support',
        type: 'counter',
        category: 'healthcare',
        priority: 'medium',
        thresholds: { good: 100, warning: 50, critical: 20 },
        unit: 'count',
        healthcareRelevance: 'Indicates adoption of clinical support tools'
      },
      {
        id: 'emergency_protocol_access',
        name: 'Emergency Protocol Access',
        description: 'Number of emergency protocol activations',
        type: 'counter',
        category: 'healthcare',
        priority: 'high',
        thresholds: { good: 0, warning: 5, critical: 15 },
        unit: 'count',
        healthcareRelevance: 'Critical for emergency response monitoring'
      }
    );

    // User Experience Metrics
    this.metrics.push(
      {
        id: 'accessibility_compliance',
        name: 'Accessibility Compliance',
        description: 'WCAG 2.2 AA compliance score',
        type: 'gauge',
        category: 'user_experience',
        priority: 'high',
        thresholds: { good: 95, warning: 85, critical: 75 },
        unit: '%',
        healthcareRelevance: 'Ensures healthcare access for users with disabilities'
      },
      {
        id: 'error_rate',
        name: 'Application Error Rate',
        description: 'Percentage of requests resulting in errors',
        type: 'gauge',
        category: 'performance',
        priority: 'high',
        thresholds: { good: 1, warning: 3, critical: 5 },
        unit: '%',
        healthcareRelevance: 'Affects reliability of healthcare operations'
      },
      {
        id: 'user_satisfaction_score',
        name: 'User Satisfaction Score',
        description: 'Healthcare user satisfaction rating',
        type: 'gauge',
        category: 'user_experience',
        priority: 'medium',
        thresholds: { good: 4.5, warning: 3.5, critical: 2.5 },
        unit: 'rating',
        healthcareRelevance: 'Indicates effectiveness of healthcare tools'
      }
    );
  }

  private initializeWidgets(): void {
    // Critical Healthcare Metrics Widget
    this.widgets.push({
      id: 'critical_healthcare_metrics',
      title: 'Critical Healthcare Metrics',
      type: 'metric',
      metrics: ['emergency_access_time', 'phi_access_violations', 'hipaa_compliance_score'],
      size: 'large',
      position: { x: 0, y: 0, w: 6, h: 3 },
      config: {
        layout: 'grid',
        showTrends: true,
        alertOnThreshold: true,
        healthcareAlerts: true
      },
      healthcareContext: 'Life-critical metrics requiring immediate attention'
    });

    // Performance Overview Widget
    this.widgets.push({
      id: 'performance_overview',
      title: 'Healthcare Performance Overview',
      type: 'chart',
      metrics: ['page_load_time', 'health_data_load_time', 'clinical_feature_response', 'api_response_time'],
      size: 'large',
      position: { x: 6, y: 0, w: 6, h: 3 },
      config: {
        chartType: 'line',
        timeRange: '24h',
        showThresholds: true,
        realTimeUpdates: true
      },
      healthcareContext: 'Monitor healthcare application performance trends'
    });

    // Security Status Widget
    this.widgets.push({
      id: 'security_status',
      title: 'Healthcare Security Status',
      type: 'status',
      metrics: ['failed_login_attempts', 'security_threats_detected', 'encryption_status'],
      size: 'medium',
      position: { x: 0, y: 3, w: 4, h: 2 },
      config: {
        statusIndicators: true,
        threatLevel: true,
        securityAlerts: true,
        complianceCheck: true
      },
      healthcareContext: 'Real-time security monitoring for patient data protection'
    });

    // Compliance Dashboard Widget
    this.widgets.push({
      id: 'compliance_dashboard',
      title: 'HIPAA Compliance Dashboard',
      type: 'metric',
      metrics: ['hipaa_compliance_score', 'audit_trail_completeness', 'consent_management_events'],
      size: 'medium',
      position: { x: 4, y: 3, w: 4, h: 2 },
      config: {
        complianceView: true,
        auditSummary: true,
        regulatoryReports: true,
        alertOnViolation: true
      },
      healthcareContext: 'Monitor regulatory compliance for healthcare operations'
    });

    // Clinical Features Usage Widget
    this.widgets.push({
      id: 'clinical_features_usage',
      title: 'Clinical Features Usage',
      type: 'chart',
      metrics: ['medication_interaction_checks', 'clinical_decision_support_usage', 'emergency_protocol_access'],
      size: 'medium',
      position: { x: 8, y: 3, w: 4, h: 2 },
      config: {
        chartType: 'bar',
        timeRange: '7d',
        showComparison: true,
        clinicalInsights: true
      },
      healthcareContext: 'Track adoption and usage of clinical safety features'
    });

    // Family Collaboration Widget
    this.widgets.push({
      id: 'family_collaboration',
      title: 'Family Health Collaboration',
      type: 'metric',
      metrics: ['family_collaboration_events'],
      size: 'small',
      position: { x: 0, y: 5, w: 3, h: 1 },
      config: {
        familyMetrics: true,
        privacyCompliance: true,
        collaborationTrends: true
      },
      healthcareContext: 'Monitor family engagement in health management'
    });

    // Accessibility Status Widget
    this.widgets.push({
      id: 'accessibility_status',
      title: 'Healthcare Accessibility',
      type: 'gauge',
      metrics: ['accessibility_compliance'],
      size: 'small',
      position: { x: 3, y: 5, w: 3, h: 1 },
      config: {
        wcagCompliance: true,
        accessibilityIssues: true,
        improvementSuggestions: true
      },
      healthcareContext: 'Ensure healthcare tools are accessible to all users'
    });

    // Recent Alerts Widget
    this.widgets.push({
      id: 'recent_alerts',
      title: 'Healthcare System Alerts',
      type: 'alert',
      metrics: ['emergency_access_time', 'phi_access_violations', 'security_threats_detected'],
      size: 'medium',
      position: { x: 6, y: 5, w: 6, h: 2 },
      config: {
        alertHistory: true,
        severityFiltering: true,
        healthcareContext: true,
        actionableAlerts: true
      },
      healthcareContext: 'Real-time alerts for healthcare system issues'
    });

    // System Health Summary Widget
    this.widgets.push({
      id: 'system_health_summary',
      title: 'Healthcare System Health',
      type: 'table',
      metrics: ['error_rate', 'user_satisfaction_score', 'api_response_time'],
      size: 'full',
      position: { x: 0, y: 7, w: 12, h: 2 },
      config: {
        healthSummary: true,
        detailedMetrics: true,
        historicalData: true,
        exportCapability: true
      },
      healthcareContext: 'Comprehensive overview of healthcare system health'
    });
  }

  private initializeLayouts(): void {
    // Healthcare Administrator Layout
    this.layouts.push({
      id: 'healthcare_admin',
      name: 'Healthcare Administrator Dashboard',
      description: 'Comprehensive dashboard for healthcare administrators',
      target: 'healthcare_admin',
      widgets: [
        'critical_healthcare_metrics',
        'performance_overview',
        'security_status',
        'compliance_dashboard',
        'clinical_features_usage',
        'system_health_summary'
      ],
      autoRefresh: 30, // 30 seconds
      alerting: true
    });

    // Clinical Staff Layout
    this.layouts.push({
      id: 'clinical_staff',
      name: 'Clinical Staff Dashboard',
      description: 'Dashboard focused on clinical features and patient safety',
      target: 'clinical_staff',
      widgets: [
        'critical_healthcare_metrics',
        'clinical_features_usage',
        'emergency_protocol_access',
        'medication_interaction_checks',
        'family_collaboration'
      ],
      autoRefresh: 60, // 1 minute
      alerting: true
    });

    // Technical Team Layout
    this.layouts.push({
      id: 'technical_team',
      name: 'Technical Operations Dashboard',
      description: 'Dashboard for technical monitoring and performance',
      target: 'technical_team',
      widgets: [
        'performance_overview',
        'security_status',
        'system_health_summary',
        'recent_alerts',
        'accessibility_status'
      ],
      autoRefresh: 15, // 15 seconds
      alerting: true
    });

    // Compliance Officer Layout
    this.layouts.push({
      id: 'compliance_officer',
      name: 'Compliance Monitoring Dashboard',
      description: 'Dashboard for regulatory compliance monitoring',
      target: 'compliance_officer',
      widgets: [
        'compliance_dashboard',
        'audit_trail_completeness',
        'consent_management_events',
        'phi_access_violations',
        'encryption_status'
      ],
      autoRefresh: 300, // 5 minutes
      alerting: true
    });
  }

  /**
   * Get metric configuration by ID
   */
  public getMetric(id: string): DashboardMetric | undefined {
    return this.metrics.find(metric => metric.id === id);
  }

  /**
   * Get all metrics by category
   */
  public getMetricsByCategory(category: string): DashboardMetric[] {
    return this.metrics.filter(metric => metric.category === category);
  }

  /**
   * Get critical healthcare metrics
   */
  public getCriticalHealthcareMetrics(): DashboardMetric[] {
    return this.metrics.filter(metric => 
      metric.priority === 'critical' && 
      (metric.category === 'healthcare' || metric.category === 'security' || metric.category === 'compliance')
    );
  }

  /**
   * Get widget configuration by ID
   */
  public getWidget(id: string): DashboardWidget | undefined {
    return this.widgets.find(widget => widget.id === id);
  }

  /**
   * Get layout configuration by ID
   */
  public getLayout(id: string): DashboardLayout | undefined {
    return this.layouts.find(layout => layout.id === id);
  }

  /**
   * Get layout for specific user role
   */
  public getLayoutForRole(role: string): DashboardLayout | undefined {
    return this.layouts.find(layout => layout.target === role);
  }

  /**
   * Generate dashboard configuration for specific role
   */
  public generateDashboardConfig(role: string): any {
    const layout = this.getLayoutForRole(role);
    if (!layout) return null;

    const config = {
      layout: layout,
      widgets: layout.widgets.map(widgetId => this.getWidget(widgetId)).filter(Boolean),
      metrics: this.metrics.filter(metric => 
        layout.widgets.some(widgetId => {
          const widget = this.getWidget(widgetId);
          return widget?.metrics.includes(metric.id);
        })
      ),
      alerting: {
        enabled: layout.alerting,
        criticalMetrics: this.getCriticalHealthcareMetrics().map(m => m.id),
        thresholds: this.generateAlertThresholds(role)
      },
      autoRefresh: layout.autoRefresh,
      healthcareContext: this.generateHealthcareContext(role)
    };

    return config;
  }

  private generateAlertThresholds(role: string): Record<string, any> {
    const thresholds: Record<string, any> = {};

    this.metrics.forEach(metric => {
      if (metric.priority === 'critical' || metric.priority === 'high') {
        thresholds[metric.id] = {
          warning: metric.thresholds.warning,
          critical: metric.thresholds.critical,
          healthcareImpact: metric.healthcareRelevance
        };
      }
    });

    return thresholds;
  }

  private generateHealthcareContext(role: string): any {
    const contexts = {
      healthcare_admin: {
        focus: 'Overall healthcare system performance and compliance',
        criticalAreas: ['Patient safety', 'HIPAA compliance', 'System reliability'],
        responsibilities: ['System oversight', 'Compliance management', 'Performance optimization']
      },
      clinical_staff: {
        focus: 'Clinical features and patient safety tools',
        criticalAreas: ['Drug interactions', 'Emergency access', 'Clinical decision support'],
        responsibilities: ['Patient care', 'Clinical tool usage', 'Safety protocol adherence']
      },
      technical_team: {
        focus: 'System performance and technical operations',
        criticalAreas: ['Application performance', 'Security monitoring', 'System reliability'],
        responsibilities: ['System maintenance', 'Performance optimization', 'Security management']
      },
      compliance_officer: {
        focus: 'Regulatory compliance and audit requirements',
        criticalAreas: ['HIPAA compliance', 'Audit trails', 'Data protection'],
        responsibilities: ['Compliance monitoring', 'Audit management', 'Regulatory reporting']
      }
    };

    return contexts[role] || contexts.healthcare_admin;
  }

  /**
   * Get healthcare-specific alerting rules
   */
  public getHealthcareAlertingRules(): any[] {
    return [
      {
        id: 'emergency_access_critical',
        name: 'Critical Emergency Access Delay',
        condition: 'emergency_access_time > 2000',
        severity: 'critical',
        message: 'Emergency access time exceeds 2-second requirement',
        actions: ['immediate_notification', 'escalate_to_on_call', 'log_incident'],
        healthcareImpact: 'Life-threatening delay in emergency medical access'
      },
      {
        id: 'phi_access_violation',
        name: 'PHI Access Violation Detected',
        condition: 'phi_access_violations > 0',
        severity: 'critical',
        message: 'Unauthorized access to protected health information detected',
        actions: ['block_access', 'notify_security_team', 'create_audit_report'],
        healthcareImpact: 'HIPAA violation with potential legal consequences'
      },
      {
        id: 'encryption_failure',
        name: 'Healthcare Data Encryption Failure',
        condition: 'encryption_status < 100',
        severity: 'critical',
        message: 'Healthcare data encryption is compromised',
        actions: ['immediate_remediation', 'notify_compliance_officer', 'restrict_data_access'],
        healthcareImpact: 'PHI data at risk of unauthorized exposure'
      },
      {
        id: 'hipaa_compliance_low',
        name: 'HIPAA Compliance Score Below Threshold',
        condition: 'hipaa_compliance_score < 85',
        severity: 'high',
        message: 'HIPAA compliance score has fallen below acceptable threshold',
        actions: ['compliance_review', 'remediation_plan', 'notify_stakeholders'],
        healthcareImpact: 'Risk of regulatory non-compliance'
      },
      {
        id: 'clinical_feature_slow',
        name: 'Clinical Feature Performance Degradation',
        condition: 'clinical_feature_response > 10000',
        severity: 'high',
        message: 'Clinical decision support features responding slowly',
        actions: ['performance_investigation', 'optimize_clinical_services', 'notify_clinical_staff'],
        healthcareImpact: 'Delayed clinical decision making'
      },
      {
        id: 'accessibility_non_compliance',
        name: 'Accessibility Compliance Issues',
        condition: 'accessibility_compliance < 90',
        severity: 'medium',
        message: 'Healthcare accessibility compliance below standards',
        actions: ['accessibility_audit', 'remediation_plan', 'notify_development_team'],
        healthcareImpact: 'Reduced access for users with disabilities'
      }
    ];
  }

  /**
   * Generate comprehensive monitoring report
   */
  public generateMonitoringReport(): any {
    return {
      timestamp: new Date(),
      summary: {
        totalMetrics: this.metrics.length,
        criticalMetrics: this.metrics.filter(m => m.priority === 'critical').length,
        healthcareMetrics: this.metrics.filter(m => m.category === 'healthcare').length,
        securityMetrics: this.metrics.filter(m => m.category === 'security').length,
        complianceMetrics: this.metrics.filter(m => m.category === 'compliance').length
      },
      layouts: this.layouts.map(layout => ({
        id: layout.id,
        name: layout.name,
        target: layout.target,
        widgetCount: layout.widgets.length,
        autoRefresh: layout.autoRefresh
      })),
      criticalMetrics: this.getCriticalHealthcareMetrics(),
      alertingRules: this.getHealthcareAlertingRules(),
      healthcareContext: {
        complianceRequirements: ['HIPAA', 'GDPR', 'WCAG 2.2 AA'],
        clinicalSafetyFeatures: ['Drug interaction checking', 'Emergency access', 'Audit logging'],
        performanceRequirements: ['<2s emergency access', '<3s health data load', '<5s clinical features']
      }
    };
  }

  /**
   * Validate dashboard configuration
   */
  public validateConfiguration(): any {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    // Validate critical metrics coverage
    const criticalMetrics = this.getCriticalHealthcareMetrics();
    if (criticalMetrics.length < 5) {
      validation.warnings.push('Consider adding more critical healthcare metrics');
    }

    // Validate security metrics
    const securityMetrics = this.getMetricsByCategory('security');
    if (securityMetrics.length < 4) {
      validation.errors.push('Insufficient security metrics for healthcare compliance');
      validation.valid = false;
    }

    // Validate compliance metrics
    const complianceMetrics = this.getMetricsByCategory('compliance');
    if (complianceMetrics.length < 3) {
      validation.errors.push('Insufficient compliance metrics for HIPAA requirements');
      validation.valid = false;
    }

    // Validate emergency access monitoring
    const emergencyMetric = this.getMetric('emergency_access_time');
    if (!emergencyMetric || emergencyMetric.thresholds.critical > 2000) {
      validation.errors.push('Emergency access time threshold exceeds healthcare requirements');
      validation.valid = false;
    }

    // Validate layout coverage
    const requiredRoles = ['healthcare_admin', 'clinical_staff', 'compliance_officer'];
    const availableRoles = this.layouts.map(l => l.target);
    const missingRoles = requiredRoles.filter(role => !availableRoles.includes(role));
    
    if (missingRoles.length > 0) {
      validation.warnings.push(`Missing dashboard layouts for roles: ${missingRoles.join(', ')}`);
    }

    return validation;
  }
}

// Export singleton instance
export const healthcareDashboardConfig = new HealthcareDashboardConfig();

export default HealthcareDashboardConfig; 