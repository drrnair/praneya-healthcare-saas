'use client';

import React, { forwardRef } from 'react';
import { useGrid, useResponsive } from '../LayoutProvider';

interface GridContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  fluid?: boolean;
}

interface GridRowProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

interface GridColProps {
  children: React.ReactNode;
  className?: string;
  span?: number | { mobile?: number; tablet?: number; desktop?: number };
  offset?: number | { mobile?: number; tablet?: number; desktop?: number };
  order?: number | { mobile?: number; tablet?: number; desktop?: number };
}

// Container component
export const GridContainer = forwardRef<HTMLDivElement, GridContainerProps>(
  ({ children, className = '', maxWidth = 'xl', fluid = false }, ref) => {
    const grid = useGrid();
    
    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md', 
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      full: 'max-w-full'
    };

    return (
      <div
        ref={ref}
        className={`
          mx-auto w-full
          ${fluid ? 'px-4 md:px-6 lg:px-8' : `px-${grid.margin / 4}`}
          ${maxWidthClasses[maxWidth]}
          ${className}
        `}
        style={{
          paddingLeft: fluid ? undefined : `${grid.margin}px`,
          paddingRight: fluid ? undefined : `${grid.margin}px`
        }}
      >
        {children}
      </div>
    );
  }
);

GridContainer.displayName = 'GridContainer';

// Row component
export const GridRow = forwardRef<HTMLDivElement, GridRowProps>(
  ({ 
    children, 
    className = '', 
    align = 'stretch',
    justify = 'start',
    gap = 'md'
  }, ref) => {
    const grid = useGrid();
    
    const alignClasses = {
      start: 'items-start',
      center: 'items-center', 
      end: 'items-end',
      stretch: 'items-stretch'
    };

    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end', 
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly'
    };

    const gapSizes = {
      none: 0,
      sm: grid.gutter / 2,
      md: grid.gutter,
      lg: grid.gutter * 1.5,
      xl: grid.gutter * 2
    };

    return (
      <div
        ref={ref}
        className={`
          flex flex-wrap
          ${alignClasses[align]}
          ${justifyClasses[justify]}
          ${className}
        `}
        style={{
          gap: `${gapSizes[gap]}px`,
          marginLeft: `-${gapSizes[gap] / 2}px`,
          marginRight: `-${gapSizes[gap] / 2}px`
        }}
      >
        {children}
      </div>
    );
  }
);

GridRow.displayName = 'GridRow';

// Column component  
export const GridCol = forwardRef<HTMLDivElement, GridColProps>(
  ({ 
    children, 
    className = '', 
    span = 1,
    offset = 0,
    order = 0
  }, ref) => {
    const { isMobile, isTablet, isDesktop } = useResponsive();
    const grid = useGrid();

    // Calculate responsive spans
    const getSpanClass = () => {
      if (typeof span === 'number') {
        return `flex-[0_0_${(span / grid.columns) * 100}%]`;
      }

      let activeSpan = 1;
      if (isMobile && span.mobile) activeSpan = span.mobile;
      else if (isTablet && span.tablet) activeSpan = span.tablet;  
      else if (isDesktop && span.desktop) activeSpan = span.desktop;
      
      return `flex-[0_0_${(activeSpan / grid.columns) * 100}%]`;
    };

    // Calculate responsive offsets
    const getOffsetClass = () => {
      if (typeof offset === 'number') {
        return offset > 0 ? `ml-[${(offset / grid.columns) * 100}%]` : '';
      }

      let activeOffset = 0;
      if (isMobile && offset.mobile) activeOffset = offset.mobile;
      else if (isTablet && offset.tablet) activeOffset = offset.tablet;
      else if (isDesktop && offset.desktop) activeOffset = offset.desktop;
      
      return activeOffset > 0 ? `ml-[${(activeOffset / grid.columns) * 100}%]` : '';
    };

    // Calculate responsive order
    const getOrderClass = () => {
      if (typeof order === 'number') {
        return order > 0 ? `order-${order}` : '';
      }

      let activeOrder = 0;
      if (isMobile && order.mobile) activeOrder = order.mobile;
      else if (isTablet && order.tablet) activeOrder = order.tablet;
      else if (isDesktop && order.desktop) activeOrder = order.desktop;
      
      return activeOrder > 0 ? `order-${activeOrder}` : '';
    };

    return (
      <div
        ref={ref}
        className={`
          ${getSpanClass()}
          ${getOffsetClass()} 
          ${getOrderClass()}
          ${className}
        `}
      >
        {children}
      </div>
    );
  }
);

GridCol.displayName = 'GridCol';

// Utility hook for manual grid calculations
export function useGridCalculations() {
  const grid = useGrid();
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getColumnWidth = (span: number = 1) => {
    const totalGutters = (grid.columns - 1) * grid.gutter;
    const availableWidth = grid.maxWidth - (grid.margin * 2) - totalGutters;
    const columnWidth = availableWidth / grid.columns;
    
    return (columnWidth * span) + (grid.gutter * (span - 1));
  };

  const getBreakpointColumns = () => {
    if (isMobile) return 4;
    if (isTablet) return 8; 
    return 12;
  };

  const getResponsiveSpan = (spanConfig: number | { mobile?: number; tablet?: number; desktop?: number }) => {
    if (typeof spanConfig === 'number') return spanConfig;
    
    if (isMobile && spanConfig.mobile) return spanConfig.mobile;
    if (isTablet && spanConfig.tablet) return spanConfig.tablet;
    if (isDesktop && spanConfig.desktop) return spanConfig.desktop;
    
    return 1;
  };

  return {
    grid,
    getColumnWidth,
    getBreakpointColumns,
    getResponsiveSpan
  };
}

// Common grid patterns for healthcare layouts
export const HealthcareGridPatterns = {
  // Dashboard hero section
  DashboardHero: ({ children }: { children: React.ReactNode }) => (
    <GridContainer>
      <GridRow>
        <GridCol span={{ mobile: 4, tablet: 8, desktop: 12 }}>
          {children}
        </GridCol>
      </GridRow>
    </GridContainer>
  ),

  // Two-column layout (sidebar + main)
  SidebarLayout: ({ 
    sidebar, 
    main 
  }: { 
    sidebar: React.ReactNode; 
    main: React.ReactNode; 
  }) => (
    <GridContainer fluid>
      <GridRow>
        <GridCol span={{ mobile: 4, tablet: 3, desktop: 3 }}>
          {sidebar}
        </GridCol>
        <GridCol span={{ mobile: 4, tablet: 5, desktop: 9 }}>
          {main}
        </GridCol>
      </GridRow>
    </GridContainer>
  ),

  // Card grid (responsive cards)
  CardGrid: ({ 
    children,
    cardSpan = { mobile: 4, tablet: 4, desktop: 4 }
  }: { 
    children: React.ReactNode;
    cardSpan?: { mobile: number; tablet: number; desktop: number };
  }) => (
    <GridContainer>
      <GridRow gap="lg">
        <GridCol span={cardSpan}>
          {children}
        </GridCol>
      </GridRow>
    </GridContainer>
  ),

  // Three-column dashboard
  ThreeColumnDashboard: ({
    left,
    center, 
    right
  }: {
    left: React.ReactNode;
    center: React.ReactNode;
    right: React.ReactNode;
  }) => (
    <GridContainer fluid>
      <GridRow>
        <GridCol span={{ mobile: 4, tablet: 8, desktop: 3 }} order={{ mobile: 2, tablet: 2, desktop: 1 }}>
          {left}
        </GridCol>
        <GridCol span={{ mobile: 4, tablet: 8, desktop: 6 }} order={{ mobile: 1, tablet: 1, desktop: 2 }}>
          {center}
        </GridCol>
        <GridCol span={{ mobile: 4, tablet: 8, desktop: 3 }} order={{ mobile: 3, tablet: 3, desktop: 3 }}>
          {right}
        </GridCol>
      </GridRow>
    </GridContainer>
  )
}; 