// Family Account Management Types
// Comprehensive type definitions for Praneya's family health management system

export type FamilyMemberRole = 'head' | 'parent' | 'adult' | 'teen' | 'child' | 'guardian' | 'caregiver';
export type PrivacyLevel = 'public' | 'family' | 'parents_only' | 'guardians_only' | 'private' | 'emergency_only';
export type PermissionType = 'view' | 'edit' | 'share' | 'emergency_access' | 'admin';
export type FamilyPlanTier = 'family_basic' | 'family_premium' | 'family_clinical';
export type EmergencyAccessLevel = 'none' | 'basic' | 'medical' | 'full';
export type AgeGroup = 'infant' | 'toddler' | 'child' | 'teen' | 'adult' | 'senior';

// Core Family Account Structure
export interface FamilyAccount {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  head_of_family: string; // User ID
  subscription_tier: FamilyPlanTier;
  subscription_status: 'active' | 'inactive' | 'suspended' | 'trial';
  max_members: number;
  current_member_count: number;
  family_code: string; // Unique invitation code
  billing_account_id: string;
  privacy_settings: FamilyPrivacySettings;
  collaboration_settings: FamilyCollaborationSettings;
  emergency_settings: FamilyEmergencySettings;
  parental_controls: ParentalControlSettings;
  audit_settings: FamilyAuditSettings;
}

// Family Member Profile
export interface FamilyMember {
  id: string;
  user_id: string;
  family_id: string;
  display_name: string;
  role: FamilyMemberRole;
  age_group: AgeGroup;
  relationship_to_head: string;
  date_of_birth?: string;
  profile_image?: string;
  joined_at: string;
  status: 'active' | 'pending' | 'suspended' | 'left';
  privacy_preferences: MemberPrivacyPreferences;
  permissions: FamilyMemberPermissions;
  emergency_contact_priority: number;
  requires_parental_consent: boolean;
  guardian_ids: string[]; // For minors
  health_summary_visibility: PrivacyLevel;
  last_active: string;
}

// Privacy Settings
export interface FamilyPrivacySettings {
  default_data_sharing: PrivacyLevel;
  health_data_sharing: PrivacyLevel;
  meal_planning_sharing: PrivacyLevel;
  emergency_information_sharing: EmergencyAccessLevel;
  external_sharing_allowed: boolean;
  provider_access_level: PrivacyLevel;
  audit_log_access: PrivacyLevel;
  family_insights_sharing: boolean;
  anonymous_analytics_participation: boolean;
}

export interface MemberPrivacyPreferences {
  health_data_visibility: PrivacyLevel;
  meal_preferences_visibility: PrivacyLevel;
  activity_status_visibility: PrivacyLevel;
  emergency_contact_access: EmergencyAccessLevel;
  provider_communication: boolean;
  family_challenges_participation: boolean;
  goal_sharing: PrivacyLevel;
  achievement_sharing: PrivacyLevel;
  custom_permissions: Record<string, PrivacyLevel>;
}

// Additional interfaces will be added in subsequent edits...
export interface FamilyCollaborationSettings {
  shared_meal_planning: boolean;
  collaborative_shopping_lists: boolean;
  family_challenges_enabled: boolean;
  goal_sharing_enabled: boolean;
  recipe_sharing_enabled: boolean;
  achievement_celebrations: boolean;
  family_insights_enabled: boolean;
  real_time_updates: boolean;
  notification_preferences: FamilyNotificationSettings;
}

export interface FamilyNotificationSettings {
  meal_plan_updates: boolean;
  shopping_list_changes: boolean;
  health_alerts: boolean;
  achievement_notifications: boolean;
  challenge_updates: boolean;
  emergency_alerts: boolean;
  provider_communications: boolean;
  billing_notifications: boolean;
}

export interface FamilyEmergencySettings {
  enabled: boolean;
  emergency_contacts: EmergencyContact[];
  medical_information_access: EmergencyAccessLevel;
  break_glass_protocols: BreakGlassProtocol[];
  emergency_providers: string[];
  emergency_notification_settings: EmergencyNotificationSettings;
  location_sharing_in_emergency: boolean;
  medical_alert_integration: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone_primary: string;
  phone_secondary?: string;
  email: string;
  priority: number;
  can_access_medical_info: boolean;
  notification_methods: ('sms' | 'call' | 'email')[];
  location?: string;
  is_healthcare_professional: boolean;
}

export interface BreakGlassProtocol {
  id: string;
  name: string;
  description: string;
  trigger_conditions: string[];
  access_level: EmergencyAccessLevel;
  time_limit_hours: number;
  requires_multiple_authorization: boolean;
  authorized_roles: FamilyMemberRole[];
  audit_requirements: string[];
  automatic_provider_notification: boolean;
}

export interface EmergencyNotificationSettings {
  immediate_family: boolean;
  extended_family: boolean;
  healthcare_providers: boolean;
  emergency_services: boolean;
  notification_delay_seconds: number;
  escalation_timeline: number[];
  include_location: boolean;
  include_medical_summary: boolean;
}

export interface ParentalControlSettings {
  enabled: boolean;
  content_filtering: ContentFilteringSettings;
  screen_time_limits: ScreenTimeLimits;
  feature_restrictions: FeatureRestrictions;
  supervision_settings: SupervisionSettings;
  educational_settings: EducationalSettings;
  coppa_compliance: COPPAComplianceSettings;
}

export interface ContentFilteringSettings {
  age_appropriate_content_only: boolean;
  health_education_level: 'basic' | 'intermediate' | 'advanced';
  nutrition_information_level: 'simplified' | 'standard' | 'detailed';
  medical_terminology_filtering: boolean;
  external_link_restrictions: boolean;
  social_features_restrictions: boolean;
}

export interface ScreenTimeLimits {
  daily_time_limit_minutes: number;
  session_duration_limit_minutes: number;
  bedtime_restrictions: {
    enabled: boolean;
    start_time: string;
    end_time: string;
  };
  homework_time_restrictions: boolean;
  weekend_different_limits: boolean;
}

export interface FeatureRestrictions {
  can_modify_health_data: boolean;
  can_communicate_with_providers: boolean;
  can_access_family_data: boolean;
  can_share_externally: boolean;
  can_make_purchases: boolean;
  can_join_challenges: boolean;
  requires_approval_for: string[];
}

export interface SupervisionSettings {
  activity_monitoring: boolean;
  data_entry_supervision: boolean;
  communication_monitoring: boolean;
  health_goal_supervision: boolean;
  meal_planning_supervision: boolean;
  supervisor_notifications: boolean;
  periodic_check_ins: boolean;
}

export interface EducationalSettings {
  age_appropriate_health_tips: boolean;
  nutrition_education_enabled: boolean;
  healthy_habit_gamification: boolean;
  family_health_learning: boolean;
  interactive_health_content: boolean;
  progress_celebrations: boolean;
}

export interface COPPAComplianceSettings {
  parental_consent_obtained: boolean;
  consent_date: string;
  consent_method: string;
  data_collection_minimized: boolean;
  third_party_sharing_disabled: boolean;
  data_retention_period_days: number;
  deletion_request_capability: boolean;
}

export interface FamilyMemberPermissions {
  member_id: string;
  granted_by: string;
  granted_at: string;
  permissions: Record<string, PermissionLevel>;
  resource_access: ResourceAccess[];
  time_based_restrictions: TimeBasedRestriction[];
  conditional_permissions: ConditionalPermission[];
}

export interface PermissionLevel {
  type: PermissionType;
  granted: boolean;
  restricted_to: string[];
  expires_at?: string;
  granted_by: string;
  reason?: string;
}

export interface ResourceAccess {
  resource_type: string;
  resource_id: string;
  access_level: PrivacyLevel;
  granted_at: string;
  expires_at?: string;
  conditions: string[];
}

export interface TimeBasedRestriction {
  id: string;
  permission_type: PermissionType;
  start_time: string;
  end_time: string;
  days_of_week: number[];
  timezone: string;
  exception_dates: string[];
}

export interface ConditionalPermission {
  id: string;
  permission_type: PermissionType;
  conditions: PermissionCondition[];
  action: 'grant' | 'deny' | 'require_approval';
  requires_additional_auth: boolean;
}

export interface PermissionCondition {
  type: 'location' | 'time' | 'emergency' | 'supervisor_present' | 'age_verification';
  operator: 'equals' | 'greater_than' | 'less_than' | 'in_range' | 'contains';
  value: any;
  description: string;
}

export interface FamilyAuditSettings {
  audit_enabled: boolean;
  retention_period_days: number;
  log_level: 'basic' | 'detailed' | 'comprehensive';
  family_member_access: boolean;
  external_audit_support: boolean;
  compliance_reporting: boolean;
  automated_privacy_checks: boolean;
}

export interface FamilyState {
  account: FamilyAccount | null;
  members: FamilyMember[];
  loading: boolean;
  error: string | null;
}

export interface FamilyComponentProps {
  familyId: string;
  currentUserId: string;
  userRole: FamilyMemberRole;
  permissions: FamilyMemberPermissions;
  privacyLevel: PrivacyLevel;
  className?: string;
  onAction?: (action: string, data?: any) => void;
  onError?: (error: Error) => void;
} 