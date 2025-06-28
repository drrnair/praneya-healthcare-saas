'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout, useSafeArea } from '../LayoutProvider';
import { useHealthcareTheme } from '@/lib/design-system/theme-provider';
import { BottomTabNavigation } from './BottomTabNavigation';
import { SidebarNavigation } from './SidebarNavigation';
import { FloatingActionButton } from './FloatingActionButton';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { SearchOverlay } from './SearchOverlay';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showBackButton?: boolean;
  headerActions?: React.ReactNode;
  className?: string;
}

export function MainLayout({
  children,
  title,
  subtitle,
  showHeader = true,
  showBackButton = false,
  headerActions,
  className = ''
}: MainLayoutProps) {
  const { theme } = useHealthcareTheme();
  const { layout, navigation, toggleSidebar } = useLayout();
  const safeArea = useSafeArea();

  // Register service worker for PWA functionality
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  // Calculate layout dimensions
  const sidebarWidth = navigation.showSidebar 
    ? (navigation.sidebarCollapsed ? 72 : 280)
    : 0;

  const headerHeight = showHeader ? 64 : 0;
  
  const bottomTabsHeight = layout.isMobile && navigation.showBottomTabs 
    ? 60 + safeArea.bottom 
    : 0;

  const mainContentStyle = {
    marginLeft: layout.isMobile ? 0 : sidebarWidth,
    marginTop: headerHeight,
    marginBottom: bottomTabsHeight,
    paddingTop: `${safeArea.top}px`,
    paddingLeft: `${safeArea.left}px`,
    paddingRight: `${safeArea.right}px`,
    minHeight: `calc(100vh - ${headerHeight + bottomTabsHeight}px)`
  };

  return (
    <div className={`relative min-h-screen bg-neutral-50 ${className}`}>
      {/* Sidebar Navigation */}
      <SidebarNavigation />

      {/* Main Content Area */}
      <div 
        className="transition-all duration-300 ease-healthcare"
        style={mainContentStyle}
      >
        {/* Header */}
        {showHeader && (
          <motion.header
            className={`
              fixed top-0 right-0 z-30 h-16 bg-white border-b border-neutral-200
              shadow-sm backdrop-blur-sm bg-opacity-95
            `}
            style={{
              left: layout.isMobile ? 0 : sidebarWidth,
              paddingTop: `${safeArea.top}px`,
              paddingLeft: `${Math.max(safeArea.left, 16)}px`,
              paddingRight: `${Math.max(safeArea.right, 16)}px`
            }}
            initial={{ y: -64 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between h-16 px-4">
              {/* Left section */}
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                {layout.isMobile && (
                  <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors lg:hidden"
                    aria-label="Toggle menu"
                  >
                    <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                      <div className="w-full h-0.5 bg-neutral-600 rounded"></div>
                      <div className="w-full h-0.5 bg-neutral-600 rounded"></div>
                      <div className="w-full h-0.5 bg-neutral-600 rounded"></div>
                    </div>
                  </button>
                )}

                {/* Back button */}
                {showBackButton && (
                  <button
                    onClick={() => window.history.back()}
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    aria-label="Go back"
                  >
                    ←
                  </button>
                )}

                {/* Title */}
                <div className="min-w-0 flex-1">
                  {title && (
                    <h1 className="text-lg font-semibold text-neutral-900 truncate">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-sm text-neutral-600 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Right section */}
              <div className="flex items-center gap-2">
                {headerActions}
                
                {/* Search button */}
                <button
                  onClick={() => {}}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  aria-label="Search"
                >
                  🔍
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                    aria-label="Notifications"
                  >
                    🔔
                  </button>
                  {/* Notification badge */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </div>
                </div>

                {/* User menu */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                  {!layout.isMobile && (
                    <div className="text-sm">
                      <div className="font-medium text-neutral-900">User Name</div>
                      <div className="text-neutral-500 capitalize">{theme.tier}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.header>
        )}

        {/* Breadcrumb Navigation */}
        {navigation.showBreadcrumbs && (
          <div className="px-4 py-2 border-b border-neutral-100">
            <BreadcrumbNavigation />
          </div>
        )}

        {/* Main Content */}
        <motion.main
          className="flex-1 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.main>
      </div>

      {/* Bottom Tab Navigation */}
      <BottomTabNavigation />

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Search Overlay */}
      <AnimatePresence>
        {navigation.searchVisible && <SearchOverlay />}
      </AnimatePresence>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}

// PWA Install Prompt Component
function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt || localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-neutral-200 p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">P</span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-neutral-900">Install Praneya</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Add to your home screen for quick access to your health data.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-md hover:bg-primary-600 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 text-neutral-600 text-sm hover:text-neutral-800 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Offline Indicator Component
function OfflineIndicator() {
  const [isOnline, setIsOnline] = React.useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 bg-warning-500 text-white text-center py-2 text-sm"
      initial={{ y: -40 }}
      animate={{ y: 0 }}
    >
      You're currently offline. Some features may be limited.
    </motion.div>
  );
} 