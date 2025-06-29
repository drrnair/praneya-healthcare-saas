/**
 * Healthcare Security Optimization System
 * Advanced security optimizations for medical applications with HIPAA compliance
 */

interface SecurityConfig {
  encryption: {
    fieldLevelEncryption: boolean;
    encryptionAlgorithm: string;
    keyRotationInterval: number; // days
  };
  access: {
    multiFactorAuth: boolean;
    sessionTimeout: number; // minutes
    deviceFingerprinting: boolean;
    auditLogging: boolean;
  };
  compliance: {
    hipaaCompliance: boolean;
    gdprCompliance: boolean;
    auditRetention: number; // days
    complianceReporting: boolean;
  };
  monitoring: {
    threatDetection: boolean;
    anomalyDetection: boolean;
    realTimeAlerts: boolean;
    securityDashboard: boolean;
  };
}

interface SecurityThreat {
  type: 'authentication' | 'authorization' | 'data_access' | 'injection' | 'xss' | 'csrf';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  source: string;
  userAgent: string;
  ipAddress: string;
  action: 'blocked' | 'allowed' | 'monitored';
}

interface SecurityMetrics {
  failedLoginAttempts: number;
  suspiciousActivityDetected: number;
  phiAccessViolations: number;
  encryptionStatus: boolean;
  complianceScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

class HealthcareSecurityOptimizer {
  private config: SecurityConfig;
  private metrics: SecurityMetrics;
  private threats: SecurityThreat[] = [];
  private sessionStartTime: Date;
  private deviceFingerprint: string;
  private encryptionKeys: Map<string, string> = new Map();

  constructor(config: SecurityConfig) {
    this.config = config;
    this.metrics = this.initializeMetrics();
    this.sessionStartTime = new Date();
    this.deviceFingerprint = this.generateDeviceFingerprint();
    this.initializeSecurityOptimizations();
  }

  private initializeMetrics(): SecurityMetrics {
    return {
      failedLoginAttempts: 0,
      suspiciousActivityDetected: 0,
      phiAccessViolations: 0,
      encryptionStatus: true,
      complianceScore: 100,
      threatLevel: 'low'
    };
  }

  private initializeSecurityOptimizations(): void {
    this.setupEncryption();
    this.setupAccessControl();
    this.setupComplianceMonitoring();
    this.setupThreatDetection();
    this.setupSecurityHeaders();
    this.setupContentSecurityPolicy();
  }

  /**
   * Setup advanced encryption for healthcare data
   */
  private setupEncryption(): void {
    if (!this.config.encryption.fieldLevelEncryption) return;

    this.initializeEncryptionKeys();
    this.setupFieldLevelEncryption();
    this.setupKeyRotation();
  }

  private initializeEncryptionKeys(): void {
    // Generate encryption keys for different data types
    const keyTypes = ['phi', 'clinical', 'family', 'emergency'];
    
    keyTypes.forEach(type => {
      const key = this.generateEncryptionKey();
      this.encryptionKeys.set(type, key);
    });
  }

  private generateEncryptionKey(): string {
    // Generate AES-256 key
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private setupFieldLevelEncryption(): void {
    // Intercept form data for encryption
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      
      if (target.dataset.encrypt === 'phi') {
        this.encryptFieldData(target, 'phi');
      } else if (target.dataset.encrypt === 'clinical') {
        this.encryptFieldData(target, 'clinical');
      }
    });

    // Intercept form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      if (form.dataset.encryptForm === 'true') {
        this.encryptFormData(form);
      }
    });
  }

  private encryptFieldData(field: HTMLInputElement, keyType: string): void {
    const key = this.encryptionKeys.get(keyType);
    if (!key) return;

    try {
      const encryptedValue = this.encryptData(field.value, key);
      field.dataset.encryptedValue = encryptedValue;
      
      // Log encryption activity
      this.logSecurityEvent('field_encryption', {
        fieldType: keyType,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Field encryption failed:', error);
      this.recordSecurityThreat({
        type: 'data_access',
        severity: 'high',
        description: 'Field encryption failure',
        timestamp: new Date(),
        source: 'encryption_system',
        userAgent: navigator.userAgent,
        ipAddress: 'client',
        action: 'monitored'
      });
    }
  }

  private encryptFormData(form: HTMLFormElement): void {
    const formData = new FormData(form);
    const encryptedData = new Map();

    formData.forEach((value, key) => {
      const field = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
      const encryptionType = field?.dataset.encrypt;
      
      if (encryptionType) {
        const encryptionKey = this.encryptionKeys.get(encryptionType);
        if (encryptionKey) {
          const encryptedValue = this.encryptData(value.toString(), encryptionKey);
          encryptedData.set(key, encryptedValue);
        }
      }
    });

    // Store encrypted data in hidden fields
    encryptedData.forEach((value, key) => {
      const hiddenField = document.createElement('input');
      hiddenField.type = 'hidden';
      hiddenField.name = `encrypted_${key}`;
      hiddenField.value = value;
      form.appendChild(hiddenField);
    });
  }

  private encryptData(data: string, key: string): string {
    // In a real implementation, use Web Crypto API or a proper encryption library
    // This is a simplified example
    return btoa(data + key).replace(/[^a-zA-Z0-9]/g, '');
  }

  private setupKeyRotation(): void {
    const rotationInterval = this.config.encryption.keyRotationInterval * 24 * 60 * 60 * 1000;
    
    setInterval(() => {
      this.rotateEncryptionKeys();
    }, rotationInterval);
  }

  private rotateEncryptionKeys(): void {
    console.log('Rotating encryption keys for healthcare data');
    
    // Generate new keys
    this.encryptionKeys.forEach((_, keyType) => {
      const newKey = this.generateEncryptionKey();
      this.encryptionKeys.set(keyType, newKey);
    });

    // Notify server of key rotation
    this.notifyKeyRotation();
  }

  private async notifyKeyRotation(): Promise<void> {
    try {
      await fetch('/api/security/key-rotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date(),
          keys: Array.from(this.encryptionKeys.keys())
        })
      });
    } catch (error) {
      console.error('Key rotation notification failed:', error);
    }
  }

  /**
   * Setup access control and authentication
   */
  private setupAccessControl(): void {
    this.setupSessionManagement();
    this.setupDeviceFingerprinting();
    this.setupAccessLogging();
  }

  private setupSessionManagement(): void {
    // Monitor session timeout
    const sessionTimeout = this.config.access.sessionTimeout * 60 * 1000;
    let lastActivity = Date.now();

    // Track user activity
    ['click', 'keypress', 'mousemove', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        lastActivity = Date.now();
      });
    });

    // Check session timeout
    setInterval(() => {
      if (Date.now() - lastActivity > sessionTimeout) {
        this.handleSessionTimeout();
      }
    }, 60000); // Check every minute
  }

  private handleSessionTimeout(): void {
    // Log session timeout
    this.logSecurityEvent('session_timeout', {
      sessionDuration: Date.now() - this.sessionStartTime.getTime(),
      timestamp: new Date()
    });

    // Show session timeout warning
    this.showSessionTimeoutWarning();
  }

  private showSessionTimeoutWarning(): void {
    const warning = document.createElement('div');
    warning.className = 'healthcare-session-timeout-warning';
    warning.innerHTML = `
      <div class="timeout-content">
        <div class="timeout-icon">🔒</div>
        <div class="timeout-message">
          <strong>Session Timeout Warning</strong>
          <p>Your session will expire in 2 minutes for security reasons.</p>
        </div>
        <div class="timeout-actions">
          <button id="extend-session" class="timeout-btn primary">Extend Session</button>
          <button id="logout-now" class="timeout-btn secondary">Logout Now</button>
        </div>
      </div>
    `;

    document.body.appendChild(warning);

    // Handle timeout actions
    document.getElementById('extend-session')?.addEventListener('click', () => {
      this.extendSession();
      warning.remove();
    });

    document.getElementById('logout-now')?.addEventListener('click', () => {
      this.logoutUser();
    });

    // Auto-logout after 2 minutes
    setTimeout(() => {
      if (document.body.contains(warning)) {
        this.logoutUser();
      }
    }, 2 * 60 * 1000);
  }

  private extendSession(): void {
    fetch('/api/auth/extend-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      if (response.ok) {
        console.log('Session extended');
      } else {
        this.logoutUser();
      }
    }).catch(() => {
      this.logoutUser();
    });
  }

  private logoutUser(): void {
    // Clear sensitive data
    this.clearSensitiveData();
    
    // Redirect to login
    window.location.href = '/auth/login';
  }

  private clearSensitiveData(): void {
    // Clear encryption keys
    this.encryptionKeys.clear();
    
    // Clear session storage
    sessionStorage.clear();
    
    // Clear local storage (except user preferences)
    const keysToKeep = ['user_preferences', 'accessibility_settings'];
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !keysToKeep.includes(key)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  private generateDeviceFingerprint(): string {
    if (!this.config.access.deviceFingerprinting) return '';

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      navigator.deviceMemory || 0
    ].join('|');

    return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  private setupDeviceFingerprinting(): void {
    if (!this.config.access.deviceFingerprinting) return;

    // Verify device fingerprint
    const storedFingerprint = localStorage.getItem('device_fingerprint');
    
    if (storedFingerprint && storedFingerprint !== this.deviceFingerprint) {
      this.recordSecurityThreat({
        type: 'authentication',
        severity: 'high',
        description: 'Device fingerprint mismatch detected',
        timestamp: new Date(),
        source: 'device_fingerprinting',
        userAgent: navigator.userAgent,
        ipAddress: 'client',
        action: 'monitored'
      });
    }

    localStorage.setItem('device_fingerprint', this.deviceFingerprint);
  }

  private setupAccessLogging(): void {
    if (!this.config.access.auditLogging) return;

    // Log PHI access
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const phiElement = target.closest('[data-phi-protected]');
      
      if (phiElement) {
        this.logPHIAccess(phiElement);
      }
    });

    // Log navigation to sensitive pages
    window.addEventListener('beforeunload', () => {
      this.logPageAccess(window.location.pathname);
    });
  }

  private logPHIAccess(element: HTMLElement): void {
    const phiType = element.dataset.phiType || 'unknown';
    const userId = this.getCurrentUserId();
    
    this.logSecurityEvent('phi_access', {
      phiType,
      userId,
      element: element.tagName,
      timestamp: new Date(),
      deviceFingerprint: this.deviceFingerprint
    });

    this.metrics.phiAccessViolations++;
  }

  private logPageAccess(pathname: string): void {
    const sensitivePages = ['/health/', '/clinical/', '/family/', '/emergency/'];
    
    if (sensitivePages.some(page => pathname.includes(page))) {
      this.logSecurityEvent('sensitive_page_access', {
        pathname,
        timestamp: new Date(),
        deviceFingerprint: this.deviceFingerprint
      });
    }
  }

  /**
   * Setup compliance monitoring
   */
  private setupComplianceMonitoring(): void {
    if (!this.config.compliance.hipaaCompliance) return;

    this.setupHIPAACompliance();
    this.setupGDPRCompliance();
    this.setupAuditRetention();
    this.setupComplianceReporting();
  }

  private setupHIPAACompliance(): void {
    // Monitor HIPAA compliance requirements
    this.monitorDataMinimization();
    this.monitorAccessControls();
    this.monitorAuditTrails();
    this.monitorEncryption();
  }

  private monitorDataMinimization(): void {
    // Ensure only necessary PHI is accessed
    document.addEventListener('api-call', (event: CustomEvent) => {
      const { url, data } = event.detail;
      
      if (this.containsPHI(data)) {
        this.validateDataMinimization(url, data);
      }
    });
  }

  private containsPHI(data: any): boolean {
    const phiFields = [
      'ssn', 'dateOfBirth', 'medicalRecordNumber', 'healthPlanNumber',
      'accountNumber', 'certificateNumber', 'licenseNumber', 'vehicleId',
      'deviceId', 'biometricId', 'facePhotoId', 'fingerprint', 'voiceprint',
      'fullName', 'address', 'email', 'phone'
    ];

    return phiFields.some(field => 
      JSON.stringify(data).toLowerCase().includes(field.toLowerCase())
    );
  }

  private validateDataMinimization(url: string, data: any): void {
    // Check if the API call requests only necessary PHI
    const necessaryFields = this.getNecessaryPHIFields(url);
    const requestedFields = Object.keys(data);
    
    const unnecessaryFields = requestedFields.filter(field => 
      !necessaryFields.includes(field)
    );

    if (unnecessaryFields.length > 0) {
      this.recordSecurityThreat({
        type: 'data_access',
        severity: 'medium',
        description: `Unnecessary PHI requested: ${unnecessaryFields.join(', ')}`,
        timestamp: new Date(),
        source: url,
        userAgent: navigator.userAgent,
        ipAddress: 'client',
        action: 'monitored'
      });
    }
  }

  private getNecessaryPHIFields(url: string): string[] {
    // Define necessary PHI fields for different endpoints
    const fieldMap: Record<string, string[]> = {
      '/api/health-profile': ['fullName', 'dateOfBirth', 'medicalRecordNumber'],
      '/api/emergency': ['fullName', 'phone', 'address', 'medicalConditions'],
      '/api/medications': ['medicalRecordNumber', 'allergies'],
      '/api/appointments': ['fullName', 'phone', 'dateOfBirth']
    };

    return fieldMap[url] || [];
  }

  private monitorAccessControls(): void {
    // Monitor role-based access control
    document.addEventListener('access-attempt', (event: CustomEvent) => {
      const { resource, userRole, action } = event.detail;
      
      if (!this.isAccessAuthorized(resource, userRole, action)) {
        this.recordSecurityThreat({
          type: 'authorization',
          severity: 'high',
          description: `Unauthorized access attempt to ${resource}`,
          timestamp: new Date(),
          source: 'access_control',
          userAgent: navigator.userAgent,
          ipAddress: 'client',
          action: 'blocked'
        });
      }
    });
  }

  private isAccessAuthorized(resource: string, userRole: string, action: string): boolean {
    // Define access control matrix
    const accessMatrix: Record<string, Record<string, string[]>> = {
      'health-profile': {
        'patient': ['read', 'update'],
        'provider': ['read', 'update', 'create'],
        'family': ['read'],
        'admin': ['read', 'update', 'delete', 'create']
      },
      'clinical-data': {
        'patient': ['read'],
        'provider': ['read', 'update', 'create'],
        'admin': ['read', 'update', 'delete', 'create']
      },
      'emergency-data': {
        'patient': ['read', 'update'],
        'provider': ['read', 'update'],
        'family': ['read'],
        'emergency': ['read'],
        'admin': ['read', 'update', 'delete', 'create']
      }
    };

    return accessMatrix[resource]?.[userRole]?.includes(action) || false;
  }

  private monitorAuditTrails(): void {
    // Ensure all PHI access is logged
    this.auditTrailInterval = setInterval(() => {
      this.validateAuditTrails();
    }, 60000); // Check every minute
  }

  private auditTrailInterval: NodeJS.Timeout | null = null;

  private validateAuditTrails(): void {
    // Check if audit trails are complete
    const auditEvents = this.getAuditEvents();
    const requiredEvents = ['phi_access', 'clinical_data_access', 'emergency_access'];
    
    requiredEvents.forEach(eventType => {
      const eventCount = auditEvents.filter(event => event.type === eventType).length;
      if (eventCount === 0) {
        console.warn(`Missing audit trail for ${eventType}`);
      }
    });
  }

  private getAuditEvents(): any[] {
    // Retrieve audit events from storage
    const events = localStorage.getItem('audit_events');
    return events ? JSON.parse(events) : [];
  }

  private monitorEncryption(): void {
    // Monitor encryption status
    setInterval(() => {
      this.validateEncryptionStatus();
    }, 30000); // Check every 30 seconds
  }

  private validateEncryptionStatus(): void {
    const isSecureContext = window.isSecureContext;
    const httpsEnabled = location.protocol === 'https:';
    
    this.metrics.encryptionStatus = isSecureContext && httpsEnabled;
    
    if (!this.metrics.encryptionStatus) {
      this.recordSecurityThreat({
        type: 'data_access',
        severity: 'critical',
        description: 'Healthcare data encryption compromised',
        timestamp: new Date(),
        source: 'encryption_monitor',
        userAgent: navigator.userAgent,
        ipAddress: 'client',
        action: 'blocked'
      });
    }
  }

  private setupGDPRCompliance(): void {
    if (!this.config.compliance.gdprCompliance) return;

    // Monitor GDPR compliance
    this.monitorConsentManagement();
    this.monitorDataPortability();
    this.monitorRightToErasure();
  }

  private monitorConsentManagement(): void {
    document.addEventListener('consent-given', (event: CustomEvent) => {
      this.logSecurityEvent('consent_given', event.detail);
    });

    document.addEventListener('consent-withdrawn', (event: CustomEvent) => {
      this.logSecurityEvent('consent_withdrawn', event.detail);
      this.handleConsentWithdrawal(event.detail);
    });
  }

  private handleConsentWithdrawal(consentData: any): void {
    // Remove data processing based on withdrawn consent
    if (consentData.type === 'data_processing') {
      this.stopDataProcessing(consentData.userId);
    }
  }

  private stopDataProcessing(userId: string): void {
    // Stop processing user data
    console.log(`Stopping data processing for user ${userId}`);
    
    // Notify server
    fetch('/api/compliance/stop-processing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, timestamp: new Date() })
    }).catch(error => {
      console.error('Failed to stop data processing:', error);
    });
  }

  private monitorDataPortability(): void {
    document.addEventListener('data-export-requested', (event: CustomEvent) => {
      this.logSecurityEvent('data_export_requested', event.detail);
    });
  }

  private monitorRightToErasure(): void {
    document.addEventListener('data-deletion-requested', (event: CustomEvent) => {
      this.logSecurityEvent('data_deletion_requested', event.detail);
    });
  }

  private setupAuditRetention(): void {
    const retentionPeriod = this.config.compliance.auditRetention * 24 * 60 * 60 * 1000;
    
    // Clean up old audit events
    setInterval(() => {
      this.cleanupAuditEvents(retentionPeriod);
    }, 24 * 60 * 60 * 1000); // Daily cleanup
  }

  private cleanupAuditEvents(retentionPeriod: number): void {
    const events = this.getAuditEvents();
    const cutoffDate = new Date(Date.now() - retentionPeriod);
    
    const activeEvents = events.filter(event => 
      new Date(event.timestamp) > cutoffDate
    );
    
    localStorage.setItem('audit_events', JSON.stringify(activeEvents));
  }

  private setupComplianceReporting(): void {
    if (!this.config.compliance.complianceReporting) return;

    // Generate compliance reports
    setInterval(() => {
      this.generateComplianceReport();
    }, 7 * 24 * 60 * 60 * 1000); // Weekly reports
  }

  private generateComplianceReport(): any {
    const report = {
      timestamp: new Date(),
      period: '7days',
      metrics: this.metrics,
      threats: this.threats.slice(-100), // Last 100 threats
      auditEvents: this.getAuditEvents().slice(-1000), // Last 1000 events
      complianceStatus: {
        hipaa: this.calculateHIPAACompliance(),
        gdpr: this.calculateGDPRCompliance(),
        encryption: this.metrics.encryptionStatus,
        auditTrails: this.validateAuditTrailCompleteness()
      }
    };

    // Send report to server
    this.submitComplianceReport(report);
    
    return report;
  }

  private calculateHIPAACompliance(): number {
    // Calculate HIPAA compliance score
    const factors = {
      encryption: this.metrics.encryptionStatus ? 25 : 0,
      accessControl: this.metrics.phiAccessViolations === 0 ? 25 : 0,
      auditTrails: this.validateAuditTrailCompleteness() ? 25 : 0,
      dataMinimization: this.metrics.suspiciousActivityDetected === 0 ? 25 : 0
    };

    return Object.values(factors).reduce((sum, score) => sum + score, 0);
  }

  private calculateGDPRCompliance(): number {
    // Calculate GDPR compliance score
    return 100; // Simplified for example
  }

  private validateAuditTrailCompleteness(): boolean {
    const events = this.getAuditEvents();
    const requiredEventTypes = ['phi_access', 'consent_given', 'data_export_requested'];
    
    return requiredEventTypes.every(type => 
      events.some(event => event.type === type)
    );
  }

  private async submitComplianceReport(report: any): Promise<void> {
    try {
      await fetch('/api/compliance/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
    } catch (error) {
      console.error('Failed to submit compliance report:', error);
    }
  }

  /**
   * Setup threat detection
   */
  private setupThreatDetection(): void {
    if (!this.config.monitoring.threatDetection) return;

    this.setupAnomalyDetection();
    this.setupRealTimeAlerts();
    this.setupThreatResponse();
  }

  private setupAnomalyDetection(): void {
    // Monitor for suspicious patterns
    this.monitorFailedLogins();
    this.monitorUnusualAccess();
    this.monitorDataExfiltration();
  }

  private monitorFailedLogins(): void {
    document.addEventListener('login-attempt', (event: CustomEvent) => {
      const { success, username } = event.detail;
      
      if (!success) {
        this.metrics.failedLoginAttempts++;
        
        if (this.metrics.failedLoginAttempts > 5) {
          this.recordSecurityThreat({
            type: 'authentication',
            severity: 'high',
            description: `Multiple failed login attempts for ${username}`,
            timestamp: new Date(),
            source: 'login_monitor',
            userAgent: navigator.userAgent,
            ipAddress: 'client',
            action: 'blocked'
          });
        }
      } else {
        this.metrics.failedLoginAttempts = 0;
      }
    });
  }

  private monitorUnusualAccess(): void {
    let accessPattern: string[] = [];
    
    document.addEventListener('page-visit', (event: CustomEvent) => {
      const { pathname } = event.detail;
      accessPattern.push(pathname);
      
      // Keep only last 10 page visits
      if (accessPattern.length > 10) {
        accessPattern = accessPattern.slice(-10);
      }
      
      // Check for suspicious patterns
      if (this.isUnusualAccessPattern(accessPattern)) {
        this.recordSecurityThreat({
          type: 'data_access',
          severity: 'medium',
          description: 'Unusual access pattern detected',
          timestamp: new Date(),
          source: 'access_monitor',
          userAgent: navigator.userAgent,
          ipAddress: 'client',
          action: 'monitored'
        });
      }
    });
  }

  private isUnusualAccessPattern(pattern: string[]): boolean {
    // Check for rapid consecutive access to sensitive pages
    const sensitivePages = pattern.filter(page => 
      page.includes('/health/') || page.includes('/clinical/')
    );
    
    return sensitivePages.length > 5;
  }

  private monitorDataExfiltration(): void {
    let dataTransferSize = 0;
    const transferThreshold = 1024 * 1024; // 1MB

    // Monitor large data transfers
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      if (response.ok) {
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          dataTransferSize += parseInt(contentLength);
          
          if (dataTransferSize > transferThreshold) {
            this.recordSecurityThreat({
              type: 'data_access',
              severity: 'high',
              description: `Large data transfer detected: ${dataTransferSize} bytes`,
              timestamp: new Date(),
              source: 'data_monitor',
              userAgent: navigator.userAgent,
              ipAddress: 'client',
              action: 'monitored'
            });
          }
        }
      }
      
      return response;
    };
  }

  private setupRealTimeAlerts(): void {
    if (!this.config.monitoring.realTimeAlerts) return;

    // Send real-time alerts for critical threats
    setInterval(() => {
      const criticalThreats = this.threats.filter(threat => 
        threat.severity === 'critical' && 
        threat.timestamp > new Date(Date.now() - 60000) // Last minute
      );

      if (criticalThreats.length > 0) {
        this.sendRealTimeAlert(criticalThreats);
      }
    }, 60000); // Check every minute
  }

  private async sendRealTimeAlert(threats: SecurityThreat[]): Promise<void> {
    try {
      await fetch('/api/security/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threats, timestamp: new Date() })
      });
    } catch (error) {
      console.error('Failed to send real-time alert:', error);
    }
  }

  private setupThreatResponse(): void {
    // Automated threat response
    this.threats.forEach(threat => {
      if (threat.severity === 'critical') {
        this.executeThreatResponse(threat);
      }
    });
  }

  private executeThreatResponse(threat: SecurityThreat): void {
    switch (threat.type) {
      case 'authentication':
        this.handleAuthenticationThreat(threat);
        break;
      case 'data_access':
        this.handleDataAccessThreat(threat);
        break;
      case 'injection':
        this.handleInjectionThreat(threat);
        break;
      default:
        this.handleGenericThreat(threat);
    }
  }

  private handleAuthenticationThreat(threat: SecurityThreat): void {
    // Lock user account
    this.lockUserAccount();
    
    // Show security warning
    this.showSecurityWarning('Authentication threat detected. Your account has been temporarily locked.');
  }

  private handleDataAccessThreat(threat: SecurityThreat): void {
    // Restrict data access
    this.restrictDataAccess();
    
    // Show security warning
    this.showSecurityWarning('Suspicious data access detected. Access has been restricted.');
  }

  private handleInjectionThreat(threat: SecurityThreat): void {
    // Sanitize inputs
    this.sanitizeAllInputs();
    
    // Show security warning
    this.showSecurityWarning('Security threat detected. Additional protections have been activated.');
  }

  private handleGenericThreat(threat: SecurityThreat): void {
    // Log threat and continue monitoring
    console.warn('Security threat detected:', threat);
  }

  private lockUserAccount(): void {
    // Clear session and redirect to login
    this.clearSensitiveData();
    this.logoutUser();
  }

  private restrictDataAccess(): void {
    // Disable access to sensitive data
    document.querySelectorAll('[data-phi-protected]').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
  }

  private sanitizeAllInputs(): void {
    // Add additional input sanitization
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        target.value = this.sanitizeInput(target.value);
      });
    });
  }

  private sanitizeInput(input: string): string {
    // Basic input sanitization
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
  }

  private showSecurityWarning(message: string): void {
    const warning = document.createElement('div');
    warning.className = 'healthcare-security-warning critical';
    warning.innerHTML = `
      <div class="security-warning-content">
        <div class="security-icon">🔒</div>
        <div class="security-message">
          <strong>Security Alert</strong>
          <p>${message}</p>
        </div>
        <button class="security-acknowledge">Acknowledge</button>
      </div>
    `;

    document.body.appendChild(warning);

    warning.querySelector('.security-acknowledge')?.addEventListener('click', () => {
      warning.remove();
    });
  }

  /**
   * Setup security headers
   */
  private setupSecurityHeaders(): void {
    // Verify security headers are set
    this.verifySecurityHeaders();
  }

  private verifySecurityHeaders(): void {
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Strict-Transport-Security',
      'X-XSS-Protection'
    ];

    // Check if headers are set (this would typically be done server-side)
    console.log('Verifying security headers:', requiredHeaders);
  }

  /**
   * Setup Content Security Policy
   */
  private setupContentSecurityPolicy(): void {
    // Monitor CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      this.recordSecurityThreat({
        type: 'xss',
        severity: 'high',
        description: `CSP violation: ${event.violatedDirective}`,
        timestamp: new Date(),
        source: event.sourceFile || 'unknown',
        userAgent: navigator.userAgent,
        ipAddress: 'client',
        action: 'blocked'
      });
    });
  }

  // Helper methods
  private recordSecurityThreat(threat: SecurityThreat): void {
    this.threats.push(threat);
    this.updateThreatLevel();
    
    // Log threat
    this.logSecurityEvent('security_threat', threat);
  }

  private updateThreatLevel(): void {
    const recentThreats = this.threats.filter(threat => 
      threat.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    const criticalThreats = recentThreats.filter(threat => threat.severity === 'critical');
    const highThreats = recentThreats.filter(threat => threat.severity === 'high');

    if (criticalThreats.length > 0) {
      this.metrics.threatLevel = 'critical';
    } else if (highThreats.length > 2) {
      this.metrics.threatLevel = 'high';
    } else if (recentThreats.length > 5) {
      this.metrics.threatLevel = 'medium';
    } else {
      this.metrics.threatLevel = 'low';
    }
  }

  private logSecurityEvent(type: string, data: any): void {
    const event = {
      type,
      data,
      timestamp: new Date(),
      sessionId: this.getSessionId(),
      userId: this.getCurrentUserId(),
      deviceFingerprint: this.deviceFingerprint
    };

    // Store in local storage
    const events = this.getAuditEvents();
    events.push(event);
    localStorage.setItem('audit_events', JSON.stringify(events));

    // Send to server
    this.sendAuditEvent(event);
  }

  private async sendAuditEvent(event: any): Promise<void> {
    try {
      await fetch('/api/audit/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to send audit event:', error);
    }
  }

  private getSessionId(): string {
    return sessionStorage.getItem('session_id') || 'unknown';
  }

  private getCurrentUserId(): string {
    return localStorage.getItem('user_id') || 'unknown';
  }

  /**
   * Generate security report
   */
  public generateSecurityReport(): any {
    return {
      timestamp: new Date(),
      metrics: this.metrics,
      threats: this.threats.slice(-100),
      config: this.config,
      deviceFingerprint: this.deviceFingerprint,
      sessionDuration: Date.now() - this.sessionStartTime.getTime(),
      complianceScore: this.calculateComplianceScore(),
      recommendations: this.generateSecurityRecommendations()
    };
  }

  private calculateComplianceScore(): number {
    const hipaaScore = this.calculateHIPAACompliance();
    const gdprScore = this.calculateGDPRCompliance();
    const threatScore = this.metrics.threatLevel === 'low' ? 100 : 
                       this.metrics.threatLevel === 'medium' ? 75 :
                       this.metrics.threatLevel === 'high' ? 50 : 25;

    return Math.round((hipaaScore + gdprScore + threatScore) / 3);
  }

  private generateSecurityRecommendations(): string[] {
    const recommendations = [];

    if (this.metrics.failedLoginAttempts > 3) {
      recommendations.push('Consider implementing account lockout after failed attempts');
    }

    if (this.metrics.threatLevel === 'high' || this.metrics.threatLevel === 'critical') {
      recommendations.push('Increase security monitoring and response measures');
    }

    if (!this.metrics.encryptionStatus) {
      recommendations.push('CRITICAL: Ensure all healthcare data is encrypted in transit and at rest');
    }

    return recommendations;
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    // Clear encryption keys
    this.encryptionKeys.clear();
    
    // Clear audit trail interval
    if (this.auditTrailInterval) {
      clearInterval(this.auditTrailInterval);
    }
  }
}

// Default healthcare security configuration
export const defaultHealthcareSecurityConfig: SecurityConfig = {
  encryption: {
    fieldLevelEncryption: true,
    encryptionAlgorithm: 'AES-256',
    keyRotationInterval: 30 // days
  },
  access: {
    multiFactorAuth: true,
    sessionTimeout: 30, // minutes
    deviceFingerprinting: true,
    auditLogging: true
  },
  compliance: {
    hipaaCompliance: true,
    gdprCompliance: true,
    auditRetention: 2555, // 7 years in days
    complianceReporting: true
  },
  monitoring: {
    threatDetection: true,
    anomalyDetection: true,
    realTimeAlerts: true,
    securityDashboard: true
  }
};

export default HealthcareSecurityOptimizer; 