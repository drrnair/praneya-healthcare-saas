-- Praneya Healthcare SaaS - Enhanced Database Schema
-- Comprehensive healthcare nutrition platform with clinical compliance

-- Enhanced health condition types with medical coding
CREATE TYPE health_condition_detailed AS ENUM (
  'diabetes_type_1', 'diabetes_type_2', 'gestational_diabetes', 'prediabetes',
  'hypertension_stage_1', 'hypertension_stage_2', 'prehypertension',
  'heart_disease_cad', 'heart_disease_chf', 'heart_disease_arrhythmia', 'heart_disease_valve',
  'kidney_disease_stage_1', 'kidney_disease_stage_2', 'kidney_disease_stage_3',
  'kidney_disease_stage_4', 'kidney_disease_stage_5', 'kidney_disease_dialysis',
  'celiac_disease', 'crohns_disease', 'ulcerative_colitis', 'ibs',
  'food_allergies_severe', 'food_allergies_moderate', 'food_allergies_mild',
  'environmental_allergies', 'drug_allergies',
  'obesity_class_1', 'obesity_class_2', 'obesity_class_3', 'underweight',
  'eating_disorder_anorexia', 'eating_disorder_bulimia', 'eating_disorder_bed',
  'thyroid_hyperthyroid', 'thyroid_hypothyroid', 'thyroid_cancer',
  'cancer_active_treatment', 'cancer_survivor', 'cancer_palliative',
  'liver_disease_fatty', 'liver_disease_cirrhosis', 'liver_disease_hepatitis',
  'mental_health_depression', 'mental_health_anxiety', 'mental_health_bipolar',
  'autoimmune_lupus', 'autoimmune_rheumatoid', 'autoimmune_multiple_sclerosis',
  'pregnancy_first_trimester', 'pregnancy_second_trimester', 'pregnancy_third_trimester',
  'breastfeeding', 'menopause', 'osteoporosis'
);

-- Clinical severity levels
CREATE TYPE severity_level AS ENUM ('mild', 'moderate', 'severe', 'critical');

-- Evidence levels for clinical recommendations
CREATE TYPE evidence_level AS ENUM ('A', 'B', 'C', 'D', 'expert_consensus');

-- Clinical review status
CREATE TYPE review_status AS ENUM ('pending', 'in_review', 'approved', 'rejected', 'escalated', 'archived');

-- Drug interaction types
CREATE TYPE interaction_type AS ENUM ('avoid', 'monitor', 'timing_separation', 'dose_adjustment', 'supplement_recommended');

-- Enhanced clinical profiles table
CREATE TABLE clinical_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Medical coding systems
    icd10_codes TEXT[], -- International Classification of Diseases, 10th Revision
    snomed_codes TEXT[], -- Systematized Nomenclature of Medicine Clinical Terms
    loinc_codes TEXT[], -- Logical Observation Identifiers Names and Codes
    
    -- Structured medication data with NDC codes
    current_medications JSONB DEFAULT '[]'::jsonb,
    -- Example structure: [{"name": "Metformin", "ndc_code": "0093-1074-01", "dosage": "500mg", "frequency": "twice daily", "start_date": "2024-01-15"}]
    
    -- Allergies with structured severity and reaction data
    allergies_structured JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"allergen": "peanuts", "severity": "severe", "reactions": ["anaphylaxis"], "confirmed_date": "2020-03-15"}]
    
    -- Medical dietary restrictions (different from preferences)
    dietary_restrictions_medical JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"restriction": "sodium_limited", "limit": "2000mg_daily", "reason": "hypertension", "prescribed_by": "Dr. Smith"}]
    
    -- Historical lab values with proper medical context
    lab_values_history JSONB[] DEFAULT '{}',
    -- Example: [{"test_date": "2024-01-15", "hba1c": 7.2, "units": "%", "reference_range": "4.0-5.6", "provider": "LabCorp"}]
    
    -- Vital signs history
    vital_signs_history JSONB[] DEFAULT '{}',
    -- Example: [{"date": "2024-01-15", "bp_systolic": 140, "bp_diastolic": 90, "heart_rate": 72, "weight_kg": 80.5}]
    
    -- Encrypted clinical notes (for premium tier)
    clinical_notes_encrypted TEXT,
    
    -- Healthcare provider information
    provider_information JSONB DEFAULT '{}'::jsonb,
    -- Example: {"primary_care": {"name": "Dr. Jane Smith", "npi": "1234567890", "phone": "+1-555-0123"}}
    
    -- Clinical review tracking
    last_clinical_review TIMESTAMP WITH TIME ZONE,
    clinical_review_required BOOLEAN DEFAULT false,
    next_review_due TIMESTAMP WITH TIME ZONE,
    
    -- Compliance and audit
    data_source VARCHAR(50) DEFAULT 'patient_reported', -- patient_reported, provider_imported, lab_integrated
    verification_status VARCHAR(20) DEFAULT 'unverified', -- unverified, patient_verified, provider_verified
    last_updated_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinical evidence base for recommendations
CREATE TABLE clinical_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Recommendation categorization
    recommendation_type VARCHAR(100) NOT NULL, -- dietary_modification, nutrient_target, food_avoidance
    health_condition health_condition_detailed NOT NULL,
    evidence_level evidence_level NOT NULL,
    
    -- Source documentation
    source_type VARCHAR(50) NOT NULL, -- peer_reviewed, clinical_guideline, expert_consensus, regulatory_guidance
    source_citation TEXT NOT NULL,
    pubmed_id VARCHAR(20), -- For peer-reviewed sources
    doi VARCHAR(100), -- Digital Object Identifier
    guideline_organization VARCHAR(100), -- e.g., "American Diabetes Association"
    
    -- Recommendation content
    recommendation_text TEXT NOT NULL,
    specific_recommendations JSONB, -- Structured recommendations
    contraindications TEXT[],
    
    -- Applicability criteria
    population_applicability JSONB, -- age groups, gender, comorbidities, pregnancy status
    -- Example: {"age_min": 18, "age_max": 65, "excludes": ["pregnancy", "kidney_disease_stage_5"]}
    
    -- Quality and review
    last_reviewed TIMESTAMP WITH TIME ZONE,
    reviewer_id UUID REFERENCES users(id),
    review_notes TEXT,
    is_active BOOLEAN DEFAULT true,
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5), -- 1=low, 5=high
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced recipes table with clinical annotations
CREATE TABLE recipes_clinical (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    base_recipe_id UUID NOT NULL, -- Reference to main recipes table
    
    -- Clinical adaptations and modifications
    clinical_adaptations JSONB DEFAULT '{}'::jsonb,
    -- Example: {"diabetes": {"carb_substitutions": ["cauliflower_rice"], "portion_adjustments": {"protein": "+25%"}}}
    
    -- Medical safety information
    contraindications TEXT[], -- Medical conditions where recipe should be avoided
    drug_food_interactions TEXT[], -- Medications that interact with ingredients
    allergen_warnings TEXT[], -- Specific allergen warnings
    
    -- Therapeutic benefits with evidence
    therapeutic_benefits JSONB DEFAULT '[]'::jsonb,
    -- Example: [{"benefit": "blood_sugar_control", "evidence_level": "B", "studies": ["PMID:12345678"]}]
    
    -- Clinical validation
    clinical_evidence_level evidence_level,
    clinical_reviewer_id UUID REFERENCES users(id),
    clinical_review_date TIMESTAMP WITH TIME ZONE,
    clinical_approval_status review_status DEFAULT 'pending',
    
    -- Condition-specific approvals
    approved_conditions health_condition_detailed[],
    restricted_conditions health_condition_detailed[],
    
    -- Nutritional targets for therapeutic use
    nutritional_targets JSONB DEFAULT '{}'::jsonb,
    -- Example: {"diabetes": {"target_carbs_per_serving": 30, "target_fiber_min": 5, "target_gi_max": 55}}
    
    -- Portion recommendations by condition
    portion_recommendations JSONB DEFAULT '{}'::jsonb,
    -- Example: {"kidney_disease": {"protein_limit_grams": 15, "sodium_limit_mg": 200, "potassium_limit_mg": 300}}
    
    -- Clinical notes and special instructions
    clinical_instructions TEXT,
    special_preparation_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drug-food interaction database
CREATE TABLE drug_food_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Drug identification
    drug_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_names TEXT[],
    ndc_codes TEXT[], -- National Drug Code identifiers
    drug_class VARCHAR(100), -- e.g., "ACE Inhibitors", "Statins"
    
    -- Food/nutrient interactions
    interacting_foods TEXT[], -- Specific foods that interact
    interacting_nutrients TEXT[], -- Specific nutrients (e.g., "potassium", "vitamin_k")
    food_categories TEXT[], -- Broader categories (e.g., "dairy", "leafy_greens")
    
    -- Interaction details
    interaction_type interaction_type NOT NULL,
    severity severity_level NOT NULL,
    mechanism VARCHAR(500), -- How the interaction occurs
    clinical_effect TEXT, -- What happens when interaction occurs
    
    -- Recommendations
    recommendations TEXT NOT NULL,
    timing_instructions TEXT, -- e.g., "Take 2 hours before or after food"
    alternative_suggestions TEXT,
    
    -- Evidence and sourcing
    evidence_level evidence_level NOT NULL,
    source_citation TEXT NOT NULL,
    regulatory_source VARCHAR(100), -- FDA, Health Canada, EMA, etc.
    
    -- Metadata
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinical review queue for AI-generated content
CREATE TABLE clinical_review_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Content identification
    content_type VARCHAR(50) NOT NULL, -- ai_recipe, nutrition_advice, clinical_recommendation, meal_plan
    content_id UUID NOT NULL,
    original_content JSONB NOT NULL,
    user_context JSONB, -- User's health profile context that generated the content
    
    -- Risk assessment
    risk_level severity_level NOT NULL,
    flagged_reasons TEXT[], -- Specific reasons for flagging
    automated_flags JSONB, -- Flags from automated systems
    ai_confidence_score DECIMAL(3,2), -- AI's confidence in its response (0.00-1.00)
    
    -- Review assignment and tracking
    assigned_reviewer_id UUID REFERENCES users(id),
    review_priority INTEGER DEFAULT 5 CHECK (review_priority BETWEEN 1 AND 10), -- 1=highest, 10=lowest
    review_status review_status DEFAULT 'pending',
    escalation_level INTEGER DEFAULT 0, -- Number of times escalated
    
    -- Review outcome
    reviewer_notes TEXT,
    approved_content JSONB, -- Modified/approved version
    rejection_reason TEXT,
    requires_patient_notification BOOLEAN DEFAULT false,
    
    -- Timing and deadlines
    review_deadline TIMESTAMP WITH TIME ZONE, -- Based on risk level
    reviewed_at TIMESTAMP WITH TIME ZONE,
    escalated_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit trail
    review_history JSONB[] DEFAULT '{}', -- Track all review actions
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription and billing enhancements
CREATE TABLE subscription_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tier_name subscription_tier NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Pricing structure
    base_price_cents INTEGER NOT NULL,
    family_member_price_cents INTEGER DEFAULT 0,
    max_family_members INTEGER DEFAULT 1,
    
    -- API and usage limits
    api_quota_monthly INTEGER NOT NULL,
    clinical_consultations_included INTEGER DEFAULT 0,
    ai_requests_monthly INTEGER DEFAULT 100,
    
    -- Feature flags
    clinical_features_enabled BOOLEAN DEFAULT false,
    family_features_enabled BOOLEAN DEFAULT false,
    ai_features_enabled BOOLEAN DEFAULT true,
    provider_integration_enabled BOOLEAN DEFAULT false,
    advanced_analytics_enabled BOOLEAN DEFAULT false,
    
    -- Stripe integration
    stripe_price_id VARCHAR(255) NOT NULL,
    stripe_product_id VARCHAR(255) NOT NULL,
    
    -- Configuration
    is_active BOOLEAN DEFAULT true,
    trial_days INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking and billing events
CREATE TABLE usage_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Event classification
    event_type VARCHAR(50) NOT NULL, -- api_call, ai_request, clinical_consultation, recipe_generation
    service_name VARCHAR(50) NOT NULL, -- edamam, gemini, clinical_review
    
    -- Usage details
    quantity INTEGER DEFAULT 1,
    cost_cents INTEGER DEFAULT 0,
    billing_category VARCHAR(50), -- included, overage, premium_feature
    
    -- Context and metadata
    request_metadata JSONB,
    response_metadata JSONB,
    session_id UUID,
    
    -- Billing period assignment
    billing_period_start DATE,
    billing_period_end DATE,
    processed_for_billing BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Family permissions with granular control
CREATE TABLE family_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    family_account_id UUID NOT NULL REFERENCES family_accounts(id) ON DELETE CASCADE,
    
    -- Permission relationship
    member_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Who has the permission
    target_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Who they can access
    
    -- Permission types
    permission_type VARCHAR(50) NOT NULL, -- health_view_basic, health_view_full, meal_manage, clinical_view, emergency_access
    permission_scope JSONB DEFAULT '{}'::jsonb, -- Specific scopes and limitations
    
    -- Conditional permissions
    age_based_restrictions JSONB, -- Automatic expiration when target reaches certain age
    emergency_only BOOLEAN DEFAULT false, -- Only accessible in emergency situations
    requires_target_consent BOOLEAN DEFAULT true,
    
    -- Approval and consent tracking
    granted_by UUID NOT NULL REFERENCES users(id),
    approved_by_target BOOLEAN DEFAULT false,
    target_consent_date TIMESTAMP WITH TIME ZONE,
    
    -- Temporal controls
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE,
    
    -- Status and audit
    is_active BOOLEAN DEFAULT true,
    suspension_reason TEXT,
    revoked_by UUID REFERENCES users(id),
    revoked_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced audit logging for healthcare compliance
CREATE TABLE audit_logs_enhanced (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    
    -- Actor information
    user_id UUID REFERENCES users(id),
    session_id UUID,
    impersonated_by UUID REFERENCES users(id), -- For admin impersonation
    
    -- Action details
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    
    -- Data changes
    old_values JSONB,
    new_values JSONB,
    sensitive_data_accessed BOOLEAN DEFAULT false,
    phi_data_types TEXT[], -- Types of PHI accessed
    
    -- Context and environment
    ip_address INET,
    user_agent TEXT,
    request_id UUID,
    api_endpoint VARCHAR(255),
    http_method VARCHAR(10),
    
    -- Risk and compliance
    risk_level severity_level DEFAULT 'mild',
    compliance_flags TEXT[], -- HIPAA, GDPR, etc.
    requires_reporting BOOLEAN DEFAULT false,
    
    -- Geographic and temporal
    geolocation JSONB, -- Country, region for compliance reporting
    timezone VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinical decision support rules
CREATE TABLE clinical_decision_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Rule identification
    rule_name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- screening, alert, recommendation, contraindication
    category VARCHAR(100) NOT NULL, -- nutrition, drug_interaction, lifestyle, monitoring
    
    -- Condition and trigger logic
    condition_logic JSONB NOT NULL, -- Complex logic for when rule applies
    -- Example: {"AND": [{"condition": "diabetes_type_2"}, {"medication": "metformin"}, {"hba1c": {">=": 7.0}}]}
    
    -- Rule content
    alert_message TEXT,
    recommendation_text TEXT,
    severity severity_level NOT NULL,
    action_required BOOLEAN DEFAULT false,
    
    -- Supporting evidence
    evidence_base JSONB, -- References to clinical evidence
    guideline_source VARCHAR(255),
    evidence_level evidence_level NOT NULL,
    
    -- Implementation details
    is_active BOOLEAN DEFAULT true,
    auto_trigger BOOLEAN DEFAULT true,
    requires_acknowledgment BOOLEAN DEFAULT false,
    
    -- Metadata
    created_by UUID NOT NULL REFERENCES users(id),
    last_reviewed_by UUID REFERENCES users(id),
    last_reviewed_date TIMESTAMP WITH TIME ZONE,
    version INTEGER DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX idx_clinical_profiles_tenant_user ON clinical_profiles(tenant_id, user_id);
CREATE INDEX idx_clinical_profiles_conditions ON clinical_profiles USING GIN (icd10_codes);
CREATE INDEX idx_clinical_profiles_medications ON clinical_profiles USING GIN (current_medications);

CREATE INDEX idx_clinical_evidence_condition ON clinical_evidence(health_condition);
CREATE INDEX idx_clinical_evidence_evidence_level ON clinical_evidence(evidence_level);
CREATE INDEX idx_clinical_evidence_active ON clinical_evidence(is_active);

CREATE INDEX idx_recipes_clinical_tenant ON recipes_clinical(tenant_id);
CREATE INDEX idx_recipes_clinical_conditions ON recipes_clinical USING GIN (approved_conditions);
CREATE INDEX idx_recipes_clinical_review_status ON recipes_clinical(clinical_approval_status);

CREATE INDEX idx_drug_interactions_drug_name ON drug_food_interactions(drug_name);
CREATE INDEX idx_drug_interactions_severity ON drug_food_interactions(severity);
CREATE INDEX idx_drug_interactions_active ON drug_food_interactions(is_active);

CREATE INDEX idx_review_queue_tenant_status ON clinical_review_queue(tenant_id, review_status);
CREATE INDEX idx_review_queue_risk_level ON clinical_review_queue(risk_level);
CREATE INDEX idx_review_queue_deadline ON clinical_review_queue(review_deadline);

CREATE INDEX idx_usage_events_tenant_user ON usage_events(tenant_id, user_id);
CREATE INDEX idx_usage_events_billing_period ON usage_events(billing_period_start, billing_period_end);
CREATE INDEX idx_usage_events_type ON usage_events(event_type);

CREATE INDEX idx_family_permissions_member ON family_permissions(member_user_id);
CREATE INDEX idx_family_permissions_target ON family_permissions(target_user_id);
CREATE INDEX idx_family_permissions_active ON family_permissions(is_active);

CREATE INDEX idx_audit_enhanced_tenant_user ON audit_logs_enhanced(tenant_id, user_id);
CREATE INDEX idx_audit_enhanced_action ON audit_logs_enhanced(action);
CREATE INDEX idx_audit_enhanced_sensitive ON audit_logs_enhanced(sensitive_data_accessed);
CREATE INDEX idx_audit_enhanced_created_at ON audit_logs_enhanced(created_at);

-- Enable RLS on new tables
ALTER TABLE clinical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes_clinical ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs_enhanced ENABLE ROW LEVEL SECURITY;

-- RLS policies for new tables
CREATE POLICY tenant_isolation_clinical_profiles ON clinical_profiles
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_recipes_clinical ON recipes_clinical
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_review_queue ON clinical_review_queue
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_usage_events ON usage_events
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_family_permissions ON family_permissions
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_audit_enhanced ON audit_logs_enhanced
    FOR ALL TO application_user
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Grant permissions on new tables
GRANT SELECT, INSERT, UPDATE, DELETE ON clinical_profiles TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON clinical_evidence TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON recipes_clinical TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON drug_food_interactions TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON clinical_review_queue TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON subscription_tiers TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON usage_events TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON family_permissions TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON audit_logs_enhanced TO application_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON clinical_decision_rules TO application_user;

-- Trigger functions for enhanced audit logging
CREATE OR REPLACE FUNCTION enhanced_audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    phi_detected BOOLEAN := false;
    phi_types TEXT[] := '{}';
BEGIN
    -- Detect PHI data types
    IF TG_TABLE_NAME IN ('clinical_profiles', 'health_profiles') THEN
        phi_detected := true;
        phi_types := ARRAY['health_data', 'clinical_information'];
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs_enhanced (
            tenant_id, user_id, action, resource_type, resource_id, 
            old_values, sensitive_data_accessed, phi_data_types
        ) VALUES (
            OLD.tenant_id,
            current_setting('app.current_user_id', true)::UUID,
            'DELETE',
            TG_TABLE_NAME,
            OLD.id,
            row_to_json(OLD),
            phi_detected,
            phi_types
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs_enhanced (
            tenant_id, user_id, action, resource_type, resource_id,
            old_values, new_values, sensitive_data_accessed, phi_data_types
        ) VALUES (
            NEW.tenant_id,
            current_setting('app.current_user_id', true)::UUID,
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(OLD),
            row_to_json(NEW),
            phi_detected,
            phi_types
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs_enhanced (
            tenant_id, user_id, action, resource_type, resource_id,
            new_values, sensitive_data_accessed, phi_data_types
        ) VALUES (
            NEW.tenant_id,
            current_setting('app.current_user_id', true)::UUID,
            'INSERT',
            TG_TABLE_NAME,
            NEW.id,
            row_to_json(NEW),
            phi_detected,
            phi_types
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create enhanced audit triggers
CREATE TRIGGER enhanced_audit_clinical_profiles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON clinical_profiles
    FOR EACH ROW EXECUTE FUNCTION enhanced_audit_trigger_function();

CREATE TRIGGER enhanced_audit_recipes_clinical_trigger
    AFTER INSERT OR UPDATE OR DELETE ON recipes_clinical
    FOR EACH ROW EXECUTE FUNCTION enhanced_audit_trigger_function();

-- Insert sample clinical evidence data
INSERT INTO clinical_evidence (
    recommendation_type, health_condition, evidence_level, source_type, source_citation,
    recommendation_text, contraindications, population_applicability
) VALUES 
(
    'dietary_carbohydrate_limit',
    'diabetes_type_2',
    'A',
    'clinical_guideline',
    'American Diabetes Association. Standards of Medical Care in Diabetes—2024',
    'Limit carbohydrate intake to 45-65g per meal for optimal blood glucose control',
    ARRAY['hypoglycemia_risk', 'eating_disorders'],
    '{"age_min": 18, "excludes": ["pregnancy", "type_1_diabetes"]}'::jsonb
),
(
    'sodium_restriction',
    'hypertension_stage_1',
    'A',
    'clinical_guideline',
    'ACC/AHA Hypertension Guidelines 2017',
    'Limit sodium intake to less than 2,300mg per day, ideally 1,500mg per day',
    ARRAY['kidney_disease_advanced'],
    '{"age_min": 18, "applicable_conditions": ["hypertension", "heart_disease"]}'::jsonb
);

-- Insert sample subscription tiers
INSERT INTO subscription_tiers (
    tier_name, display_name, description, base_price_cents, family_member_price_cents,
    max_family_members, api_quota_monthly, clinical_consultations_included,
    ai_requests_monthly, clinical_features_enabled, family_features_enabled,
    stripe_price_id, stripe_product_id
) VALUES 
(
    'basic',
    'Basic Nutrition',
    'Essential nutrition tracking and recipe search',
    0, 0, 1, 1000, 0, 50, false, false,
    'price_basic_monthly', 'prod_basic'
),
(
    'enhanced',
    'Family Nutrition',
    'Advanced meal planning for the whole family',
    1299, 499, 6, 5000, 0, 200, false, true,
    'price_enhanced_monthly', 'prod_enhanced'
),
(
    'premium',
    'Clinical Nutrition',
    'Professional-grade nutrition with clinical AI and provider integration',
    2999, 999, 6, 20000, 2, 1000, true, true,
    'price_premium_monthly', 'prod_premium'
);

-- Insert sample drug-food interactions
INSERT INTO drug_food_interactions (
    drug_name, generic_name, drug_class, interacting_foods, interacting_nutrients,
    interaction_type, severity, mechanism, clinical_effect, recommendations,
    evidence_level, source_citation
) VALUES 
(
    'Warfarin',
    'warfarin',
    'Anticoagulant',
    ARRAY['leafy_greens', 'broccoli', 'brussels_sprouts'],
    ARRAY['vitamin_k'],
    'monitor',
    'moderate',
    'Vitamin K antagonizes warfarin anticoagulant effect',
    'Decreased anticoagulation, increased risk of thrombosis',
    'Maintain consistent vitamin K intake. Monitor INR closely when dietary changes occur.',
    'A',
    'FDA Drug Safety Communication: Warfarin and Vitamin K interactions'
),
(
    'Lisinopril',
    'lisinopril',
    'ACE Inhibitor',
    ARRAY['bananas', 'oranges', 'potatoes', 'salt_substitutes'],
    ARRAY['potassium'],
    'monitor',
    'moderate',
    'ACE inhibitors increase potassium retention',
    'Risk of hyperkalemia, cardiac arrhythmias',
    'Monitor potassium levels. Limit high-potassium foods and salt substitutes.',
    'A',
    'Clinical Pharmacology: ACE Inhibitor Drug Interactions'
);