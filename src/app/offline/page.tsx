'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Heart, 
  Activity, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { TouchButton } from '@/components/mobile/TouchOptimizedComponents';
import { ResponsiveContainer } from '@/components/mobile/ResponsiveLayout';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [offlineFeatures] = useState([
    { icon: Heart, title: 'Health Goals', description: 'Track your daily wellness targets' },
    { icon: Activity, title: 'Nutrition Logs', description: 'Log meals and activities offline' },
    { icon: Users, title: 'Family Profiles', description: 'View cached family member data' },
    { icon: Clock, title: 'Health History', description: 'Access recent health records' }
  ]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSyncTime(new Date());
      // Auto-redirect after showing success message
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetryConnection = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      // Trigger a fetch to test connectivity
      fetch('/api/health-check', { method: 'HEAD', cache: 'no-store' })
        .then(() => {
          setIsOnline(true);
          window.location.href = '/';
        })
        .catch(() => {
          // Still offline
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <ResponsiveContainer maxWidth="md" padding="lg" className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Connection Status */}
          <motion.div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 ${
              isOnline 
                ? 'bg-success-100 text-success-600' 
                : 'bg-neutral-100 text-neutral-400'
            }`}
            animate={isOnline ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {isOnline ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Wifi size={32} />
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <WifiOff size={32} />
              </motion.div>
            )}
          </motion.div>

          {/* Status Message */}
          <motion.div
            key={isOnline ? 'online' : 'offline'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOnline ? (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-success-600 mb-4">
                  You're Back Online!
                </h1>
                <p className="text-lg text-neutral-600 mb-4">
                  Connection restored. Redirecting you to Praneya...
                </p>
                <motion.div
                  className="inline-flex items-center text-success-600"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <CheckCircle size={20} className="mr-2" />
                  <span>Syncing your data</span>
                </motion.div>
              </div>
            ) : (
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-800 mb-4">
                  You're Currently Offline
                </h1>
                <p className="text-lg text-neutral-600 mb-6">
                  Don't worry! You can still access many features while we work to reconnect you.
                </p>
                
                <motion.div
                  className="inline-flex items-center text-amber-600 bg-amber-50 px-4 py-2 rounded-lg"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <AlertCircle size={20} className="mr-2" />
                  <span>Limited functionality available</span>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Available Offline Features */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-xl font-semibold text-neutral-800 mb-6">
                Available Offline Features
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offlineFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon size={24} className="text-primary-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-neutral-800 mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-4"
          >
            {!isOnline && (
              <TouchButton
                onClick={handleRetryConnection}
                size="lg"
                className="w-full sm:w-auto"
              >
                <RefreshCw size={20} className="mr-2" />
                Try to Reconnect
              </TouchButton>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TouchButton
                onClick={() => window.location.href = '/health/dashboard'}
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                <Activity size={18} className="mr-2" />
                View Health Dashboard
              </TouchButton>
              
              <TouchButton
                onClick={() => window.location.href = '/family'}
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                <Users size={18} className="mr-2" />
                Family Profiles
              </TouchButton>
            </div>
          </motion.div>

          {/* Last Sync Info */}
          {lastSyncTime && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-neutral-500">
                Last synced: {lastSyncTime.toLocaleString()}
              </p>
            </motion.div>
          )}

          {/* Tips for Offline Usage */}
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-12 bg-neutral-50 rounded-xl p-6 text-left"
            >
              <h3 className="font-semibold text-neutral-800 mb-4">
                Tips for Using Praneya Offline
              </h3>
              
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Your recent data is cached and available for viewing</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Log new health data - it will sync when you're back online</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Emergency features remain fully functional</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Check your connection settings if issues persist</span>
                </li>
              </ul>
            </motion.div>
          )}

          {/* Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="mt-16 flex items-center justify-center text-neutral-400"
          >
            <Heart size={16} className="mr-2" />
            <span className="text-sm">Praneya Healthcare - Always here for your family</span>
          </motion.div>
        </motion.div>
      </ResponsiveContainer>
    </div>
  );
} 