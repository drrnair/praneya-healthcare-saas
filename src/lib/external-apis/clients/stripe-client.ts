import Stripe from 'stripe';
import { Database } from '@/types/database';
import { supabase } from './supabase-client';

// Types
interface HealthcareSubscriptionTier {
  id: string;
  name: 'basic' | 'enhanced' | 'premium';
  stripePriceId: string;
  stripeProductId: string;
  basePriceCents: number;
  familyMemberPriceCents: number;
  maxFamilyMembers: number;
  trialDays: number;
  features: {
    clinicalFeaturesEnabled: boolean;
    familyFeaturesEnabled: boolean;
    aiFeaturesEnabled: boolean;
    providerIntegrationEnabled: boolean;
    advancedAnalyticsEnabled: boolean;
  };
}

interface SubscriptionResult {
  subscriptionId: string;
  status: string;
  currentPeriodEnd: Date;
  familyAccountId: string;
  clientSecret?: string;
}

interface HealthcareStripeConfig {
  secretKey: string;
  webhookSecret: string;
  healthcareProductId: string;
  gracePeriodDays: number;
  criticalAccessEnabled: boolean;
}

export class HealthcareStripeClient {
  private stripe: Stripe;
  private config: HealthcareStripeConfig;

  constructor(config: HealthcareStripeConfig) {
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
    this.config = config;
  }

  // ===========================================
  // SUBSCRIPTION MANAGEMENT
  // ===========================================

  async createFamilySubscription(
    familyAccountId: string,
    tier: HealthcareSubscriptionTier,
    memberCount: number,
    paymentMethodId: string
  ): Promise<SubscriptionResult> {
    try {
      // Get family account details
      const { data: familyAccount } = await supabase
        .from('family_accounts')
        .select('*')
        .eq('id', familyAccountId)
        .single();

      if (!familyAccount) {
        throw new Error('Family account not found');
      }

      // Create or get Stripe customer
      const customer = await this.getOrCreateCustomer(familyAccount);

      // Attach payment method
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });

      // Calculate pricing
      const pricing = this.calculateFamilyPricing(tier, memberCount);

      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: pricing.basePriceId,
            quantity: 1,
          },
          ...(memberCount > 1 ? [{
            price: pricing.familyMemberPriceId,
            quantity: memberCount - 1,
          }] : []),
        ],
        default_payment_method: paymentMethodId,
        trial_period_days: tier.trialDays,
        metadata: {
          family_account_id: familyAccountId,
          subscription_tier: tier.name,
          member_count: memberCount.toString(),
          healthcare_plan: 'true',
          hipaa_compliant: 'true',
        },
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      // Save subscription to database
      await this.createInternalSubscriptionRecord(subscription, familyAccountId, tier);

      return {
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        familyAccountId,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      };
    } catch (error) {
      console.error('Failed to create family subscription:', error);
      throw error;
    }
  }

  // ===========================================
  // HEALTH CHECK
  // ===========================================

  async healthCheck(): Promise<boolean> {
    try {
      await this.stripe.products.list({ limit: 1 });
      return true;
    } catch (error) {
      console.error('Stripe health check failed:', error);
      return false;
    }
  }

  // ===========================================
  // PRIVATE HELPER METHODS
  // ===========================================

  private async getOrCreateCustomer(familyAccount: any): Promise<Stripe.Customer> {
    if (familyAccount.stripe_customer_id) {
      try {
        return await this.stripe.customers.retrieve(familyAccount.stripe_customer_id) as Stripe.Customer;
      } catch (error) {
        // Customer not found, create new one
      }
    }

    // Create new customer
    const customer = await this.stripe.customers.create({
      email: familyAccount.contact_email,
      name: familyAccount.family_name,
      metadata: {
        family_account_id: familyAccount.id,
        healthcare_plan: 'true',
      },
    });

    // Update family account with Stripe customer ID
    await supabase
      .from('family_accounts')
      .update({ stripe_customer_id: customer.id })
      .eq('id', familyAccount.id);

    return customer;
  }

  private calculateFamilyPricing(tier: HealthcareSubscriptionTier, memberCount: number) {
    const additionalMembers = Math.max(0, memberCount - 1);
    
    return {
      basePriceId: tier.stripePriceId,
      familyMemberPriceId: `${tier.stripePriceId}_family_member`,
      totalAmount: tier.basePriceCents + (additionalMembers * tier.familyMemberPriceCents),
    };
  }

  private async createInternalSubscriptionRecord(
    subscription: Stripe.Subscription,
    familyAccountId: string,
    tier: HealthcareSubscriptionTier
  ): Promise<void> {
    await supabase.from('subscriptions').insert({
      family_account_id: familyAccountId,
      stripe_subscription_id: subscription.id,
      tier: tier.name,
      status: subscription.status,
      member_count: parseInt(subscription.metadata.member_count || '1'),
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      grace_period_active: false,
      critical_access_enabled: this.config.criticalAccessEnabled,
    });
  }
}

// Export configured instance
export const stripeClient = new HealthcareStripeClient({
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  healthcareProductId: process.env.STRIPE_HEALTHCARE_PRODUCT_ID!,
  gracePeriodDays: parseInt(process.env.BILLING_GRACE_PERIOD_DAYS || '7'),
  criticalAccessEnabled: process.env.BILLING_CRITICAL_ACCESS_ENABLED === 'true',
});
