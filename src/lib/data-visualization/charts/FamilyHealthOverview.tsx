'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVisualization, FamilyMember, Achievement, colorPalettes } from '../VisualizationProvider';

interface FamilyHealthOverviewProps {
  members: FamilyMember[];
  currentUserId: string;
  showPrivacyControls?: boolean;
  enableChallenges?: boolean;
  className?: string;
}

interface FamilyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'steps' | 'nutrition' | 'meditation' | 'water';
  startDate: Date;
  endDate: Date;
  participants: string[];
  progress: { [memberId: string]: number };
  target: number;
  reward: string;
}

export function FamilyHealthOverview({
  members = [],
  currentUserId,
  showPrivacyControls = true,
  enableChallenges = true,
  className = ''
}: FamilyHealthOverviewProps) {
  const { 
    isReducedMotion, 
    colorTheme, 
    announceDataChange,
    triggerAchievement 
  } = useVisualization();
  
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'challenges' | 'achievements'>('overview');
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);
  
  const colors = colorPalettes[colorTheme];
  
  // Sample family challenges
  const familyChallenges: FamilyChallenge[] = [
    {
      id: 'weekly-steps',
      title: '10K Steps Challenge',
      description: 'Everyone walks 10,000 steps daily for a week',
      type: 'steps',
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      participants: members.map(m => m.id),
      progress: members.reduce((acc, m) => ({ ...acc, [m.id]: Math.random() * 100 }), {}),
      target: 100,
      reward: 'Family movie night'
    },
    {
      id: 'hydration-hero',
      title: 'Hydration Heroes',
      description: 'Drink 8 glasses of water daily',
      type: 'water',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      participants: members.map(m => m.id),
      progress: members.reduce((acc, m) => ({ ...acc, [m.id]: Math.random() * 100 }), {}),
      target: 100,
      reward: 'Healthy smoothie party'
    }
  ];
  
  // Filter members based on privacy settings
  const visibleMembers = members.filter(member => 
    member.id === currentUserId || member.privacyLevel !== 'none'
  );
  
  // Handle member selection
  const handleMemberSelect = (member: FamilyMember) => {
    setSelectedMember(member);
    announceDataChange(`Selected ${member.name}'s health overview`);
  };
  
  // Get health status color
  const getHealthStatusColor = (score: number): string => {
    if (score >= 80) return colors.zones.optimal;
    if (score >= 60) return colors.zones.caution;
    return colors.zones.warning;
  };
  
  // Emergency simulation (for demo)
  const simulateEmergency = () => {
    setEmergencyAlert('John has requested emergency health assistance');
    announceDataChange('Emergency health alert triggered');
    
    setTimeout(() => setEmergencyAlert(null), 5000);
  };
  
  if (visibleMembers.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <span className="text-4xl mb-2 block">👨‍👩‍👧‍👦</span>
          <p>No family members visible</p>
          <p className="text-sm">Add family members or adjust privacy settings</p>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: isReducedMotion ? 0.1 : 0.5 }}
    >
      {/* Emergency Alert */}
      <AnimatePresence>
        {emergencyAlert && (
          <motion.div
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <span className="text-red-600 text-lg mr-3">🚨</span>
              <div>
                <h4 className="text-red-800 font-semibold">Emergency Alert</h4>
                <p className="text-red-700 text-sm">{emergencyAlert}</p>
              </div>
              <button
                onClick={() => setEmergencyAlert(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Family Health</h3>
          <div className="flex gap-2">
            {['overview', 'challenges', 'achievements'].map((view) => (
              <motion.button
                key={view}
                onClick={() => setActiveView(view as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition-colors ${
                  activeView === view
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={isReducedMotion ? {} : { scale: 1.02 }}
                whileTap={isReducedMotion ? {} : { scale: 0.98 }}
              >
                {view}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Family health summary */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {Math.round(visibleMembers.reduce((sum, m) => sum + m.healthScore, 0) / visibleMembers.length)}
            </div>
            <div className="text-sm text-gray-500">Average Health Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {visibleMembers.filter(m => new Date().getTime() - m.lastActivity.getTime() < 24 * 60 * 60 * 1000).length}
            </div>
            <div className="text-sm text-gray-500">Active Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {familyChallenges.filter(c => c.endDate > new Date()).length}
            </div>
            <div className="text-sm text-gray-500">Active Challenges</div>
          </div>
        </div>
      </div>
      
      {/* Content based on active view */}
      <AnimatePresence mode="wait">
        {activeView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: isReducedMotion ? 0.1 : 0.3 }}
          >
            {/* Family member cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {visibleMembers.map((member) => (
                <motion.div
                  key={member.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleMemberSelect(member)}
                  whileHover={isReducedMotion ? {} : { scale: 1.02 }}
                  whileTap={isReducedMotion ? {} : { scale: 0.98 }}
                >
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xl">{member.avatar}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.relationship}</p>
                    </div>
                    {member.privacyLevel === 'summary' && (
                      <div className="ml-auto">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Limited
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Health score */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Health Score</span>
                      <span className="text-sm font-medium" style={{ color: getHealthStatusColor(member.healthScore) }}>
                        {member.healthScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: getHealthStatusColor(member.healthScore) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${member.healthScore}%` }}
                        transition={{ duration: isReducedMotion ? 0.1 : 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  
                  {/* Last activity */}
                  <div className="text-xs text-gray-500">
                    Last activity: {member.lastActivity.toLocaleDateString()}
                  </div>
                  
                  {/* Recent achievements */}
                  {member.achievements.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {member.achievements.slice(0, 3).map((achievement) => (
                        <span
                          key={achievement.id}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                          title={achievement.description}
                        >
                          {achievement.title}
                        </span>
                      ))}
                      {member.achievements.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{member.achievements.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Emergency contact button (demo) */}
            <div className="text-center">
              <motion.button
                onClick={simulateEmergency}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                whileHover={isReducedMotion ? {} : { scale: 1.02 }}
                whileTap={isReducedMotion ? {} : { scale: 0.98 }}
              >
                🚨 Emergency Alert (Demo)
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {activeView === 'challenges' && enableChallenges && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: isReducedMotion ? 0.1 : 0.3 }}
          >
            <div className="space-y-4">
              {familyChallenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  className="p-4 border border-gray-200 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: isReducedMotion ? 0.1 : 0.3 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-800">{challenge.title}</h4>
                    <span className="text-sm text-gray-500">
                      {Math.ceil((challenge.endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000))} days left
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{challenge.description}</p>
                  
                  {/* Participant progress */}
                  <div className="space-y-2">
                    {challenge.participants.map((participantId) => {
                      const member = members.find(m => m.id === participantId);
                      const progress = challenge.progress[participantId] || 0;
                      
                      if (!member) return null;
                      
                      return (
                        <div key={participantId} className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm">{member.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{member.name}</span>
                              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className="bg-blue-600 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: isReducedMotion ? 0.1 : 0.8, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Reward */}
                  <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-yellow-800">
                      🏆 Reward: {challenge.reward}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {activeView === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: isReducedMotion ? 0.1 : 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleMembers.map((member) => (
                <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <span className="text-lg">{member.avatar}</span>
                    </div>
                    <h4 className="font-semibold text-gray-800">{member.name}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {member.achievements.slice(0, 5).map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        className={`p-2 rounded-lg ${
                          achievement.rarity === 'legendary' ? 'bg-purple-100 border border-purple-200' :
                          achievement.rarity === 'epic' ? 'bg-blue-100 border border-blue-200' :
                          achievement.rarity === 'rare' ? 'bg-green-100 border border-green-200' :
                          'bg-gray-100'
                        }`}
                        whileHover={isReducedMotion ? {} : { scale: 1.02 }}
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{achievement.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{achievement.title}</div>
                            <div className="text-xs text-gray-500">{achievement.date.toLocaleDateString()}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {member.achievements.length === 0 && (
                      <div className="text-center text-gray-500 py-4">
                        <span className="text-2xl mb-2 block">🏆</span>
                        <p className="text-sm">No achievements yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Selected member modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">{selectedMember.name}</h3>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600">Health Score</span>
                  <div className="text-2xl font-bold" style={{ color: getHealthStatusColor(selectedMember.healthScore) }}>
                    {selectedMember.healthScore}/100
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Recent Achievements</span>
                  <div className="mt-2 space-y-2">
                    {selectedMember.achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <span className="text-lg mr-2">{achievement.icon}</span>
                        <div>
                          <div className="text-sm font-medium">{achievement.title}</div>
                          <div className="text-xs text-gray-500">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedMember.privacyLevel === 'summary' && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-sm text-yellow-800">
                      <span className="font-medium">Limited Access:</span> Some health details are private
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 