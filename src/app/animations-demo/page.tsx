'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import all animation components
import { 
  AnimatedButton, 
  AnimatedCard, 
  AnimatedInput, 
  AnimatedToggle
} from '@/components/animations/MicroInteractions';

import {
  FadeInUp,
  StaggerContainer,
  ScrollFadeIn,
  ScrollReveal,
  StaggerReveal,
  Parallax
} from '@/components/animations/ScrollAnimations';

import {
  ConfettiAnimation,
  PulseEffect,
  TrophyReveal
} from '@/components/animations/SuccessCelebrations';

import { EnhancedInput } from '@/components/animations/EnhancedFormFields';

import {
  FoodScanningAnimation,
  RecipeGenerationAnimation
} from '@/components/animations/AILoadingStates';

import { Sparkles, Heart, Zap, Trophy, Camera, ChefHat } from 'lucide-react';

export default function AnimationsDemo() {
  const [activeTab, setActiveTab] = useState('micro');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showTrophy, setShowTrophy] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [scanningActive, setScanningActive] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [generatingRecipes, setGeneratingRecipes] = useState(false);

  // Form states
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  const handleScanDemo = () => {
    setScanningActive(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setScanningActive(false), 1000);
          return prev;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRecipeDemo = () => {
    setGeneratingRecipes(true);
    setTimeout(() => {
      setGeneratingRecipes(false);
    }, 4000);
  };

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      setEmailSuccess(false);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      setEmailSuccess(false);
    } else {
      setEmailError('');
      setEmailSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Praneya Animation System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sophisticated animations and micro-interactions built with neuroscience-based timing 
            and spring physics for delightful user experiences.
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="micro">Micro-Interactions</TabsTrigger>
            <TabsTrigger value="scroll">Scroll Animations</TabsTrigger>
            <TabsTrigger value="forms">Enhanced Forms</TabsTrigger>
            <TabsTrigger value="celebrations">Celebrations</TabsTrigger>
            <TabsTrigger value="ai">AI Animations</TabsTrigger>
          </TabsList>

          {/* Micro-Interactions Tab */}
          <TabsContent value="micro">
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Button Interactions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Animated Buttons</h3>
                    <div className="space-y-3">
                      <AnimatedButton variant="primary" size="md">
                        <Sparkles className="w-4 h-4" />
                        Primary Action
                      </AnimatedButton>
                      <AnimatedButton variant="secondary" size="md">
                        Secondary
                      </AnimatedButton>
                      <AnimatedButton variant="outline" size="md">
                        Outline Style
                      </AnimatedButton>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Interactive Effects</h3>
                    <div className="space-y-3">
                      <AnimatedButton variant="primary" ripple>
                        <Heart className="w-4 h-4" />
                        Ripple Effect
                      </AnimatedButton>
                      <PulseEffect isActive={pulseActive} className="inline-block">
                        <AnimatedButton
                          variant="primary"
                          onClick={() => setPulseActive(!pulseActive)}
                        >
                          <Zap className="w-4 h-4" />
                          Pulse Button
                        </AnimatedButton>
                      </PulseEffect>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Touch Ripple</h3>
                    <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl text-white text-center cursor-pointer">
                      Click for Ripple Effect
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Card Interactions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <AnimatedCard hover tilt className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Hover & Tilt</h3>
                      <p className="text-sm text-gray-600 mt-2">3D hover effects with magnetic attraction</p>
                    </div>
                  </AnimatedCard>

                  <AnimatedCard hover className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Hover Only</h3>
                      <p className="text-sm text-gray-600 mt-2">Smooth scaling and shadow effects</p>
                    </div>
                  </AnimatedCard>

                  <AnimatedCard className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Static Card</h3>
                      <p className="text-sm text-gray-600 mt-2">No animations for comparison</p>
                    </div>
                  </AnimatedCard>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Scroll Animations Tab */}
          <TabsContent value="scroll">
            <div className="space-y-12">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Scroll-Triggered Animations</h2>
                <p className="text-gray-600 mb-8">Scroll down to see animations trigger</p>
                
                <div className="space-y-16">
                  <FadeInUp delay={0}>
                    <div className="p-6 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-800">Fade In Up Animation</h3>
                      <p className="text-gray-600 mt-2">Smooth entrance from bottom with custom easing</p>
                    </div>
                  </FadeInUp>

                  <ScrollFadeIn direction="left" delay={0.2}>
                    <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                      <h3 className="text-xl font-semibold text-gray-800">Slide In from Left</h3>
                      <p className="text-gray-600 mt-2">Direction-aware fade animations</p>
                    </div>
                  </ScrollFadeIn>

                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
                      <h3 className="font-semibold text-gray-800">Staggered 1</h3>
                      <p className="text-sm text-gray-600 mt-2">Sequential reveal</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                      <h3 className="font-semibold text-gray-800">Staggered 2</h3>
                      <p className="text-sm text-gray-600 mt-2">Coordinated timing</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                      <h3 className="font-semibold text-gray-800">Staggered 3</h3>
                      <p className="text-sm text-gray-600 mt-2">Beautiful cascading</p>
                    </div>
                  </StaggerContainer>

                  <ScrollReveal>
                    <div className="p-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl text-center">
                      <h3 className="text-2xl font-semibold text-gray-800">Scroll Reveal</h3>
                      <p className="text-gray-600 mt-2">Enhanced reveal with margin offsets</p>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Enhanced Forms Tab */}
          <TabsContent value="forms">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Enhanced Form Fields</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <EnhancedInput
                    label="Email Address"
                    type="email"
                    value={formEmail}
                    onChange={(e) => {
                      setFormEmail(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    error={emailError}
                    success={emailSuccess}
                  />

                  <EnhancedInput
                    label="Password"
                    type="password"
                    showPasswordToggle
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                  />

                  <EnhancedInput
                    label="Loading Example"
                    value="Validating..."
                    isLoading={true}
                    disabled
                  />

                  <div className="space-y-2">
                    <AnimatedToggle
                      checked={pulseActive}
                      onChange={setPulseActive}
                      label="Enable notifications"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Form Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Floating label animations</li>
                    <li>• Focus state transitions</li>
                    <li>• Validation feedback with shake animations</li>
                    <li>• Success states with checkmark reveals</li>
                    <li>• Loading indicators</li>
                    <li>• Password visibility toggle</li>
                    <li>• Haptic feedback on interactions</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Celebrations Tab */}
          <TabsContent value="celebrations">
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Success Celebrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-medium text-gray-700">Confetti Animation</h3>
                    <AnimatedButton
                      variant="primary"
                      onClick={() => setShowConfetti(true)}
                    >
                      <Sparkles className="w-4 h-4" />
                      Trigger Confetti
                    </AnimatedButton>
                    <p className="text-sm text-gray-600">50 physics-based particles</p>
                  </div>

                  <div className="text-center space-y-4">
                    <h3 className="font-medium text-gray-700">Pulse Effect</h3>
                    <PulseEffect isActive={pulseActive} className="inline-block">
                      <AnimatedButton
                        variant="primary"
                        onClick={() => setPulseActive(!pulseActive)}
                      >
                        <Heart className="w-4 h-4" />
                        Pulse Effect
                      </AnimatedButton>
                    </PulseEffect>
                    <p className="text-sm text-gray-600">Expanding shadow rings</p>
                  </div>

                  <div className="text-center space-y-4">
                    <h3 className="font-medium text-gray-700">Trophy Reveal</h3>
                    <AnimatedButton
                      variant="primary"
                      onClick={() => setShowTrophy(true)}
                    >
                      <Trophy className="w-4 h-4" />
                      Show Trophy
                    </AnimatedButton>
                    <p className="text-sm text-gray-600">3D rotation with sparkles</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AI Animations Tab */}
          <TabsContent value="ai">
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">AI Processing Animations</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Food Recognition</h3>
                    <FoodScanningAnimation
                      isScanning={scanningActive}
                      progress={scanProgress}
                      foodItem={scanProgress >= 100 ? "Grilled Salmon" : ""}
                      onComplete={() => console.log('Scan complete')}
                    />
                    <div className="text-center">
                      <AnimatedButton
                        variant="primary"
                        onClick={handleScanDemo}
                        disabled={scanningActive}
                      >
                        <Camera className="w-4 h-4" />
                        Start Food Scan
                      </AnimatedButton>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-700">Recipe Generation</h3>
                    <div className="h-96 overflow-y-auto">
                      <RecipeGenerationAnimation
                        isGenerating={generatingRecipes}
                        recipes={[
                          "Healthy Salmon Bowl",
                          "Mediterranean Quinoa Salad",
                          "Grilled Vegetable Stack",
                          "Protein Power Smoothie"
                        ]}
                        onComplete={() => console.log('Recipes generated')}
                      />
                    </div>
                    <div className="text-center">
                      <AnimatedButton
                        variant="primary"
                        onClick={handleRecipeDemo}
                        disabled={generatingRecipes}
                      >
                        <ChefHat className="w-4 h-4" />
                        Generate Recipes
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Global Animations */}
        <ConfettiAnimation 
          isActive={showConfetti} 
          onComplete={() => setShowConfetti(false)} 
        />
        
        <TrophyReveal
          isRevealed={showTrophy}
          title="Achievement Unlocked!"
          description="You've mastered the animation system!"
          onComplete={() => setShowTrophy(false)}
        />
      </div>
    </div>
  );
} 