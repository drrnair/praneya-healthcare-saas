'use client';

import React, { useState, useEffect } from 'react';

export const ConsentManagement: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('healthcare-consent');
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('healthcare-consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 text-sm">
          <p>
            This healthcare platform uses cookies and collects data in compliance with HIPAA regulations. 
            By continuing, you consent to our data practices outlined in our Privacy Policy.
          </p>
        </div>
        <div className="ml-4 flex gap-2">
          <button
            onClick={handleAccept}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
