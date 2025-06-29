'use client';

import React, { useState, useEffect } from 'react';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  maxFamilyMembers: number;
  recommended?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic Healthcare',
    price: 0,
    maxFamilyMembers: 1,
    features: [
      'Basic nutrition tracking',
      'Recipe search',
      'Allergy management',
      'Single user account'
    ]
  },
  {
    id: 'enhanced',
    name: 'Family Healthcare',
    price: 12.99,
    maxFamilyMembers: 6,
    recommended: true,
    features: [
      'Everything in Basic',
      'Up to 6 family members',
      'Advanced meal planning',
      'Shopping lists',
      'Family health goals',
      'Shared recipes'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Healthcare',
    price: 29.99,
    maxFamilyMembers: 999,
    features: [
      'Everything in Enhanced',
      'Unlimited family members',
      'AI health insights',
      'Clinical integrations',
      'Provider sharing',
      'Priority support'
    ]
  }
];

export default function StripeDemo() {
  const [selectedPlan, setSelectedPlan] = useState<string>('enhanced');
  const [familyMembers, setFamilyMembers] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stripeConfigured, setStripeConfigured] = useState<boolean>(false);

  useEffect(() => {
    // Check if Stripe is configured (client-side can only check publishable key)
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const hasStripeKeys = !!(publishableKey &&
                             publishableKey !== 'pk_test_your_stripe_publishable_key' &&
                             publishableKey !== 'pk_test_your_stripe_publishable_key_here' &&
                             publishableKey.startsWith('pk_'));
    setStripeConfigured(hasStripeKeys);
  }, []);

  const calculateTotalPrice = (planId: string, memberCount: number): number => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan || plan.price === 0) return 0;
    
    const additionalMemberCost = planId === 'enhanced' ? 4.99 : 9.99;
    const additionalMembers = Math.max(0, memberCount - 1);
    
    return plan.price + (additionalMembers * additionalMemberCost);
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      console.log('Creating subscription for:', {
        plan: selectedPlan,
        familyMembers: familyMembers,
        totalPrice: calculateTotalPrice(selectedPlan, familyMembers)
      });
      
      setTimeout(() => {
        alert(`✅ Subscription ready!\n\nPlan: ${selectedPlan}\nFamily Members: ${familyMembers}\nTotal: $${calculateTotalPrice(selectedPlan, familyMembers).toFixed(2)}/month\n\nAdd Stripe keys to enable real billing.`);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Subscription creation failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 Praneya Healthcare Billing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Healthcare subscription plans with family-friendly pricing
          </p>
          
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            stripeConfigured 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {stripeConfigured ? '✅ Stripe Integration Ready' : '🔧 Add Stripe Keys to Enable'}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-lg p-8 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-blue-500 transform scale-105'
                  : 'hover:shadow-xl'
              } ${plan.recommended ? 'ring-2 ring-green-500' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ${plan.price}
                  {plan.price > 0 && <span className="text-lg text-gray-500">/month</span>}
                </div>
                {plan.price === 0 && (
                  <span className="text-sm text-green-600 font-medium">Free Forever</span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <div className="text-sm text-gray-500">
                  Up to {plan.maxFamilyMembers === 999 ? 'Unlimited' : plan.maxFamilyMembers} family members
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPlan !== 'basic' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Family Configuration</h3>
            <div className="flex items-center space-x-6">
              <label className="text-lg font-medium text-gray-700">
                Number of Family Members:
              </label>
              <input
                type="number"
                min="1"
                max={subscriptionPlans.find(p => p.id === selectedPlan)?.maxFamilyMembers || 6}
                value={familyMembers}
                onChange={(e) => setFamilyMembers(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Pricing Breakdown:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Plan ({selectedPlan})</span>
                  <span>${subscriptionPlans.find(p => p.id === selectedPlan)?.price.toFixed(2)}</span>
                </div>
                {familyMembers > 1 && (
                  <div className="flex justify-between">
                    <span>Additional Members ({familyMembers - 1})</span>
                    <span>${((familyMembers - 1) * (selectedPlan === 'enhanced' ? 4.99 : 9.99)).toFixed(2)}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Monthly</span>
                  <span>${calculateTotalPrice(selectedPlan, familyMembers).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className={`px-8 py-4 rounded-lg text-white font-bold text-lg transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
            }`}
          >
            {isLoading ? 'Processing...' : `Subscribe - $${calculateTotalPrice(selectedPlan, familyMembers).toFixed(2)}/month`}
          </button>
          
          <p className="mt-4 text-sm text-gray-600">
            🔐 HIPAA-compliant billing with healthcare data protection
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Healthcare-Grade Security Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h4 className="font-bold text-gray-900 mb-2">HIPAA Compliant</h4>
              <p className="text-sm text-gray-600">All billing data encrypted and audit-logged</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">⏱️</div>
              <h4 className="font-bold text-gray-900 mb-2">Grace Periods</h4>
              <p className="text-sm text-gray-600">7-day grace period maintains health data access</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
              <h4 className="font-bold text-gray-900 mb-2">Family Management</h4>
              <p className="text-sm text-gray-600">Seamless family member addition/removal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
