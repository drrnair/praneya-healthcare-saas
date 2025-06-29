/**
 * Healthcare Performance Optimization System
 * Advanced performance optimization for medical applications
 */

interface OptimizationConfig {
  healthcare: {
    emergencyAccessThreshold: number; // ms
    healthDataLoadThreshold: number; // ms
    clinicalFeatureThreshold: number; // ms
  };
  caching: {
    enableHealthcareCache: boolean;
    phiCachePolicy: 'never' | 'encrypted-only';
    emergencyDataCache: boolean;
  };
  prefetching: {
    criticalHealthData: boolean;
    familyData: boolean;
    emergencyProtocols: boolean;
  };
}

interface PerformanceMetrics {
  bundleSize: number;
  initialLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

class HealthcarePerformanceOptimizer {
  private config: OptimizationConfig;
  private metrics: PerformanceMetrics;
  private resourceHints: Map<string, HTMLLinkElement> = new Map();
  private criticalResources: Set<string> = new Set();

  constructor(config: OptimizationConfig) {
    this.config = config;
    this.metrics = this.initializeMetrics();
    this.initializeOptimizations();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      bundleSize: 0,
      initialLoadTime: 0,
      timeToInteractive: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0
    };
  }

  private initializeOptimizations(): void {
    this.setupCriticalResourceIdentification();
    this.setupLazyLoading();
    this.setupCodeSplitting();
    this.setupImageOptimization();
    this.setupCacheOptimization();
    this.setupPrefetching();
  }

  /**
   * Setup critical resource identification for healthcare workflows
   */
  private setupCriticalResourceIdentification(): void {
    // Identify critical healthcare resources
    this.criticalResources.add('/api/emergency/protocols');
    this.criticalResources.add('/api/health-profile/critical');
    this.criticalResources.add('/api/clinical/drug-interactions');
    this.criticalResources.add('/styles/healthcare-critical.css');
    this.criticalResources.add('/js/emergency-functions.js');

    // Preload critical resources
    this.criticalResources.forEach(resource => {
      this.preloadResource(resource, this.getResourceType(resource));
    });
  }

  private preloadResource(url: string, type: 'script' | 'style' | 'fetch'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (type === 'fetch') {
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
    this.resourceHints.set(url, link);
  }

  private getResourceType(url: string): 'script' | 'style' | 'fetch' {
    if (url.endsWith('.js')) return 'script';
    if (url.endsWith('.css')) return 'style';
    return 'fetch';
  }

  /**
   * Setup intelligent lazy loading with healthcare priorities
   */
  private setupLazyLoading(): void {
    // Healthcare-aware intersection observer
    const healthcareObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            
            // Prioritize healthcare content loading
            if (element.dataset.healthcarePriority === 'high') {
              this.loadHealthcareContent(element);
            } else if (element.dataset.healthcarePriority === 'emergency') {
              this.loadEmergencyContent(element);
            } else {
              this.loadStandardContent(element);
            }
            
            healthcareObserver.unobserve(element);
          }
        });
      },
      {
        // Healthcare-specific thresholds
        rootMargin: '50px 0px', // Load earlier for healthcare content
        threshold: 0.1
      }
    );

    // Observe healthcare content containers
    document.querySelectorAll('[data-lazy-healthcare]').forEach(element => {
      healthcareObserver.observe(element);
    });
  }

  private async loadHealthcareContent(element: HTMLElement): Promise<void> {
    const contentType = element.dataset.contentType;
    const startTime = performance.now();

    try {
      switch (contentType) {
        case 'health-profile':
          await this.loadHealthProfile(element);
          break;
        case 'clinical-data':
          await this.loadClinicalData(element);
          break;
        case 'medication-list':
          await this.loadMedicationData(element);
          break;
        default:
          await this.loadGenericContent(element);
      }

      const loadTime = performance.now() - startTime;
      
      if (loadTime > this.config.healthcare.healthDataLoadThreshold) {
        console.warn(`Healthcare content loaded slowly: ${loadTime}ms for ${contentType}`);
      }
    } catch (error) {
      console.error('Failed to load healthcare content:', error);
      this.showHealthcareErrorFallback(element);
    }
  }

  private async loadEmergencyContent(element: HTMLElement): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Emergency content must load within 2 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Emergency content timeout')), 2000);
      });

      const contentPromise = this.loadGenericContent(element);
      
      await Promise.race([contentPromise, timeoutPromise]);
      
      const loadTime = performance.now() - startTime;
      
      if (loadTime > this.config.healthcare.emergencyAccessThreshold) {
        console.error(`CRITICAL: Emergency content exceeded threshold: ${loadTime}ms`);
      }
    } catch (error) {
      console.error('Emergency content failed to load:', error);
      this.showEmergencyErrorFallback(element);
    }
  }

  private async loadStandardContent(element: HTMLElement): Promise<void> {
    try {
      await this.loadGenericContent(element);
    } catch (error) {
      console.warn('Standard content failed to load:', error);
    }
  }

  private async loadGenericContent(element: HTMLElement): Promise<void> {
    const src = element.dataset.src;
    if (!src) return;

    if (element.tagName === 'IMG') {
      await this.loadImage(element as HTMLImageElement, src);
    } else {
      const response = await fetch(src);
      const content = await response.text();
      element.innerHTML = content;
    }
  }

  private async loadImage(img: HTMLImageElement, src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        img.src = src;
        img.classList.add('loaded');
        resolve();
      };
      image.onerror = reject;
      image.src = src;
    });
  }

  private async loadHealthProfile(element: HTMLElement): Promise<void> {
    const profileId = element.dataset.profileId;
    if (!profileId) return;

    const response = await fetch(`/api/health-profile/${profileId}`);
    const profileData = await response.json();
    
    // Render health profile with proper security
    this.renderSecureHealthContent(element, profileData);
  }

  private async loadClinicalData(element: HTMLElement): Promise<void> {
    const dataType = element.dataset.clinicalType;
    if (!dataType) return;

    const response = await fetch(`/api/clinical-data/${dataType}`);
    const clinicalData = await response.json();
    
    // Render clinical data with audit logging
    this.renderClinicalContent(element, clinicalData);
  }

  private async loadMedicationData(element: HTMLElement): Promise<void> {
    const patientId = element.dataset.patientId;
    if (!patientId) return;

    const response = await fetch(`/api/medications/${patientId}`);
    const medications = await response.json();
    
    // Check for drug interactions while rendering
    this.renderMedicationContent(element, medications);
  }

  private renderSecureHealthContent(element: HTMLElement, data: any): void {
    // Add PHI protection markers
    element.setAttribute('data-phi-protected', 'true');
    element.setAttribute('data-phi-type', 'health-profile');
    
    // Log PHI access
    document.dispatchEvent(new CustomEvent('health-profile-viewed', {
      detail: { userId: data.userId, timestamp: new Date() }
    }));
    
    // Render content with security
    element.innerHTML = this.createSecureHealthHTML(data);
  }

  private renderClinicalContent(element: HTMLElement, data: any): void {
    element.setAttribute('data-phi-protected', 'true');
    element.setAttribute('data-phi-type', 'clinical-data');
    
    document.dispatchEvent(new CustomEvent('clinical-data-accessed', {
      detail: { dataType: data.type, timestamp: new Date() }
    }));
    
    element.innerHTML = this.createClinicalHTML(data);
  }

  private renderMedicationContent(element: HTMLElement, medications: any[]): void {
    element.setAttribute('data-phi-protected', 'true');
    element.setAttribute('data-phi-type', 'medication-data');
    
    // Check for drug interactions
    this.checkDrugInteractions(medications);
    
    element.innerHTML = this.createMedicationHTML(medications);
  }

  private createSecureHealthHTML(data: any): string {
    return `
      <div class="health-profile-secure">
        <div class="health-metrics">
          ${data.metrics ? this.createMetricsHTML(data.metrics) : ''}
        </div>
        <div class="health-conditions">
          ${data.conditions ? this.createConditionsHTML(data.conditions) : ''}
        </div>
      </div>
    `;
  }

  private createClinicalHTML(data: any): string {
    return `
      <div class="clinical-data">
        <div class="clinical-header">
          <h3>${data.title}</h3>
          <span class="clinical-date">${new Date(data.date).toLocaleDateString()}</span>
        </div>
        <div class="clinical-content">${data.content}</div>
      </div>
    `;
  }

  private createMedicationHTML(medications: any[]): string {
    return `
      <div class="medication-list">
        ${medications.map(med => `
          <div class="medication-item" data-medication-id="${med.id}">
            <div class="medication-name">${med.name}</div>
            <div class="medication-dosage">${med.dosage}</div>
            <div class="medication-frequency">${med.frequency}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private createMetricsHTML(metrics: any): string {
    return Object.entries(metrics).map(([key, value]) => `
      <div class="metric-item">
        <span class="metric-label">${key}</span>
        <span class="metric-value">${value}</span>
      </div>
    `).join('');
  }

  private createConditionsHTML(conditions: any[]): string {
    return conditions.map(condition => `
      <div class="condition-item">
        <span class="condition-name">${condition.name}</span>
        <span class="condition-status">${condition.status}</span>
      </div>
    `).join('');
  }

  private async checkDrugInteractions(medications: any[]): Promise<void> {
    try {
      const response = await fetch('/api/clinical/drug-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications })
      });
      
      const interactions = await response.json();
      
      if (interactions.hasInteractions) {
        this.showDrugInteractionWarning(interactions.interactions);
      }
    } catch (error) {
      console.error('Drug interaction check failed:', error);
    }
  }

  private showDrugInteractionWarning(interactions: any[]): void {
    const warning = document.createElement('div');
    warning.className = 'drug-interaction-warning';
    warning.innerHTML = `
      <div class="warning-header">⚠️ Drug Interaction Warning</div>
      <div class="warning-content">
        ${interactions.map(interaction => `
          <div class="interaction-item">
            <strong>${interaction.drugs.join(' + ')}</strong>
            <p>${interaction.description}</p>
            <span class="severity-${interaction.severity}">${interaction.severity.toUpperCase()}</span>
          </div>
        `).join('')}
      </div>
    `;
    
    document.body.appendChild(warning);
    
    // Auto-remove after 10 seconds for non-critical interactions
    setTimeout(() => {
      if (warning && !interactions.some(i => i.severity === 'critical')) {
        warning.remove();
      }
    }, 10000);
  }

  private showHealthcareErrorFallback(element: HTMLElement): void {
    element.innerHTML = `
      <div class="healthcare-error-fallback">
        <div class="error-icon">⚠️</div>
        <div class="error-message">Healthcare data temporarily unavailable</div>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }

  private showEmergencyErrorFallback(element: HTMLElement): void {
    element.innerHTML = `
      <div class="emergency-error-fallback critical">
        <div class="error-icon">🚨</div>
        <div class="error-message">EMERGENCY: Unable to load critical data</div>
        <div class="emergency-contact">Call 911 if this is a medical emergency</div>
        <button onclick="location.reload()" class="emergency-retry">RETRY NOW</button>
      </div>
    `;
  }

  /**
   * Setup code splitting for healthcare workflows
   */
  private setupCodeSplitting(): void {
    // Dynamic imports for healthcare modules
    this.defineHealthcareModules();
  }

  private defineHealthcareModules(): void {
    // Emergency module - always preloaded
    this.preloadModule('emergency');
    
    // Clinical modules - loaded on demand
    this.defineLazyModule('clinical-interfaces', () => import('@/lib/clinical-interfaces'));
    this.defineLazyModule('drug-interactions', () => import('@/lib/clinical/drug-interactions'));
    this.defineLazyModule('health-analytics', () => import('@/lib/analytics/health-analytics'));
    
    // Family modules - loaded when family features accessed
    this.defineLazyModule('family-management', () => import('@/lib/family-management'));
    
    // Visualization modules - loaded when charts accessed
    this.defineLazyModule('health-charts', () => import('@/lib/data-visualization'));
  }

  private async preloadModule(moduleName: string): Promise<void> {
    try {
      switch (moduleName) {
        case 'emergency':
          await import('@/lib/emergency');
          break;
        default:
          console.warn(`Unknown preload module: ${moduleName}`);
      }
    } catch (error) {
      console.error(`Failed to preload module ${moduleName}:`, error);
    }
  }

  private defineLazyModule(moduleName: string, importFn: () => Promise<any>): void {
    (window as any).__healthcareModules = (window as any).__healthcareModules || {};
    (window as any).__healthcareModules[moduleName] = importFn;
  }

  /**
   * Setup image optimization for medical imagery
   */
  private setupImageOptimization(): void {
    // Medical image optimization settings
    this.observeMedicalImages();
  }

  private observeMedicalImages(): void {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          this.optimizeMedicalImage(img);
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-medical-image]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  private optimizeMedicalImage(img: HTMLImageElement): void {
    const originalSrc = img.dataset.src;
    if (!originalSrc) return;

    // For medical images, preserve quality while optimizing format
    const optimizedSrc = this.generateOptimizedImageUrl(originalSrc, {
      quality: 90, // High quality for medical imagery
      format: 'webp',
      fallback: 'jpeg'
    });

    img.src = optimizedSrc;
    img.classList.add('medical-image-loaded');
  }

  private generateOptimizedImageUrl(src: string, options: any): string {
    const params = new URLSearchParams({
      url: src,
      q: options.quality.toString(),
      f: options.format
    });

    return `/api/optimize-image?${params.toString()}`;
  }

  /**
   * Setup cache optimization with healthcare considerations
   */
  private setupCacheOptimization(): void {
    if (!this.config.caching.enableHealthcareCache) return;

    this.setupServiceWorkerCache();
    this.setupMemoryCache();
  }

  private setupServiceWorkerCache(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/healthcare-sw.js')
        .then(registration => {
          console.log('Healthcare Service Worker registered');
          this.configureHealthcareCaching(registration);
        })
        .catch(error => {
          console.error('Healthcare Service Worker registration failed:', error);
        });
    }
  }

  private configureHealthcareCaching(registration: ServiceWorkerRegistration): void {
    // Configure caching strategies for healthcare data
    registration.addEventListener('message', (event) => {
      if (event.data.type === 'CACHE_CONFIG') {
        event.ports[0].postMessage({
          phiCachePolicy: this.config.caching.phiCachePolicy,
          emergencyDataCache: this.config.caching.emergencyDataCache
        });
      }
    });
  }

  private setupMemoryCache(): void {
    // In-memory cache for frequently accessed healthcare data
    const healthcareCache = new Map();
    
    // Cache emergency protocols
    if (this.config.caching.emergencyDataCache) {
      this.cacheEmergencyProtocols(healthcareCache);
    }
  }

  private async cacheEmergencyProtocols(cache: Map<string, any>): Promise<void> {
    try {
      const response = await fetch('/api/emergency/protocols');
      const protocols = await response.json();
      cache.set('emergency-protocols', protocols);
    } catch (error) {
      console.error('Failed to cache emergency protocols:', error);
    }
  }

  /**
   * Setup intelligent prefetching
   */
  private setupPrefetching(): void {
    this.setupPredictivePrefetching();
    this.setupHealthcarePrefetching();
  }

  private setupPredictivePrefetching(): void {
    // Predict next healthcare actions based on user behavior
    let currentSection = '';
    
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const section = target.closest('[data-healthcare-section]')?.getAttribute('data-healthcare-section');
      
      if (section && section !== currentSection) {
        currentSection = section;
        this.prefetchRelatedHealthcareContent(section);
      }
    });
  }

  private prefetchRelatedHealthcareContent(section: string): void {
    const prefetchMap: Record<string, string[]> = {
      'health-profile': ['/api/health-metrics', '/api/recent-activities'],
      'medications': ['/api/drug-interactions', '/api/medication-reminders'],
      'family': ['/api/family-members', '/api/shared-health-data'],
      'emergency': ['/api/emergency/contacts', '/api/emergency/medical-info']
    };

    const urlsToPrefetch = prefetchMap[section] || [];
    
    urlsToPrefetch.forEach(url => {
      this.prefetchURL(url);
    });
  }

  private prefetchURL(url: string): void {
    if (this.resourceHints.has(url)) return;

    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    
    document.head.appendChild(link);
    this.resourceHints.set(url, link);
  }

  private setupHealthcarePrefetching(): void {
    if (this.config.prefetching.criticalHealthData) {
      this.prefetchCriticalHealthData();
    }

    if (this.config.prefetching.familyData) {
      this.prefetchFamilyData();
    }

    if (this.config.prefetching.emergencyProtocols) {
      this.prefetchEmergencyProtocols();
    }
  }

  private prefetchCriticalHealthData(): void {
    // Prefetch critical health data during idle time
    requestIdleCallback(() => {
      this.prefetchURL('/api/health-profile/critical');
      this.prefetchURL('/api/medications/critical');
      this.prefetchURL('/api/allergies');
    });
  }

  private prefetchFamilyData(): void {
    requestIdleCallback(() => {
      this.prefetchURL('/api/family/members');
      this.prefetchURL('/api/family/permissions');
    });
  }

  private prefetchEmergencyProtocols(): void {
    // Emergency protocols should be prefetched immediately
    this.prefetchURL('/api/emergency/protocols');
    this.prefetchURL('/api/emergency/contacts');
  }

  /**
   * Performance metrics collection
   */
  public collectMetrics(): PerformanceMetrics {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      this.metrics.initialLoadTime = navigation.loadEventEnd - navigation.navigationStart;
      this.metrics.timeToInteractive = navigation.domInteractive - navigation.navigationStart;
    }

    // Collect paint metrics
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      if (entry.name === 'first-contentful-paint') {
        this.metrics.firstContentfulPaint = entry.startTime;
      }
    });

    return { ...this.metrics };
  }

  /**
   * Generate optimization report
   */
  public generateOptimizationReport(): any {
    return {
      timestamp: new Date(),
      metrics: this.collectMetrics(),
      config: this.config,
      resourceHints: Array.from(this.resourceHints.keys()),
      criticalResources: Array.from(this.criticalResources),
      recommendations: this.generateOptimizationRecommendations()
    };
  }

  private generateOptimizationRecommendations(): string[] {
    const recommendations = [];
    const metrics = this.collectMetrics();

    if (metrics.initialLoadTime > 3000) {
      recommendations.push('Reduce initial bundle size for faster healthcare app loading');
    }

    if (metrics.firstContentfulPaint > 1500) {
      recommendations.push('Optimize critical rendering path for faster healthcare content display');
    }

    if (metrics.largestContentfulPaint > 2500) {
      recommendations.push('Optimize largest healthcare content elements');
    }

    return recommendations;
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    // Remove resource hints
    this.resourceHints.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
    this.resourceHints.clear();
  }
}

// Default healthcare optimization configuration
export const defaultHealthcareOptimizationConfig: OptimizationConfig = {
  healthcare: {
    emergencyAccessThreshold: 2000, // 2 seconds for emergency access
    healthDataLoadThreshold: 3000,  // 3 seconds for health data
    clinicalFeatureThreshold: 5000  // 5 seconds for clinical features
  },
  caching: {
    enableHealthcareCache: true,
    phiCachePolicy: 'never', // Never cache PHI data
    emergencyDataCache: true
  },
  prefetching: {
    criticalHealthData: true,
    familyData: true,
    emergencyProtocols: true
  }
};

export default HealthcarePerformanceOptimizer; 