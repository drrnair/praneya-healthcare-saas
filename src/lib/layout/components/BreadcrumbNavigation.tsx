'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useLayout } from '../LayoutProvider';

interface Breadcrumb {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavigationProps {
  customBreadcrumbs?: Breadcrumb[];
  className?: string;
}

// Healthcare-specific route mapping
const ROUTE_MAPPING: Record<string, { label: string; icon?: React.ReactNode }> = {
  '/dashboard': { label: 'Dashboard', icon: '🏠' },
  '/health': { label: 'Health Overview', icon: '💚' },
  '/medications': { label: 'Medications', icon: '💊' },
  '/medications/log': { label: 'Log Medication' },
  '/medications/reminders': { label: 'Reminders' },
  '/family': { label: 'Family Hub', icon: '👨‍👩‍👧‍👦' },
  '/family/members': { label: 'Members' },
  '/family/goals': { label: 'Shared Goals' },
  '/appointments': { label: 'Appointments', icon: '📅' },
  '/analytics': { label: 'Analytics', icon: '📊' },
  '/settings': { label: 'Settings', icon: '⚙️' },
  '/settings/profile': { label: 'Profile' },
  '/settings/privacy': { label: 'Privacy' }
};

export function BreadcrumbNavigation({ 
  customBreadcrumbs,
  className = '' 
}: BreadcrumbNavigationProps) {
  const { navigation } = useLayout();
  const pathname = usePathname();
  const router = useRouter();

  // Don't show breadcrumbs if disabled or on mobile
  if (!navigation.showBreadcrumbs) {
    return null;
  }

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = (): Breadcrumb[] => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [];

    // Always start with Dashboard (unless we're already there)
    if (pathname !== '/dashboard') {
      breadcrumbs.push({
        label: 'Dashboard',
        href: '/dashboard',
        icon: '🏠'
      });
    }

    // Build breadcrumbs from path segments
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      const routeInfo = ROUTE_MAPPING[currentPath];
      if (routeInfo) {
        breadcrumbs.push({
          label: routeInfo.label,
          href: currentPath,
          icon: routeInfo.icon
        });
      } else {
        // Fallback: capitalize segment name
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
          href: currentPath
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if only one breadcrumb (current page)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (href: string, index: number) => {
    // Don't navigate if it's the current page (last breadcrumb)
    if (index < breadcrumbs.length - 1) {
      router.push(href);
    }
  };

  return (
    <nav 
      className={`flex items-center space-x-1 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={breadcrumb.href} className="flex items-center">
              {/* Separator */}
              {index > 0 && (
                <motion.span 
                  className="mx-2 text-neutral-400"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  /
                </motion.span>
              )}

              {/* Breadcrumb item */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {isLast ? (
                  // Current page (not clickable)
                  <span 
                    className="flex items-center gap-1 text-neutral-900 font-medium"
                    aria-current="page"
                  >
                    {breadcrumb.icon && (
                      <span className="text-base">{breadcrumb.icon}</span>
                    )}
                    {breadcrumb.label}
                  </span>
                ) : (
                  // Clickable breadcrumb
                  <button
                    onClick={() => handleBreadcrumbClick(breadcrumb.href, index)}
                    className={`
                      flex items-center gap-1 text-neutral-600 hover:text-neutral-900
                      transition-colors duration-200 rounded px-2 py-1
                      hover:bg-neutral-100 focus:outline-none focus:ring-2 
                      focus:ring-primary-300 focus:bg-neutral-100
                    `}
                    aria-label={`Go to ${breadcrumb.label}`}
                  >
                    {breadcrumb.icon && (
                      <span className="text-base">{breadcrumb.icon}</span>
                    )}
                    {breadcrumb.label}
                  </button>
                )}
              </motion.div>
            </li>
          );
        })}
      </ol>

      {/* Quick actions for current page */}
      <div className="ml-auto flex items-center gap-2">
        {/* Back button */}
        <motion.button
          onClick={() => window.history.back()}
          className={`
            p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100
            rounded transition-colors duration-200 focus:outline-none 
            focus:ring-2 focus:ring-primary-300
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go back"
        >
          ←
        </motion.button>

        {/* Forward button */}
        <motion.button
          onClick={() => window.history.forward()}
          className={`
            p-1.5 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100
            rounded transition-colors duration-200 focus:outline-none 
            focus:ring-2 focus:ring-primary-300
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Go forward"
        >
          →
        </motion.button>
      </div>
    </nav>
  );
}

// Hook for managing custom breadcrumbs
export function useBreadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = React.useState<Breadcrumb[]>([]);

  const updateBreadcrumbs = (newBreadcrumbs: Breadcrumb[]) => {
    setBreadcrumbs(newBreadcrumbs);
  };

  const addBreadcrumb = (breadcrumb: Breadcrumb) => {
    setBreadcrumbs(prev => [...prev, breadcrumb]);
  };

  const removeBreadcrumb = (href: string) => {
    setBreadcrumbs(prev => prev.filter(b => b.href !== href));
  };

  const clearBreadcrumbs = () => {
    setBreadcrumbs([]);
  };

  return {
    breadcrumbs,
    updateBreadcrumbs,
    addBreadcrumb,
    removeBreadcrumb,
    clearBreadcrumbs
  };
} 