# Praneya Healthcare SaaS - Production Dockerfile
# Multi-stage build with security hardening for HIPAA compliance

# ===========================================
# STAGE 1: Base Image with Security Hardening
# ===========================================
FROM node:18-alpine AS base

# Install security updates and required packages
RUN apk update && apk upgrade && \
    apk add --no-cache \
    dumb-init \
    ca-certificates \
    tzdata \
    curl \
    && rm -rf /var/cache/apk/*

# Create non-root user for healthcare security
RUN addgroup -g 1001 -S healthcare && \
    adduser -S praneya -u 1001 -G healthcare

# Set timezone for healthcare logging
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# ===========================================
# STAGE 2: Dependencies Installation
# ===========================================
FROM base AS deps

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with security audit
RUN npm ci --only=production --audit-level=high && \
    npm cache clean --force

# ===========================================
# STAGE 3: Build Stage
# ===========================================
FROM base AS builder

WORKDIR /app

# Copy source code and configs
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Set build environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HEALTHCARE_MODE=true
ENV HIPAA_COMPLIANCE_ENABLED=true

# Build the application
RUN npm run build

# Build the server
RUN npm run build:server

# ===========================================
# STAGE 4: Production Runtime
# ===========================================
FROM base AS runtime

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HEALTHCARE_MODE=true
ENV HIPAA_COMPLIANCE_ENABLED=true

# Healthcare security environment variables
ENV SECURITY_HEADERS_ENABLED=true
ENV HELMET_ENABLED=true
ENV COMPRESSION_ENABLED=true
ENV TRUST_PROXY=true

# Healthcare compliance settings
ENV HIPAA_AUDIT_LOGGING_ENABLED=true
ENV HIPAA_AUDIT_RETENTION_DAYS=2555
ENV HIPAA_ENCRYPTION_AT_REST=true
ENV HIPAA_ENCRYPTION_IN_TRANSIT=true
ENV HIPAA_ACCESS_LOGGING=true
ENV HIPAA_BACKUP_ENCRYPTION=true

# Clinical oversight settings
ENV CLINICAL_OVERSIGHT_REQUIRED=true
ENV CLINICAL_AI_ENABLED=true
ENV MEDICAL_ADVICE_DETECTION_ENABLED=true
ENV HIGH_RISK_CONTENT_BLOCKING=true

# Family privacy settings
ENV FAMILY_PRIVACY_DEFAULT=strict
ENV MINOR_DATA_PROTECTION_ENABLED=true
ENV FAMILY_CONSENT_EXPIRY_HOURS=48

# API and performance settings
ENV RATE_LIMIT_WINDOW_MS=900000
ENV RATE_LIMIT_MAX_REQUESTS=100
ENV RATE_LIMIT_HEALTHCARE_MAX=50
ENV API_RESPONSE_TIME_THRESHOLD=2000
ENV ERROR_RATE_THRESHOLD=0.05

# Emergency and monitoring settings
ENV EMERGENCY_ACCESS_ENABLED=true
ENV MONITORING_ENABLED=true
ENV HEALTH_CHECK_INTERVAL_SECONDS=30
ENV PERFORMANCE_MONITORING=true
ENV ERROR_TRACKING_ENABLED=true

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Copy healthcare-specific files
COPY --from=builder /app/database ./database
COPY --from=builder /app/docs ./docs

# Create necessary directories with proper permissions
RUN mkdir -p /app/logs /app/temp /app/uploads && \
    mkdir -p /app/data/cache /app/data/emergency && \
    mkdir -p /app/audit-logs /app/clinical-logs && \
    chown -R praneya:healthcare /app && \
    chmod -R 750 /app && \
    chmod -R 700 /app/logs /app/audit-logs /app/clinical-logs && \
    chmod -R 755 /app/public

# Healthcare security: Remove unnecessary files
RUN rm -rf /tmp/* /var/tmp/* /root/.npm

# Switch to non-root user
USER praneya

# Expose ports
EXPOSE 3000 3001

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Set resource limits for healthcare applications
ENV NODE_OPTIONS="--max-old-space-size=2048 --max-semi-space-size=128"

# Entry point with init process for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Default command - can be overridden for different services
CMD ["node", "server.js"]

# ===========================================
# LABELS FOR HEALTHCARE COMPLIANCE
# ===========================================
LABEL maintainer="Praneya Healthcare Team <dev@praneya.com>"
LABEL version="1.0.0"
LABEL description="Praneya Healthcare Nutrition SaaS Platform"
LABEL healthcare.platform="true"
LABEL hipaa.compliant="true"
LABEL clinical.oversight="enabled"
LABEL data.classification="PHI"
LABEL security.level="high"
LABEL backup.encryption="enabled"
LABEL audit.logging="enabled"
LABEL emergency.access="available"
LABEL family.privacy="protected"
LABEL ai.clinical="enabled"
LABEL conflict.detection="active" 