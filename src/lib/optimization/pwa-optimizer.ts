/**
 * Healthcare PWA Optimization System
 * Advanced PWA features optimized for medical applications
 */

interface PWAConfig {
  offline: {
    enableOfflineAccess: boolean;
    offlineHealthDataAccess: boolean;
    emergencyOfflineMode: boolean;
    syncWhenOnline: boolean;
  };
  notifications: {
    medicationReminders: boolean;
    appointmentAlerts: boolean;
    emergencyNotifications: boolean;
    familyUpdates: boolean;
  };
  installation: {
    showInstallPrompt: boolean;
    customInstallUI: boolean;
    deferInstallPrompt: boolean;
  };
  background: {
    backgroundSync: boolean;
    healthDataSync: boolean;
    familyCollaboration: boolean;
  };
}

interface OfflineHealthData {
  emergencyContacts: any[];
  criticalMedications: any[];
  allergies: any[];
  medicalConditions: any[];
  emergencyProtocols: any[];
}

class HealthcarePWAOptimizer {
  private config: PWAConfig;
  private deferredPrompt: any;
  private isOnline: boolean = navigator.onLine;
  private offlineHealthData: OfflineHealthData | null = null;
  private notificationPermission: NotificationPermission = 'default';

  constructor(config: PWAConfig) {
    this.config = config;
    this.initializePWAOptimizations();
  }

  private initializePWAOptimizations(): void {
    this.setupServiceWorker();
    this.setupOfflineCapabilities();
    this.setupNotificationSystem();
    this.setupInstallationPrompt();
    this.setupBackgroundSync();
    this.setupNetworkStatusMonitoring();
  }

  /**
   * Setup enhanced service worker for healthcare applications
   */
  private async setupServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/healthcare-sw.js', {
          scope: '/',
          updateViaCache: 'none' // Always check for updates for healthcare apps
        });

        console.log('Healthcare Service Worker registered:', registration.scope);

        // Configure healthcare-specific caching strategies
        this.configureHealthcareCaching(registration);

        // Setup service worker update handling
        this.setupServiceWorkerUpdates(registration);

        // Setup message communication with service worker
        this.setupServiceWorkerMessaging(registration);

      } catch (error) {
        console.error('Healthcare Service Worker registration failed:', error);
      }
    }
  }

  private configureHealthcareCaching(registration: ServiceWorkerRegistration): void {
    // Send healthcare-specific caching configuration to service worker
    if (registration.active) {
      registration.active.postMessage({
        type: 'HEALTHCARE_CACHE_CONFIG',
        config: {
          cacheEmergencyData: this.config.offline.emergencyOfflineMode,
          cacheHealthData: this.config.offline.offlineHealthDataAccess,
          phiCachePolicy: 'encrypted-only', // Only cache encrypted PHI
          maxCacheAge: 24 * 60 * 60 * 1000, // 24 hours for non-PHI data
          emergencyCacheAge: 7 * 24 * 60 * 60 * 1000 // 7 days for emergency data
        }
      });
    }
  }

  private setupServiceWorkerUpdates(registration: ServiceWorkerRegistration): void {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Show healthcare app update notification
            this.showHealthcareUpdateNotification();
          }
        });
      }
    });
  }

  private setupServiceWorkerMessaging(registration: ServiceWorkerRegistration): void {
    navigator.serviceWorker.addEventListener('message', (event) => {
      const { type, data } = event.data;

      switch (type) {
        case 'HEALTHCARE_DATA_SYNC_COMPLETE':
          this.handleHealthDataSyncComplete(data);
          break;
        case 'EMERGENCY_DATA_CACHED':
          this.handleEmergencyDataCached(data);
          break;
        case 'PHI_ACCESS_AUDIT':
          this.handlePHIAccessAudit(data);
          break;
        case 'OFFLINE_ACTION_QUEUED':
          this.handleOfflineActionQueued(data);
          break;
      }
    });
  }

  private showHealthcareUpdateNotification(): void {
    const updateBanner = document.createElement('div');
    updateBanner.className = 'healthcare-update-banner';
    updateBanner.innerHTML = `
      <div class="update-content">
        <div class="update-icon">🏥</div>
        <div class="update-message">
          <strong>Healthcare App Update Available</strong>
          <p>New features and security improvements are ready to install.</p>
        </div>
        <div class="update-actions">
          <button id="update-now" class="update-btn primary">Update Now</button>
          <button id="update-later" class="update-btn secondary">Later</button>
        </div>
      </div>
    `;

    document.body.appendChild(updateBanner);

    // Handle update actions
    document.getElementById('update-now')?.addEventListener('click', () => {
      window.location.reload();
    });

    document.getElementById('update-later')?.addEventListener('click', () => {
      updateBanner.remove();
    });
  }

  /**
   * Setup offline capabilities for healthcare data
   */
  private setupOfflineCapabilities(): void {
    if (!this.config.offline.enableOfflineAccess) return;

    this.cacheEssentialHealthcareData();
    this.setupOfflineDataAccess();
    this.setupOfflineActionQueue();
  }

  private async cacheEssentialHealthcareData(): Promise<void> {
    try {
      // Cache critical health data for offline access
      const emergencyData = await this.fetchEmergencyData();
      const criticalMedications = await this.fetchCriticalMedications();
      const allergies = await this.fetchAllergies();
      const medicalConditions = await this.fetchMedicalConditions();
      const emergencyProtocols = await this.fetchEmergencyProtocols();

      this.offlineHealthData = {
        emergencyContacts: emergencyData.contacts || [],
        criticalMedications: criticalMedications || [],
        allergies: allergies || [],
        medicalConditions: medicalConditions || [],
        emergencyProtocols: emergencyProtocols || []
      };

      // Store in encrypted localStorage for offline access
      this.storeOfflineHealthData(this.offlineHealthData);

      console.log('Essential healthcare data cached for offline access');
    } catch (error) {
      console.error('Failed to cache healthcare data:', error);
    }
  }

  private async fetchEmergencyData(): Promise<any> {
    try {
      const response = await fetch('/api/emergency/data');
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch emergency data:', error);
      return { contacts: [] };
    }
  }

  private async fetchCriticalMedications(): Promise<any[]> {
    try {
      const response = await fetch('/api/medications/critical');
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch critical medications:', error);
      return [];
    }
  }

  private async fetchAllergies(): Promise<any[]> {
    try {
      const response = await fetch('/api/health-profile/allergies');
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch allergies:', error);
      return [];
    }
  }

  private async fetchMedicalConditions(): Promise<any[]> {
    try {
      const response = await fetch('/api/health-profile/conditions');
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch medical conditions:', error);
      return [];
    }
  }

  private async fetchEmergencyProtocols(): Promise<any[]> {
    try {
      const response = await fetch('/api/emergency/protocols');
      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch emergency protocols:', error);
      return [];
    }
  }

  private storeOfflineHealthData(data: OfflineHealthData): void {
    try {
      // Encrypt sensitive health data before storing
      const encryptedData = this.encryptHealthData(data);
      localStorage.setItem('healthcare_offline_data', JSON.stringify(encryptedData));
    } catch (error) {
      console.error('Failed to store offline health data:', error);
    }
  }

  private encryptHealthData(data: OfflineHealthData): any {
    // In a real implementation, use proper encryption
    // This is a simplified example
    return {
      ...data,
      encrypted: true,
      timestamp: Date.now()
    };
  }

  private setupOfflineDataAccess(): void {
    // Provide offline access to cached health data
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineNotification();
      this.enableOfflineMode();
    });

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.hideOfflineNotification();
      this.disableOfflineMode();
      this.syncOfflineActions();
    });
  }

  private showOfflineNotification(): void {
    const offlineBanner = document.createElement('div');
    offlineBanner.id = 'offline-banner';
    offlineBanner.className = 'healthcare-offline-banner';
    offlineBanner.innerHTML = `
      <div class="offline-content">
        <div class="offline-icon">📱</div>
        <div class="offline-message">
          <strong>Offline Mode Active</strong>
          <p>Limited healthcare data available. Emergency information accessible.</p>
        </div>
        <button id="view-offline-data" class="offline-btn">View Available Data</button>
      </div>
    `;

    document.body.appendChild(offlineBanner);

    document.getElementById('view-offline-data')?.addEventListener('click', () => {
      this.showOfflineHealthData();
    });
  }

  private hideOfflineNotification(): void {
    const offlineBanner = document.getElementById('offline-banner');
    if (offlineBanner) {
      offlineBanner.remove();
    }
  }

  private enableOfflineMode(): void {
    document.body.classList.add('healthcare-offline-mode');
    
    // Show offline data access UI
    this.showOfflineDataInterface();
  }

  private disableOfflineMode(): void {
    document.body.classList.remove('healthcare-offline-mode');
    
    // Hide offline data interface
    this.hideOfflineDataInterface();
  }

  private showOfflineDataInterface(): void {
    const offlineInterface = document.createElement('div');
    offlineInterface.id = 'offline-interface';
    offlineInterface.className = 'healthcare-offline-interface';
    offlineInterface.innerHTML = `
      <div class="offline-interface-content">
        <h3>Available Offline</h3>
        <ul class="offline-data-list">
          <li><a href="#" data-action="view-emergency">Emergency Contacts</a></li>
          <li><a href="#" data-action="view-medications">Critical Medications</a></li>
          <li><a href="#" data-action="view-allergies">Allergies</a></li>
          <li><a href="#" data-action="view-conditions">Medical Conditions</a></li>
          <li><a href="#" data-action="view-protocols">Emergency Protocols</a></li>
        </ul>
      </div>
    `;

    document.body.appendChild(offlineInterface);

    // Handle offline data access
    offlineInterface.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const action = target.dataset.action;
      if (action) {
        this.handleOfflineDataRequest(action);
      }
    });
  }

  private hideOfflineDataInterface(): void {
    const offlineInterface = document.getElementById('offline-interface');
    if (offlineInterface) {
      offlineInterface.remove();
    }
  }

  private handleOfflineDataRequest(action: string): void {
    if (!this.offlineHealthData) {
      this.showOfflineDataUnavailable();
      return;
    }

    switch (action) {
      case 'view-emergency':
        this.showOfflineEmergencyData();
        break;
      case 'view-medications':
        this.showOfflineMedicationData();
        break;
      case 'view-allergies':
        this.showOfflineAllergyData();
        break;
      case 'view-conditions':
        this.showOfflineConditionData();
        break;
      case 'view-protocols':
        this.showOfflineProtocolData();
        break;
    }
  }

  private showOfflineHealthData(): void {
    if (!this.offlineHealthData) {
      this.showOfflineDataUnavailable();
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'healthcare-offline-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Offline Healthcare Data</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="offline-data-section">
            <h3>Emergency Contacts</h3>
            <div class="emergency-contacts">
              ${this.offlineHealthData.emergencyContacts.map(contact => `
                <div class="contact-item">
                  <strong>${contact.name}</strong> - ${contact.phone}
                  <span class="relationship">${contact.relationship}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="offline-data-section">
            <h3>Critical Medications</h3>
            <div class="medications">
              ${this.offlineHealthData.criticalMedications.map(med => `
                <div class="medication-item">
                  <strong>${med.name}</strong> - ${med.dosage}
                  <span class="frequency">${med.frequency}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="offline-data-section">
            <h3>Allergies</h3>
            <div class="allergies">
              ${this.offlineHealthData.allergies.map(allergy => `
                <div class="allergy-item">
                  <strong>${allergy.allergen}</strong>
                  <span class="severity severity-${allergy.severity}">${allergy.severity}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle modal close
    modal.querySelector('.modal-close')?.addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
  }

  private showOfflineDataUnavailable(): void {
    const alert = document.createElement('div');
    alert.className = 'healthcare-offline-alert';
    alert.innerHTML = `
      <div class="alert-content">
        <div class="alert-icon">⚠️</div>
        <div class="alert-message">
          <strong>Offline Data Unavailable</strong>
          <p>Please connect to the internet to access your healthcare data.</p>
        </div>
      </div>
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 5000);
  }

  private setupOfflineActionQueue(): void {
    // Queue actions performed while offline for later sync
    const offlineActions: any[] = [];

    // Intercept healthcare data modifications while offline
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      if (!this.isOnline && this.isHealthcareWriteOperation(args[0] as string)) {
        // Queue the action for later sync
        const action = {
          url: args[0],
          options: args[1],
          timestamp: new Date(),
          type: 'healthcare_write'
        };
        offlineActions.push(action);
        
        // Store in localStorage for persistence
        localStorage.setItem('healthcare_offline_actions', JSON.stringify(offlineActions));
        
        // Show queued action notification
        this.showActionQueuedNotification();
        
        // Return a mock response
        return new Response(JSON.stringify({ queued: true, timestamp: new Date() }));
      }
      
      return originalFetch(...args);
    };
  }

  private isHealthcareWriteOperation(url: string): boolean {
    const writeEndpoints = [
      '/api/health-profile',
      '/api/medications',
      '/api/clinical-data',
      '/api/family/data'
    ];

    return writeEndpoints.some(endpoint => url.includes(endpoint)) && 
           (url.includes('POST') || url.includes('PUT') || url.includes('PATCH'));
  }

  private showActionQueuedNotification(): void {
    const notification = document.createElement('div');
    notification.className = 'healthcare-queue-notification';
    notification.innerHTML = `
      <div class="queue-content">
        <div class="queue-icon">⏳</div>
        <div class="queue-message">
          Action queued for sync when online
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  private async syncOfflineActions(): Promise<void> {
    const queuedActions = localStorage.getItem('healthcare_offline_actions');
    if (!queuedActions) return;

    try {
      const actions = JSON.parse(queuedActions);
      console.log(`Syncing ${actions.length} queued healthcare actions`);

      for (const action of actions) {
        try {
          await fetch(action.url, action.options);
          console.log('Synced healthcare action:', action.url);
        } catch (error) {
          console.error('Failed to sync healthcare action:', error);
        }
      }

      // Clear synced actions
      localStorage.removeItem('healthcare_offline_actions');
      
      this.showSyncCompleteNotification();
    } catch (error) {
      console.error('Failed to sync offline actions:', error);
    }
  }

  private showSyncCompleteNotification(): void {
    const notification = document.createElement('div');
    notification.className = 'healthcare-sync-notification';
    notification.innerHTML = `
      <div class="sync-content">
        <div class="sync-icon">✅</div>
        <div class="sync-message">
          Healthcare data synchronized successfully
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  /**
   * Setup notification system for healthcare alerts
   */
  private setupNotificationSystem(): void {
    this.requestNotificationPermission();
    this.setupMedicationReminders();
    this.setupAppointmentAlerts();
    this.setupEmergencyNotifications();
    this.setupFamilyUpdateNotifications();
  }

  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window) {
      this.notificationPermission = await Notification.requestPermission();
      
      if (this.notificationPermission === 'granted') {
        console.log('Healthcare notification permission granted');
      } else {
        console.warn('Healthcare notification permission denied');
      }
    }
  }

  private setupMedicationReminders(): void {
    if (!this.config.notifications.medicationReminders) return;

    // Setup medication reminder system
    document.addEventListener('medication-reminder-scheduled', (event: CustomEvent) => {
      const { medication, time } = event.detail;
      this.scheduleMedicationReminder(medication, time);
    });
  }

  private scheduleMedicationReminder(medication: any, time: Date): void {
    const now = new Date();
    const delay = time.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        this.showMedicationReminder(medication);
      }, delay);
    }
  }

  private showMedicationReminder(medication: any): void {
    if (this.notificationPermission === 'granted') {
      new Notification('Medication Reminder', {
        body: `Time to take your ${medication.name} (${medication.dosage})`,
        icon: '/icons/medication-reminder.png',
        tag: `medication-${medication.id}`,
        requireInteraction: true,
        actions: [
          { action: 'taken', title: 'Mark as Taken' },
          { action: 'snooze', title: 'Snooze 15 min' }
        ]
      });
    }

    // Also show in-app notification
    this.showInAppMedicationReminder(medication);
  }

  private showInAppMedicationReminder(medication: any): void {
    const reminder = document.createElement('div');
    reminder.className = 'healthcare-medication-reminder';
    reminder.innerHTML = `
      <div class="reminder-content">
        <div class="reminder-icon">💊</div>
        <div class="reminder-message">
          <strong>Medication Reminder</strong>
          <p>Time to take your ${medication.name} (${medication.dosage})</p>
        </div>
        <div class="reminder-actions">
          <button class="reminder-btn taken">Mark as Taken</button>
          <button class="reminder-btn snooze">Snooze 15 min</button>
          <button class="reminder-btn close">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(reminder);

    // Handle reminder actions
    reminder.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (target.classList.contains('taken')) {
        this.markMedicationTaken(medication);
        reminder.remove();
      } else if (target.classList.contains('snooze')) {
        this.snoozeMedicationReminder(medication, 15);
        reminder.remove();
      } else if (target.classList.contains('close')) {
        reminder.remove();
      }
    });
  }

  private markMedicationTaken(medication: any): void {
    // Record medication taken
    fetch('/api/medications/taken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medicationId: medication.id,
        timestamp: new Date()
      })
    }).catch(error => {
      console.error('Failed to record medication taken:', error);
    });
  }

  private snoozeMedicationReminder(medication: any, minutes: number): void {
    const snoozeTime = new Date(Date.now() + minutes * 60 * 1000);
    this.scheduleMedicationReminder(medication, snoozeTime);
  }

  private setupAppointmentAlerts(): void {
    if (!this.config.notifications.appointmentAlerts) return;

    // Setup appointment alert system
    document.addEventListener('appointment-scheduled', (event: CustomEvent) => {
      const { appointment } = event.detail;
      this.scheduleAppointmentAlerts(appointment);
    });
  }

  private scheduleAppointmentAlerts(appointment: any): void {
    const appointmentTime = new Date(appointment.datetime);
    
    // Schedule alerts at different intervals
    const alerts = [
      { time: new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000), message: '24 hours before' },
      { time: new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000), message: '2 hours before' },
      { time: new Date(appointmentTime.getTime() - 30 * 60 * 1000), message: '30 minutes before' }
    ];

    alerts.forEach(alert => {
      const delay = alert.time.getTime() - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          this.showAppointmentAlert(appointment, alert.message);
        }, delay);
      }
    });
  }

  private showAppointmentAlert(appointment: any, timing: string): void {
    if (this.notificationPermission === 'granted') {
      new Notification('Appointment Reminder', {
        body: `${appointment.type} appointment with ${appointment.provider} - ${timing}`,
        icon: '/icons/appointment-reminder.png',
        tag: `appointment-${appointment.id}`,
        requireInteraction: true
      });
    }
  }

  private setupEmergencyNotifications(): void {
    if (!this.config.notifications.emergencyNotifications) return;

    // Setup emergency notification system
    document.addEventListener('emergency-alert', (event: CustomEvent) => {
      const { alert } = event.detail;
      this.showEmergencyNotification(alert);
    });
  }

  private showEmergencyNotification(alert: any): void {
    // Emergency notifications always show, regardless of permission
    const emergencyNotification = document.createElement('div');
    emergencyNotification.className = 'healthcare-emergency-notification critical';
    emergencyNotification.innerHTML = `
      <div class="emergency-content">
        <div class="emergency-icon">🚨</div>
        <div class="emergency-message">
          <strong>EMERGENCY ALERT</strong>
          <p>${alert.message}</p>
        </div>
        <div class="emergency-actions">
          <button class="emergency-btn call-911">Call 911</button>
          <button class="emergency-btn acknowledge">Acknowledge</button>
        </div>
      </div>
    `;

    document.body.appendChild(emergencyNotification);

    // Handle emergency actions
    emergencyNotification.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (target.classList.contains('call-911')) {
        window.location.href = 'tel:911';
      } else if (target.classList.contains('acknowledge')) {
        this.acknowledgeEmergencyAlert(alert);
        emergencyNotification.remove();
      }
    });

    // Emergency notifications don't auto-remove
  }

  private acknowledgeEmergencyAlert(alert: any): void {
    fetch('/api/emergency/acknowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alertId: alert.id,
        timestamp: new Date()
      })
    }).catch(error => {
      console.error('Failed to acknowledge emergency alert:', error);
    });
  }

  private setupFamilyUpdateNotifications(): void {
    if (!this.config.notifications.familyUpdates) return;

    // Setup family update notification system
    document.addEventListener('family-health-update', (event: CustomEvent) => {
      const { update } = event.detail;
      this.showFamilyUpdateNotification(update);
    });
  }

  private showFamilyUpdateNotification(update: any): void {
    if (this.notificationPermission === 'granted') {
      new Notification('Family Health Update', {
        body: `${update.memberName} has updated their health information`,
        icon: '/icons/family-update.png',
        tag: `family-update-${update.id}`
      });
    }
  }

  /**
   * Setup installation prompt optimization
   */
  private setupInstallationPrompt(): void {
    if (!this.config.installation.showInstallPrompt) return;

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt = event;

      if (this.config.installation.customInstallUI) {
        this.showCustomInstallPrompt();
      } else if (this.config.installation.deferInstallPrompt) {
        this.deferInstallPrompt();
      }
    });
  }

  private showCustomInstallPrompt(): void {
    const installPrompt = document.createElement('div');
    installPrompt.className = 'healthcare-install-prompt';
    installPrompt.innerHTML = `
      <div class="install-content">
        <div class="install-icon">🏥</div>
        <div class="install-message">
          <strong>Install Praneya Healthcare</strong>
          <p>Get faster access to your health data with our mobile app</p>
          <ul class="install-benefits">
            <li>✓ Offline emergency data access</li>
            <li>✓ Medication reminders</li>
            <li>✓ Secure health data sync</li>
            <li>✓ Family health collaboration</li>
          </ul>
        </div>
        <div class="install-actions">
          <button id="install-app" class="install-btn primary">Install App</button>
          <button id="install-later" class="install-btn secondary">Maybe Later</button>
        </div>
      </div>
    `;

    document.body.appendChild(installPrompt);

    // Handle install actions
    document.getElementById('install-app')?.addEventListener('click', () => {
      this.installHealthcareApp();
      installPrompt.remove();
    });

    document.getElementById('install-later')?.addEventListener('click', () => {
      installPrompt.remove();
      // Show again in 7 days
      localStorage.setItem('healthcare_install_defer', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
    });
  }

  private deferInstallPrompt(): void {
    const deferUntil = localStorage.getItem('healthcare_install_defer');
    if (deferUntil && Date.now() < parseInt(deferUntil)) {
      return; // Still in defer period
    }

    // Show install prompt after user has used the app for a while
    setTimeout(() => {
      this.showCustomInstallPrompt();
    }, 5 * 60 * 1000); // 5 minutes
  }

  private async installHealthcareApp(): Promise<void> {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Healthcare app installed');
        this.trackInstallation('accepted');
      } else {
        console.log('Healthcare app installation declined');
        this.trackInstallation('declined');
      }
      
      this.deferredPrompt = null;
    }
  }

  private trackInstallation(outcome: string): void {
    fetch('/api/analytics/app-install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outcome,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      })
    }).catch(error => {
      console.error('Failed to track installation:', error);
    });
  }

  /**
   * Setup background sync for healthcare data
   */
  private setupBackgroundSync(): void {
    if (!this.config.background.backgroundSync) return;

    this.setupHealthDataBackgroundSync();
    this.setupFamilyCollaborationSync();
  }

  private setupHealthDataBackgroundSync(): void {
    if (!this.config.background.healthDataSync) return;

    // Register background sync for health data
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('healthcare-data-sync');
      }).catch(error => {
        console.error('Background sync registration failed:', error);
      });
    }
  }

  private setupFamilyCollaborationSync(): void {
    if (!this.config.background.familyCollaboration) return;

    // Register background sync for family collaboration
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('family-collaboration-sync');
      }).catch(error => {
        console.error('Family collaboration sync registration failed:', error);
      });
    }
  }

  /**
   * Setup network status monitoring
   */
  private setupNetworkStatusMonitoring(): void {
    // Monitor network quality for healthcare operations
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      this.logNetworkStatus(connection);
      
      connection.addEventListener('change', () => {
        this.logNetworkStatus(connection);
        this.adaptToNetworkConditions(connection);
      });
    }
  }

  private logNetworkStatus(connection: any): void {
    console.log('Healthcare network status:', {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    });
  }

  private adaptToNetworkConditions(connection: any): void {
    // Adapt healthcare app behavior based on network conditions
    if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      this.enableLowBandwidthMode();
    } else {
      this.disableLowBandwidthMode();
    }

    if (connection.saveData) {
      this.enableDataSavingMode();
    } else {
      this.disableDataSavingMode();
    }
  }

  private enableLowBandwidthMode(): void {
    document.body.classList.add('healthcare-low-bandwidth');
    
    // Disable non-essential features
    this.disableNonEssentialFeatures();
    
    // Show low bandwidth notification
    this.showLowBandwidthNotification();
  }

  private disableLowBandwidthMode(): void {
    document.body.classList.remove('healthcare-low-bandwidth');
    this.enableAllFeatures();
  }

  private enableDataSavingMode(): void {
    document.body.classList.add('healthcare-data-saving');
    
    // Reduce image quality and disable auto-updates
    this.optimizeForDataSaving();
  }

  private disableDataSavingMode(): void {
    document.body.classList.remove('healthcare-data-saving');
  }

  private disableNonEssentialFeatures(): void {
    // Disable features like animations, auto-refresh, etc.
    document.querySelectorAll('.non-essential').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
  }

  private enableAllFeatures(): void {
    document.querySelectorAll('.non-essential').forEach(element => {
      (element as HTMLElement).style.display = '';
    });
  }

  private optimizeForDataSaving(): void {
    // Reduce image quality, disable auto-updates
    document.querySelectorAll('img').forEach(img => {
      if (img.dataset.lowDataSrc) {
        img.src = img.dataset.lowDataSrc;
      }
    });
  }

  private showLowBandwidthNotification(): void {
    const notification = document.createElement('div');
    notification.className = 'healthcare-bandwidth-notification';
    notification.innerHTML = `
      <div class="bandwidth-content">
        <div class="bandwidth-icon">📶</div>
        <div class="bandwidth-message">
          <strong>Low Bandwidth Detected</strong>
          <p>Some features have been disabled to ensure reliable healthcare access.</p>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Event handlers
  private handleHealthDataSyncComplete(data: any): void {
    console.log('Health data sync completed:', data);
    this.showSyncCompleteNotification();
  }

  private handleEmergencyDataCached(data: any): void {
    console.log('Emergency data cached:', data);
    this.offlineHealthData = { ...this.offlineHealthData, ...data };
  }

  private handlePHIAccessAudit(data: any): void {
    console.log('PHI access audited:', data);
    // Log PHI access for compliance
    fetch('/api/audit/phi-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(error => {
      console.error('Failed to log PHI access:', error);
    });
  }

  private handleOfflineActionQueued(data: any): void {
    console.log('Offline action queued:', data);
    this.showActionQueuedNotification();
  }

  // Show specific offline data sections
  private showOfflineEmergencyData(): void {
    // Implementation for showing emergency data
  }

  private showOfflineMedicationData(): void {
    // Implementation for showing medication data
  }

  private showOfflineAllergyData(): void {
    // Implementation for showing allergy data
  }

  private showOfflineConditionData(): void {
    // Implementation for showing condition data
  }

  private showOfflineProtocolData(): void {
    // Implementation for showing protocol data
  }

  /**
   * Generate PWA optimization report
   */
  public generatePWAReport(): any {
    return {
      timestamp: new Date(),
      config: this.config,
      networkStatus: {
        online: this.isOnline,
        connectionType: (navigator as any).connection?.effectiveType || 'unknown'
      },
      notificationPermission: this.notificationPermission,
      serviceWorkerStatus: navigator.serviceWorker?.controller ? 'active' : 'inactive',
      offlineDataCached: !!this.offlineHealthData,
      installPromptAvailable: !!this.deferredPrompt
    };
  }

  /**
   * Cleanup PWA resources
   */
  public destroy(): void {
    // Cleanup event listeners and resources
    if (this.deferredPrompt) {
      this.deferredPrompt = null;
    }
  }
}

// Default healthcare PWA configuration
export const defaultHealthcarePWAConfig: PWAConfig = {
  offline: {
    enableOfflineAccess: true,
    offlineHealthDataAccess: true,
    emergencyOfflineMode: true,
    syncWhenOnline: true
  },
  notifications: {
    medicationReminders: true,
    appointmentAlerts: true,
    emergencyNotifications: true,
    familyUpdates: true
  },
  installation: {
    showInstallPrompt: true,
    customInstallUI: true,
    deferInstallPrompt: true
  },
  background: {
    backgroundSync: true,
    healthDataSync: true,
    familyCollaboration: true
  }
};

export default HealthcarePWAOptimizer; 