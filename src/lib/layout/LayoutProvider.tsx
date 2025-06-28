'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useHealthcareTheme } from '@/lib/design-system/theme-provider';

// Layout configuration types
export interface LayoutConfig {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  hasNotch: boolean;
  isStandalone: boolean;
  isFullscreen: boolean;
  orientation: 'portrait' | 'landscape';
}

export interface NavigationConfig {
  showBottomTabs: boolean;
  showSidebar: boolean;
  showFloatingAction: boolean;
  showBreadcrumbs: boolean;
  sidebarCollapsed: boolean;
  searchVisible: boolean;
}

export interface GridConfig {
  columns: number;
  gutter: number;
  margin: number;
  maxWidth: number;
}

interface LayoutContextType {
  layout: LayoutConfig;
  navigation: NavigationConfig;
  grid: GridConfig;
  updateNavigation: (updates: Partial<NavigationConfig>) => void;
  toggleSidebar: () => void;
  toggleSearch: () => void;
  setFullscreen: (fullscreen: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// Responsive breakpoints
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440
} as const;

// Grid configurations by breakpoint
const GRID_CONFIGS = {
  mobile: { columns: 4, gutter: 16, margin: 16, maxWidth: 768 },
  tablet: { columns: 8, gutter: 20, margin: 24, maxWidth: 1024 },
  desktop: { columns: 12, gutter: 24, margin: 32, maxWidth: 1440 }
} as const;

interface LayoutProviderProps {
  children: React.ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
  const { theme } = useHealthcareTheme();
  
  // Layout state
  const [layout, setLayout] = useState<LayoutConfig>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 1024,
    screenHeight: 768,
    safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
    hasNotch: false,
    isStandalone: false,
    isFullscreen: false,
    orientation: 'landscape'
  });

  // Navigation state
  const [navigation, setNavigation] = useState<NavigationConfig>({
    showBottomTabs: false,
    showSidebar: true,
    showFloatingAction: true,
    showBreadcrumbs: false,
    sidebarCollapsed: false,
    searchVisible: false
  });

  // Grid configuration
  const [grid, setGrid] = useState<GridConfig>(GRID_CONFIGS.desktop);

  // Detect safe area insets (for notched devices)
  const detectSafeAreaInsets = useCallback(() => {
    if (typeof window === 'undefined') return { top: 0, bottom: 0, left: 0, right: 0 };

    const computedStyle = getComputedStyle(document.documentElement);
    
    return {
      top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
      bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
      left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
      right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0')
    };
  }, []);

  // Detect device capabilities and environment
  const detectEnvironment = useCallback(() => {
    if (typeof window === 'undefined') return {};

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;

    // Detect notch (simplified detection)
    const hasNotch = window.screen.height / window.screen.width > 2 || // Very tall aspect ratio
                     CSS.supports('padding: env(safe-area-inset-top)');

    return { isStandalone, isFullscreen, hasNotch };
  }, []);

  // Update layout based on screen size
  const updateLayout = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const orientation = height > width ? 'portrait' : 'landscape';

    const isMobile = width < BREAKPOINTS.mobile;
    const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
    const isDesktop = width >= BREAKPOINTS.tablet;

    const safeAreaInsets = detectSafeAreaInsets();
    const environment = detectEnvironment();

    // Update layout config
    setLayout({
      isMobile,
      isTablet,
      isDesktop,
      screenWidth: width,
      screenHeight: height,
      safeAreaInsets,
      orientation,
      ...environment
    });

    // Update grid config
    if (isMobile) {
      setGrid(GRID_CONFIGS.mobile);
    } else if (isTablet) {
      setGrid(GRID_CONFIGS.tablet);
    } else {
      setGrid(GRID_CONFIGS.desktop);
    }

    // Update navigation config based on screen size
    setNavigation(prev => ({
      ...prev,
      showBottomTabs: isMobile,
      showSidebar: !isMobile,
      showBreadcrumbs: !isMobile,
      sidebarCollapsed: isTablet // Auto-collapse on tablet for more space
    }));
  }, [detectSafeAreaInsets, detectEnvironment]);

  // Navigation control functions
  const updateNavigation = useCallback((updates: Partial<NavigationConfig>) => {
    setNavigation(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setNavigation(prev => ({ 
      ...prev, 
      sidebarCollapsed: !prev.sidebarCollapsed 
    }));
  }, []);

  const toggleSearch = useCallback(() => {
    setNavigation(prev => ({ 
      ...prev, 
      searchVisible: !prev.searchVisible 
    }));
  }, []);

  const setFullscreen = useCallback((fullscreen: boolean) => {
    setLayout(prev => ({ ...prev, isFullscreen: fullscreen }));
  }, []);

  // Initialize layout on mount and window resize
  useEffect(() => {
    updateLayout();

    const handleResize = () => updateLayout();
    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated after orientation change
      setTimeout(updateLayout, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => updateLayout();
    mediaQuery.addListener(handleDisplayModeChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      mediaQuery.removeListener(handleDisplayModeChange);
    };
  }, [updateLayout]);

  // Keyboard event handling for navigation shortcuts
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K for search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        toggleSearch();
      }
      
      // Cmd/Ctrl + B for sidebar toggle
      if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
        event.preventDefault();
        if (!layout.isMobile) {
          toggleSidebar();
        }
      }
      
      // Escape to close search
      if (event.key === 'Escape' && navigation.searchVisible) {
        toggleSearch();
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [layout.isMobile, navigation.searchVisible, toggleSearch, toggleSidebar]);

  const contextValue: LayoutContextType = {
    layout,
    navigation,
    grid,
    updateNavigation,
    toggleSidebar,
    toggleSearch,
    setFullscreen
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}

// Utility hooks for common layout patterns
export function useResponsive() {
  const { layout } = useLayout();
  return {
    isMobile: layout.isMobile,
    isTablet: layout.isTablet,
    isDesktop: layout.isDesktop,
    isPortrait: layout.orientation === 'portrait',
    isLandscape: layout.orientation === 'landscape'
  };
}

export function useSafeArea() {
  const { layout } = useLayout();
  return layout.safeAreaInsets;
}

export function useGrid() {
  const { grid } = useLayout();
  
  const getColumnWidth = (span: number = 1) => {
    const totalGutters = (grid.columns - 1) * grid.gutter;
    const availableWidth = grid.maxWidth - (grid.margin * 2) - totalGutters;
    const columnWidth = availableWidth / grid.columns;
    
    return (columnWidth * span) + (grid.gutter * (span - 1));
  };

  const getGridClasses = (span: number | { mobile?: number; tablet?: number; desktop?: number }) => {
    if (typeof span === 'number') {
      return `col-span-${span}`;
    }

    const { isMobile, isTablet, isDesktop } = useResponsive();
    
    if (isMobile && span.mobile) return `col-span-${span.mobile}`;
    if (isTablet && span.tablet) return `col-span-${span.tablet}`;
    if (isDesktop && span.desktop) return `col-span-${span.desktop}`;
    
    return 'col-span-1';
  };

  return {
    ...grid,
    getColumnWidth,
    getGridClasses
  };
} 