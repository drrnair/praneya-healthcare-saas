// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Shield, 
  Heart, 
  Calendar, 
  Settings, 
  Trophy, 
  Target,
  UserPlus,
  Crown,
  Baby,
  GraduationCap,
  Activity,
  Eye,
  EyeOff,
  Bell,
  Lock,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function FamilyManagementDemo() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Mock family data
  const familyData = {
    account: {
      id: 'family-123',
      name: 'Johnson Family',
      memberCount: 4,
      maxMembers: 6,
      planTier: 'Premium',
      subscriptionStatus: 'active'
    },
    members: [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'head',
        ageGroup: 'adult',
        relationship: 'self',
        avatar: '/avatars/sarah.jpg',
        status: 'active',
        privacyLevel: 'family',
        healthStatus: 'excellent',
        activeGoals: 3,
        recentAchievements: 2,
        permissions: ['admin', 'billing', 'member_management'],
        emergencyPriority: 1,
        lastActive: '2 minutes ago'
      },
      {
        id: '2',
        name: 'Mike Johnson',
        role: 'parent',
        ageGroup: 'adult',
        relationship: 'spouse',
        avatar: '/avatars/mike.jpg',
        status: 'active',
        privacyLevel: 'family',
        healthStatus: 'good',
        activeGoals: 2,
        recentAchievements: 1,
        permissions: ['parental_controls', 'emergency_access'],
        emergencyPriority: 2,
        lastActive: '1 hour ago'
      },
      {
        id: '3',
        name: 'Emma Johnson',
        role: 'teen',
        ageGroup: 'teen',
        relationship: 'daughter',
        avatar: '/avatars/emma.jpg',
        status: 'active',
        privacyLevel: 'parents_only',
        healthStatus: 'good',
        activeGoals: 4,
        recentAchievements: 3,
        permissions: ['basic_access', 'goal_participation'],
        emergencyPriority: 3,
        lastActive: '30 minutes ago'
      },
      {
        id: '4',
        name: 'Alex Johnson',
        role: 'child',
        ageGroup: 'child',
        relationship: 'son',
        avatar: '/avatars/alex.jpg',
        status: 'active',
        privacyLevel: 'guardians_only',
        healthStatus: 'private',
        activeGoals: 2,
        recentAchievements: 1,
        permissions: ['supervised_access'],
        emergencyPriority: 4,
        lastActive: '45 minutes ago'
      }
    ],
    goals: [
      {
        id: '1',
        title: 'Family Vegetable Challenge',
        description: 'Eat 5 servings of vegetables daily',
        category: 'nutrition',
        progress: 65,
        target: '35 servings/week',
        current: '23 servings',
        participants: 4,
        dueDate: '2024-02-15'
      },
      {
        id: '2',
        title: 'Walking Together',
        description: '30 minutes family walk, 5 times per week',
        category: 'activity',
        progress: 80,
        target: '150 minutes/week',
        current: '120 minutes',
        participants: 3,
        dueDate: '2024-02-01'
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Healthy Week Champion',
        description: 'Sarah completed all nutritional goals',
        icon: '🥗',
        points: 100,
        achievedBy: ['Sarah Johnson'],
        date: '2 days ago'
      },
      {
        id: '2',
        title: 'Family Meal Prep Masters',
        description: 'Everyone helped with weekly meal prep',
        icon: '👨‍🍳',
        points: 250,
        achievedBy: ['Whole Family'],
        date: '5 days ago'
      }
    ]
  };

  const getRoleIcon = (role: string) => {
    const icons = {
      head: Crown,
      parent: Users,
      adult: Users,
      teen: GraduationCap,
      child: Baby
    };
    return icons[role as keyof typeof icons] || Users;
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Praneya Family Management System
                </h1>
                <p className="text-sm text-gray-600">
                  Comprehensive family health management with privacy protection
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">HIPAA Compliant</Badge>
              <Badge className="bg-blue-100 text-blue-800">Premium Features</Badge>
              <Badge className="bg-purple-100 text-purple-800">Family Plan</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="collaboration">Planning</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="parental">Parental</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Family Overview Header */}
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
                    <h1 className="text-2xl font-bold text-gray-900">{familyData.account.name}</h1>
                    <p className="text-gray-600">
                      {familyData.account.memberCount} members • {familyData.account.planTier} Plan • HIPAA Compliant
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">All Systems Active</Badge>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-1" />
                    Privacy Controls
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-gray-600">Health Status</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-1">3/4 Good+</p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Active Goals</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-1">11 Goals</p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-600">This Week</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-1">7 Achievements</p>
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

            {/* Family Members Health Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Family Health Overview</span>
                </CardTitle>
                <CardDescription>
                  Privacy-appropriate health summaries with role-based access controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {familyData.members.map((member) => {
                    const RoleIcon = getRoleIcon(member.role);
                    const canViewDetails = member.privacyLevel === 'family' || member.privacyLevel === 'public';
                    
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getHealthStatusColor(member.healthStatus)}`}
                        onClick={() => setSelectedMember(member.id)}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-1 -right-1 p-1 bg-blue-600 rounded-full">
                              <RoleIcon className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.relationship}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="capitalize text-sm">{member.role}</Badge>
                              {member.privacyLevel === 'private' || member.privacyLevel === 'guardians_only' ? (
                                <EyeOff className="h-3 w-3 text-gray-400" />
                              ) : (
                                <Eye className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {canViewDetails ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Health Status:</span>
                              <Badge variant="outline" className="capitalize">
                                {member.healthStatus}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Active Goals:</span>
                              <span className="font-medium">{member.activeGoals}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Recent Wins:</span>
                              <span className="font-medium">{member.recentAchievements}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Last active: {member.lastActive}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2">
                            <Lock className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">Privacy Protected</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common family health management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                    <Calendar className="h-6 w-6 text-green-600" />
                    <span className="text-sm">Plan Meals</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                    <Target className="h-6 w-6 text-blue-600" />
                    <span className="text-sm">New Goal</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                    <UserPlus className="h-6 w-6 text-purple-600" />
                    <span className="text-sm">Add Member</span>
                  </Button>
                  
                  <Button variant="outline" className="flex flex-col items-center space-y-2 h-auto py-4">
                    <Shield className="h-6 w-6 text-red-600" />
                    <span className="text-sm">Emergency</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Member Management</h2>
                <p className="text-gray-600">Invite, manage, and configure family member access</p>
              </div>
              <Button className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Invite Member</span>
              </Button>
            </div>

            {/* Family Tree Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Visual Family Tree</span>
                </CardTitle>
                <CardDescription>Hierarchical view of family relationships and access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Head of Family */}
                  <div className="flex justify-center">
                    <div className="relative p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="relative">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback>SJ</AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-1 -right-1 p-1 bg-blue-600 rounded-full">
                            <Crown className="h-3 w-3 text-white" />
                          </div>
                        </div>
                        <h3 className="font-semibold text-sm">Sarah Johnson</h3>
                        <Badge className="bg-blue-100 text-blue-800">Head of Family</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Other Members */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {familyData.members.slice(1).map((member) => {
                      const RoleIcon = getRoleIcon(member.role);
                      const isOnline = ['2 minutes ago', '30 minutes ago', '45 minutes ago'].includes(member.lastActive);
                      
                      return (
                        <div key={member.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              {isOnline && (
                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{member.name}</h3>
                              <p className="text-xs text-gray-500">{member.relationship}</p>
                              <Badge className="mt-1 capitalize text-sm">{member.role}</Badge>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-between text-xs">
                            <span className="text-gray-600">Permissions: {member.permissions.length}</span>
                            <span className="text-gray-600">Privacy: {member.privacyLevel}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>Family Plan Usage</span>
                </CardTitle>
                <CardDescription>Track family plan limits and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Members</h3>
                    <div className="flex items-center space-x-2">
                      <Progress value={(familyData.account.memberCount / familyData.account.maxMembers) * 100} className="flex-1" />
                      <span className="text-sm text-gray-600">
                        {familyData.account.memberCount}/{familyData.account.maxMembers}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {familyData.account.maxMembers - familyData.account.memberCount} slots remaining
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Storage</h3>
                    <div className="flex items-center space-x-2">
                      <Progress value={35} className="flex-1" />
                      <span className="text-sm text-gray-600">3.5GB/10GB</span>
                    </div>
                    <p className="text-xs text-gray-500">6.5GB available</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Plan Tier</h3>
                    <Badge className="bg-purple-100 text-purple-800">FAMILY PREMIUM</Badge>
                    <p className="text-xs text-gray-500">$29.99/month</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Next Billing</h3>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-900">Feb 15, 2024</span>
                    </div>
                    <p className="text-xs text-gray-500">Auto-renewal enabled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Collaboration Tab */}
          <TabsContent value="collaboration" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Collaborative Health Planning</h2>
              <p className="text-gray-600">Shared goals, meal planning, and family health challenges</p>
            </div>

            {/* Family Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Family Health Goals</span>
                </CardTitle>
                <CardDescription>Collaborative goals with mutual support and tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyData.goals.map((goal) => (
                    <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <Badge variant="outline" className="capitalize">{goal.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{goal.current}/{goal.target}</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>{goal.participants} participating members</span>
                        <span>Due {goal.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Collaborative Meal Planning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span>Family Meal Planning</span>
                </CardTitle>
                <CardDescription>Shared meal calendar with dietary preferences integration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">This Week's Meals</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded border">
                        <span className="text-sm">Monday Dinner</span>
                        <span className="text-sm font-medium">Grilled Salmon & Vegetables</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded border">
                        <span className="text-sm">Tuesday Dinner</span>
                        <span className="text-sm font-medium">Chicken Stir-Fry</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-purple-50 rounded border">
                        <span className="text-sm">Wednesday Dinner</span>
                        <span className="text-sm font-medium">Vegetarian Pasta</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Dietary Considerations</h3>
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-red-600 bg-red-50">Emma: Nut Allergy</Badge>
                      <Badge variant="outline" className="text-blue-600 bg-blue-50">Alex: Lactose Sensitive</Badge>
                      <Badge variant="outline" className="text-green-600 bg-green-50">Mike: Low Sodium</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Family Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Recent Achievements</span>
                </CardTitle>
                <CardDescription>Celebrating family health milestones together</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyData.achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>{achievement.achievedBy.join(', ')}</span>
                            <span>{achievement.points} points</span>
                            <span>{achievement.date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Privacy Control Center</h2>
              <p className="text-gray-600">Comprehensive privacy settings and data sharing controls</p>
            </div>

            {/* Privacy Overview */}
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                All family data is HIPAA-compliant with comprehensive audit logging. Family members can only access data appropriate to their role and permissions.
              </AlertDescription>
            </Alert>

            {/* Individual Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span>Individual Data Visibility</span>
                </CardTitle>
                <CardDescription>Control what health information each family member can see</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {familyData.members.map((member) => (
                    <div key={member.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold">{member.name}</h3>
                        </div>
                        <Badge variant="outline">{member.privacyLevel}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Health Data Sharing</h4>
                          <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                            <option value="family">Family</option>
                            <option value="parents_only">Parents Only</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Emergency Access</h4>
                          <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                            <option value="full">Full Access</option>
                            <option value="medical">Medical Only</option>
                            <option value="basic">Basic Info</option>
                            <option value="none">No Access</option>
                          </select>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Provider Communication</h4>
                          <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                            <option value="enabled">Enabled</option>
                            <option value="supervised">Supervised</option>
                            <option value="disabled">Disabled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Access Configuration */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span>Emergency Access Protocols</span>
                </CardTitle>
                <CardDescription className="text-red-700">
                  Configure break-glass access for medical emergencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Emergency Contacts</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Dr. Smith (Primary Care)</span>
                        <Badge className="text-xs px-2 py-1 bg-green-100 text-green-800">Full Access</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Grandma Johnson</span>
                        <Badge className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800">Basic Info</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Uncle Mark</span>
                        <Badge className="text-xs px-2 py-1 bg-blue-100 text-blue-800">Contact Only</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Access Audit Log</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>No emergency access events in the last 30 days</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>Last audit: {new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        <span>All access attempts logged and monitored</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parental Controls Tab */}
          <TabsContent value="parental" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Parental Controls & Child Safety</h2>
              <p className="text-gray-600">Age-appropriate interfaces and COPPA-compliant safety measures</p>
            </div>

            {/* COPPA Compliance */}
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                All child accounts are COPPA-compliant with verified parental consent and appropriate data protection measures.
              </AlertDescription>
            </Alert>

            {/* Child Account Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Baby className="h-5 w-5 text-purple-600" />
                  <span>Child Account Management</span>
                </CardTitle>
                <CardDescription>Age-appropriate access controls and content filtering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {familyData.members.filter(m => m.role === 'child' || m.role === 'teen').map((child) => (
                    <div key={child.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{child.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{child.name}</h3>
                            <p className="text-sm text-gray-600">{child.ageGroup} • {child.role}</p>
                          </div>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">
                          {child.role === 'child' ? 'Full Supervision' : 'Partial Supervision'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Content Filtering</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span>Age-appropriate content</span>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Medical terminology filtering</span>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex justify-between items-center">
                              <span>External link restrictions</span>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Time Restrictions</h4>
                          <div className="space-y-2 text-sm">
                            {child.role === 'child' && (
                              <>
                                <div className="flex justify-between">
                                  <span>Daily limit</span>
                                  <span>2 hours</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Bedtime restriction</span>
                                  <span>8 PM - 7 AM</span>
                                </div>
                              </>
                            )}
                            {child.role === 'teen' && (
                              <>
                                <div className="flex justify-between">
                                  <span>School hours</span>
                                  <span>8 AM - 3 PM</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Weekend extended</span>
                                  <span>4 hours</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Supervision</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span>Activity monitoring</span>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Data entry supervision</span>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Guardian notifications</span>
                              <Bell className="h-4 w-4 text-blue-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Educational Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <span>Educational Features</span>
                </CardTitle>
                <CardDescription>Age-appropriate health education and gamification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Learning Features</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">Nutrition Education</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm">Healthy Habit Gamification</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                        <span className="text-sm">Interactive Health Content</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Progress Tracking</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Emma's Learning Progress</span>
                          <span>75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Alex's Learning Progress</span>
                          <span>60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 