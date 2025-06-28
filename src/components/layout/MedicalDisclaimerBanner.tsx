'use client';

import React from 'react';

export const MedicalDisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
      <span className="font-medium">Medical Disclaimer:</span> This platform provides health information for educational purposes only. 
      Always consult with healthcare professionals for medical advice.
    </div>
  );
};
