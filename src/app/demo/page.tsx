'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Play, Star, Users, Shield, Activity, Brain, Heart, Gamepad2, UserPlus, BarChart3, Stethoscope, Smartphone, Utensils, Zap } from 'lucide-react';

export default function DemoPage() {
  const demoCategories = [
    {
      title: 'Core Health Features',
      description: 'Essential healthcare nutrition tools',
      demos: [
        {
          id: 'family-demo',
          title: 'Family Health Management',
          description: 'Manage nutrition for your entire family with personalized profiles',
          icon: <Users className="w-8 h-8" />,
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-600',
          route: '/family-demo'
        },
        {
          id: 'family-management-demo',
          title: 'Advanced Family Features',
          description: 'Emergency access, privacy controls, and family coordination',
          icon: <Shield className="w-8 h-8" />,
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-600',
          route: '/family-management-demo'
        },
        {
          id: 'edamam-demo',
          title: 'Recipe & Nutrition API',
          description: 'AI-powered recipe recommendations and nutritional analysis',
          icon: <Utensils className="w-8 h-8" />,
          color: 'from-orange-500 to-red-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-600',
          route: '/edamam-demo'
        }
      ]
    },
    {
      title: 'AI & Analytics',
      description: 'Advanced artificial intelligence features',
      demos: [
        {
          id: 'gemini-demo',
          title: 'Google AI Integration',
          description: 'Advanced AI-powered health insights and recommendations',
          icon: <Brain className="w-8 h-8" />,
          color: 'from-purple-500 to-pink-500',
          bgColor: 'bg-purple-50',
          textColor: 'text-purple-600',
          route: '/gemini-demo'
        },
        {
          id: 'data-visualization-demo',
          title: 'Health Analytics Dashboard',
          description: 'Interactive charts and health trend visualization',
          icon: <BarChart3 className="w-8 h-8" />,
          color: 'from-indigo-500 to-blue-500',
          bgColor: 'bg-indigo-50',
          textColor: 'text-indigo-600',
          route: '/data-visualization-demo'
        },
        {
          id: 'gamification-demo',
          title: 'Gamification & Rewards',
          description: 'Achievement system, streaks, and health challenges',
          icon: <Gamepad2 className="w-8 h-8" />,
          color: 'from-yellow-500 to-orange-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-600',
          route: '/gamification-demo'
        }
      ]
    },
    {
      title: 'Clinical & Professional',
      description: 'Healthcare provider and clinical features',
      demos: [
        {
          id: 'clinical-interfaces-demo',
          title: 'Clinical Dashboard',
          description: 'HIPAA-compliant clinical oversight and drug interaction monitoring',
          icon: <Stethoscope className="w-8 h-8" />,
          color: 'from-teal-500 to-cyan-500',
          bgColor: 'bg-teal-50',
          textColor: 'text-teal-600',
          route: '/clinical-interfaces-demo'
        }
      ]
    },
    {
      title: 'User Experience',
      description: 'Enhanced user interface and experience features',
      demos: [
        {
          id: 'onboarding-demo',
          title: 'Smart Onboarding',
          description: 'Personalized user onboarding with health assessment',
          icon: <UserPlus className="w-8 h-8" />,
          color: 'from-rose-500 to-pink-500',
          bgColor: 'bg-rose-50',
          textColor: 'text-rose-600',
          route: '/onboarding-demo'
        },
        {
          id: 'micro-interactions-demo',
          title: 'Micro-Interactions',
          description: 'Delightful animations and interactive feedback',
          icon: <Zap className="w-8 h-8" />,
          color: 'from-amber-500 to-yellow-500',
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-600',
          route: '/micro-interactions-demo'
        },
        {
          id: 'pwa-demo',
          title: 'Mobile PWA Features',
          description: 'Progressive web app capabilities and mobile optimization',
          icon: <Smartphone className="w-8 h-8" />,
          color: 'from-slate-500 to-gray-500',
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-600',
          route: '/pwa-demo'
        }
      ]
    },
    {
      title: 'Business Features',
      description: 'Payment and business integration features',
      demos: [
        {
          id: 'stripe-demo',
          title: 'Payment Integration',
          description: 'Stripe payment processing and subscription management',
          icon: <Activity className="w-8 h-8" />,
          color: 'from-emerald-500 to-teal-500',
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-600',
          route: '/stripe-demo'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="text-2xl font-bold text-teal-600">
              Praneya Healthcare Demos
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Interactive Demos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore all the powerful features of Praneya Healthcare through our interactive demonstrations.
            Each demo showcases real functionality you can use today.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>10,000+ Active Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-purple-600" />
              <span>Interactive Demos</span>
            </div>
          </div>
        </div>

        {/* Demo Categories */}
        {demoCategories.map((category, categoryIndex) => (
          <div key={category.title} className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {category.title}
              </h2>
              <p className="text-lg text-gray-600">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.demos.map((demo, index) => (
                <Link
                  key={demo.id}
                  href={demo.route}
                  className="group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-teal-300 transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Background Pattern */}
                  <div className={`absolute inset-0 ${demo.bgColor} opacity-20`} />
                  
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className={`
                      inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6
                      bg-gradient-to-r ${demo.color} text-white
                      group-hover:shadow-lg transition-shadow duration-300
                    `}>
                      {demo.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {demo.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {demo.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center justify-between">
                      <span className={`
                        inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold
                        ${demo.bgColor} ${demo.textColor}
                      `}>
                        Try Demo
                      </span>
                      
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600/0 to-cyan-600/0 group-hover:from-teal-600/5 group-hover:to-cyan-600/5 transition-all duration-300" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Call to Action */}
        <div className="text-center mt-16 p-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the full power of Praneya Healthcare with your own account
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/signup?source=demo-page"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/api-test"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-xl hover:bg-white hover:text-teal-600 transition-all duration-300"
            >
              API Testing Suite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 