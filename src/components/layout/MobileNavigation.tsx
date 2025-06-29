'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  User,
  Bell,
  Heart,
  ChefHat,
  Stethoscope,
  Shield,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
  submenu?: NavigationItem[];
}

const HamburgerIcon: React.FC<{ isOpen: boolean; onToggle: () => void }> = ({ isOpen, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      className="relative w-11 h-11 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-200 flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ minHeight: '44px', minWidth: '44px' }}
    >
      <div className="w-6 h-6 relative">
        <motion.span
          className="absolute w-6 h-0.5 bg-neutral-700 rounded-full"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : -6,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute w-6 h-0.5 bg-neutral-700 rounded-full"
          animate={{
            opacity: isOpen ? 0 : 1,
            x: isOpen ? 10 : 0
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute w-6 h-0.5 bg-neutral-700 rounded-full"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 0 : 6,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </motion.button>
  );
};

const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
}> = ({ isOpen, onClose, navigationItems }) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const menuVariants = {
    closed: { x: '-100%' },
    open: { x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Praneya Healthcare</h2>
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-primary-100 text-sm">Premium Member</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="mb-2"
                >
                  <Link href={item.href}>
                    <motion.div
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-neutral-50 transition-colors"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                          <item.icon size={20} />
                        </div>
                        <span className="font-medium text-neutral-700">{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <div className="w-6 h-6 bg-error-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {item.badge > 99 ? '99+' : item.badge}
                        </div>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 + navigationItems.length * 0.05 }}
                className="mt-8 pt-4 border-t border-neutral-200"
              >
                <motion.button
                  className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-error-50 text-error-600 transition-colors"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-error-100 text-error-600 flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const BottomNavigation: React.FC<{
  activeTab: string;
  onTabChange: (tabId: string) => void;
  navigationItems: NavigationItem[];
}> = ({ activeTab, onTabChange, navigationItems }) => {
  const displayItems = navigationItems.slice(0, 5);

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200 z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {displayItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-[44px] min-h-[44px]",
                isActive 
                  ? "bg-primary-100 text-primary-600" 
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-error-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </motion.div>
                )}
              </div>
              
              <span className={cn(
                "text-xs font-medium mt-1 transition-colors",
                isActive ? "text-primary-600" : "text-neutral-500"
              )}>
                {item.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute top-0 left-1/2 w-8 h-1 bg-primary-500 rounded-full"
                  style={{ transform: 'translateX(-50%)' }}
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export const MobileNavigation: React.FC<{ className?: string }> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isMobile, setIsMobile] = useState(false);

  const navigationItems: NavigationItem[] = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'family', label: 'Family', icon: Users, href: '/family', badge: 2 },
    { id: 'meals', label: 'Meals', icon: ChefHat, href: '/meals' },
    { id: 'health', label: 'Health', icon: Stethoscope, href: '/health', badge: 1 },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' }
  ];

  const sideMenuItems: NavigationItem[] = [
    ...navigationItems,
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications', badge: 5 },
    { id: 'security', label: 'Security & Privacy', icon: Shield, href: '/security' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' }
  ];

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  if (!isMobile) return null;

  return (
    <div className={cn("lg:hidden", className)}>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-neutral-200 z-40"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <HamburgerIcon 
            isOpen={isMenuOpen} 
            onToggle={() => setIsMenuOpen(!isMenuOpen)} 
          />
          
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-neutral-800">Praneya</h1>
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          </div>

          <motion.button
            className="relative w-11 h-11 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-200 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={20} className="text-neutral-600" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
            >
              3
            </motion.div>
          </motion.button>
        </div>
      </motion.div>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigationItems={sideMenuItems}
      />

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        navigationItems={navigationItems}
      />

      <div style={{ height: 'calc(64px + env(safe-area-inset-top))' }} />
      <div style={{ height: 'calc(80px + env(safe-area-inset-bottom))' }} className="fixed bottom-0" />
    </div>
  );
}; 