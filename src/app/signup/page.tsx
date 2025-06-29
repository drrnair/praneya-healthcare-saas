'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Star, Users, Shield } from 'lucide-react';

function SignupContent() {
  const searchParams = useSearchParams();
  const [source, setSource] = useState('');
  const [audience, setAudience] = useState('');

  useEffect(() => {
    setSource(searchParams.get('source') || '');
    setAudience(searchParams.get('audience') || '');
  }, [searchParams]);

  const handleSignup = (planType: string) => {
    // For now, redirect to a demo page based on the plan
    const demoRoutes = {
      basic: '/family-demo',
      enhanced: '/gamification-demo',
      premium: '/clinical-interfaces-demo'
    };
    
    window.location.href = demoRoutes[planType as keyof typeof demoRoutes] || '/family-demo';
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$9.99/month',
      description: 'Perfect for individuals and small families',
      features: [
        'AI-powered meal planning',
        'Basic nutrition tracking',
        'Recipe recommendations',
        'Food allergy management',
        'Mobile app access'
      ],
      popular: false
    },
    {
      id: 'enhanced',
      name: 'Enhanced Plan',
      price: '$19.99/month',
      description: 'Ideal for families with health goals',
      features: [
        'Everything in Basic',
        'Family member management',
        'Advanced health analytics',
        'Chronic condition support',
        'Clinical oversight',
        'Priority support'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '$39.99/month',
      description: 'Complete healthcare nutrition solution',
      features: [
        'Everything in Enhanced',
        'Healthcare provider integration',
        'Drug-food interaction checking',
        'Emergency access protocols',
        'HIPAA-compliant data export',
        'Dedicated health coach'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="text-2xl font-bold text-teal-600">
              Praneya Healthcare
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start your healthcare nutrition journey with a plan that fits your needs.
            {source && (
              <span className="block mt-2 text-sm text-teal-600">
                Coming from: {source.replace('-', ' ').replace('_', ' ')}
              </span>
            )}
            {audience && (
              <span className="block mt-1 text-sm text-cyan-600">
                Tailored for: {audience} needs
              </span>
            )}
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12 text-sm text-gray-600">
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
            <span>10,000+ Users</span>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300
                ${plan.popular 
                  ? 'border-teal-500 shadow-xl scale-105' 
                  : 'border-gray-200 hover:border-teal-300 hover:shadow-xl'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-teal-600 mb-2">
                  {plan.price}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSignup(plan.id)}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300
                  ${plan.popular
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 transform hover:scale-105'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }
                `}
              >
                Get Started with {plan.name}
              </button>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-green-50 border border-green-200 rounded-full px-6 py-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <span className="text-green-700 font-medium">
              30-day money-back guarantee • No credit card required for trial
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading signup...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
} 