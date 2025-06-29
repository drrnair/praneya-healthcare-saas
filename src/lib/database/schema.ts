/**
 * Healthcare Database Schema for Praneya SaaS Platform
 * HIPAA-compliant multi-tenant PostgreSQL schema with Drizzle ORM
 */

import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  boolean, 
  jsonb, 
  integer, 
  decimal,
  serial,
  varchar,
  index,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ===========================================
// MULTI-TENANT FOUNDATION
// ===========================================

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  planType: text('plan_type', { 
    enum: ['basic', 'enhanced', 'premium'] 
  }).notNull().default('basic'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  hipaaCompliant: boolean('hipaa_compliant').default(true).notNull(),
  encryptionKeyId: text('encryption_key_id').notNull(),
  isActive: boolean('is_active').default(true).notNull()
}, (table) => {
  return {
    nameIdx: index('tenants_name_idx').on(table.name),
    planTypeIdx: index('tenants_plan_type_idx').on(table.planType)
  };
});

// ===========================================
// USERS AND AUTHENTICATION
// ===========================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  encryptedPii: text('encrypted_pii'), // Field-level encryption for PII
  deviceFingerprints: jsonb('device_fingerprints').$type<{
    id: string;
    fingerprint: string;
    userAgent: string;
    ipAddress?: string;
    trusted: boolean;
    lastSeen: Date;
    riskScore: number;
  }[]>().default([]),
  consentTimestamps: jsonb('consent_timestamps').$type<{
    medicalDisclaimer?: Date;
    dataProcessing?: Date;
    familySharing?: Date;
    clinicalAdvice?: Date;
    versionConsented: string;
  }>().default({ versionConsented: '1.0' }),
  healthcareRole: text('healthcare_role', {
    enum: ['end_user', 'clinical_advisor', 'super_admin']
  }).default('end_user').notNull(),
  mfaEnabled: boolean('mfa_enabled').default(false).notNull(),
  lastHipaaTraining: timestamp('last_hipaa_training'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull()
}, (table) => {
  return {
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    tenantIdx: index('users_tenant_idx').on(table.tenantId),
    roleIdx: index('users_role_idx').on(table.healthcareRole)
  };
});

// ===========================================
// MEDICAL DISCLAIMERS AND CONSENT TRACKING
// ===========================================

export const medicalDisclaimers = pgTable('medical_disclaimers', {
  id: uuid('id').primaryKey().defaultRandom(),
  version: varchar('version', { length: 50 }).notNull(),
  content: text('content').notNull(),
  effectiveDate: timestamp('effective_date').notNull(),
  isCurrent: boolean('is_current').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    versionIdx: index('medical_disclaimers_version_idx').on(table.version),
    currentIdx: index('medical_disclaimers_current_idx').on(table.isCurrent),
    effectiveDateIdx: index('medical_disclaimers_effective_date_idx').on(table.effectiveDate)
  };
});

export const userConsents = pgTable('user_consents', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  disclaimerId: uuid('disclaimer_id').references(() => medicalDisclaimers.id).notNull(),
  status: text('status', {
    enum: ['granted', 'revoked', 'pending']
  }).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  consentedAt: timestamp('consented_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => {
  return {
    userDisclaimerIdx: uniqueIndex('user_consents_user_disclaimer_idx').on(table.userId, table.disclaimerId),
    tenantIdx: index('user_consents_tenant_idx').on(table.tenantId),
    statusIdx: index('user_consents_status_idx').on(table.status),
    consentedAtIdx: index('user_consents_consented_at_idx').on(table.consentedAt)
  };
});

// ===========================================
// HEALTH PROFILES WITH TIERED DATA
// ===========================================

export const healthProfiles = pgTable('health_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  subscriptionTier: text('subscription_tier', {
    enum: ['basic', 'enhanced', 'premium']
  }).notNull(),
  encryptedHealthData: text('encrypted_health_data'), // Encrypted PHI
  allergies: jsonb('allergies').$type<{
    id: string;
    allergen: string;
    severity: 'mild' | 'moderate' | 'severe' | 'anaphylactic';
    reaction: string[];
    verifiedBy?: string;
    notes?: string;
    dateIdentified?: Date;
    isActive: boolean;
  }[]>().default([]),
  dietaryRestrictions: jsonb('dietary_restrictions').$type<{
    id: string;
    restriction: string;
    reason: 'allergy' | 'medical' | 'religious' | 'preference';
    strictness: 'strict' | 'moderate' | 'flexible';
    notes?: string;
    isActive: boolean;
  }[]>().default([]),
  medications: jsonb('medications').$type<{
    id: string;
    genericName: string;
    brandName?: string;
    dosage: string;
    frequency: string;
    route: string;
    prescribedBy?: string;
    datePrescribed?: Date;
    indication?: string;
    isActive: boolean;
  }[]>(), // Premium tier only
  labValues: jsonb('lab_values').$type<{
    id: string;
    testName: string;
    value: number;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'abnormal' | 'critical';
    dateCollected: Date;
    issuingLab?: string;
    notes?: string;
  }[]>(), // Premium tier only
  chronicConditions: jsonb('chronic_conditions').$type<{
    id: string;
    condition: string;
    icd10Code?: string;
    diagnosedDate?: Date;
    severity: 'mild' | 'moderate' | 'severe';
    managementNotes?: string;
    isActive: boolean;
  }[]>(), // Premium tier only
  nutritionGoals: jsonb('nutrition_goals').$type<{
    id: string;
    goalType: 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber' | 'sodium';
    targetValue: number;
    unit: string;
    timeframe: 'daily' | 'weekly' | 'monthly';
    isActive: boolean;
    reason?: string;
  }[]>().default([]),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  version: integer('version').default(1).notNull(), // For conflict resolution
  dataIntegrityHash: text('data_integrity_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
}, (table) => {
  return {
    userIdx: uniqueIndex('health_profiles_user_idx').on(table.userId),
    tenantIdx: index('health_profiles_tenant_idx').on(table.tenantId),
    tierIdx: index('health_profiles_tier_idx').on(table.subscriptionTier),
    lastUpdatedIdx: index('health_profiles_last_updated_idx').on(table.lastUpdated)
  };
});

// ===========================================
// FAMILY ACCOUNTS WITH HIERARCHICAL PERMISSIONS
// ===========================================

export const familyAccounts = pgTable('family_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  primaryUserId: uuid('primary_user_id').references(() => users.id).notNull(),
  familyName: varchar('family_name', { length: 255 }).notNull(),
  subscriptionTier: text('subscription_tier', {
    enum: ['basic', 'enhanced', 'premium']
  }).notNull(),
  maxMembers: integer('max_members').notNull(),
  privacySettings: jsonb('privacy_settings').$type<{
    defaultHealthSharing: boolean;
    requireExplicitConsent: boolean;
    minorProtectionEnabled: boolean;
    auditAllAccess: boolean;
    emergencyDataSharing: boolean;
  }>().default({
    defaultHealthSharing: false,
    requireExplicitConsent: true,
    minorProtectionEnabled: true,
    auditAllAccess: true,
    emergencyDataSharing: false
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull()
}, (table) => {
  return {
    primaryUserIdx: index('family_accounts_primary_user_idx').on(table.primaryUserId),
    tenantIdx: index('family_accounts_tenant_idx').on(table.tenantId),
    tierIdx: index('family_accounts_tier_idx').on(table.subscriptionTier)
  };
});

export const familyMembers = pgTable('family_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyAccountId: uuid('family_account_id').references(() => familyAccounts.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  relationship: text('relationship', {
    enum: ['parent', 'child', 'spouse', 'guardian', 'sibling', 'other']
  }).notNull(),
  permissionLevel: text('permission_level', {
    enum: ['full', 'limited', 'view_only', 'emergency_only']
  }).notNull(),
  canViewHealthData: boolean('can_view_health_data').default(false).notNull(),
  isMinor: boolean('is_minor').default(false).notNull(),
  guardianConsent: boolean('guardian_consent').default(false).notNull(),
  privacyOverrides: jsonb('privacy_overrides').$type<{
    healthDataSharing: 'explicit_consent_only' | 'family_visible' | 'guardian_only';
    recipeSharing: 'family_visible' | 'private' | 'public';
    mealPlanSharing: 'guardian_visible' | 'family_visible' | 'private';
    emergencyAccess?: string;
  }>().default({
    healthDataSharing: 'explicit_consent_only',
    recipeSharing: 'family_visible',
    mealPlanSharing: 'guardian_visible'
  }),
  addedAt: timestamp('added_at').defaultNow().notNull(),
  isActive: boolean('is_active').default(true).notNull()
}, (table) => {
  return {
    familyUserIdx: uniqueIndex('family_members_family_user_idx').on(table.familyAccountId, table.userId),
    familyIdx: index('family_members_family_idx').on(table.familyAccountId),
    userIdx: index('family_members_user_idx').on(table.userId),
    relationshipIdx: index('family_members_relationship_idx').on(table.relationship)
  };
});

// ===========================================
// CLINICAL RULES AND SAFETY
// ===========================================

export const clinicalRules = pgTable('clinical_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  ruleType: text('rule_type', {
    enum: ['drug_interaction', 'allergy_warning', 'condition_restriction']
  }).notNull(),
  condition: jsonb('condition').notNull(),
  action: jsonb('action').notNull(),
  severity: text('severity', {
    enum: ['info', 'warning', 'critical']
  }).notNull(),
  evidenceLevel: text('evidence_level', {
    enum: ['high', 'medium', 'low']
  }).notNull(),
  clinicalReferences: jsonb('clinical_references').$type<string[]>().default([]),
  isActive: boolean('is_active').default(true).notNull(),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  approvedBy: uuid('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastReviewed: timestamp('last_reviewed'),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    typeIdx: index('clinical_rules_type_idx').on(table.ruleType),
    severityIdx: index('clinical_rules_severity_idx').on(table.severity),
    activeIdx: index('clinical_rules_active_idx').on(table.isActive),
    createdByIdx: index('clinical_rules_created_by_idx').on(table.createdBy)
  };
});

export const clinicalReviews = pgTable('clinical_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  content: text('content').notNull(),
  analysisResult: jsonb('analysis_result').$type<{
    overallRisk: number;
    confidence: number;
    flaggedPhrases: string[];
    medicalConcepts: string[];
    requiresReview: boolean;
    analysisTimestamp: Date;
  }>().notNull(),
  submittedBy: uuid('submitted_by').references(() => users.id).notNull(),
  priority: text('priority', {
    enum: ['low', 'medium', 'high', 'critical']
  }).notNull(),
  status: text('status', {
    enum: ['pending', 'in_review', 'approved', 'rejected', 'escalated']
  }).default('pending').notNull(),
  assignedAdvisor: uuid('assigned_advisor').references(() => users.id),
  advisorDecision: text('advisor_decision'),
  advisorNotes: text('advisor_notes'),
  clinicalRecommendations: text('clinical_recommendations'),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  safetyRating: integer('safety_rating'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  dueDate: timestamp('due_date').notNull(),
  reviewedAt: timestamp('reviewed_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    statusIdx: index('clinical_reviews_status_idx').on(table.status),
    priorityIdx: index('clinical_reviews_priority_idx').on(table.priority),
    assignedIdx: index('clinical_reviews_assigned_idx').on(table.assignedAdvisor),
    dueDateIdx: index('clinical_reviews_due_date_idx').on(table.dueDate),
    submittedByIdx: index('clinical_reviews_submitted_by_idx').on(table.submittedBy)
  };
});

// ===========================================
// COMPREHENSIVE AUDIT LOGGING FOR HIPAA
// ===========================================

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 255 }).notNull(),
  resourceType: varchar('resource_type', { length: 100 }).notNull(),
  resourceId: uuid('resource_id'),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  sessionId: varchar('session_id', { length: 255 }),
  riskScore: decimal('risk_score', { precision: 5, scale: 2 }),
  complianceFlags: jsonb('compliance_flags').$type<string[]>().default([]),
  timestamp: timestamp('timestamp').defaultNow().notNull()
}, (table) => {
  return {
    tenantIdx: index('audit_logs_tenant_idx').on(table.tenantId),
    userIdx: index('audit_logs_user_idx').on(table.userId),
    actionIdx: index('audit_logs_action_idx').on(table.action),
    resourceIdx: index('audit_logs_resource_idx').on(table.resourceType, table.resourceId),
    timestampIdx: index('audit_logs_timestamp_idx').on(table.timestamp),
    riskScoreIdx: index('audit_logs_risk_score_idx').on(table.riskScore)
  };
});

// ===========================================
// API USAGE TRACKING FOR COST OPTIMIZATION
// ===========================================

export const apiUsageLogs = pgTable('api_usage_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  apiProvider: text('api_provider', {
    enum: ['edamam', 'gemini', 'med_gemini', 'stripe']
  }).notNull(),
  endpoint: varchar('endpoint', { length: 255 }).notNull(),
  requestCost: decimal('request_cost', { precision: 10, scale: 4 }),
  cacheHit: boolean('cache_hit').default(false).notNull(),
  responseTime: integer('response_time'), // milliseconds
  statusCode: integer('status_code'),
  errorMessage: text('error_message'),
  timestamp: timestamp('timestamp').defaultNow().notNull()
}, (table) => {
  return {
    tenantIdx: index('api_usage_tenant_idx').on(table.tenantId),
    userIdx: index('api_usage_user_idx').on(table.userId),
    providerIdx: index('api_usage_provider_idx').on(table.apiProvider),
    timestampIdx: index('api_usage_timestamp_idx').on(table.timestamp),
    costIdx: index('api_usage_cost_idx').on(table.requestCost),
    cacheIdx: index('api_usage_cache_idx').on(table.cacheHit)
  };
});

// ===========================================
// SUBSCRIPTIONS AND BILLING
// ===========================================

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyAccountId: uuid('family_account_id').references(() => familyAccounts.id).notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).unique().notNull(),
  tier: text('tier', {
    enum: ['basic', 'enhanced', 'premium']
  }).notNull(),
  status: text('status', {
    enum: ['active', 'past_due', 'canceled', 'unpaid', 'trialing']
  }).notNull(),
  memberCount: integer('member_count').notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  gracePeriodActive: boolean('grace_period_active').default(false).notNull(),
  criticalAccessEnabled: boolean('critical_access_enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => {
  return {
    familyAccountIdx: uniqueIndex('subscriptions_family_account_idx').on(table.familyAccountId),
    stripeIdx: uniqueIndex('subscriptions_stripe_idx').on(table.stripeSubscriptionId),
    statusIdx: index('subscriptions_status_idx').on(table.status),
    tierIdx: index('subscriptions_tier_idx').on(table.tier),
    periodEndIdx: index('subscriptions_period_end_idx').on(table.currentPeriodEnd)
  };
});

// ===========================================
// CONFLICT DETECTION AND RESOLUTION
// ===========================================

export const healthConflicts = pgTable('health_conflicts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  affectedUserId: uuid('affected_user_id').references(() => users.id).notNull(),
  conflictType: text('conflict_type', {
    enum: ['medication_interaction', 'allergy_conflict', 'condition_compatibility', 'lab_value_inconsistency']
  }).notNull(),
  severity: text('severity', {
    enum: ['low', 'medium', 'high', 'critical']
  }).notNull(),
  description: text('description').notNull(),
  conflictingData: jsonb('conflicting_data').notNull(),
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
  resolved: boolean('resolved').default(false).notNull(),
  resolutionAction: text('resolution_action'),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: uuid('resolved_by').references(() => users.id),
  autoResolved: boolean('auto_resolved').default(false).notNull()
}, (table) => {
  return {
    tenantIdx: index('health_conflicts_tenant_idx').on(table.tenantId),
    userIdx: index('health_conflicts_user_idx').on(table.affectedUserId),
    typeIdx: index('health_conflicts_type_idx').on(table.conflictType),
    severityIdx: index('health_conflicts_severity_idx').on(table.severity),
    resolvedIdx: index('health_conflicts_resolved_idx').on(table.resolved),
    detectedAtIdx: index('health_conflicts_detected_at_idx').on(table.detectedAt)
  };
});

// ===========================================
// RELATIONS
// ===========================================

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id]
  }),
  healthProfile: one(healthProfiles, {
    fields: [users.id],
    references: [healthProfiles.userId]
  }),
  familyMemberships: many(familyMembers),
  auditLogs: many(auditLogs),
  clinicalReviews: many(clinicalReviews)
}));

export const healthProfilesRelations = relations(healthProfiles, ({ one }) => ({
  user: one(users, {
    fields: [healthProfiles.userId],
    references: [users.id]
  }),
  tenant: one(tenants, {
    fields: [healthProfiles.tenantId],
    references: [tenants.id]
  })
}));

export const familyAccountsRelations = relations(familyAccounts, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [familyAccounts.tenantId],
    references: [tenants.id]
  }),
  primaryUser: one(users, {
    fields: [familyAccounts.primaryUserId],
    references: [users.id]
  }),
  members: many(familyMembers),
  subscription: one(subscriptions)
}));

export const familyMembersRelations = relations(familyMembers, ({ one }) => ({
  familyAccount: one(familyAccounts, {
    fields: [familyMembers.familyAccountId],
    references: [familyAccounts.id]
  }),
  user: one(users, {
    fields: [familyMembers.userId],
    references: [users.id]
  })
}));

// Export all tables for use in queries
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type HealthProfile = typeof healthProfiles.$inferSelect;
export type NewHealthProfile = typeof healthProfiles.$inferInsert;
export type FamilyAccount = typeof familyAccounts.$inferSelect;
export type NewFamilyAccount = typeof familyAccounts.$inferInsert;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type NewFamilyMember = typeof familyMembers.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;