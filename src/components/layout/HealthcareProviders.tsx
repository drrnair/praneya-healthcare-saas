'use client';

import React from 'react';

interface HealthcareProvidersProps {
  children: React.ReactNode;
}

export const HealthcareProviders: React.FC<HealthcareProvidersProps> = ({ children }) => {
  return (
    <div className="healthcare-providers-wrapper">
      {children}
    </div>
  );
};
