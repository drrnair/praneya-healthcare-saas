'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useLayout } from '../LayoutProvider';
import { useHealthcareTheme } from '@/lib/design-system/theme-provider';

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
  tier?: 'basic' | 'enhanced' | 'premium';
  collapsible?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  tier?: 'basic' | 'enhanced' | 'premium';
  external?: boolean;
}

interface SidebarNavigationProps {
  className?: string;
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'main',
    label: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '🏠', href: '/dashboard' },
      { id: 'health-overview', label: 'Health Overview', icon: '💚', href: '/health' },
      { id: 'medications', label: 'Medications', icon: '💊', href: '/medications' },
      { id: 'appointments', label: 'Appointments', icon: '📅', href: '/appointments' }
    ]
  },
  {
    id: 'family',
    label: 'Family',
    tier: 'enhanced',
    items: [
      { id: 'family-hub', label: 'Family Hub', icon: '👨‍👩‍👧‍👦', href: '/family' },
      { id: 'family-members', label: 'Members', icon: '👥', href: '/family/members' },
      { id: 'shared-goals', label: 'Shared Goals', icon: '🎯', href: '/family/goals' }
    ]
  },
  {
    id: 'wellness',
    label: 'Wellness',
    items: [
      { id: 'nutrition', label: 'Nutrition', icon: '🥗', href: '/nutrition' },
      { id: 'exercise', label: 'Exercise', icon: '🏃‍♂️', href: '/exercise' },
      { id: 'sleep', label: 'Sleep', icon: '😴', href: '/sleep' },
      { id: 'mindfulness', label: 'Mindfulness', icon: '🧘‍♀️', href: '/mindfulness', tier: 'premium' }
    ]
  },
  {
    id: 'data',
    label: 'Data & Reports',
    tier: 'enhanced',
    collapsible: true,
    items: [
      { id: 'analytics', label: 'Analytics', icon: '📊', href: '/analytics' },
      { id: 'reports', label: 'Reports', icon: '📋', href: '/reports' },
      { id: 'trends', label: 'Trends', icon: '📈', href: '/trends' },
      { id: 'export', label: 'Export Data', icon: '📤', href: '/export', tier: 'premium' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [
      { id: 'profile', label: 'Profile', icon: '👤', href: '/settings/profile' },
      { id: 'preferences', label: 'Preferences', icon: '⚙️', href: '/settings/preferences' },
      { id: 'privacy', label: 'Privacy', icon: '🔒', href: '/settings/privacy' },
      { id: 'help', label: 'Help & Support', icon: '❓', href: '/help' }
    ]
  }
];

export function SidebarNavigation({ className = '' }: SidebarNavigationProps) {
  const { theme } = useHealthcareTheme();
  const { layout, navigation, toggleSidebar } = useLayout();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // Filter navigation based on user tier
  const getFilteredGroups = () => {
    const tierLevels = { basic: 1, enhanced: 2, premium: 3 };
    const userTierLevel = tierLevels[theme.tier] || 1;

    return NAV_GROUPS.map(group => {
      // Check if user has access to group
      if (group.tier) {
        const requiredLevel = tierLevels[group.tier] || 1;
        if (userTierLevel < requiredLevel) return null;
      }

      // Filter items within group
      const filteredItems = group.items.filter(item => {
        if (!item.tier) return true;
        const requiredLevel = tierLevels[item.tier] || 1;
        return userTierLevel >= requiredLevel;
      });

      return { ...group, items: filteredItems };
    }).filter(Boolean) as NavGroup[];
  };

  const handleNavigation = (item: NavItem) => {
    if (item.external) {
      window.open(item.href, '_blank');
    } else {
      router.push(item.href);
    }

    // Auto-collapse sidebar on mobile/tablet after navigation
    if (layout.isTablet && !navigation.sidebarCollapsed) {
      toggleSidebar();
    }
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Don't render on mobile
  if (layout.isMobile || !navigation.showSidebar) {
    return null;
  }

  const sidebarWidth = navigation.sidebarCollapsed ? 72 : 280;

  return (
    <>
      {/* Overlay for tablet when sidebar is open */}
      <AnimatePresence>
        {layout.isTablet && !navigation.sidebarCollapsed && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-neutral-200 z-50
          flex flex-col shadow-lg lg:shadow-none
          ${className}
        `}
        animate={{ width: sidebarWidth }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 min-h-[64px]">
          {!navigation.sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <h1 className="font-semibold text-neutral-800">Praneya</h1>
                <p className="text-xs text-neutral-500 capitalize">{theme.tier} Plan</p>
              </div>
            </motion.div>
          )}
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label={navigation.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <motion.div
              animate={{ rotate: navigation.sidebarCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              ←
            </motion.div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-6">
            {getFilteredGroups().map(group => (
              <div key={group.id}>
                {/* Group header */}
                {!navigation.sidebarCollapsed && (
                  <div className="px-4 mb-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                        {group.label}
                      </h3>
                      {group.collapsible && (
                        <button
                          onClick={() => toggleGroup(group.id)}
                          className="p-1 hover:bg-neutral-100 rounded"
                        >
                          <motion.div
                            animate={{ rotate: collapsedGroups.has(group.id) ? -90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            ↓
                          </motion.div>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Group items */}
                <AnimatePresence>
                  {(!group.collapsible || !collapsedGroups.has(group.id)) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-1 px-2"
                    >
                      {group.items.map(item => {
                        const isActive = pathname === item.href || 
                          (item.href !== '/' && pathname.startsWith(item.href));

                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => handleNavigation(item)}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2 rounded-lg
                              transition-all duration-200 text-left
                              ${isActive
                                ? 'bg-primary-50 text-primary-700 shadow-sm'
                                : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                              }
                              ${navigation.sidebarCollapsed ? 'justify-center' : ''}
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-lg flex-shrink-0">{item.icon}</span>
                            
                            {!navigation.sidebarCollapsed && (
                              <>
                                <span className="font-medium flex-1">{item.label}</span>
                                
                                {/* Badge */}
                                {item.badge && item.badge > 0 && (
                                  <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                                    {item.badge > 99 ? '99+' : item.badge}
                                  </span>
                                )}

                                {/* Tier indicator */}
                                {item.tier && item.tier !== 'basic' && (
                                  <span className={`
                                    w-2 h-2 rounded-full
                                    ${item.tier === 'premium'
                                      ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                                      : 'bg-gradient-to-r from-blue-400 to-cyan-400'
                                    }
                                  `} />
                                )}
                              </>
                            )}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        {!navigation.sidebarCollapsed && (
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-200 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">John Doe</p>
                <p className="text-xs text-neutral-500">john@example.com</p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
} 