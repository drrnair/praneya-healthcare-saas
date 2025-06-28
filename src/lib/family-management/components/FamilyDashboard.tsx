'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Target, Calendar, Shield, Trophy, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FamilyComponentProps } from '@/types/family';

interface FamilyDashboardProps extends FamilyComponentProps {
  showPrivacyControls?: boolean;
  enableQuickActions?: boolean;
}

export function FamilyDashboard({
  familyId,
  currentUserId,
  userRole,
  permissions,
  privacyLevel,
  showPrivacyControls = true,
  enableQuickActions = true,
  className = '',
  onAction,
  onError
}: FamilyDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

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
              <h1 className="text-2xl font-bold text-gray-900">Family Dashboard</h1>
              <p className="text-gray-600">4 members • Premium Plan</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-1" />
              Privacy
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
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
            <p className="text-lg font-semibold text-gray-900 mt-1">3/4 Good</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Active Goals</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">5 Goals</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">This Week</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">3 Achievements</p>
          </div>

          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Meal Plans</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">2 Active</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Family Health Overview</CardTitle>
              <CardDescription>Privacy-appropriate health summaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800">Sarah (Mom)</h3>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  <p className="text-sm text-green-700 mt-2">3 active goals, 2 recent wins</p>
                </div>
                
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Mike (Dad)</h3>
                  <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                  <p className="text-sm text-blue-700 mt-2">2 active goals, 1 recent win</p>
                </div>
                
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">Emma (Teen)</h3>
                  <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>
                  <p className="text-sm text-yellow-700 mt-2">4 active goals, 3 recent wins</p>
                </div>
                
                <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Alex (Child)</h3>
                  <Badge className="bg-gray-100 text-gray-800">Private</Badge>
                  <p className="text-sm text-gray-700 mt-2">Parental controls active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Family Health Goals</CardTitle>
              <CardDescription>Collaborative goals with shared progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Family Vegetable Challenge</h3>
                  <p className="text-sm text-gray-600 mb-2">Eat 5 servings of vegetables daily</p>
                  <Progress value={65} className="mb-2" />
                  <p className="text-xs text-gray-500">23/35 servings this week</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Walking Together</h3>
                  <p className="text-sm text-gray-600 mb-2">30 minutes, 5 times per week</p>
                  <Progress value={80} className="mb-2" />
                  <p className="text-xs text-gray-500">4/5 walks completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Family health milestones and celebrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🥗</span>
                    <div>
                      <h3 className="font-semibold">Healthy Week Champion</h3>
                      <p className="text-sm text-gray-600">Sarah completed all nutritional goals</p>
                      <p className="text-xs text-gray-500">2 days ago • 100 points</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👨‍🍳</span>
                    <div>
                      <h3 className="font-semibold">Family Meal Prep Masters</h3>
                      <p className="text-sm text-gray-600">Everyone helped with weekly meal prep</p>
                      <p className="text-xs text-gray-500">5 days ago • 250 points</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Emergency Information</CardTitle>
              <CardDescription className="text-red-700">
                Critical health information for emergencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 border-red-200">
                  <div className="text-left">
                    <div className="font-medium text-red-800">Emergency Contacts</div>
                    <div className="text-sm text-red-600">View contact information</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="h-auto p-4 border-red-200">
                  <div className="text-left">
                    <div className="font-medium text-red-800">Medical Information</div>
                    <div className="text-sm text-red-600">Allergies, medications</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 