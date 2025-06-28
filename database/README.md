# 🏥 Praneya Healthcare Database Architecture

This document describes the comprehensive multi-tenant database architecture for the Praneya Healthcare Platform, designed with HIPAA compliance, clinical safety, and family privacy protection at its core.

## 🔧 Quick Setup

### Prerequisites
- PostgreSQL 14+ with required extensions
- Node.js 18+ and npm/yarn
- Prisma CLI

### Automated Deployment
```bash
# Set required environment variables
export DATABASE_URL="postgresql://user:password@localhost:5432/praneya_healthcare"
export HIPAA_COMPLIANCE_REQUIRED=true
export BACKUP_ENCRYPTION_KEY="your-secure-encryption-key"

# Run the automated deployment script
./database/scripts/deploy-healthcare-db.sh
```

### Manual Setup
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Deploy database schema
npx prisma db push

# Seed development data
npx prisma db seed
```

## 🏗️ Architecture Overview

### Multi-Schema Organization
- **`public`**: Core application tables (users, tenants, recipes)
- **`healthcare`**: PHI and medical data (health profiles, medications, allergies)
- **`audit`**: HIPAA compliance logs and monitoring
- **`clinical`**: Clinical rules, drug interactions, safety protocols

### Key Design Principles
1. **Multi-Tenant Isolation**: Complete data separation between healthcare organizations
2. **Row-Level Security**: Database-enforced access controls
3. **Field-Level Encryption**: Sensitive PHI data encrypted at rest
4. **Comprehensive Auditing**: Every data access logged for HIPAA compliance
5. **Family Privacy**: Hierarchical permissions for family health data

## 📊 Database Schema

### Core Tables

#### Tenants
```sql
-- Multi-tenant foundation with encryption keys
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  plan_type plan_type DEFAULT 'BASIC',
  encryption_key_id TEXT NOT NULL,
  hipaa_compliant BOOLEAN DEFAULT true
);
```

#### Users
```sql
-- Users with encrypted PII and healthcare roles
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id),
  email TEXT UNIQUE,
  firebase_uid TEXT UNIQUE,
  -- Encrypted fields
  encrypted_first_name TEXT,
  encrypted_last_name TEXT,
  encrypted_phone TEXT,
  encrypted_date_of_birth TEXT,
  -- Healthcare-specific
  healthcare_role healthcare_role DEFAULT 'END_USER',
  subscription_tier subscription_tier DEFAULT 'BASIC',
  mfa_enabled BOOLEAN DEFAULT false
);
```

#### Health Profiles (healthcare schema)
```sql
-- Tiered health data with integrity protection
CREATE TABLE healthcare.health_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE REFERENCES users(id),
  subscription_tier subscription_tier,
  data_integrity_hash TEXT, -- For tamper detection
  last_verified TIMESTAMP,
  version INTEGER DEFAULT 1
);
```

### Healthcare Data Tables

#### Medications
```sql
CREATE TABLE healthcare.medications (
  id TEXT PRIMARY KEY,
  health_profile_id TEXT REFERENCES healthcare.health_profiles(id),
  generic_name TEXT NOT NULL,
  brand_name TEXT,
  dosage TEXT,
  frequency TEXT,
  route TEXT,
  indication TEXT,
  prescribed_by TEXT,
  is_active BOOLEAN DEFAULT true
);
```

#### Drug Interactions (clinical schema)
```sql
CREATE TABLE clinical.drug_interactions (
  id TEXT PRIMARY KEY,
  medication_id TEXT REFERENCES healthcare.medications(id),
  interacting_medication_id TEXT,
  interacting_substance TEXT,
  severity interaction_severity,
  interaction_type interaction_type,
  description TEXT,
  recommendation TEXT,
  avoid_combination BOOLEAN DEFAULT false,
  evidence_level evidence_level
);
```

#### Allergies
```sql
CREATE TABLE healthcare.allergies (
  id TEXT PRIMARY KEY,
  health_profile_id TEXT REFERENCES healthcare.health_profiles(id),
  allergen TEXT NOT NULL,
  allergen_category allergen_category,
  severity allergy_severity,
  reactions TEXT[],
  emergency_medication TEXT,
  is_active BOOLEAN DEFAULT true
);
```

### Family Management

#### Family Accounts
```sql
CREATE TABLE family_accounts (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id),
  primary_user_id TEXT REFERENCES users(id),
  family_name TEXT,
  subscription_tier subscription_tier,
  max_members INTEGER DEFAULT 6,
  privacy_settings JSONB DEFAULT '{}'
);
```

#### Family Members
```sql
CREATE TABLE family_members (
  id TEXT PRIMARY KEY,
  family_account_id TEXT REFERENCES family_accounts(id),
  user_id TEXT REFERENCES users(id),
  relationship family_relationship,
  permission_level permission_level,
  can_view_health_data BOOLEAN DEFAULT false,
  is_minor BOOLEAN DEFAULT false,
  guardian_consent BOOLEAN DEFAULT false
);
```

### Clinical Safety

#### Clinical Rules
```sql
CREATE TABLE clinical.clinical_rules (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id),
  rule_type clinical_rule_type,
  name TEXT NOT NULL,
  description TEXT,
  conditions JSONB, -- Complex rule logic
  actions JSONB,    -- Actions to take
  severity rule_severity,
  evidence_level evidence_level,
  is_active BOOLEAN DEFAULT true
);
```

### Audit & Compliance

#### Comprehensive Audit Logs
```sql
CREATE TABLE audit.audit_logs (
  id TEXT PRIMARY KEY,
  tenant_id TEXT REFERENCES tenants(id),
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  phi_accessed BOOLEAN DEFAULT false,
  risk_score FLOAT DEFAULT 0.0,
  compliance_flags TEXT[],
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Security Implementation

### Row-Level Security (RLS)

#### Tenant Isolation
```sql
-- Ensure users can only access data from their tenant
CREATE POLICY tenant_isolation_users ON users
  FOR ALL TO authenticated
  USING (tenant_id = current_tenant_id());
```

#### Family Privacy
```sql
-- Control health data access within families
CREATE POLICY family_health_access ON healthcare.health_profiles
  FOR SELECT TO authenticated
  USING (
    user_id = current_user_id() OR 
    can_access_family_data(user_id) OR
    has_emergency_access(user_id)
  );
```

#### Healthcare Role-Based Access
```sql
-- Clinical advisors have broader access
CREATE POLICY clinical_advisor_access ON healthcare.health_profiles
  FOR ALL TO authenticated
  USING (current_healthcare_role() IN ('CLINICAL_ADVISOR', 'SUPER_ADMIN'));
```

### Field-Level Encryption

#### Encryption Functions
```sql
-- Encrypt sensitive healthcare data
CREATE FUNCTION encrypt_phi(data TEXT, tenant_key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(pgp_sym_encrypt(data, tenant_key), 'base64');
END;
$$ LANGUAGE plpgsql;
```

#### Usage in Application
```typescript
// Encrypt before saving
const encryptedName = await encryption.encrypt(user.firstName);
await prisma.user.create({
  data: {
    encryptedFirstName: encryptedName,
    // ... other fields
  }
});
```

### Audit Triggers

#### Automatic PHI Access Logging
```sql
CREATE TRIGGER audit_health_profile_access
  AFTER INSERT OR UPDATE OR DELETE ON healthcare.health_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_audit_phi_access();
```

## 🔄 Data Access Layer

### Healthcare Data Access Class
```typescript
export class HealthcareDataAccess {
  async getUser(userId: string, requestContext: { tenantId: string; requestingUserId?: string }) {
    return this.dbManager.executeHealthcareQuery(
      () => prisma.user.findUnique({
        where: { id: userId },
        include: { healthProfile: true }
      }),
      {
        tenantId: requestContext.tenantId,
        userId: requestContext.requestingUserId,
        operation: 'read',
        resourceType: 'user',
        resourceId: userId,
        phiAccess: true,
      }
    );
  }
}
```

### Automatic Audit Logging
```typescript
async executeHealthcareQuery<T>(
  operation: () => Promise<T>,
  context: {
    userId?: string;
    tenantId: string;
    operation: string;
    resourceType: string;
    phiAccess?: boolean;
  }
): Promise<T> {
  const startTime = Date.now();
  
  try {
    const result = await operation();
    
    // Automatic audit logging for PHI access
    if (context.phiAccess) {
      await this.logDatabaseAccess(context);
    }
    
    return result;
  } catch (error) {
    // Log errors for compliance
    await this.logDatabaseAccess({ ...context, status: 'error' });
    throw error;
  }
}
```

## 📈 Performance Optimization

### Healthcare-Specific Indexes

#### Multi-Tenant Queries
```sql
-- Tenant isolation with included columns
CREATE INDEX CONCURRENTLY idx_users_tenant_email 
ON users(tenant_id, email) 
INCLUDE (healthcare_role, subscription_tier);
```

#### Family Privacy Queries
```sql
-- Family member relationships
CREATE INDEX CONCURRENTLY idx_family_members_permissions 
ON family_members(user_id, permission_level, can_view_health_data);
```

#### Medical Data Lookups
```sql
-- Active medications
CREATE INDEX CONCURRENTLY idx_medications_profile_active 
ON healthcare.medications(health_profile_id, is_active) 
INCLUDE (generic_name, dosage);

-- Critical allergies for emergency access
CREATE INDEX CONCURRENTLY idx_allergies_emergency 
ON healthcare.allergies(health_profile_id, severity) 
WHERE severity IN ('SEVERE', 'ANAPHYLACTIC') AND is_active = true;
```

#### Audit Compliance
```sql
-- HIPAA audit trail performance
CREATE INDEX CONCURRENTLY idx_audit_logs_phi_access 
ON audit.audit_logs(phi_accessed, timestamp DESC) 
WHERE phi_accessed = true;
```

### Query Optimization

#### Biometric Time-Series
```sql
-- Optimized for trend analysis
CREATE INDEX CONCURRENTLY idx_biometric_readings_trend 
ON healthcare.biometric_readings(user_id, reading_type, taken_at DESC) 
INCLUDE (value, trend_direction);
```

#### Clinical Rules Execution
```sql
-- Fast rule lookup
CREATE INDEX CONCURRENTLY idx_clinical_rules_type_active 
ON clinical.clinical_rules(rule_type, is_active, severity) 
WHERE is_active = true;
```

## 🔄 Backup & Recovery

### Automated Backup System

#### Encrypted Backups
```sql
-- Schedule daily encrypted backups
SELECT cron.schedule(
  'healthcare-daily-backup',
  '0 2 * * *',
  $$SELECT create_encrypted_backup('daily_backup', 'encryption_key');$$
);
```

#### HIPAA Retention Policy
```sql
-- 7-year audit log retention
CREATE FUNCTION manage_healthcare_retention()
RETURNS JSONB AS $$
BEGIN
  -- Archive audit logs older than 7 years
  WITH archived_logs AS (
    DELETE FROM audit.audit_logs 
    WHERE timestamp < NOW() - INTERVAL '7 years'
    RETURNING *
  )
  INSERT INTO audit.audit_logs_archive 
  SELECT * FROM archived_logs;
END;
$$ LANGUAGE plpgsql;
```

### Disaster Recovery

#### Point-in-Time Recovery
```sql
-- Prepare PITR configuration
CREATE FUNCTION prepare_point_in_time_recovery()
RETURNS JSONB AS $$
BEGIN
  RETURN jsonb_build_object(
    'wal_level', current_setting('wal_level'),
    'archive_mode', current_setting('archive_mode'),
    'current_wal_lsn', pg_current_wal_lsn()::TEXT
  );
END;
$$ LANGUAGE plpgsql;
```

#### Emergency Health Data Access
```sql
-- Emergency access for critical health information
CREATE FUNCTION emergency_health_access(
  target_user_id TEXT,
  requesting_user_id TEXT,
  emergency_reason TEXT
)
RETURNS JSONB AS $$
-- Returns critical allergies, medications, and conditions
-- Logs emergency access for audit compliance
$$;
```

## 🏥 Healthcare Compliance

### HIPAA Compliance Features

#### Data Encryption
- **At Rest**: Field-level encryption for all PHI using AES-256-GCM
- **In Transit**: TLS 1.3 for all database connections
- **Key Management**: Tenant-specific encryption keys

#### Access Controls
- **Multi-Factor Authentication**: Required for PHI access
- **Role-Based Access**: End users, clinical advisors, super admins
- **Audit Trails**: Every data access logged with user, time, action

#### Data Integrity
- **Integrity Hashes**: Tamper detection for health records
- **Version Control**: Health profile versioning for change tracking
- **Digital Signatures**: For clinical recommendations

### Compliance Validation
```sql
-- Automated HIPAA compliance check
SELECT validate_hipaa_compliance('tenant_id');
-- Returns compliance score and recommendations
```

### Privacy Protection

#### Family Data Sharing
- **Explicit Consent**: Required for health data sharing
- **Minor Protection**: Guardian consent for children under 18
- **Granular Permissions**: Control what family members can see

#### Data Minimization
- **Tiered Access**: Basic, Enhanced, Premium subscription levels
- **Need-to-Know**: Users only see data relevant to their role
- **Automated Purging**: Expired data automatically removed

## 🚀 Deployment

### Environment Setup
```bash
# Required environment variables
export DATABASE_URL="postgresql://user:pass@host:5432/db"
export BACKUP_ENCRYPTION_KEY="your-secure-key"
export HIPAA_COMPLIANCE_REQUIRED=true
export AUDIT_LOGGING_ENABLED=true
export ROW_LEVEL_SECURITY_ENABLED=true
```

### Production Deployment
```bash
# Run the comprehensive deployment script
./database/scripts/deploy-healthcare-db.sh
```

The script automatically:
1. ✅ Validates prerequisites and database connection
2. ✅ Installs required PostgreSQL extensions
3. ✅ Creates healthcare schemas (public, healthcare, audit, clinical)
4. ✅ Deploys Prisma schema with all tables and relationships
5. ✅ Enables row-level security policies
6. ✅ Creates audit triggers for HIPAA compliance
7. ✅ Optimizes performance with healthcare-specific indexes
8. ✅ Sets up backup and recovery procedures
9. ✅ Validates HIPAA compliance configuration
10. ✅ Seeds development data (if applicable)

### Monitoring & Maintenance

#### Database Health Checks
```typescript
// Automated health monitoring
export async function checkDatabaseHealth(): Promise<{
  status: 'healthy' | 'unhealthy';
  details: any;
}> {
  // Check connection, encryption, compliance status
}
```

#### Performance Monitoring
```sql
-- Identify slow healthcare queries
SELECT * FROM identify_slow_queries();

-- Monitor index usage
SELECT * FROM monitor_index_performance();
```

## 📋 Seed Data

The system includes comprehensive seed data for testing:

### Demo Scenarios
- **Healthcare Provider**: Dr. Sarah Smith (Clinical Advisor)
- **Family Account**: Doe Family with parent, spouse, and child
- **Health Conditions**: Severe allergies, medications, drug interactions
- **Clinical Rules**: Drug interaction safety checks
- **Audit Logs**: HIPAA compliance demonstrations

### Test Cases
- Multi-tenant data isolation
- Family privacy controls
- Emergency health access
- Clinical safety rules
- Audit trail completeness

## 🔍 Troubleshooting

### Common Issues

#### Connection Problems
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check PostgreSQL extensions
psql $DATABASE_URL -c "SELECT extname FROM pg_extension;"
```

#### Performance Issues
```sql
-- Update table statistics
SELECT update_healthcare_statistics();

-- Identify unused indexes
SELECT * FROM identify_unused_indexes();
```

#### Compliance Issues
```sql
-- Validate HIPAA compliance
SELECT validate_hipaa_compliance('tenant_id');

-- Check audit log coverage
SELECT COUNT(*) FROM audit.audit_logs WHERE phi_accessed = true;
```

### Support

For issues with the healthcare database implementation:

1. **Check Logs**: Review `database/scripts/deployment.log`
2. **Validate Schema**: Run `npx prisma validate`
3. **Test Connections**: Use the health check functions
4. **Review Compliance**: Run the HIPAA validation functions

## 🔮 Future Enhancements

### Planned Features
- **Horizontal Scaling**: Read replicas for reporting
- **Advanced Analytics**: Clinical outcome tracking
- **Machine Learning**: Predictive health insights
- **Integration APIs**: EHR and lab system connections
- **Mobile Optimization**: Offline emergency data access

### Compliance Roadmap
- **SOC 2 Type II**: Enhanced security controls
- **HITRUST CSF**: Comprehensive healthcare framework
- **FDA Validation**: Medical device software compliance
- **International Standards**: GDPR, PIPEDA support

This database architecture provides a solid foundation for the Praneya Healthcare Platform with enterprise-grade security, compliance, and performance capabilities.