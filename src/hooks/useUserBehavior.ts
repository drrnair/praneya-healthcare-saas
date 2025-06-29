/**
 * User Behavior Tracking Hook
 * Tracks user interactions, scroll depth, time on page, and engagement for CTA optimization
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UserBehavior {
  scrollDepth: number;
  timeOnPage: number;
  engagementScore: number;
  pageViews: number;
  interactionCount: number;
  mouseMovements: number;
  lastActivity: number;
}

interface AudienceSignals {
  entrySource?: string;
  timeOnSite: number;
  pagesVisited: string[];
  interactionPatterns: {
    ctaClicks: string[];
    sectionViews: string[];
    calculatorUse: boolean;
    videoWatched: boolean;
  };
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browserLanguage: string;
}

interface UseUserBehaviorReturn {
  userBehavior: UserBehavior;
  audienceSignals: AudienceSignals;
  detectedAudience: 'unknown' | 'fitness' | 'families' | 'health';
  isEngaged: boolean;
  shouldShowUrgency: boolean;
  trackInteraction: (type: string, data?: any) => void;
  trackCTAClick: (ctaId: string) => void;
  trackSectionView: (sectionId: string) => void;
}

export const useUserBehavior = (): UseUserBehaviorReturn => {
  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    scrollDepth: 0,
    timeOnPage: 0,
    engagementScore: 0,
    pageViews: 1,
    interactionCount: 0,
    mouseMovements: 0,
    lastActivity: Date.now()
  });

  const [audienceSignals, setAudienceSignals] = useState<AudienceSignals>({
    timeOnSite: 0,
    pagesVisited: [typeof window !== 'undefined' ? window.location.pathname : '/'],
    interactionPatterns: {
      ctaClicks: [],
      sectionViews: [],
      calculatorUse: false,
      videoWatched: false
    },
    deviceType: typeof window !== 'undefined' ? getDeviceType() : 'desktop',
    browserLanguage: typeof window !== 'undefined' ? navigator.language : 'en-US'
  });

  const [detectedAudience, setDetectedAudience] = useState<'unknown' | 'fitness' | 'families' | 'health'>('unknown');
  
  const startTime = useRef(Date.now());
  const scrollCheckInterval = useRef<NodeJS.Timeout>();
  const mouseMovementCount = useRef(0);
  const engagementTimer = useRef<NodeJS.Timeout>();

  // Device type detection
  function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  // Calculate engagement score based on multiple factors
  const calculateEngagementScore = useCallback((behavior: UserBehavior, signals: AudienceSignals): number => {
    let score = 0;
    
    // Time-based engagement
    if (behavior.timeOnPage > 30000) score += 20; // 30+ seconds
    if (behavior.timeOnPage > 60000) score += 20; // 1+ minute
    if (behavior.timeOnPage > 120000) score += 20; // 2+ minutes
    
    // Scroll depth engagement
    if (behavior.scrollDepth > 25) score += 10;
    if (behavior.scrollDepth > 50) score += 15;
    if (behavior.scrollDepth > 75) score += 20;
    if (behavior.scrollDepth > 90) score += 25;
    
    // Interaction engagement
    score += Math.min(behavior.interactionCount * 5, 30);
    score += Math.min(signals.interactionPatterns.ctaClicks.length * 10, 40);
    score += Math.min(signals.interactionPatterns.sectionViews.length * 5, 25);
    
    // Special interactions
    if (signals.interactionPatterns.calculatorUse) score += 15;
    if (signals.interactionPatterns.videoWatched) score += 20;
    
    // Mouse movement (indicates attention)
    score += Math.min(behavior.mouseMovements / 10, 10);
    
    return Math.min(score, 100);
  }, []);

  // Audience detection based on behavior patterns
  const detectAudience = useCallback((signals: AudienceSignals): 'unknown' | 'fitness' | 'families' | 'health' => {
    const { interactionPatterns, entrySource, timeOnSite } = signals;
    
    // Entry source signals
    if (entrySource?.includes('fitness') || entrySource?.includes('workout')) {
      return 'fitness';
    }
    if (entrySource?.includes('family') || entrySource?.includes('kids')) {
      return 'families';
    }
    if (entrySource?.includes('health') || entrySource?.includes('wellness')) {
      return 'health';
    }
    
    // CTA click patterns
    const fitnessSignals = interactionPatterns.ctaClicks.filter(cta => 
      cta.includes('transformation') || cta.includes('macro') || cta.includes('performance')
    ).length;
    
    const familySignals = interactionPatterns.ctaClicks.filter(cta => 
      cta.includes('meal') || cta.includes('family') || cta.includes('kids')
    ).length;
    
    const healthSignals = interactionPatterns.ctaClicks.filter(cta => 
      cta.includes('nutrition') || cta.includes('wellness') || cta.includes('evidence')
    ).length;
    
    // Section view patterns
    const sectionSignals = {
      fitness: interactionPatterns.sectionViews.filter(s => s.includes('fitness')).length,
      families: interactionPatterns.sectionViews.filter(s => s.includes('family')).length,
      health: interactionPatterns.sectionViews.filter(s => s.includes('health')).length
    };
    
    // Calculate total signals for each audience
    const totalSignals = {
      fitness: fitnessSignals + sectionSignals.fitness,
      families: familySignals + sectionSignals.families,
      health: healthSignals + sectionSignals.health
    };
    
    // Determine audience with highest signal count
    if (totalSignals.fitness > totalSignals.families && totalSignals.fitness > totalSignals.health && totalSignals.fitness >= 2) {
      return 'fitness';
    }
    if (totalSignals.families > totalSignals.fitness && totalSignals.families > totalSignals.health && totalSignals.families >= 2) {
      return 'families';
    }
    if (totalSignals.health > totalSignals.fitness && totalSignals.health > totalSignals.families && totalSignals.health >= 2) {
      return 'health';
    }
    
    // Time-based fallback detection
    if (timeOnSite > 120000) { // 2+ minutes suggests health-conscious research
      return 'health';
    }
    
    return 'unknown';
  }, []);

  // Track scroll depth
  const updateScrollDepth = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
    
    setUserBehavior(prev => ({
      ...prev,
      scrollDepth: Math.max(prev.scrollDepth, scrollPercent)
    }));
  }, []);

  // Track mouse movements
  const handleMouseMove = useCallback(() => {
    mouseMovementCount.current += 1;
    setUserBehavior(prev => ({
      ...prev,
      mouseMovements: mouseMovementCount.current,
      lastActivity: Date.now()
    }));
  }, []);

  // Track any interaction
  const trackInteraction = useCallback((type: string, data?: any) => {
    setUserBehavior(prev => ({
      ...prev,
      interactionCount: prev.interactionCount + 1,
      lastActivity: Date.now()
    }));

    // Track specific interaction types
    if (type === 'calculator_use') {
      setAudienceSignals(prev => ({
        ...prev,
        interactionPatterns: {
          ...prev.interactionPatterns,
          calculatorUse: true
        }
      }));
    }
    
    if (type === 'video_watched') {
      setAudienceSignals(prev => ({
        ...prev,
        interactionPatterns: {
          ...prev.interactionPatterns,
          videoWatched: true
        }
      }));
    }
  }, []);

  // Track CTA clicks
  const trackCTAClick = useCallback((ctaId: string) => {
    setAudienceSignals(prev => ({
      ...prev,
      interactionPatterns: {
        ...prev.interactionPatterns,
        ctaClicks: [...prev.interactionPatterns.ctaClicks, ctaId]
      }
    }));
    
    trackInteraction('cta_click', { ctaId });
  }, [trackInteraction]);

  // Track section views
  const trackSectionView = useCallback((sectionId: string) => {
    setAudienceSignals(prev => ({
      ...prev,
      interactionPatterns: {
        ...prev.interactionPatterns,
        sectionViews: [...prev.interactionPatterns.sectionViews, sectionId]
      }
    }));
  }, []);

  // Update time on page
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timeOnPage = currentTime - startTime.current;
      
      setUserBehavior(prev => ({
        ...prev,
        timeOnPage
      }));
      
      setAudienceSignals(prev => ({
        ...prev,
        timeOnSite: timeOnPage
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Set up scroll tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    updateScrollDepth(); // Initial call
    
    const handleScroll = () => {
      updateScrollDepth();
      setUserBehavior(prev => ({
        ...prev,
        lastActivity: Date.now()
      }));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollDepth]);

  // Set up mouse movement tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Update engagement score
  useEffect(() => {
    const score = calculateEngagementScore(userBehavior, audienceSignals);
    setUserBehavior(prev => ({
      ...prev,
      engagementScore: score
    }));
  }, [userBehavior.timeOnPage, userBehavior.scrollDepth, userBehavior.interactionCount, audienceSignals, calculateEngagementScore]);

  // Update detected audience
  useEffect(() => {
    const audience = detectAudience(audienceSignals);
    setDetectedAudience(audience);
  }, [audienceSignals, detectAudience]);

  // Get entry source from URL parameters or referrer
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source') || urlParams.get('utm_source') || document.referrer;
    
    if (source) {
      setAudienceSignals(prev => ({
        ...prev,
        entrySource: source
      }));
    }
  }, []);

  // Derived states
  const isEngaged = userBehavior.engagementScore > 30;
  const shouldShowUrgency = userBehavior.timeOnPage > 60000 && userBehavior.scrollDepth > 50;

  return {
    userBehavior,
    audienceSignals,
    detectedAudience,
    isEngaged,
    shouldShowUrgency,
    trackInteraction,
    trackCTAClick,
    trackSectionView
  };
}; 