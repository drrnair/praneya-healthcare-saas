'use client';

import React from 'react';
import { useHealthcareTheme, useTierFeatures, healthcareThemeUtils } from './theme-provider';

// Healthcare Status Indicator Component
interface HealthStatusProps {
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthStatus({ status, label, showIcon = true, size = 'md' }: HealthStatusProps) {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  const statusConfig = {
    excellent: { icon: '🟢', bgColor: 'bg-success-50', textColor: 'text-success-700', borderColor: 'border-success-200' },
    good: { icon: '🟡', bgColor: 'bg-secondary-50', textColor: 'text-secondary-700', borderColor: 'border-secondary-200' },
    fair: { icon: '🟠', bgColor: 'bg-accent-50', textColor: 'text-accent-700', borderColor: 'border-accent-200' },
    poor: { icon: '🔴', bgColor: 'bg-warning-50', textColor: 'text-warning-700', borderColor: 'border-warning-200' },
    critical: { icon: '🚨', bgColor: 'bg-error-50', textColor: 'text-error-700', borderColor: 'border-error-200' },
  };

  const config = statusConfig[status];

  return (
    <div className={`
      inline-flex items-center gap-2 rounded-lg border font-medium
      ${config.bgColor} ${config.textColor} ${config.borderColor}
      ${sizeClasses[size]}
    `}>
      {showIcon && <span>{config.icon}</span>}
      <span>{label || status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  );
}

// Tier-aware Feature Card
interface FeatureCardProps {
  title: string;
  description: string;
  featureKey: string;
  children?: React.ReactNode;
  className?: string;
}

export function FeatureCard({ title, description, featureKey, children, className = '' }: FeatureCardProps) {
  const { theme } = useHealthcareTheme();
  const tierFeatures = useTierFeatures();
  const isAvailable = tierFeatures.features.includes(featureKey);

  if (!isAvailable) {
    return (
      <div className={`card-healthcare opacity-50 ${className}`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-600">{title}</h3>
            <p className="text-sm text-neutral-500 mt-1">{description}</p>
            <div className="mt-3">
              <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                Available in Enhanced and Premium plans
              </span>
            </div>
          </div>
          <div className="text-neutral-300">🔒</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-tier ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-tier">{title}</h3>
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
          {children && <div className="mt-4">{children}</div>}
        </div>
        <div className="text-tier">✨</div>
      </div>
    </div>
  );
}

// Healthcare Alert Component
interface HealthcareAlertProps {
  type: 'info' | 'success' | 'warning' | 'error' | 'clinical';
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function HealthcareAlert({ 
  type, 
  urgency = 'medium', 
  title, 
  message, 
  action, 
  dismissible = false, 
  onDismiss 
}: HealthcareAlertProps) {
  const alertConfig = {
    info: { icon: 'ℹ️', className: 'alert-info bg-primary-50 border-primary-200 text-primary-800' },
    success: { icon: '✅', className: 'alert-success' },
    warning: { icon: '⚠️', className: 'alert-warning' },
    error: { icon: '❌', className: 'alert-error' },
    clinical: { icon: '🏥', className: 'bg-accent-50 border-accent-200 text-accent-800' },
  };

  const urgencyStyles = healthcareThemeUtils.getUrgencyStyles(urgency);
  const config = alertConfig[type];

  return (
    <div className={`
      rounded-lg border p-4 ${config.className} ${urgencyStyles}
      ${urgency === 'critical' ? 'shadow-floating' : 'shadow-subtle'}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-lg">{config.icon}</span>
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm mt-1">{message}</p>
            {action && (
              <button
                onClick={action.onClick}
                className="mt-3 btn-healthcare-primary text-sm"
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

// Family Role Badge
interface FamilyRoleBadgeProps {
  role: 'ADMIN' | 'PARENT' | 'MEMBER' | 'CHILD';
  userName?: string;
  showRole?: boolean;
}

export function FamilyRoleBadge({ role, userName, showRole = true }: FamilyRoleBadgeProps) {
  const roleConfig = {
    ADMIN: { icon: '👑', label: 'Admin', color: 'primary' },
    PARENT: { icon: '👨‍👩‍👧‍👦', label: 'Parent', color: 'secondary' },
    MEMBER: { icon: '👤', label: 'Member', color: 'accent' },
    CHILD: { icon: '🧒', label: 'Child', color: 'neutral' },
  };

  const config = roleConfig[role];
  const roleStyles = healthcareThemeUtils.getRoleStyles(role);

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium
      ${roleStyles}
    `}>
      <span>{config.icon}</span>
      {userName && <span>{userName}</span>}
      {showRole && <span className="text-xs opacity-75">({config.label})</span>}
    </div>
  );
}

// Healthcare Metric Card
interface HealthMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  icon?: string;
}

export function HealthMetric({ 
  label, 
  value, 
  unit, 
  trend, 
  trendValue, 
  status, 
  icon 
}: HealthMetricProps) {
  const trendConfig = {
    up: { icon: '📈', color: 'text-success-600', bg: 'bg-success-50' },
    down: { icon: '📉', color: 'text-error-600', bg: 'bg-error-50' },
    stable: { icon: '➡️', color: 'text-neutral-600', bg: 'bg-neutral-50' },
  };

  const trendStyle = trend ? trendConfig[trend] : null;

  return (
    <div className="card-healthcare">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {icon && <span className="text-lg">{icon}</span>}
            <span className="text-sm font-medium text-neutral-600">{label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-neutral-900">{value}</span>
            {unit && <span className="text-sm text-neutral-500">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className={`
              inline-flex items-center gap-1 mt-2 px-2 py-1 rounded text-xs font-medium
              ${trendStyle.color} ${trendStyle.bg}
            `}>
              <span>{trendStyle.icon}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {status && (
          <HealthStatus status={status} showIcon={false} size="sm" />
        )}
      </div>
    </div>
  );
}

// Subscription Tier Upgrade Prompt
interface TierUpgradePromptProps {
  currentTier: 'basic' | 'enhanced' | 'premium';
  targetTier: 'enhanced' | 'premium';
  featureName: string;
  onUpgrade: () => void;
  onDismiss?: () => void;
}

export function TierUpgradePrompt({ 
  currentTier, 
  targetTier, 
  featureName, 
  onUpgrade, 
  onDismiss 
}: TierUpgradePromptProps) {
  const tierNames = {
    basic: 'Basic',
    enhanced: 'Enhanced',
    premium: 'Premium',
  };

  const tierColors = {
    enhanced: 'bg-primary-gradient border-primary-300',
    premium: 'bg-wellness-gradient border-accent-300',
  };

  return (
    <div className={`
      rounded-lg border-2 p-6 ${tierColors[targetTier]}
      shadow-raised transition-all duration-base hover:shadow-floating
    `}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            Unlock {featureName}
          </h3>
          <p className="text-sm text-neutral-600 mb-4">
            Upgrade to {tierNames[targetTier]} to access this feature and many more advanced healthcare tools.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onUpgrade}
              className="btn-healthcare-primary"
            >
              Upgrade to {tierNames[targetTier]}
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                Maybe later
              </button>
            )}
          </div>
        </div>
        <div className="text-2xl">✨</div>
      </div>
    </div>
  );
}

// Healthcare Form Input with tier-aware styling
interface HealthcareInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  sensitive?: boolean; // For health data that needs extra security indicators
}

export function HealthcareInput({ 
  label, 
  error, 
  helpText, 
  required = false, 
  sensitive = false, 
  className = '', 
  ...props 
}: HealthcareInputProps) {
  const { theme } = useHealthcareTheme();
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
        {sensitive && (
          <span className="ml-2 text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
            🔒 Encrypted
          </span>
        )}
      </label>
      <input
        className={`
          input-healthcare w-full
          ${error ? 'border-error-500 focus:border-error-500 focus:shadow-error-100' : ''}
          ${sensitive ? 'bg-primary-50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-600 mt-1">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-sm text-neutral-500 mt-1">{helpText}</p>
      )}
    </div>
  );
}

// Emergency Access Component
interface EmergencyAccessProps {
  isEmergency?: boolean;
  familyRole: 'ADMIN' | 'PARENT' | 'MEMBER' | 'CHILD';
  onEmergencyAccess?: () => void;
}

export function EmergencyAccess({ 
  isEmergency = false, 
  familyRole, 
  onEmergencyAccess 
}: EmergencyAccessProps) {
  const canAccessEmergency = ['ADMIN', 'PARENT'].includes(familyRole);

  if (!canAccessEmergency && !isEmergency) {
    return null;
  }

  return (
    <div className="bg-error-50 border border-error-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🚨</span>
        <div>
          <h4 className="font-semibold text-error-800">Emergency Access</h4>
          <p className="text-sm text-error-700">
            {isEmergency 
              ? 'Emergency mode is active. Full health data is accessible.'
              : 'Access critical health information in emergency situations.'
            }
          </p>
          {!isEmergency && onEmergencyAccess && (
            <button
              onClick={onEmergencyAccess}
              className="mt-3 bg-error-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-error-700 transition-colors"
            >
              Activate Emergency Access
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 