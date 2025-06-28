'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMicroInteractions } from './MicroInteractionManager';

// Family Activity Indicator
interface FamilyActivityProps {
  familyMember: {
    name: string;
    avatar: string;
    activity: string;
    timestamp: string;
  };
  isVisible: boolean;
  onDismiss: () => void;
}

export function FamilyActivityIndicator({ familyMember, isVisible, onDismiss }: FamilyActivityProps) {
  const { triggerSocialFeedback, isReducedMotion } = useMicroInteractions();

  useEffect(() => {
    if (isVisible) {
      triggerSocialFeedback('activity');
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, triggerSocialFeedback, onDismiss]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-sm"
        initial={{ opacity: 0, x: 300, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 300, scale: 0.9 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
        onAnimationComplete={() => {
          setTimeout(onDismiss, 4000);
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="relative"
            animate={isReducedMotion ? {} : {
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={familyMember.avatar}
              alt={familyMember.name}
              className="w-10 h-10 rounded-full"
            />
            <motion.div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
              animate={isReducedMotion ? {} : {
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
          
          <div className="flex-1">
            <motion.p
              className="text-sm font-medium text-gray-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {familyMember.name}
            </motion.p>
            <motion.p
              className="text-xs text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {familyMember.activity}
            </motion.p>
            <motion.p
              className="text-xs text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {familyMember.timestamp}
            </motion.p>
          </div>
          
          <motion.button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 p-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Achievement Sharing Animation
interface AchievementSharingProps {
  achievementType: string;
  familyMembers: string[];
  isVisible: boolean;
  onComplete: () => void;
}

export function AchievementSharingAnimation({ 
  achievementType, 
  familyMembers, 
  isVisible, 
  onComplete 
}: AchievementSharingProps) {
  const { triggerSocialFeedback, isReducedMotion } = useMicroInteractions();

  useEffect(() => {
    if (isVisible) {
      triggerSocialFeedback('sharing');
    }
  }, [isVisible, triggerSocialFeedback]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onAnimationComplete={() => {
          setTimeout(onComplete, 3000);
        }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={isReducedMotion ? {} : {
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 1, repeat: 2 }}
            >
              <span className="text-2xl">🎉</span>
            </motion.div>
            
            <motion.h2
              className="text-xl font-bold text-gray-800 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Achievement Shared!
            </motion.h2>
            
            <motion.p
              className="text-gray-600 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your {achievementType} achievement has been shared with your family
            </motion.p>
            
            <motion.div
              className="flex justify-center gap-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {familyMembers.map((member, index) => (
                <motion.div
                  key={member}
                  className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center text-xs"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {member[0]}
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div
              className="bg-purple-50 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-purple-700">
                Your family will be notified and can celebrate with you!
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Emergency Contact Activation
interface EmergencyContactProps {
  contactName: string;
  contactType: 'family' | 'doctor' | 'emergency';
  isVisible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function EmergencyContactActivation({ 
  contactName, 
  contactType, 
  isVisible, 
  onCancel, 
  onConfirm 
}: EmergencyContactProps) {
  const { triggerSocialFeedback, isReducedMotion } = useMicroInteractions();
  const [countdown, setCountdown] = useState(10);

  const contactConfig = {
    family: { emoji: '👨‍👩‍👧‍👦', color: 'blue', urgency: 'medium' },
    doctor: { emoji: '👩‍⚕️', color: 'green', urgency: 'high' },
    emergency: { emoji: '🚨', color: 'red', urgency: 'critical' }
  };

  const config = contactConfig[contactType];

  useEffect(() => {
    if (isVisible) {
      triggerSocialFeedback('emergency');
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onConfirm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isVisible, triggerSocialFeedback, onConfirm]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border-l-4 border-${config.color}-500`}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            y: 0,
            ...(config.urgency === 'critical' && !isReducedMotion ? {
              x: [0, -3, 3, -3, 3, 0]
            } : {})
          }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-start gap-4">
            <motion.div
              className={`w-12 h-12 bg-${config.color}-100 rounded-full flex items-center justify-center`}
              animate={isReducedMotion ? {} : {
                scale: config.urgency === 'critical' ? [1, 1.2, 1] : [1, 1.1, 1],
                backgroundColor: config.urgency === 'critical' ? 
                  ['#FEE2E2', '#FECACA', '#FEE2E2'] : 
                  [`#${config.color === 'blue' ? 'DBEAFE' : config.color === 'green' ? 'D1FAE5' : 'FEE2E2'}`]
              }}
              transition={{ 
                duration: config.urgency === 'critical' ? 0.3 : 0.6,
                repeat: config.urgency === 'critical' ? Infinity : 2
              }}
            >
              <span className="text-xl">{config.emoji}</span>
            </motion.div>
            
            <div className="flex-1">
              <motion.h3
                className={`font-bold text-${config.color}-800 mb-2`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Emergency Contact Activation
              </motion.h3>
              
              <motion.p
                className={`text-${config.color}-700 mb-4`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Contacting {contactName} in {countdown} seconds...
              </motion.p>
              
              <motion.div
                className="bg-gray-50 rounded-lg p-3 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-sm text-gray-600">
                  {contactType === 'emergency' && 'Emergency services will be notified of your location and medical information.'}
                  {contactType === 'doctor' && 'Your healthcare provider will receive your current health status and location.'}
                  {contactType === 'family' && 'Your family members will be notified that you need assistance.'}
                </p>
              </motion.div>
              
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-2 bg-${config.color}-600 text-white rounded-lg font-medium hover:bg-${config.color}-700 transition-colors`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Now
                </motion.button>
              </motion.div>
            </div>
          </div>
          
          {/* Countdown indicator */}
          <motion.div
            className={`absolute bottom-0 left-0 h-1 bg-${config.color}-500 rounded-b-lg`}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 10, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 