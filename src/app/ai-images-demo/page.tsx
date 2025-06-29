'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeroAIImage, 
  FeatureAIImage, 
  TrustAIImage, 
  BadgeAIImage,
  AI_GENERATED_IMAGES 
} from '@/components/images/AIGeneratedImages';
import { Camera, Monitor, Shield, Award, Eye, Sparkles } from 'lucide-react';

export default function AIImagesDemoPage() {
  const [activeTab, setActiveTab] = useState('hero');

  const tabs = [
    { id: 'hero', label: 'Hero Images', icon: Camera },
    { id: 'features', label: 'Feature Images', icon: Monitor },
    { id: 'trust', label: 'Trust Building', icon: Shield },
    { id: 'badges', label: 'Badges', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-teal-600" />
              AI-Generated Images Demo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience how AI-generated images enhance the Praneya healthcare platform 
              with professional visuals that build trust and engage users.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto py-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-teal-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Hero Images */}
          {activeTab === 'hero' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Hero Section Images</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  High-impact hero images designed to capture attention and communicate 
                  Praneya's value proposition at first glance.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      Family Cooking Hero
                    </h3>
                    <HeroAIImage
                      imageKey="heroFamilyCooking"
                      className="rounded-xl shadow-lg"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      AI Interface Showcase
                    </h3>
                    <HeroAIImage
                      imageKey="heroAIInterface"
                      className="rounded-xl shadow-lg max-w-md mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other sections would go here but simplified for now */}
          {activeTab !== 'hero' && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Coming Soon: {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">
                This section will showcase {activeTab} images once they are generated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 