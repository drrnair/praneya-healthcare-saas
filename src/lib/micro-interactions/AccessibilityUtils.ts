// Accessibility utilities for micro-interactions
export class AccessibilityManager {
  private static announceTimer: NodeJS.Timeout | null = null;
  
  // Screen reader announcements
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    // Clear previous announcement to avoid overlap
    if (this.announceTimer) {
      clearTimeout(this.announceTimer);
    }
    
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    this.announceTimer = setTimeout(() => {
      if (document.body.contains(announcer)) {
        document.body.removeChild(announcer);
      }
    }, 1000);
  }
  
  // Check if user prefers reduced motion
  static prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  // Check for high contrast mode
  static prefersHighContrast(): boolean {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }
  
  // Focus management
  static trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
      
      if (e.key === 'Escape') {
        element.blur();
      }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }
  
  // Keyboard navigation helper
  static addKeyboardNavigation(element: HTMLElement, callback: (key: string) => void) {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow standard navigation keys
      if (['Enter', ' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        callback(e.key);
        e.preventDefault();
      }
    };
    
    element.addEventListener('keydown', handleKeyDown);
    element.setAttribute('tabindex', '0');
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }
  
  // Visual focus indicator
  static addVisualFocus(element: HTMLElement) {
    const handleFocus = () => {
      element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
    };
    
    const handleBlur = () => {
      element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
    };
    
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);
    
    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }
}

// Animation presets with accessibility considerations
export const accessibleAnimations = {
  // Reduced motion fallbacks
  slideIn: (prefersReduced: boolean) => ({
    initial: { opacity: 0, x: prefersReduced ? 0 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: prefersReduced ? 0 : -20 },
    transition: { duration: prefersReduced ? 0.1 : 0.3 }
  }),
  
  fadeIn: (prefersReduced: boolean) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: prefersReduced ? 0.1 : 0.3 }
  }),
  
  scaleIn: (prefersReduced: boolean) => ({
    initial: { opacity: 0, scale: prefersReduced ? 1 : 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: prefersReduced ? 1 : 0.95 },
    transition: { duration: prefersReduced ? 0.1 : 0.3 }
  }),
  
  // Healthcare-specific animations
  healthAlert: (prefersReduced: boolean, severity: 'low' | 'medium' | 'high') => ({
    initial: { opacity: 0, scale: prefersReduced ? 1 : 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      ...(severity === 'high' && !prefersReduced ? { x: [0, -2, 2, 0] } : {})
    },
    exit: { opacity: 0, scale: prefersReduced ? 1 : 0.9 },
    transition: { duration: prefersReduced ? 0.1 : severity === 'high' ? 0.5 : 0.3 }
  }),
  
  progressUpdate: (prefersReduced: boolean) => ({
    initial: { opacity: 0, y: prefersReduced ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReduced ? 0 : -10 },
    transition: { duration: prefersReduced ? 0.1 : 0.4 }
  })
};

// Color contrast utilities
export const colorContrast = {
  // Ensure sufficient contrast for accessibility
  getContrastRatio(foreground: string, background: string): number {
    const getLuminance = (color: string) => {
      const rgb = parseInt(color.replace('#', ''), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  },
  
  // Check if color combination meets WCAG guidelines
  meetsWCAG(foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  },
  
  // High contrast mode colors
  highContrastColors: {
    primary: '#000000',
    secondary: '#FFFFFF',
    accent: '#0000FF',
    warning: '#FFFF00',
    error: '#FF0000',
    success: '#00FF00'
  }
};

// Haptic feedback utilities (mobile)
export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },
  
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  },
  
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  },
  
  // Healthcare-specific patterns
  healthSuccess: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  },
  
  healthWarning: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  },
  
  healthCritical: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }
};

// Performance monitoring for animations
export class AnimationPerformanceMonitor {
  private static frameCount = 0;
  private static lastTime = performance.now();
  private static fps = 60;
  
  static startMonitoring() {
    const measure = () => {
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      requestAnimationFrame(measure);
    };
    
    requestAnimationFrame(measure);
  }
  
  static getFPS(): number {
    return this.fps;
  }
  
  static isLowPerformance(): boolean {
    return this.fps < 30;
  }
  
  static getRecommendedQuality(): 'low' | 'medium' | 'high' {
    if (this.fps < 30) return 'low';
    if (this.fps < 45) return 'medium';
    return 'high';
  }
} 