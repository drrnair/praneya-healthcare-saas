'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout, useSafeArea } from '../LayoutProvider';
import { useHealthcareTheme } from '@/lib/design-system/theme-provider';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  emergency?: boolean;
  tier?: 'basic' | 'enhanced' | 'premium';
}

interface FloatingActionButtonProps {
  className?: string;
  actions?: QuickAction[];
}

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    id: 'medication',
    label: 'Log Medication',
    icon: '💊',
    action: () => console.log('Log medication'),
    emergency: true
  },
  {
    id: 'vitals',
    label: 'Record Vitals',
    icon: '🫀',
    action: () => console.log('Record vitals')
  },
  {
    id: 'symptom',
    label: 'Log Symptom',
    icon: '🤒',
    action: () => console.log('Log symptom')
  },
  {
    id: 'emergency',
    label: 'Emergency',
    icon: '🚨',
    action: () => console.log('Emergency call'),
    emergency: true
  }
];

export function FloatingActionButton({ 
  className = '',
  actions = DEFAULT_ACTIONS 
}: FloatingActionButtonProps) {
  const { theme } = useHealthcareTheme();
  const { layout, navigation } = useLayout();
  const safeArea = useSafeArea();
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter actions based on tier
  const availableActions = actions.filter(action => {
    if (!action.tier) return true;
    
    const tierLevels = { basic: 1, enhanced: 2, premium: 3 };
    const userTierLevel = tierLevels[theme.tier] || 1;
    const requiredTierLevel = tierLevels[action.tier] || 1;
    
    return userTierLevel >= requiredTierLevel;
  });

  // Don't show if navigation setting is disabled
  if (!navigation.showFloatingAction) {
    return null;
  }

  const handleMainAction = () => {
    if (availableActions.length === 1) {
      availableActions[0].action();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleActionSelect = (action: QuickAction) => {
    action.action();
    setIsExpanded(false);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(action.emergency ? [50, 20, 50] : [10]);
    }
  };

  const fabPosition = {
    bottom: layout.isMobile 
      ? `${safeArea.bottom + (navigation.showBottomTabs ? 80 : 20)}px`
      : '24px',
    right: layout.isMobile 
      ? `${Math.max(safeArea.right, 16)}px`
      : '24px'
  };

  return (
    <div 
      className={`fixed z-40 ${className}`}
      style={fabPosition}
    >
      {/* Action menu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 right-0 space-y-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {availableActions.map((action, index) => (
              <motion.button
                key={action.id}
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full shadow-lg
                  transition-all duration-200 backdrop-blur-sm
                  ${action.emergency 
                    ? 'bg-error-500 hover:bg-error-600 text-white' 
                    : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${action.emergency ? 'focus:ring-error-300' : 'focus:ring-primary-300'}
                `}
                onClick={() => handleActionSelect(action)}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={action.label}
              >
                <span className="text-lg">{action.icon}</span>
                
                {/* Tooltip */}
                <div className={`
                  absolute right-16 top-1/2 transform -translate-y-1/2
                  bg-neutral-800 text-white text-xs px-2 py-1 rounded
                  whitespace-nowrap opacity-0 hover:opacity-100
                  transition-opacity duration-200 pointer-events-none
                `}>
                  {action.label}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        className={`
          flex items-center justify-center w-14 h-14 rounded-full shadow-lg
          bg-primary-500 hover:bg-primary-600 text-white
          transition-all duration-200 backdrop-blur-sm
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300
        `}
        onClick={handleMainAction}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isExpanded ? 45 : 0 }}
        aria-label={isExpanded ? 'Close quick actions' : 'Open quick actions'}
        aria-expanded={isExpanded}
      >
        <motion.span 
          className="text-xl"
          animate={{ rotate: isExpanded ? 45 : 0 }}
        >
          {availableActions.length === 1 ? availableActions[0].icon : '+'}
        </motion.span>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 