-- Praneya Healthcare SaaS - Database Initialization
-- Multi-tenant architecture with row-level security for healthcare compliance

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types for healthcare compliance
CREATE TYPE user_role AS ENUM ('end_user', 'super_admin', 'clinical_advisor');
CREATE TYPE subscription_tier AS ENUM ('basic', 'enhanced', 'premium');
CREATE TYPE health_condition AS ENUM ('diabetes', 'hypertension', 'heart_disease', 'kidney_disease', 'other');
CREATE TYPE consent_status AS ENUM ('pending', 'granted', 'revoked');

-- Create tenants table (root table for multi-tenancy)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create tenant-aware users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'end_user',
    subscription_tier subscription_tier DEFAULT 'basic',
    device_fingerprint TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER DEFAULT 0,
    account_locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create medical disclaimers table for consent management
CREATE TABLE medical_disclaimers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    effective_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_current BOOLEAN DEFAULT false
);

-- Create user consent tracking
CREATE TABLE user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    disclaimer_id UUID NOT NULL REFERENCES medical_disclaimers(id),
    status consent_status DEFAULT 'pending',
    ip_address INET,
    user_agent TEXT,
    consented_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create health profiles for tiered health data collection
CREATE TABLE health_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    age_range VARCHAR(20),
    gender VARCHAR(20),
    activity_level VARCHAR(20),
    dietary_restrictions TEXT[],
    allergies TEXT[],
    health_conditions health_condition[],
    medications TEXT[],
    lab_values JSONB, -- For Premium tier only
    biometric_data JSONB, -- For Premium tier only
    clinical_notes TEXT, -- For Premium tier only
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family accounts for hierarchical relationships
CREATE TABLE family_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    primary_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    family_name VARCHAR(255),
    max_members INTEGER DEFAULT 6,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family members junction table
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    family_account_id UUID NOT NULL REFERENCES family_accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relationship VARCHAR(50),
    can_view_health_data BOOLEAN DEFAULT false,
    can_manage_meals BOOLEAN DEFAULT false,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit log for healthcare compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_health_profiles_tenant_user ON health_profiles(tenant_id, user_id);
CREATE INDEX idx_family_accounts_tenant_id ON family_accounts(tenant_id);
CREATE INDEX idx_family_members_tenant_family ON family_members(tenant_id, family_account_id);
CREATE INDEX idx_audit_logs_tenant_user ON audit_logs(tenant_id, user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for multi-tenant isolation
-- Users can only see data from their tenant
CREATE POLICY tenant_isolation_users ON users
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_health_profiles ON health_profiles
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_family_accounts ON family_accounts
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_family_members ON family_members
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_user_consents ON user_consents
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_audit_logs ON audit_logs
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Create application user for the application to connect as
CREATE USER application_user WITH PASSWORD 'app_user_password_2024';

-- Grant necessary permissions to application user
GRANT USAGE ON SCHEMA public TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO application_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO application_user;

-- Create function to set tenant context
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_uuid UUID)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', tenant_uuid::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION set_tenant_context(UUID) TO application_user;

-- Create trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_profiles_updated_at BEFORE UPDATE ON health_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_accounts_updated_at BEFORE UPDATE ON family_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default tenant for development
INSERT INTO tenants (id, name, subdomain) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Praneya Dev', 'dev');

-- Insert default medical disclaimer
INSERT INTO medical_disclaimers (version, content, effective_date, is_current)
VALUES (
    '1.0',
    'This application provides general nutrition information and is not intended as medical advice. Always consult with healthcare professionals for medical guidance.',
    NOW(),
    true
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (tenant_id, action, resource_type, resource_id, old_values)
        VALUES (
            OLD.tenant_id,
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            row_to_json(OLD)
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (tenant_id, action, resource_type, resource_id, old_values, new_values)
        VALUES (
            NEW.tenant_id,
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(OLD),
            row_to_json(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (tenant_id, action, resource_type, resource_id, new_values)
        VALUES (
            NEW.tenant_id,
            'INSERT',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(NEW)
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for healthcare compliance
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_health_profiles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON health_profiles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create view for user with health profile (convenience)
CREATE VIEW user_profiles AS
SELECT 
    u.id,
    u.tenant_id,
    u.firebase_uid,
    u.email,
    u.role,
    u.subscription_tier,
    u.last_login,
    u.created_at as user_created_at,
    hp.age_range,
    hp.gender,
    hp.activity_level,
    hp.dietary_restrictions,
    hp.allergies,
    hp.health_conditions,
    hp.medications,
    CASE 
        WHEN u.subscription_tier = 'premium' THEN hp.lab_values
        ELSE NULL
    END as lab_values,
    CASE 
        WHEN u.subscription_tier = 'premium' THEN hp.biometric_data
        ELSE NULL
    END as biometric_data
FROM users u
LEFT JOIN health_profiles hp ON u.id = hp.user_id AND u.tenant_id = hp.tenant_id;