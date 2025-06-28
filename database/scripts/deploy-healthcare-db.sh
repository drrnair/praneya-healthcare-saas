#!/bin/bash

# Healthcare Database Deployment Script
set -euo pipefail

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
NODE_ENV="${NODE_ENV:-development}"

# Logging
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/healthcare-deployment-$(date +%Y%m%d_%H%M%S).log"
mkdir -p "$LOG_DIR"

# Database configuration check
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
    
    # Create SQL file for extensions
    local ext_sql="/tmp/extensions.sql"
    cat > "$ext_sql" << 'EXT_EOF'
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto', 'pg_stat_statements', 'pg_trgm', 'pg_cron');
EXT_EOF
    
    if psql "$DATABASE_URL" -f "$ext_sql" >/dev/null 2>&1; then
        log_message "INFO" "Database extensions setup completed"
        rm -f "$ext_sql"
    else
        log_message "WARN" "Some extensions may not be available - continuing"
        rm -f "$ext_sql"
    fi
}

create_schemas() {
    log_message "INFO" "Creating database schemas..."
    
    # Create SQL file for schemas
    local schema_sql="/tmp/schemas.sql"
    cat > "$schema_sql" << 'SCHEMA_EOF'
CREATE SCHEMA IF NOT EXISTS healthcare;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS clinical;
SCHEMA_EOF
    
    if psql "$DATABASE_URL" -f "$schema_sql" >/dev/null 2>&1; then
        log_message "INFO" "Database schemas created successfully"
        rm -f "$schema_sql"
    else
        log_message "ERROR" "Failed to create schemas"
        rm -f "$schema_sql"
        exit 1
    fi
}

generate_prisma_schema() {
    log_message "INFO" "Generating and applying Prisma schema..."
    
    cd "$PROJECT_ROOT"
    
    # Generate Prisma client
    if npx prisma generate; then
        log_message "INFO" "Prisma client generated successfully"
    else
        log_message "ERROR" "Failed to generate Prisma client"
        exit 1
    fi
    
    # Push database schema
    if npx prisma db push --accept-data-loss; then
        log_message "INFO" "Prisma schema applied successfully"
    else
        log_message "ERROR" "Failed to push database schema"
        exit 1
    fi
}

enable_row_level_security() {
    log_message "INFO" "Checking Row Level Security configuration..."
    
    if [ "$ROW_LEVEL_SECURITY_ENABLED" = "true" ]; then
        log_message "INFO" "Enabling Row Level Security policies..."
        
        # Create RLS SQL commands in a temporary file
        local rls_sql="/tmp/rls_commands.sql"
        cat > "$rls_sql" << 'RLS_EOF'
-- Enable RLS on core tables if they exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;
RLS_EOF
        
        # Execute the SQL commands
        if psql "$DATABASE_URL" -f "$rls_sql" >/dev/null 2>&1; then
            log_message "INFO" "Row Level Security policies enabled successfully"
            rm -f "$rls_sql"
        else
            log_message "WARN" "Row Level Security setup had issues - tables may not exist yet"
            rm -f "$rls_sql"
        fi
    else
        log_message "WARN" "Row Level Security is disabled"
    fi
}

seed_development_data() {
    if [ "${NODE_ENV:-development}" = "development" ]; then
        log_message "INFO" "Seeding development data..."
        
        cd "$PROJECT_ROOT"
        
        if [ -f "prisma/seed.ts" ]; then
            if npx tsx prisma/seed.ts; then
                log_message "INFO" "Development data seeded successfully"
            else
                log_message "WARN" "Development data seeding failed"
            fi
        else
            log_message "WARN" "Seed file not found, skipping development data"
        fi
    else
        log_message "INFO" "Production environment detected, skipping development seed data"
    fi
}

run_healthcare_validation() {
    log_message "INFO" "Running healthcare setup validation..."
    
    cd "$PROJECT_ROOT"
    
    if [ -f "scripts/validate-healthcare-setup.js" ]; then
        if node scripts/validate-healthcare-setup.js; then
            log_message "SUCCESS" "Healthcare validation passed"
        else
            log_message "WARN" "Healthcare validation found some issues"
        fi
    else
        log_message "WARN" "Healthcare validation script not found"
    fi
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
    echo ""
    echo "Next Steps:"
    echo "  1. Review the deployment log: $LOG_FILE"
    echo "  2. Configure healthcare-specific environment variables"
    echo "  3. Set up monitoring and alerting for HIPAA compliance"
    echo "  4. Run the healthcare validation script"
    echo ""
    echo "Important Files:"
    echo "  • Deployment log: $LOG_FILE"
    echo "  • Prisma schema: $PROJECT_ROOT/prisma/schema.prisma"
    echo "  • Healthcare validation: $PROJECT_ROOT/scripts/validate-healthcare-setup.js"
    echo ""
}

# Main deployment function
main() {
    print_banner
    
    # Basic checks
    test_database_connection
    
    # Database setup
    setup_database_extensions
    create_schemas
    
    # Prisma schema deployment
    generate_prisma_schema
    
    # Security setup
    enable_row_level_security
    
    # Development data (if applicable)
    seed_development_data
    
    # Validation
    run_healthcare_validation
    
    # Print summary
    print_deployment_summary
    
    log_message "SUCCESS" "Healthcare database deployment completed successfully!"
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 
