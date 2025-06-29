'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Shield, CreditCard, Lock, Star } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });
  
  // Extract URL parameters
  const tier = searchParams.get('tier') || 'enhanced';
  const billing = (searchParams.get('billing') || 'monthly') as 'monthly' | 'annual';
  const plan = (searchParams.get('plan') || 'individual') as 'individual' | 'family';
  const audience = searchParams.get('audience') || 'general';

  const planDetails = {
    basic: {
      name: 'Basic Plan',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      description: 'Perfect for individuals starting their health journey',
      features: [
        'AI-powered meal planning',
        'Basic nutrition tracking',
        'Recipe recommendations',
        'Food allergy management',
        'Mobile app access'
      ]
    },
    enhanced: {
      name: 'Enhanced Plan',
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      description: 'Best for families with health goals',
      features: [
        'Everything in Basic',
        'Family member management',
        'Advanced health analytics',
        'Chronic condition support',
        'Clinical oversight',
        'Priority support'
      ]
    },
    premium: {
      name: 'Premium Plan',
      monthlyPrice: 39.99,
      annualPrice: 399.99,
      description: 'Complete healthcare nutrition solution',
      features: [
        'Everything in Enhanced',
        'Healthcare provider integration',
        'Drug-food interaction checking',
        'Emergency access protocols',
        'HIPAA-compliant data export',
        'Dedicated health coach'
      ]
    }
  };

  const currentPlan = planDetails[tier as keyof typeof planDetails] || planDetails.enhanced;
  const price = billing === 'monthly' ? currentPlan.monthlyPrice : currentPlan.annualPrice;
  const savings = billing === 'annual' ? (currentPlan.monthlyPrice * 12 - currentPlan.annualPrice) : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For demo purposes, redirect to the appropriate demo page
    const demoRoutes = {
      basic: '/family-demo',
      enhanced: '/gamification-demo',
      premium: '/clinical-interfaces-demo'
    };
    
    // Simulate account creation and redirect to demo
    setTimeout(() => {
      window.location.href = demoRoutes[tier as keyof typeof demoRoutes] || '/family-demo';
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Plans
            </Link>
            <div className="text-2xl font-bold text-teal-600">
              Praneya Healthcare
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            {/* Plan Details */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {currentPlan.name} ({plan === 'family' ? 'Family' : 'Individual'})
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600">
                    ${price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    per {billing === 'monthly' ? 'month' : 'year'}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{currentPlan.description}</p>
              
              {billing === 'annual' && savings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Star className="w-4 h-4" />
                    <span className="font-medium">
                      Save ${savings.toFixed(2)} with annual billing!
                    </span>
                  </div>
                </div>
              )}

              {audience !== 'general' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="text-blue-700 text-sm">
                    <strong>Optimized for:</strong> {audience} needs
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">What's included:</h4>
              <ul className="space-y-3">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Indicators */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600" />
                  <span>30-day Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Account</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="Create a secure password"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {/* Payment Method Placeholder */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600 mb-2">Payment integration coming soon</p>
                  <p className="text-sm text-gray-500">For demo purposes, account will be created without payment</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Create Account & Start Demo
              </button>

              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
                Your data is protected with enterprise-grade security.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
} 