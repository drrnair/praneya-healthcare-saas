'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Heart, 
  Target, 
  Calendar, 
  Shield, 
  Trophy, 
  AlertTriangle,
  ChevronRight,
  Eye,
  EyeOff,
  Bell,
  Activity,
  PlusCircle,
  Settings
} from 'lucide-react';
import { useFamilyData } from '../hooks/useFamilyData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { 
  FamilyComponentProps, 
  FamilyMember, 
  FamilyGoal, 
  FamilyAchievement,
  PrivacyLevel,
  FamilyMemberHealthSummary 
} from '@/types/family';

interface FamilyDashboardOverviewProps extends FamilyComponentProps {
  showPrivacyControls?: boolean;
  enableQuickActions?: boolean;
  compactView?: boolean;
}

export function FamilyDashboardOverview({
  familyId,
  currentUserId,
  userRole,
  permissions,
  privacyLevel,
  showPrivacyControls = true,
  enableQuickActions = true,
  compactView = false,
  className = '',
  onAction,
  onError
}: FamilyDashboardOverviewProps) {
  const { 
    familyAccount,
    members,
    healthOverview,
    activeChallenges,
    recentAchievements,
    loading,
    error,
    updatePrivacySettings,
    addFamilyGoal,
    celebrateAchievement
  } = useFamilyData(familyId);

  const [activeTab, setActiveTab] = useState('overview');
  const [privacyControlsOpen, setPrivacyControlsOpen] = useState(false);
  const [memberHealthSummaries, setMemberHealthSummaries] = useState<FamilyMemberHealthSummary[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    if (members.length > 0) {
      const summaries: FamilyMemberHealthSummary[] = members.map(member => ({
        member_id: member.id,
        display_name: member.display_name,
        health_status: ['excellent', 'good', 'fair', 'needs_attention'][Math.floor(Math.random() * 4)] as any,
        last_check_in: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        active_goals: Math.floor(Math.random() * 5) + 1,
        recent_achievements: Math.floor(Math.random() * 3),
        privacy_level: member.privacy_preferences.health_data_visibility,
        emergency_alerts: Math.random() > 0.8,
        requires_follow_up: Math.random() > 0.7,
        provider_notifications: Math.floor(Math.random() * 2)
      }));
      setMemberHealthSummaries(summaries);
    }
  }, [members]);

  const mockFamilyGoals: FamilyGoal[] = [
    {
      id: '1',
      title: 'Increase Family Vegetable Intake',
      description: 'Each family member aims to eat 5 servings of vegetables daily',
      category: 'nutrition',
      target_members: members.map(m => m.id),
      participating_members: members.map(m => m.id),
      target_value: 35,
      current_value: 23,
      unit: 'servings/week',
      target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: currentUserId,
      created_at: new Date().toISOString(),
      status: 'active',
      privacy_level: 'family',
      celebration_settings: {
        enabled: true,
        celebration_types: [],
        notification_preferences: {
          immediate_family: true,
          extended_family: false,
          family_calendar: true,
          achievement_board: true,
          social_sharing: false,
          custom_recipients: []
        },
        sharing_preferences: {
          within_app: true,
          external_social: false,
          healthcare_providers: false,
          family_newsletter: true,
          photo_sharing: false,
          privacy_controls: 'family'
        },
        custom_messages: true,
        family_traditions: []
      }
    },
    {
      id: '2',
      title: 'Family Walking Challenge',
      description: 'Walk together for 30 minutes, 5 times per week',
      category: 'activity',
      target_members: members.map(m => m.id),
      participating_members: members.slice(0, 3).map(m => m.id),
      target_value: 150,
      current_value: 90,
      unit: 'minutes/week',
      target_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: currentUserId,
      created_at: new Date().toISOString(),
      status: 'active',
      privacy_level: 'family',
      celebration_settings: {
        enabled: true,
        celebration_types: [],
        notification_preferences: {
          immediate_family: true,
          extended_family: false,
          family_calendar: true,
          achievement_board: true,
          social_sharing: false,
          custom_recipients: []
        },
        sharing_preferences: {
          within_app: true,
          external_social: false,
          healthcare_providers: false,
          family_newsletter: true,
          photo_sharing: false,
          privacy_controls: 'family'
        },
        custom_messages: true,
        family_traditions: []
      }
    }
  ];

  const mockRecentAchievements: FamilyAchievement[] = [
    {
      id: '1',
      title: 'Healthy Week Champion',
      description: 'Completed all nutritional goals for the week',
      achieved_by: [members[0]?.id || ''],
      achieved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'nutrition',
      points_earned: 100,
      badge_icon: '🥗',
      celebration_level: 'family',
      shared_publicly: false
    },
    {
      id: '2',
      title: 'Family Meal Prep Masters',
      description: 'Successfully planned and prepared all family meals for the week',
      achieved_by: members.map(m => m.id),
      achieved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'collaboration',
      points_earned: 250,
      badge_icon: '👨‍🍳',
      celebration_level: 'family',
      shared_publicly: true
    }
  ];

  const getHealthStatusColor = (status: string) => {
    const colors = {
      excellent: 'text-green-600 bg-green-50 border-green-200',
      good: 'text-blue-600 bg-blue-50 border-blue-200',
      fair: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      needs_attention: 'text-red-600 bg-red-50 border-red-200',
      private: 'text-gray-600 bg-gray-50 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.private;
  };

  const getPrivacyIcon = (level: PrivacyLevel) => {
    const isRestricted = ['private', 'parents_only', 'guardians_only'].includes(level);
    return isRestricted ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />;
  };

  const handleQuickAction = (action: string, data?: any) => {
    onAction?.(action, data);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Failed to load family dashboard: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Family Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {familyAccount?.name || 'Family Dashboard'}
              </h1>
              <p className="text-gray-600">
                {members.length} member{members.length !== 1 ? 's' : ''} • {familyAccount?.subscription_tier || 'Premium'} Plan
              </p>
            </div>
          </div>
          
          {showPrivacyControls && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPrivacyControlsOpen(!privacyControlsOpen)}
                className="flex items-center space-x-1"
              >
                {getPrivacyIcon(privacyLevel)}
                <span>Privacy</span>
              </Button>
              
              {enableQuickActions && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction('open_settings')}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Health Status</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {memberHealthSummaries.filter(m => m.health_status === 'excellent' || m.health_status === 'good').length}/{members.length} Good
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Active Goals</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {mockFamilyGoals.filter(g => g.status === 'active').length} Goals
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">This Week</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {mockRecentAchievements.length} Achievement{mockRecentAchievements.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Meal Plans</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">3 Active</p>
          </div>
        </div>
      </motion.div>

      {/* Privacy Controls Panel */}
      <AnimatePresence>
        {privacyControlsOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Privacy Settings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-yellow-800">Health Data Sharing</label>
                <select className="mt-1 w-full px-3 py-2 border border-yellow-300 rounded-md bg-white">
                  <option>Family</option>
                  <option>Parents Only</option>
                  <option>Private</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-yellow-800">Emergency Access</label>
                <select className="mt-1 w-full px-3 py-2 border border-yellow-300 rounded-md bg-white">
                  <option>Full Access</option>
                  <option>Medical Only</option>
                  <option>Basic Info</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-yellow-800">Goal Visibility</label>
                <select className="mt-1 w-full px-3 py-2 border border-yellow-300 rounded-md bg-white">
                  <option>Family</option>
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Family Members Health Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span>Family Health Overview</span>
              </CardTitle>
              <CardDescription>
                Privacy-appropriate health summaries for all family members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memberHealthSummaries.map((summary) => {
                  const member = members.find(m => m.id === summary.member_id);
                  const canViewDetails = summary.privacy_level === 'family' || summary.privacy_level === 'public';
                  
                  return (
                    <motion.div
                      key={summary.member_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-lg border-2 ${getHealthStatusColor(summary.health_status)}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{summary.display_name}</h3>
                        <div className="flex items-center space-x-1">
                          {getPrivacyIcon(summary.privacy_level)}
                          {summary.emergency_alerts && (
                            <Bell className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status:</span>
                          <Badge variant="outline" className={getHealthStatusColor(summary.health_status)}>
                            {canViewDetails ? summary.health_status.replace('_', ' ') : 'Private'}
                          </Badge>
                        </div>
                        
                        {canViewDetails && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Active Goals:</span>
                              <span className="font-medium">{summary.active_goals}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Recent Wins:</span>
                              <span className="font-medium">{summary.recent_achievements}</span>
                            </div>
                            
                            <div className="text-xs text-gray-500">
                              Last check-in: {new Date(summary.last_check_in).toLocaleDateString()}
                            </div>
                          </>
                        )}
                        
                        {summary.requires_follow_up && canViewDetails && (
                          <Alert className="mt-2 py-2">
                            <AlertTriangle className="h-3 w-3" />
                            <AlertDescription className="text-xs">
                              Follow-up recommended
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {enableQuickActions && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common family health management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('create_meal_plan')}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <Calendar className="h-6 w-6 text-green-600" />
                    <span className="text-sm">Plan Meals</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('add_family_goal')}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <Target className="h-6 w-6 text-blue-600" />
                    <span className="text-sm">New Goal</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('invite_member')}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <PlusCircle className="h-6 w-6 text-purple-600" />
                    <span className="text-sm">Add Member</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleQuickAction('emergency_info')}
                    className="flex flex-col items-center space-y-2 h-auto py-4"
                  >
                    <Shield className="h-6 w-6 text-red-600" />
                    <span className="text-sm">Emergency</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Family Health Goals</span>
              </CardTitle>
              <CardDescription>
                Collaborative goals with mutual support and tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFamilyGoals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <Badge variant="outline" className="capitalize">
                        {goal.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.current_value}/{goal.target_value} {goal.unit}</span>
                      </div>
                      <Progress 
                        value={(goal.current_value / goal.target_value) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>{goal.participating_members.length} participating</span>
                      <span>Due {new Date(goal.target_date).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Family Achievements</span>
              </CardTitle>
              <CardDescription>
                Celebrating family health milestones and successes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.badge_icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{achievement.achieved_by.length} member{achievement.achieved_by.length !== 1 ? 's' : ''}</span>
                          <span>{achievement.points_earned} points</span>
                          <span>{new Date(achievement.achieved_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <Shield className="h-5 w-5 text-red-600" />
                <span>Emergency Health Information</span>
              </CardTitle>
              <CardDescription className="text-red-700">
                Critical health information accessible to authorized family members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="border-red-300 bg-red-100">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    Emergency access requires appropriate permissions and is fully audited for HIPAA compliance.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="flex items-center justify-between p-4 h-auto border-red-200 hover:bg-red-50"
                    onClick={() => handleQuickAction('emergency_contacts')}
                  >
                    <div className="text-left">
                      <div className="font-medium text-red-800">Emergency Contacts</div>
                      <div className="text-sm text-red-600">View contact information</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-600" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center justify-between p-4 h-auto border-red-200 hover:bg-red-50"
                    onClick={() => handleQuickAction('medical_information')}
                  >
                    <div className="text-left">
                      <div className="font-medium text-red-800">Medical Information</div>
                      <div className="text-sm text-red-600">Allergies, medications, conditions</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-600" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center justify-between p-4 h-auto border-red-200 hover:bg-red-50"
                    onClick={() => handleQuickAction('healthcare_providers')}
                  >
                    <div className="text-left">
                      <div className="font-medium text-red-800">Healthcare Providers</div>
                      <div className="text-sm text-red-600">Primary care, specialists</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-600" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex items-center justify-between p-4 h-auto border-red-200 hover:bg-red-50"
                    onClick={() => handleQuickAction('break_glass_access')}
                  >
                    <div className="text-left">
                      <div className="font-medium text-red-800">Break Glass Access</div>
                      <div className="text-sm text-red-600">Emergency medical data</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 