// Supabase Healthcare Authentication Client
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceKey?: string;
}

export interface HealthcareUserData {
  id: string;
  email: string;
  name?: string;
  healthcareRole: 'end_user' | 'clinical_advisor' | 'super_admin';
  subscriptionTier: 'basic' | 'enhanced' | 'premium';
  tenantId?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  lastLogin?: Date;
}

export class SupabaseClient {
  private client: SupabaseClient;
  private serviceClient?: SupabaseClient;

  constructor(config: SupabaseConfig) {
    // Public client for client-side operations
    this.client = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });

    // Service client for admin operations (server-side only)
    if (config.serviceKey) {
      this.serviceClient = createClient(config.url, config.serviceKey);
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await this.client.from('users').select('count').limit(1);
      return !error;
    } catch (error) {
      console.error('Supabase health check failed:', error);
      return false;
    }
  }

  // Authentication methods
  async signUpWithEmail(email: string, password: string, userData?: Partial<HealthcareUserData>) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData?.name,
            healthcare_role: userData?.healthcareRole || 'end_user',
            subscription_tier: userData?.subscriptionTier || 'basic'
          }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase signup error:', error);
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase signin error:', error);
      throw error;
    }
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await this.client.auth.getUser();
    if (error) throw error;
    return user;
  }

  async getCurrentSession() {
    const { data: { session }, error } = await this.client.auth.getSession();
    if (error) throw error;
    return session;
  }

  // Healthcare-specific methods
  async updateUserHealthcareProfile(userId: string, profileData: Partial<HealthcareUserData>) {
    try {
      const { data, error } = await this.client
        .from('users')
        .update({
          healthcare_role: profileData.healthcareRole,
          subscription_tier: profileData.subscriptionTier,
          mfa_enabled: profileData.mfaEnabled,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating healthcare profile:', error);
      throw error;
    }
  }

  // Family management
  async getFamilyMembers(familyAccountId: string) {
    try {
      const { data, error } = await this.client
        .from('family_members')
        .select(`
          *,
          users:user_id (
            id,
            email,
            name,
            healthcare_role
          )
        `)
        .eq('family_account_id', familyAccountId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching family members:', error);
      throw error;
    }
  }

  // Real-time subscriptions for healthcare data
  subscribeToUserUpdates(userId: string, callback: (payload: any) => void) {
    return this.client
      .channel(`user-\${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users',
        filter: `id=eq.\${userId}`
      }, callback)
      .subscribe();
  }
}
