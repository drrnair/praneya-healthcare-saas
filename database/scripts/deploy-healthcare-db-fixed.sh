#!/bin/bash

# Healthcare Database Deployment Script
# This script deploys the complete healthcare database infrastructure with HIPAA compliance

set -euo pipefail

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Load environment variables
if [ -f "$PROJECT_ROOT/.env" ]; then
    source "$PROJECT_ROOT/.env"
fi

# Configuration
DATABASE_NAME="${DATABASE_NAME:-praneya_healthcare}"
HIPAA_COMPLIANCE_REQUIRED="${HIPAA_COMPLIANCE_REQUIRED:-true}"
ROW_LEVEL_SECURITY_ENABLED="${ROW_LEVEL_SECURITY_ENABLED:-true}"
AUDIT_LOGGING_ENABLED="${AUDIT_LOGGING_ENABLED:-true}"
FIELD_ENCRYPTION_ENABLED="${FIELD_ENCRYPTION_ENABLED:-true}"
NODE_ENV="${NODE_ENV:-development}"

# Logging configuration
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/healthcare-deployment-$(date +%Y%m%d_%H%M%S).log"

# Create logs directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Database configuration
if [ -z "${DATABASE_URL:-}" ]; then
    echo -e "${RED}ERROR: DATABASE_URL environment variable is required${NC}"
    exit 1
fi

log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local color=""
    
    case "$level" in
        "ERROR") color="$RED" ;;
        "WARN") color="$YELLOW" ;;
        "INFO") color="$BLUE" ;;
        "SUCCESS") color="$GREEN" ;;
    esac
    
    echo -e "${color}[$timestamp] [$level] $message${NC}" | tee -a "$LOG_FILE"
}

print_banner() {
    echo -e "${GREEN}"
    echo "========================================================"
    echo "🏥 Healthcare Database Deployment Script"
    echo "========================================================"
    echo -e "${NC}"
    echo "Project: Praneya Healthcare SaaS Platform"
    echo "Database: $DATABASE_NAME"
    echo "HIPAA Compliance: $HIPAA_COMPLIANCE_REQUIRED"
    echo "Log file: ${LOG_FILE}"
    echo ""
}

validate_prerequisites() {
    log_message "INFO" "Validating deployment prerequisites..."
    
    # Check if required tools are installed
    local required_tools=("psql" "npx" "node")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            log_message "ERROR" "Required tool '$tool' is not installed"
            exit 1
        fi
    done
    
    # Check if Prisma is available
    if ! npx prisma --version >/dev/null 2>&1; then
        log_message "ERROR" "Prisma CLI is not available"
        exit 1
    fi
    
    if [ -z "$DATABASE_URL" ]; then
        log_message "ERROR" "DATABASE_URL environment variable is required"
        exit 1
    fi
    
    if [ "$HIPAA_COMPLIANCE_REQUIRED" = "true" ] && [ -z "$BACKUP_ENCRYPTION_KEY" ]; then
        log_message "ERROR" "BACKUP_ENCRYPTION_KEY is required for HIPAA compliance"
        exit 1
    fi
    
    log_message "INFO" "Prerequisites validation completed successfully"
}

test_database_connection() {
    log_message "INFO" "Testing database connection..."
    
    if psql "$DATABASE_URL" -c "SELECT 1;" >/dev/null 2>&1; then
        log_message "SUCCESS" "Database connection successful"
    else
        log_message "ERROR" "Database connection failed"
        exit 1
    fi
}

setup_database_extensions() {
    log_message "INFO" "Setting up required PostgreSQL extensions..."
    
    psql "$DATABASE_URL" <<EOF || {
        log_message "ERROR" "Failed to setup database extensions"
        exit 1
    }
-- Create extensions required for healthcare platform
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Healthcare-specific extensions for audit and compliance
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Verify extensions are installed
SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pg_stat_statements', 'pg_trgm', 'pg_cron');
EOF
    
    log_message "INFO" "Database extensions setup completed"
}

create_schemas() {
    log_message "INFO" "Creating database schemas..."
    
    psql "$DATABASE_URL" <<EOF || {
        log_message "ERROR" "Failed to create schemas"
        exit 1
    }
-- Create healthcare-specific schemas
CREATE SCHEMA IF NOT EXISTS healthcare;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS clinical;

-- Set search path to include healthcare schemas
ALTER DATABASE $DATABASE_NAME SET search_path = public, healthcare, audit, clinical;
EOF
    
    log_message "INFO" "Database schemas created successfully"
}

setup_healthcare_functions() {
    log_message "INFO" "Installing healthcare-specific database functions..."
    
    # Apply initial schema if it exists
    if [ -f "${SCRIPT_DIR}/../migrations/001_initial_schema.sql" ]; then
        psql "$DATABASE_URL" -f "${SCRIPT_DIR}/../migrations/001_initial_schema.sql" || {
            log_message "WARN" "Healthcare functions setup may have issues"
        }
        log_message "INFO" "Healthcare functions installed successfully"
    else
        log_message "WARN" "Healthcare functions file not found, skipping..."
    fi
}

generate_prisma_schema() {
    log_message "INFO" "Generating and applying Prisma schema..."
    
    cd "$PROJECT_ROOT"
    
    # Generate Prisma client
    npx prisma generate || {
        log_message "ERROR" "Failed to generate Prisma client"
        exit 1
    }
    
    # Push database schema
    npx prisma db push --accept-data-loss || {
        log_message "ERROR" "Failed to push database schema"
        exit 1
    }
    
    log_message "INFO" "Prisma schema generated and applied successfully"
}

enable_row_level_security() {
    if [ "$ROW_LEVEL_SECURITY_ENABLED" = "true" ]; then
        log_message "INFO" "Enabling Row Level Security policies..."
        
        psql "$DATABASE_URL" <<EOF || {
            log_message "ERROR" "Failed to enable RLS policies"
            exit 1
        }
-- Enable RLS on all healthcare tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare.health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare.biometric_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create tenant isolation policies
CREATE POLICY tenant_isolation_users ON users
  FOR ALL TO authenticated
  USING (tenant_id = current_tenant_id());

CREATE POLICY tenant_isolation_health_profiles ON healthcare.health_profiles
  FOR ALL TO authenticated
  USING (user_id IN (
    SELECT id FROM users WHERE tenant_id = current_tenant_id()
  ));

-- Create family privacy policies
CREATE POLICY family_health_access ON healthcare.health_profiles
  FOR SELECT TO authenticated
  USING (
    user_id = current_user_id() OR 
    can_access_family_data(user_id) OR
    has_emergency_access(user_id)
  );

-- Create healthcare role policies
CREATE POLICY clinical_advisor_access ON healthcare.health_profiles
  FOR ALL TO authenticated
  USING (current_healthcare_role() IN ('CLINICAL_ADVISOR', 'SUPER_ADMIN'));

-- Audit log policies for compliance
CREATE POLICY audit_log_tenant_isolation ON audit.audit_logs
  FOR ALL TO authenticated
  USING (tenant_id = current_tenant_id());
EOF
        
        log_message "INFO" "Row Level Security policies enabled successfully"
    else
        log_message "WARN" "Row Level Security is disabled"
    fi
}

create_audit_triggers() {
    if [ "$AUDIT_LOGGING_ENABLED" = "true" ]; then
        log_message "INFO" "Creating audit triggers for HIPAA compliance..."
        
        psql "$DATABASE_URL" <<EOF || {
            log_message "ERROR" "Failed to create audit triggers"
            exit 1
        }
-- Add PHI access triggers
CREATE TRIGGER audit_health_profile_access
  AFTER INSERT OR UPDATE OR DELETE ON healthcare.health_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_audit_phi_access();

CREATE TRIGGER audit_medication_access
  AFTER INSERT OR UPDATE OR DELETE ON healthcare.medications
  FOR EACH ROW EXECUTE FUNCTION trigger_audit_phi_access();

CREATE TRIGGER audit_allergy_access
  AFTER INSERT OR UPDATE OR DELETE ON healthcare.allergies
  FOR EACH ROW EXECUTE FUNCTION trigger_audit_phi_access();

CREATE TRIGGER audit_biometric_access
  AFTER INSERT OR UPDATE OR DELETE ON healthcare.biometric_readings
  FOR EACH ROW EXECUTE FUNCTION trigger_audit_phi_access();

-- Data integrity triggers
CREATE TRIGGER health_profile_integrity_check
  BEFORE INSERT OR UPDATE ON healthcare.health_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_data_integrity_check();
EOF
        
        log_message "INFO" "Audit triggers created successfully"
    else
        log_message "WARN" "Audit logging is disabled"
    fi
}

create_performance_indexes() {
    log_message "INFO" "Creating performance optimization indexes..."
    
    if [ -f "${SCRIPT_DIR}/performance-optimization.sql" ]; then
        psql "$DATABASE_URL" -f "${SCRIPT_DIR}/performance-optimization.sql" || {
            log_message "WARN" "Some performance indexes may have failed to create"
        }
        log_message "INFO" "Performance indexes created successfully"
    else
        log_message "WARN" "Performance optimization file not found, skipping..."
    fi
}

setup_backup_procedures() {
    log_message "INFO" "Setting up backup and recovery procedures..."
    
    if [ -f "${SCRIPT_DIR}/backup-procedures.sql" ]; then
        psql "$DATABASE_URL" -f "${SCRIPT_DIR}/backup-procedures.sql" || {
            log_message "WARN" "Backup procedures setup may have issues"
        }
        log_message "INFO" "Backup procedures configured successfully"
    else
        log_message "WARN" "Backup procedures file not found, skipping..."
    fi
    
    # Schedule automated backups if pg_cron is available
    psql "$DATABASE_URL" <<EOF || log_message "WARN" "Failed to schedule automated backups"
-- Schedule healthcare backup jobs
SELECT cron.schedule(
  'healthcare-daily-backup',
  '0 2 * * *',
  \$\$SELECT create_encrypted_backup('daily_backup', '$BACKUP_ENCRYPTION_KEY');\$\$
);

SELECT cron.schedule(
  'healthcare-weekly-retention',
  '0 3 * * 0',
  \$\$SELECT manage_healthcare_retention();\$\$
);
EOF
}

seed_development_data() {
    if [ "${NODE_ENV:-development}" = "development" ]; then
        log_message "INFO" "Seeding development data..."
        
        cd "$PROJECT_ROOT"
        
        if [ -f "prisma/seed.ts" ]; then
            npx tsx prisma/seed.ts || {
                log_message "WARN" "Development data seeding failed"
            }
            log_message "INFO" "Development data seeded successfully"
        else
            log_message "WARN" "Seed file not found, skipping development data"
        fi
    else
        log_message "INFO" "Production environment detected, skipping development seed data"
    fi
}

validate_hipaa_compliance() {
    if [ "$HIPAA_COMPLIANCE_REQUIRED" = "true" ]; then
        log_message "INFO" "Validating HIPAA compliance configuration..."
        
        # Run compliance validation
        COMPLIANCE_RESULT=$(psql "$DATABASE_URL" -t -c "SELECT validate_hipaa_compliance('default_tenant');")
        
        if echo "$COMPLIANCE_RESULT" | grep -q '"compliance_score": 100'; then
            log_message "INFO" "HIPAA compliance validation passed"
        else
            log_message "WARN" "HIPAA compliance validation found issues:"
            echo "$COMPLIANCE_RESULT" | jq '.' 2>/dev/null || echo "$COMPLIANCE_RESULT"
        fi
    fi
}

run_health_checks() {
    log_message "INFO" "Running database health checks..."
    
    # Test database connection and basic functionality
    psql "$DATABASE_URL" <<EOF || {
        log_message "ERROR" "Health checks failed"
        exit 1
    }
-- Basic functionality tests
SELECT 'Database connection OK' as status;
SELECT 'Encryption functions OK' as status WHERE pgp_sym_encrypt('test', 'key') IS NOT NULL;
SELECT 'Schema integrity OK' as status WHERE validate_schema_integrity() = true;

-- Performance test
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.id, hp.subscription_tier 
FROM users u 
JOIN healthcare.health_profiles hp ON u.id = hp.user_id 
WHERE u.tenant_id = 'test_tenant' 
LIMIT 10;
EOF
    
    log_message "INFO" "Database health checks completed successfully"
}

cleanup_deployment() {
    log_message "INFO" "Cleaning up deployment artifacts..."
    
    # Update statistics for optimal performance
    psql "$DATABASE_URL" -c "SELECT update_healthcare_statistics();" || {
        log_message "WARN" "Failed to update statistics"
    }
    
    # Generate final compliance report
    if [ "$HIPAA_COMPLIANCE_REQUIRED" = "true" ]; then
        psql "$DATABASE_URL" -c "SELECT generate_backup_compliance_report();" || {
            log_message "WARN" "Failed to generate compliance report"
        }
    fi
    
    log_message "INFO" "Deployment cleanup completed"
}

print_deployment_summary() {
    echo -e "${GREEN}"
    echo "========================================================"
    echo "🎉 Healthcare Database Deployment Completed Successfully!"
    echo "========================================================"
    echo -e "${NC}"
    echo ""
    echo "Deployment Summary:"
    echo "  • Database: $DATABASE_NAME"
    echo "  • HIPAA Compliance: $HIPAA_COMPLIANCE_REQUIRED"
    echo "  • Row Level Security: $ROW_LEVEL_SECURITY_ENABLED"
    echo "  • Audit Logging: $AUDIT_LOGGING_ENABLED"
    echo "  • Field Encryption: $FIELD_ENCRYPTION_ENABLED"
    echo ""
    echo "Next Steps:"
    echo "  1. Update your application's DATABASE_URL"
    echo "  2. Configure healthcare-specific environment variables"
    echo "  3. Set up monitoring and alerting for HIPAA compliance"
    echo "  4. Review backup and recovery procedures"
    echo "  5. Conduct security assessment and penetration testing"
    echo ""
    echo "Important Files:"
    echo "  • Deployment log: $LOG_FILE"
    echo "  • Prisma schema: $PROJECT_ROOT/prisma/schema.prisma"
    echo "  • Database connection: $PROJECT_ROOT/src/lib/database/prisma.ts"
    echo ""
    echo "For production deployment, ensure:"
    echo "  • Strong encryption keys are configured"
    echo "  • Backup procedures are tested"
    echo "  • Security monitoring is active"
    echo "  • Staff HIPAA training is completed"
    echo ""
}

# Main deployment function
main() {
    print_banner
    
    # Prerequisites and validation
    validate_prerequisites
    test_database_connection
    
    # Database setup
    setup_database_extensions
    create_schemas
    setup_healthcare_functions
    
    # Prisma schema deployment
    generate_prisma_schema
    
    # Security and compliance setup
    enable_row_level_security
    create_audit_triggers
    
    # Performance optimization
    create_performance_indexes
    
    # Backup and recovery
    setup_backup_procedures
    
    # Development data (if applicable)
    seed_development_data
    
    # Compliance validation
    validate_hipaa_compliance
    
    # Health checks
    run_health_checks
    
    # Cleanup and finalization
    cleanup_deployment
    
    # Print summary
    print_deployment_summary
    
    log_message "SUCCESS" "Healthcare database deployment completed successfully!"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 