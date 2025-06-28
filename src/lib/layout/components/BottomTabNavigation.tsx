'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useLayout, useSafeArea } from '../LayoutProvider';
import { useHealthcareTheme } from '@/lib/design-system/theme-provider';

// Navigation tab configuration
interface NavTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  href: string;
  badge?: number;
  tier?: 'basic' | 'enhanced' | 'premium';
  emergencyAccess?: boolean;
}

interface BottomTabNavigationProps {
  tabs: NavTab[];
  className?: string;
}

// Healthcare-optimized navigation tabs
const DEFAULT_TABS: NavTab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '🏠',
    activeIcon: '🏠',
    href: '/dashboard'
  },
  {
    id: 'health',
    label: 'Health',
    icon: '💚',
    activeIcon: '💚',
    href: '/health'
  },
  {
    id: 'medications',
    label: 'Medications',
    icon: '💊',
    activeIcon: '💊',
    href: '/medications',
    emergencyAccess: true
  },
  {
    id: 'family',
    label: 'Family',
    icon: '👨‍👩‍👧‍👦',
    activeIcon: '👨‍👩‍👧‍👦',
    href: '/family',
    tier: 'enhanced'
  },
  {
    id: 'more',
    label: 'More',
    icon: '⋯',
    activeIcon: '⋯',
    href: '/menu'
  }
];

export function BottomTabNavigation({ 
  tabs = DEFAULT_TABS,
  className = ''
}: BottomTabNavigationProps) {
  const { theme } = useHealthcareTheme();
  const { layout, navigation } = useLayout();
  const safeArea = useSafeArea();
  const pathname = usePathname();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<string>('');
  const [showBadgeAnimation, setShowBadgeAnimation] = useState<string | null>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Determine active tab based on current pathname
  useEffect(() => {
    const currentTab = tabs.find(tab => 
      pathname === tab.href || 
      (tab.href !== '/' && pathname.startsWith(tab.href))
    );
    
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [pathname, tabs]);

  // Handle tab navigation
  const handleTabPress = (tab: NavTab) => {
    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    // Emergency access handling
    if (tab.emergencyAccess && tab.id === 'medications') {
      // Quick medication logging without full navigation
      // This could open a modal or quick action sheet
      setShowBadgeAnimation(tab.id);
      setTimeout(() => setShowBadgeAnimation(null), 600);
    }

    // Standard navigation
    if (tab.href !== pathname) {
      router.push(tab.href);
    }

    setActiveTab(tab.id);
  };

  // Filter tabs based on user tier
  const availableTabs = tabs.filter(tab => {
    if (!tab.tier) return true;
    
    const tierLevels = { basic: 1, enhanced: 2, premium: 3 };
    const userTierLevel = tierLevels[theme.tier] || 1;
    const requiredTierLevel = tierLevels[tab.tier] || 1;
    
    return userTierLevel >= requiredTierLevel;
  });

  // Don't render if not on mobile or navigation is hidden
  if (!layout.isMobile || !navigation.showBottomTabs) {
    return null;
  }

  return (
    <motion.div
      className={`
        fixed bottom-0 left-0 right-0 z-50 
        bg-white border-t border-neutral-200
        shadow-lg backdrop-blur-sm bg-opacity-95
        ${className}
      `}
      style={{
        paddingBottom: `${safeArea.bottom}px`,
        paddingLeft: `${Math.max(safeArea.left, 8)}px`,
        paddingRight: `${Math.max(safeArea.right, 8)}px`
      }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Tab container */}
      <div className="flex items-center justify-around px-2 py-2 min-h-[60px]">
        {availableTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const showBadge = tab.badge && tab.badge > 0;
          const isAnimatingBadge = showBadgeAnimation === tab.id;

          return (
            <motion.button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              className={`
                relative flex flex-col items-center justify-center
                min-w-[60px] h-[50px] rounded-lg
                transition-all duration-200 ease-healthcare
                ${isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                }
                ${tab.emergencyAccess ? 'focus:ring-2 focus:ring-error-300' : 'focus:ring-2 focus:ring-primary-300'}
                focus:outline-none active:scale-95
              `}
              onClick={() => handleTabPress(tab)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              aria-label={`Navigate to ${tab.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon container */}
              <div className="relative flex items-center justify-center mb-1">
                <motion.div
                  className="text-xl"
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    rotate: isAnimatingBadge ? [0, -10, 10, 0] : 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isActive && tab.activeIcon ? tab.activeIcon : tab.icon}
                </motion.div>

                {/* Badge indicator */}
                <AnimatePresence>
                  {showBadge && (
                    <motion.div
                      className={`
                        absolute -top-1 -right-1 min-w-[18px] h-[18px]
                        flex items-center justify-center
                        text-xs font-medium text-white rounded-full
                        ${tab.emergencyAccess 
                          ? 'bg-error-500' 
                          : 'bg-primary-500'
                        }
                      `}
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: isAnimatingBadge ? [1, 1.3, 1] : 1 
                      }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {tab.badge! > 99 ? '99+' : tab.badge}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Emergency pulse indicator */}
                {tab.emergencyAccess && tab.badge && (
                  <motion.div
                    className="absolute inset-0 bg-error-500 rounded-full opacity-20"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <motion.span
                className={`
                  text-xs font-medium transition-colors duration-200
                  ${isActive ? 'text-primary-600' : 'text-neutral-500'}
                `}
                animate={{
                  fontWeight: isActive ? 600 : 500
                }}
              >
                {tab.label}
              </motion.span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute -top-1 left-1/2 w-1 h-1 bg-primary-500 rounded-full"
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Tier indicator for premium features */}
              {tab.tier && tab.tier !== 'basic' && (
                <div className={`
                  absolute top-1 right-1 w-2 h-2 rounded-full
                  ${tab.tier === 'premium' 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
                    : 'bg-gradient-to-r from-blue-400 to-cyan-400'
                  }
                `} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Thumb-friendly zone indicator (development mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-green-200 opacity-20"
            style={{ height: '44px' }} // Minimum touch target
          />
        </div>
      )}

      {/* Home indicator for devices without home button */}
      {layout.isStandalone && (
        <div className="flex justify-center pt-1">
          <div className="w-32 h-1 bg-neutral-300 rounded-full" />
        </div>
      )}
    </motion.div>
  );
}

// Hook for managing bottom tab state
export function useBottomTabs() {
  const [badges, setBadges] = useState<{ [tabId: string]: number }>({});

  const updateBadge = (tabId: string, count: number) => {
    setBadges(prev => ({
      ...prev,
      [tabId]: count
    }));
  };

  const clearBadge = (tabId: string) => {
    setBadges(prev => {
      const newBadges = { ...prev };
      delete newBadges[tabId];
      return newBadges;
    });
  };

  const incrementBadge = (tabId: string) => {
    setBadges(prev => ({
      ...prev,
      [tabId]: (prev[tabId] || 0) + 1
    }));
  };

  return {
    badges,
    updateBadge,
    clearBadge,
    incrementBadge
  };
}

// Emergency action handler
export function useEmergencyActions() {
  const router = useRouter();

  const triggerEmergencyMedication = () => {
    // Quick medication log without full navigation
    // Could open a modal or slide-up panel
    console.log('Emergency medication logging triggered');
  };

  const triggerEmergencyCall = () => {
    // Emergency contact functionality
    if ('tel:' in window.location) {
      window.location.href = 'tel:911';
    }
  };

  const triggerEmergencyAlert = () => {
    // Family emergency alert
    console.log('Emergency alert triggered');
  };

  return {
    triggerEmergencyMedication,
    triggerEmergencyCall,
    triggerEmergencyAlert
  };
} 