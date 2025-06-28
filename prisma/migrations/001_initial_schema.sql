-- =====================================================
-- Praneya Healthcare Platform - Initial Migration
-- HIPAA-compliant multi-tenant database with RLS
-- =====================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create separate schemas for healthcare data organization
CREATE SCHEMA IF NOT EXISTS healthcare;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS clinical;

-- =====================================================
-- HEALTHCARE ENCRYPTION FUNCTIONS
-- =====================================================

-- Function to encrypt sensitive healthcare data
CREATE OR REPLACE FUNCTION encrypt_phi(data TEXT, tenant_key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(pgp_sym_encrypt(data, tenant_key), 'base64');
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt sensitive healthcare data
CREATE OR REPLACE FUNCTION decrypt_phi(encrypted_data TEXT, tenant_key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(decode(encrypted_data, 'base64'), tenant_key);
END;
$$ LANGUAGE plpgsql;

-- Function to generate data integrity hash
CREATE OR REPLACE FUNCTION generate_integrity_hash(data JSONB)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(data::TEXT, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables after creation
-- This will be applied after the schema is generated

-- Tenant isolation policy function
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User context policy function
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_user_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Healthcare role policy function
CREATE OR REPLACE FUNCTION current_healthcare_role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('app.current_healthcare_role', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Family member access check function
CREATE OR REPLACE FUNCTION can_access_family_data(target_user_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  requesting_user_id TEXT := current_user_id();
  family_account_id TEXT;
  permission_level TEXT;
  is_minor BOOLEAN;
  can_view_health BOOLEAN;
BEGIN
  -- Check if same user
  IF requesting_user_id = target_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- Check if users are in same family
  SELECT fm1.family_account_id, fm2.permission_level, fm2.is_minor, fm2.can_view_health_data
  INTO family_account_id, permission_level, is_minor, can_view_health
  FROM family_members fm1
  JOIN family_members fm2 ON fm1.family_account_id = fm2.family_account_id
  WHERE fm1.user_id = requesting_user_id 
    AND fm2.user_id = target_user_id;
  
  -- If not in same family, deny access
  IF family_account_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check permissions based on family relationship
  CASE permission_level
    WHEN 'FULL' THEN RETURN TRUE;
    WHEN 'LIMITED' THEN RETURN can_view_health;
    WHEN 'VIEW_ONLY' THEN RETURN can_view_health;
    WHEN 'EMERGENCY_ONLY' THEN RETURN FALSE; -- Emergency access handled separately
    ELSE RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Emergency access check function
CREATE OR REPLACE FUNCTION has_emergency_access(target_user_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  requesting_user_id TEXT := current_user_id();
  emergency_enabled BOOLEAN;
BEGIN
  -- Check if emergency access is enabled for the family
  SELECT EXISTS(
    SELECT 1 FROM family_members fm1
    JOIN family_members fm2 ON fm1.family_account_id = fm2.family_account_id
    WHERE fm1.user_id = requesting_user_id 
      AND fm2.user_id = target_user_id
      AND fm2.permission_level = 'EMERGENCY_ONLY'
  ) INTO emergency_enabled;
  
  RETURN emergency_enabled;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- AUDIT LOGGING FUNCTIONS
-- =====================================================

-- Function to log data access for HIPAA compliance
CREATE OR REPLACE FUNCTION log_data_access(
  p_tenant_id TEXT,
  p_user_id TEXT,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_phi_accessed BOOLEAN DEFAULT FALSE
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audit.audit_logs (
    tenant_id,
    user_id,
    action,
    resource_type,
    resource_id,
    phi_accessed,
    ip_address,
    user_agent,
    timestamp
  ) VALUES (
    p_tenant_id,
    p_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_phi_accessed,
    current_setting('app.client_ip', true),
    current_setting('app.user_agent', true),
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGER FUNCTIONS FOR AUTOMATIC AUDIT LOGGING
-- =====================================================

-- Trigger function for PHI access logging
CREATE OR REPLACE FUNCTION trigger_audit_phi_access()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_data_access(
    current_tenant_id(),
    current_user_id(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TRUE
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for data integrity validation
CREATE OR REPLACE FUNCTION trigger_data_integrity_check()
RETURNS TRIGGER AS $$
BEGIN
  -- Update integrity hash on data changes
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    NEW.data_integrity_hash := generate_integrity_hash(row_to_json(NEW)::JSONB);
    NEW.updated_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PERFORMANCE OPTIMIZATION INDEXES
-- =====================================================

-- After tables are created, these indexes will be applied
-- Indexes for healthcare-specific query patterns

-- Composite indexes for multi-tenant queries
-- CREATE INDEX CONCURRENTLY idx_users_tenant_email ON users(tenant_id, email);
-- CREATE INDEX CONCURRENTLY idx_health_profiles_user_tier ON healthcare.health_profiles(user_id, subscription_tier);

-- Indexes for family privacy queries
-- CREATE INDEX CONCURRENTLY idx_family_members_account_user ON family_members(family_account_id, user_id);
-- CREATE INDEX CONCURRENTLY idx_family_members_permissions ON family_members(user_id, permission_level, can_view_health_data);

-- Indexes for healthcare data queries
-- CREATE INDEX CONCURRENTLY idx_medications_active ON healthcare.medications(health_profile_id, is_active);
-- CREATE INDEX CONCURRENTLY idx_allergies_severity ON healthcare.allergies(health_profile_id, severity);
-- CREATE INDEX CONCURRENTLY idx_biometric_readings_type_date ON healthcare.biometric_readings(user_id, reading_type, taken_at DESC);

-- Indexes for audit and compliance
-- CREATE INDEX CONCURRENTLY idx_audit_logs_tenant_timestamp ON audit.audit_logs(tenant_id, timestamp DESC);
-- CREATE INDEX CONCURRENTLY idx_audit_logs_phi_access ON audit.audit_logs(phi_accessed, timestamp DESC);
-- CREATE INDEX CONCURRENTLY idx_audit_logs_user_action ON audit.audit_logs(user_id, action, timestamp DESC);

-- Indexes for clinical rules and safety
-- CREATE INDEX CONCURRENTLY idx_clinical_rules_type_active ON clinical.clinical_rules(rule_type, is_active);
-- CREATE INDEX CONCURRENTLY idx_drug_interactions_severity ON clinical.drug_interactions(medication_id, severity);

-- =====================================================
-- HEALTHCARE DATA RETENTION POLICIES
-- =====================================================

-- Function to archive old audit logs (7-year retention for HIPAA)
CREATE OR REPLACE FUNCTION archive_old_audit_logs()
RETURNS VOID AS $$
BEGIN
  -- Move audit logs older than 7 years to archive table
  CREATE TABLE IF NOT EXISTS audit.audit_logs_archive (LIKE audit.audit_logs);
  
  WITH archived_logs AS (
    DELETE FROM audit.audit_logs 
    WHERE timestamp < NOW() - INTERVAL '7 years'
    RETURNING *
  )
  INSERT INTO audit.audit_logs_archive 
  SELECT * FROM archived_logs;
  
  -- Log the archival operation
  INSERT INTO audit.audit_logs (
    tenant_id,
    action,
    resource_type,
    timestamp
  ) VALUES (
    'system',
    'AUDIT_LOG_ARCHIVAL',
    'audit_logs',
    NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- HEALTHCARE COMPLIANCE VALIDATION
-- =====================================================

-- Function to validate HIPAA compliance status
CREATE OR REPLACE FUNCTION validate_hipaa_compliance(p_tenant_id TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  encryption_check BOOLEAN;
  audit_check BOOLEAN;
  access_control_check BOOLEAN;
BEGIN
  -- Check encryption capabilities
  BEGIN
    PERFORM pgp_sym_encrypt('test', 'test');
    encryption_check := TRUE;
  EXCEPTION WHEN OTHERS THEN
    encryption_check := FALSE;
  END;
  
  -- Check audit logging is active
  SELECT COUNT(*) > 0 INTO audit_check
  FROM audit.audit_logs
  WHERE timestamp > NOW() - INTERVAL '1 day';
  
  -- Check access controls are in place
  SELECT COUNT(*) > 0 INTO access_control_check
  FROM pg_policies
  WHERE schemaname IN ('public', 'healthcare', 'clinical');
  
  result := jsonb_build_object(
    'tenant_id', p_tenant_id,
    'encryption_enabled', encryption_check,
    'audit_logging_active', audit_check,
    'access_controls_enabled', access_control_check,
    'compliance_score', (
      (encryption_check::INT + audit_check::INT + access_control_check::INT)::FLOAT / 3 * 100
    ),
    'last_checked', NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- EMERGENCY ACCESS PROCEDURES
-- =====================================================

-- Function for emergency health data access
CREATE OR REPLACE FUNCTION emergency_health_access(
  target_user_id TEXT,
  requesting_user_id TEXT,
  emergency_reason TEXT
)
RETURNS JSONB AS $$
DECLARE
  health_data JSONB;
  access_granted BOOLEAN := FALSE;
BEGIN
  -- Validate emergency access rights
  IF has_emergency_access(target_user_id) THEN
    access_granted := TRUE;
  END IF;
  
  -- Healthcare providers always have emergency access
  IF current_healthcare_role() IN ('CLINICAL_ADVISOR', 'SUPER_ADMIN') THEN
    access_granted := TRUE;
  END IF;
  
  IF NOT access_granted THEN
    RAISE EXCEPTION 'Emergency access denied';
  END IF;
  
  -- Retrieve critical health information
  SELECT jsonb_build_object(
    'allergies', a.allergies,
    'medications', m.medications,
    'chronic_conditions', c.conditions,
    'emergency_contacts', u.emergency_contacts
  ) INTO health_data
  FROM users u
  LEFT JOIN (
    SELECT health_profile_id, jsonb_agg(jsonb_build_object(
      'allergen', allergen,
      'severity', severity,
      'reactions', reactions
    )) as allergies
    FROM healthcare.allergies 
    WHERE health_profile_id = (SELECT id FROM healthcare.health_profiles WHERE user_id = target_user_id)
      AND severity IN ('SEVERE', 'ANAPHYLACTIC')
    GROUP BY health_profile_id
  ) a ON TRUE
  LEFT JOIN (
    SELECT health_profile_id, jsonb_agg(jsonb_build_object(
      'generic_name', generic_name,
      'dosage', dosage,
      'frequency', frequency
    )) as medications
    FROM healthcare.medications 
    WHERE health_profile_id = (SELECT id FROM healthcare.health_profiles WHERE user_id = target_user_id)
      AND is_active = TRUE
    GROUP BY health_profile_id
  ) m ON TRUE
  LEFT JOIN (
    SELECT health_profile_id, jsonb_agg(condition) as conditions
    FROM healthcare.chronic_conditions 
    WHERE health_profile_id = (SELECT id FROM healthcare.health_profiles WHERE user_id = target_user_id)
      AND is_active = TRUE
    GROUP BY health_profile_id
  ) c ON TRUE
  WHERE u.id = target_user_id;
  
  -- Log emergency access
  PERFORM log_data_access(
    current_tenant_id(),
    requesting_user_id,
    'EMERGENCY_ACCESS',
    'health_profile',
    target_user_id,
    TRUE
  );
  
  -- Add emergency access metadata
  health_data := jsonb_build_object(
    'emergency_access', TRUE,
    'accessed_by', requesting_user_id,
    'access_time', NOW(),
    'reason', emergency_reason,
    'data', health_data
  );
  
  RETURN health_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SCHEMA VALIDATION AND CLEANUP
-- =====================================================

-- Function to validate schema integrity
CREATE OR REPLACE FUNCTION validate_schema_integrity()
RETURNS BOOLEAN AS $$
DECLARE
  missing_tables INT;
  missing_indexes INT;
  missing_policies INT;
BEGIN
  -- Check for required tables
  SELECT COUNT(*) INTO missing_tables
  FROM information_schema.tables
  WHERE table_schema IN ('public', 'healthcare', 'audit', 'clinical')
    AND table_name IN (
      'tenants', 'users', 'health_profiles', 'medications',
      'allergies', 'clinical_rules', 'audit_logs'
    );
  
  -- Validate that we have all required tables
  IF missing_tables < 7 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- POST-MIGRATION SETUP NOTES
-- =====================================================

-- After Prisma generates the schema, run these commands:

/*
-- 1. Enable RLS on all healthcare tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare.health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- 2. Create tenant isolation policies
CREATE POLICY tenant_isolation_users ON users
  FOR ALL TO authenticated
  USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_health_profiles ON healthcare.health_profiles
  FOR ALL TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE tenant_id = current_tenant_id()
  ));

-- 3. Create family privacy policies
CREATE POLICY family_health_access ON healthcare.health_profiles
  FOR SELECT TO authenticated
  USING (
    user_id = current_user_id() OR 
    can_access_family_data(user_id) OR
    has_emergency_access(user_id)
  );

-- 4. Create healthcare role policies
CREATE POLICY clinical_advisor_access ON healthcare.health_profiles
  FOR ALL TO authenticated
  USING (current_healthcare_role() IN ('CLINICAL_ADVISOR', 'SUPER_ADMIN'));

-- 5. Add PHI access triggers
CREATE TRIGGER audit_health_profile_access
  AFTER INSERT OR UPDATE OR DELETE ON healthcare.health_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_audit_phi_access();

CREATE TRIGGER audit_medication_access
  AFTER INSERT OR UPDATE OR DELETE ON healthcare.medications
  FOR EACH ROW EXECUTE FUNCTION trigger_audit_phi_access();

-- 6. Create performance indexes
CREATE INDEX CONCURRENTLY idx_users_tenant_email ON users(tenant_id, email);
CREATE INDEX CONCURRENTLY idx_health_profiles_user_tier ON healthcare.health_profiles(user_id, subscription_tier);
CREATE INDEX CONCURRENTLY idx_family_members_account_user ON family_members(family_account_id, user_id);
CREATE INDEX CONCURRENTLY idx_audit_logs_tenant_timestamp ON audit.audit_logs(tenant_id, timestamp DESC);
*/ 