/**
 * Conversion Funnel Orchestrator
 * Coordinates all conversion optimization components and strategies
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CTAManager } from './CTAManager';
import { LeadMagnets } from './LeadMagnets';
import { useUserBehavior } from '../../hooks/useUserBehavior';
import { trackCTAClick, trackMicroConversion } from '../../utils/conversionTracking';

interface ConversionFunnelOrchestratorProps {
  children: React.ReactNode;
  initialAudience?: 'unknown' | 'fitness' | 'families' | 'health';
}

interface ExitIntentDetection {
  isActive: boolean;
  threshold: number;
  lastTrigger: number;
}

interface StickyElements {
  showMobileCTA: boolean;
  showSocialProof: boolean;
  showUrgencyBar: boolean;
}

const ConversionFunnelOrchestrator: React.FC<ConversionFunnelOrchestratorProps> = ({
  children,
  initialAudience = 'unknown'
}) => {
  const {
    userBehavior,
    audienceSignals,
    detectedAudience,
    isEngaged,
    shouldShowUrgency,
    trackInteraction,
    trackCTAClick: trackUserCTAClick,
    trackSectionView
  } = useUserBehavior();

  const [currentAudience, setCurrentAudience] = useState<'unknown' | 'fitness' | 'families' | 'health'>(
    initialAudience
  );
  const [leadMagnetVisible, setLeadMagnetVisible] = useState(false);
  const [leadMagnetTrigger, setLeadMagnetTrigger] = useState<'scroll' | 'exit-intent' | 'time-based' | 'cta-click' | 'manual'>('manual');
  const [exitIntentDetection, setExitIntentDetection] = useState<ExitIntentDetection>({
    isActive: true,
    threshold: 10,
    lastTrigger: 0
  });
  const [stickyElements, setStickyElements] = useState<StickyElements>({
    showMobileCTA: false,
    showSocialProof: false,
    showUrgencyBar: false
  });
  const [retargetingActive, setRetargetingActive] = useState(false);

  // Update current audience based on detection
  useEffect(() => {
    if (detectedAudience !== 'unknown') {
      setCurrentAudience(detectedAudience);
    }
  }, [detectedAudience]);

  // Exit intent detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleMouseLeave = (e: MouseEvent) => {
      if (
        exitIntentDetection.isActive &&
        e.clientY <= exitIntentDetection.threshold &&
        Date.now() - exitIntentDetection.lastTrigger > 30000 && // 30 seconds cooldown
        userBehavior.timeOnPage > 15000 && // At least 15 seconds on page
        !leadMagnetVisible
      ) {
        setLeadMagnetTrigger('exit-intent');
        setLeadMagnetVisible(true);
        setExitIntentDetection(prev => ({
          ...prev,
          lastTrigger: Date.now()
        }));

        trackMicroConversion('exit_intent_triggered', currentAudience, {
          timeOnPage: userBehavior.timeOnPage,
          scrollDepth: userBehavior.scrollDepth
        });
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [exitIntentDetection, userBehavior, leadMagnetVisible, currentAudience]);

  // Time-based lead magnet trigger
  useEffect(() => {
    if (userBehavior.timeOnPage > 45000 && userBehavior.scrollDepth > 60 && !leadMagnetVisible) {
      const timer = setTimeout(() => {
        setLeadMagnetTrigger('time-based');
        setLeadMagnetVisible(true);
        trackMicroConversion('time_based_trigger', currentAudience, {
          timeOnPage: userBehavior.timeOnPage,
          scrollDepth: userBehavior.scrollDepth
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
    
    // Return undefined when condition is not met
    return undefined;
  }, [userBehavior.timeOnPage, userBehavior.scrollDepth, leadMagnetVisible, currentAudience]);

  // Scroll-based lead magnet trigger
  useEffect(() => {
    if (userBehavior.scrollDepth > 80 && userBehavior.timeOnPage > 30000 && !leadMagnetVisible) {
      setLeadMagnetTrigger('scroll');
      setLeadMagnetVisible(true);
      trackMicroConversion('scroll_trigger', currentAudience, {
        scrollDepth: userBehavior.scrollDepth,
        timeOnPage: userBehavior.timeOnPage
      });
    }
  }, [userBehavior.scrollDepth, userBehavior.timeOnPage, leadMagnetVisible, currentAudience]);

  // Update sticky elements based on user behavior
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const shouldShowMobileCTA = userBehavior.scrollDepth > 25 && window.innerWidth < 768;
    const shouldShowSocialProof = userBehavior.scrollDepth > 50 && isEngaged;
    const shouldShowUrgencyBar = shouldShowUrgency && userBehavior.engagementScore > 40;

    setStickyElements({
      showMobileCTA: shouldShowMobileCTA,
      showSocialProof: shouldShowSocialProof,
      showUrgencyBar: shouldShowUrgencyBar
    });
  }, [userBehavior, isEngaged, shouldShowUrgency]);

  // Retargeting activation
  useEffect(() => {
    if (
      userBehavior.timeOnPage > 60000 && 
      userBehavior.scrollDepth > 70 && 
      userBehavior.interactionCount === 0
    ) {
      setRetargetingActive(true);
      trackMicroConversion('retargeting_activated', currentAudience, {
        reason: 'high_engagement_no_interaction',
        userBehavior
      });
    }
  }, [userBehavior, currentAudience]);

  // Handle CTA clicks with comprehensive tracking
  const handleCTAClick = useCallback((ctaId: string, audience: string, placement: string) => {
    // Track in multiple systems
    trackCTAClick(ctaId, audience as any, placement, undefined, userBehavior);
    trackUserCTAClick(ctaId);
    trackInteraction('cta_click', { ctaId, placement });

    // Handle specific CTA actions
    switch (ctaId) {
      case 'discover-path':
      case 'nutrition-assessment':
        // Redirect to quiz/assessment
        window.location.href = '/assessment';
        break;
      
      case 'start-transformation':
      case 'plan-meals':
      case 'improve-nutrition':
        // Show lead magnet first for high-intent CTAs
        setLeadMagnetTrigger('cta-click');
        setLeadMagnetVisible(true);
        break;
      
      case 'macro-calculator':
      case 'family-savings':
      case 'check-interactions':
        // Direct to calculator tools
        trackMicroConversion('calculator_access', audience as any);
        break;
      
      case 'watch-demo':
        // Track video engagement
        trackMicroConversion('video_engagement', audience as any);
        break;
      
      default:
        // Generic CTA handling
        console.log(`CTA clicked: ${ctaId}`);
    }
  }, [userBehavior, trackUserCTAClick, trackInteraction]);

  // Handle micro conversions
  const handleMicroConversion = useCallback((type: string, data: any) => {
    trackMicroConversion(type, currentAudience, data);
    
    // Close lead magnet after successful conversion
    if (type === 'lead_magnet_conversion') {
      setLeadMagnetVisible(false);
      
      // Set retargeting sequence
      setTimeout(() => {
        trackMicroConversion('email_sequence_started', currentAudience, data);
      }, 2000);
    }
  }, [currentAudience]);

  // Render CTAs for specific placements
  const renderCTA = (placement: 'hero' | 'problem' | 'solution' | 'social-proof' | 'pricing' | 'final') => (
    <CTAManager
      placement={placement}
      audience={currentAudience}
      userBehavior={userBehavior}
      onCTAClick={handleCTAClick}
      onMicroConversion={handleMicroConversion}
    />
  );

  return (
    <div className="relative">
      {/* Main content with CTA injection points */}
      <div className="conversion-funnel-container">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            // Inject CTAs into specific landing page sections
            const childProps = child.props as any;
            
            if (childProps.id === 'hero-section') {
              return React.cloneElement(child, {
                ...childProps,
                children: (
                  <>
                    {child.props.children}
                    <div className="mt-8">
                      {renderCTA('hero')}
                    </div>
                  </>
                )
              });
            }
            
            if (childProps.id === 'problem-section') {
              return React.cloneElement(child, {
                ...childProps,
                children: (
                  <>
                    {child.props.children}
                    <div className="mt-8">
                      {renderCTA('problem')}
                    </div>
                  </>
                )
              });
            }
            
            if (childProps.id === 'solution-section') {
              return React.cloneElement(child, {
                ...childProps,
                children: (
                  <>
                    {child.props.children}
                    <div className="mt-8">
                      {renderCTA('solution')}
                    </div>
                  </>
                )
              });
            }
            
            if (childProps.id === 'social-proof-section') {
              return React.cloneElement(child, {
                ...childProps,
                children: (
                  <>
                    {child.props.children}
                    <div className="mt-8">
                      {renderCTA('social-proof')}
                    </div>
                  </>
                )
              });
            }
            
            if (childProps.id === 'pricing-section') {
              return React.cloneElement(child, {
                ...childProps,
                children: (
                  <>
                    {child.props.children}
                    <div className="mt-8">
                      {renderCTA('pricing')}
                    </div>
                  </>
                )
              });
            }
          }
          
          return child;
        })}
        
        {/* Final CTA at the end */}
        <div className="py-16 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            {renderCTA('final')}
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <AnimatePresence>
        {stickyElements.showMobileCTA && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 md:hidden"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Ready to transform your nutrition?</p>
                <p className="text-xs text-gray-600">Join thousands who've started their journey</p>
              </div>
              <button
                onClick={() => handleCTAClick('mobile-sticky', currentAudience, 'sticky')}
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold text-sm"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Social Proof */}
      <AnimatePresence>
        {stickyElements.showSocialProof && (
          <motion.div
            className="fixed top-20 right-4 bg-white rounded-lg shadow-lg p-3 z-30 max-w-xs"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Sarah M.</span> just started her nutrition plan!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Urgency Bar */}
      <AnimatePresence>
        {stickyElements.showUrgencyBar && (
          <motion.div
            className="fixed top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 z-50"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-sm font-medium">
              ⚡ Limited Time: 50% off your first month - Don't miss out!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Magnets Modal */}
      <LeadMagnets
        audience={currentAudience}
        trigger={leadMagnetTrigger}
        onConversion={handleMicroConversion}
        isVisible={leadMagnetVisible}
        onClose={() => setLeadMagnetVisible(false)}
      />

      {/* Retargeting Pixel (invisible) */}
      {retargetingActive && (
        <div className="hidden">
          <img 
            src={`/api/pixel/retargeting?audience=${currentAudience}&behavior=${encodeURIComponent(JSON.stringify(userBehavior))}`}
            alt=""
            width="1"
            height="1"
          />
        </div>
      )}

      {/* Development Debug Panel */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg text-xs z-50 max-w-xs">
          <div className="font-bold mb-2">Conversion Debug</div>
          <div>Audience: {currentAudience}</div>
          <div>Detected: {detectedAudience}</div>
          <div>Engaged: {isEngaged ? 'Yes' : 'No'}</div>
          <div>Scroll: {userBehavior.scrollDepth}%</div>
          <div>Time: {Math.floor(userBehavior.timeOnPage / 1000)}s</div>
          <div>Score: {userBehavior.engagementScore}</div>
          <div>Lead Magnet: {leadMagnetVisible ? 'Visible' : 'Hidden'}</div>
          <div>Interactions: {userBehavior.interactionCount}</div>
        </div>
      )}
    </div>
  );
};

export { ConversionFunnelOrchestrator };
export type { ConversionFunnelOrchestratorProps }; 