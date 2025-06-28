-- =====================================================
-- Praneya Healthcare Platform - Performance Optimization
-- Healthcare-specific indexes and query optimizations
-- =====================================================

-- =====================================================
-- MULTI-TENANT PERFORMANCE INDEXES
-- =====================================================

-- Primary tenant isolation indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_tenant_email 
ON users(tenant_id, email) 
INCLUDE (healthcare_role, subscription_tier);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_tenant_active 
ON users(tenant_id, is_active, is_verified) 
WHERE is_active = true;

-- Tenant-based health profile access
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_health_profiles_tenant_user 
ON healthcare.health_profiles(user_id, subscription_tier) 
INCLUDE (last_verified, version);

-- =====================================================
-- FAMILY PRIVACY AND ACCESS CONTROL INDEXES
-- =====================================================

-- Family member relationship queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_family_members_account_user 
ON family_members(family_account_id, user_id) 
INCLUDE (relationship, permission_level);

-- Family permission and privacy queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_family_members_permissions 
ON family_members(user_id, permission_level, can_view_health_data) 
WHERE is_minor = false;

-- Minor protection queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_family_members_minors 
ON family_members(family_account_id, is_minor, guardian_consent) 
WHERE is_minor = true;

-- Family account subscription queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_family_accounts_tenant_active 
ON family_accounts(tenant_id, subscription_tier) 
INCLUDE (primary_user_id, max_members);

-- =====================================================
-- HEALTHCARE DATA QUERY OPTIMIZATION
-- =====================================================

-- Medication management indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_medications_profile_active 
ON healthcare.medications(health_profile_id, is_active) 
INCLUDE (generic_name, dosage, frequency);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_medications_generic_name 
ON healthcare.medications(generic_name, is_active) 
WHERE is_active = true;

-- Drug interaction lookup optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_drug_interactions_medication 
ON clinical.drug_interactions(medication_id, severity) 
INCLUDE (interacting_medication_id, avoid_combination);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_drug_interactions_substance 
ON clinical.drug_interactions(interacting_substance, severity) 
WHERE interacting_substance IS NOT NULL;

-- Allergy management indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_allergies_profile_severity 
ON healthcare.allergies(health_profile_id, severity, is_active) 
WHERE is_active = true;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_allergies_allergen_category 
ON healthcare.allergies(allergen, allergen_category, severity) 
WHERE is_active = true;

-- Critical allergy emergency lookup
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_allergies_emergency 
ON healthcare.allergies(health_profile_id, severity) 
WHERE severity IN ('SEVERE', 'ANAPHYLACTIC') AND is_active = true;

-- =====================================================
-- BIOMETRIC AND CLINICAL DATA INDEXES
-- =====================================================

-- Biometric readings time-series queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_biometric_readings_user_type_date 
ON healthcare.biometric_readings(user_id, reading_type, taken_at DESC) 
INCLUDE (value, unit, trend_direction);

-- Health trend analysis
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_biometric_readings_trend 
ON healthcare.biometric_readings(health_profile_id, reading_type, taken_at DESC) 
WHERE is_verified = true;

-- Lab values tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_lab_values_profile_date 
ON healthcare.lab_values(health_profile_id, date_collected DESC) 
INCLUDE (test_name, value, status);

-- Chronic condition monitoring
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chronic_conditions_active 
ON healthcare.chronic_conditions(health_profile_id, is_active) 
WHERE is_active = true;

-- =====================================================
-- CLINICAL RULES AND SAFETY INDEXES
-- =====================================================

-- Clinical rule execution optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clinical_rules_type_active 
ON clinical.clinical_rules(rule_type, is_active, severity) 
WHERE is_active = true;

-- Tenant-specific clinical rules
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clinical_rules_tenant_type 
ON clinical.clinical_rules(tenant_id, rule_type, is_active) 
WHERE is_active = true;

-- Rule execution tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rule_executions_rule_user 
ON clinical.rule_executions(clinical_rule_id, user_id, executed_at DESC);

-- Performance monitoring for rules
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rule_executions_performance 
ON clinical.rule_executions(executed_at DESC, execution_time) 
WHERE triggered = true;

-- =====================================================
-- RECIPE AND MEAL PLANNING INDEXES
-- =====================================================

-- Recipe search optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_recipes_query_hash 
ON recipes(query_hash) 
WHERE is_verified = true;

-- Dietary restriction filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_recipes_dietary_flags 
ON recipes USING GIN(dietary_flags) 
WHERE is_verified = true;

-- Meal type and cuisine filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_recipes_meal_cuisine 
ON recipes USING GIN(meal_type) 
INCLUDE (cuisine_type, complexity);

-- Recipe rating and popularity
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_recipes_rating 
ON recipes(rating DESC, rating_count DESC) 
WHERE is_verified = true;

-- Meal plan optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_meal_plans_user_active 
ON meal_plans(user_id, is_active, start_date DESC) 
WHERE is_active = true;

-- Meal plan recipe associations
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_meal_plan_recipes_plan_day 
ON meal_plan_recipes(meal_plan_id, meal_plan_day_id, meal_type);

-- =====================================================
-- AUDIT AND COMPLIANCE INDEXES
-- =====================================================

-- Audit log performance (most critical for HIPAA)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_tenant_timestamp 
ON audit.audit_logs(tenant_id, timestamp DESC) 
INCLUDE (user_id, action, resource_type);

-- PHI access tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_phi_access 
ON audit.audit_logs(phi_accessed, timestamp DESC) 
WHERE phi_accessed = true;

-- User activity monitoring
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_action 
ON audit.audit_logs(user_id, action, timestamp DESC) 
INCLUDE (resource_type, resource_id);

-- Compliance risk tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_risk_score 
ON audit.audit_logs(risk_score DESC, timestamp DESC) 
WHERE risk_score > 0.5;

-- Compliance flags monitoring
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_compliance_flags 
ON audit.audit_logs USING GIN(compliance_flags) 
WHERE compliance_flags IS NOT NULL;

-- =====================================================
-- CONSENT MANAGEMENT INDEXES
-- =====================================================

-- Consent status tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_consent_records_user_type 
ON consent_records(user_id, consent_type, status) 
INCLUDE (consented_at, expires_at);

-- Expired consent monitoring
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_consent_records_expiration 
ON consent_records(expires_at ASC, status) 
WHERE expires_at IS NOT NULL AND status = 'GRANTED';

-- =====================================================
-- DEVICE SECURITY INDEXES
-- =====================================================

-- Device fingerprint security
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_device_fingerprints_user_trusted 
ON device_fingerprints(user_id, trusted, last_seen DESC);

-- Risk-based device monitoring
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_device_fingerprints_risk 
ON device_fingerprints(risk_score DESC, last_seen DESC) 
WHERE risk_score > 0.3;

-- =====================================================
-- API USAGE AND COST OPTIMIZATION INDEXES
-- =====================================================

-- API usage tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_usage_tenant_provider 
ON audit.api_usage_logs(tenant_id, provider, timestamp DESC);

-- Cost optimization tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_usage_cost 
ON audit.api_usage_logs(tenant_id, request_cost DESC, timestamp DESC) 
WHERE request_cost IS NOT NULL;

-- Cache performance monitoring
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_api_usage_cache_performance 
ON audit.api_usage_logs(cache_hit, response_time, timestamp DESC);

-- =====================================================
-- SUBSCRIPTION AND BILLING INDEXES
-- =====================================================

-- Subscription management
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_family_status 
ON subscriptions(family_account_id, status) 
INCLUDE (tier, current_period_end);

-- Grace period monitoring
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscriptions_grace_period 
ON subscriptions(grace_period_active, current_period_end) 
WHERE grace_period_active = true;

-- =====================================================
-- FULL-TEXT SEARCH OPTIMIZATION
-- =====================================================

-- Recipe content search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_recipes_fulltext_search 
ON recipes USING GIN(to_tsvector('english', title || ' ' || description));

-- Clinical rule search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_clinical_rules_fulltext 
ON clinical.clinical_rules USING GIN(to_tsvector('english', name || ' ' || description));

-- =====================================================
-- PARTIAL INDEXES FOR COMMON FILTERS
-- =====================================================

-- Active users only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_verified 
ON users(tenant_id, last_login_at DESC) 
WHERE is_active = true AND is_verified = true;

-- Current medications only
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_medications_current 
ON healthcare.medications(health_profile_id, generic_name) 
WHERE is_active = true AND discontinued_date IS NULL;

-- Recent biometric readings
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_biometric_readings_recent 
ON healthcare.biometric_readings(user_id, reading_type, taken_at DESC) 
WHERE taken_at > NOW() - INTERVAL '1 year';

-- =====================================================
-- COVERING INDEXES FOR COMMON QUERIES
-- =====================================================

-- User profile summary (covering index)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_profile_summary 
ON users(id) 
INCLUDE (tenant_id, email, healthcare_role, subscription_tier, is_active, last_login_at);

-- Health profile summary (covering index)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_health_profiles_summary 
ON healthcare.health_profiles(user_id) 
INCLUDE (subscription_tier, last_verified, version, data_integrity_hash);

-- =====================================================
-- STATISTICS AND MAINTENANCE
-- =====================================================

-- Function to update table statistics for healthcare tables
CREATE OR REPLACE FUNCTION update_healthcare_statistics()
RETURNS VOID AS $$
BEGIN
  -- Update statistics for frequently queried tables
  ANALYZE users;
  ANALYZE healthcare.health_profiles;
  ANALYZE healthcare.medications;
  ANALYZE healthcare.allergies;
  ANALYZE healthcare.biometric_readings;
  ANALYZE family_accounts;
  ANALYZE family_members;
  ANALYZE audit.audit_logs;
  ANALYZE clinical.clinical_rules;
  ANALYZE recipes;
  ANALYZE meal_plans;
  
  -- Log statistics update
  INSERT INTO audit.audit_logs (
    tenant_id,
    action,
    resource_type,
    timestamp
  ) VALUES (
    'system',
    'DATABASE_STATISTICS_UPDATED',
    'performance_optimization',
    NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Schedule automatic statistics updates
SELECT cron.schedule(
  'healthcare-statistics-update',
  '0 1 * * *', -- Daily at 1 AM UTC
  $$SELECT update_healthcare_statistics();$$
);

-- =====================================================
-- INDEX MONITORING AND MAINTENANCE
-- =====================================================

-- Function to monitor index usage and performance
CREATE OR REPLACE FUNCTION monitor_index_performance()
RETURNS TABLE(
  schema_name TEXT,
  table_name TEXT,
  index_name TEXT,
  index_size TEXT,
  index_scans BIGINT,
  tuples_read BIGINT,
  tuples_fetched BIGINT,
  usage_ratio NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname::TEXT,
    tablename::TEXT,
    indexname::TEXT,
    pg_size_pretty(pg_relation_size(indexrelid))::TEXT as index_size,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    CASE 
      WHEN idx_scan = 0 THEN 0
      ELSE ROUND((idx_tup_fetch::NUMERIC / idx_tup_read::NUMERIC) * 100, 2)
    END as usage_ratio
  FROM pg_stat_user_indexes 
  WHERE schemaname IN ('public', 'healthcare', 'audit', 'clinical')
  ORDER BY idx_scan DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to identify unused indexes
CREATE OR REPLACE FUNCTION identify_unused_indexes()
RETURNS TABLE(
  schema_name TEXT,
  table_name TEXT,
  index_name TEXT,
  index_size TEXT,
  recommendation TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname::TEXT,
    tablename::TEXT,
    indexname::TEXT,
    pg_size_pretty(pg_relation_size(indexrelid))::TEXT,
    CASE 
      WHEN idx_scan = 0 THEN 'Consider dropping - never used'
      WHEN idx_scan < 10 THEN 'Low usage - review necessity'
      ELSE 'Active index - keep'
    END::TEXT as recommendation
  FROM pg_stat_user_indexes 
  WHERE schemaname IN ('public', 'healthcare', 'audit', 'clinical')
    AND idx_scan < 100  -- Indexes used less than 100 times
  ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- QUERY PERFORMANCE MONITORING
-- =====================================================

-- Function to identify slow healthcare queries
CREATE OR REPLACE FUNCTION identify_slow_queries()
RETURNS TABLE(
  query_text TEXT,
  calls BIGINT,
  total_time NUMERIC,
  avg_time NUMERIC,
  stddev_time NUMERIC,
  recommendation TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    LEFT(query, 100)::TEXT as query_text,
    calls,
    ROUND(total_exec_time::NUMERIC, 2) as total_time,
    ROUND(mean_exec_time::NUMERIC, 2) as avg_time,
    ROUND(stddev_exec_time::NUMERIC, 2) as stddev_time,
    CASE 
      WHEN mean_exec_time > 1000 THEN 'CRITICAL: Query averaging >1 second'
      WHEN mean_exec_time > 500 THEN 'WARNING: Query averaging >500ms'
      WHEN mean_exec_time > 100 THEN 'INFO: Monitor for optimization'
      ELSE 'OK: Performance acceptable'
    END::TEXT as recommendation
  FROM pg_stat_statements 
  WHERE query ILIKE ANY(ARRAY['%health_profiles%', '%medications%', '%allergies%', '%audit_logs%'])
    AND calls > 10
  ORDER BY mean_exec_time DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HEALTHCARE-SPECIFIC PERFORMANCE RECOMMENDATIONS
-- =====================================================

-- Function to generate performance recommendations
CREATE OR REPLACE FUNCTION generate_performance_recommendations()
RETURNS JSONB AS $$
DECLARE
  recommendations JSONB;
  table_sizes JSONB;
  index_usage JSONB;
BEGIN
  -- Get table sizes
  SELECT jsonb_object_agg(
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
  ) INTO table_sizes
  FROM pg_tables 
  WHERE schemaname IN ('public', 'healthcare', 'audit', 'clinical');
  
  -- Get index usage summary
  SELECT jsonb_object_agg(
    'total_scans',
    SUM(idx_scan)
  ) INTO index_usage
  FROM pg_stat_user_indexes 
  WHERE schemaname IN ('public', 'healthcare', 'audit', 'clinical');
  
  recommendations := jsonb_build_object(
    'generated_at', NOW(),
    'table_sizes', table_sizes,
    'index_usage_summary', index_usage,
    'performance_recommendations', jsonb_build_array(
      'Monitor audit.audit_logs table growth - consider partitioning',
      'Review healthcare.biometric_readings retention policy',
      'Optimize family_member permission queries with covering indexes',
      'Consider read replicas for reporting queries',
      'Implement connection pooling for high-concurrency scenarios'
    ),
    'healthcare_specific_optimizations', jsonb_build_array(
      'Cache frequently accessed allergy and medication data',
      'Pre-compute emergency health summaries',
      'Optimize clinical rule execution with materialized views',
      'Use partial indexes for active-only health data'
    )
  );
  
  -- Log performance analysis
  INSERT INTO audit.audit_logs (
    tenant_id,
    action,
    resource_type,
    new_values,
    timestamp
  ) VALUES (
    'system',
    'PERFORMANCE_ANALYSIS_COMPLETED',
    'database_optimization',
    recommendations,
    NOW()
  );
  
  RETURN recommendations;
END;
$$ LANGUAGE plpgsql; 