'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

// ======================
// RESPONSIVE CONTAINER
// ======================

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'lg',
  padding = 'md',
  className
}) => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddings = {
    none: '',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12'
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidths[maxWidth],
      paddings[padding],
      className
    )}>
      {children}
    </div>
  );
};

// ======================
// RESPONSIVE GRID
// ======================

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { base: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  className
}) => {
  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  const gaps = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const responsiveClasses = [
    cols.base ? gridCols[cols.base] : '',
    cols.sm ? `sm:${gridCols[cols.sm]}` : '',
    cols.md ? `md:${gridCols[cols.md]}` : '',
    cols.lg ? `lg:${gridCols[cols.lg]}` : '',
    cols.xl ? `xl:${gridCols[cols.xl]}` : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cn(
      'grid',
      responsiveClasses,
      gaps[gap],
      className
    )}>
      {children}
    </div>
  );
};

// ======================
// MOBILE STACK
// ======================

interface MobileStackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  spacing?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  className?: string;
}

export const MobileStack: React.FC<MobileStackProps> = ({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  className
}) => {
  const directions = {
    vertical: 'flex-col',
    horizontal: 'flex-row'
  };

  const spacings = {
    sm: direction === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: direction === 'vertical' ? 'space-y-4' : 'space-x-4',
    lg: direction === 'vertical' ? 'space-y-6' : 'space-x-6'
  };

  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <div className={cn(
      'flex',
      directions[direction],
      spacings[spacing],
      alignments[align],
      className
    )}>
      {children}
    </div>
  );
};

// ======================
// LAZY LOADING IMAGE
// ======================

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmNWY1ZjUiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU1ZTUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0idXJsKCNncmFkKSIvPjwvc3ZnPg==',
  onLoad
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const isInView = useInView(imgRef, { once: true, margin: '100px' });

  useEffect(() => {
    if (isInView) {
      setInView(true);
    }
  }, [isInView]);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden bg-neutral-100', className)}
      style={{ width, height }}
    >
      {/* Skeleton/Placeholder */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200"
        animate={{
          x: loaded ? '100%' : ['-100%', '100%'],
        }}
        transition={{
          repeat: loaded ? 0 : Infinity,
          duration: 1.5,
          ease: "linear"
        }}
      />

      {/* Actual Image */}
      {inView && (
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn('absolute inset-0 w-full h-full object-cover', className)}
          style={{ filter: loaded ? 'blur(0px)' : 'blur(5px)' }}
          animate={{
            opacity: loaded ? 1 : 0,
            filter: loaded ? 'blur(0px)' : 'blur(5px)'
          }}
          transition={{ duration: 0.3 }}
          onLoad={handleLoad}
          onError={() => setLoaded(true)} // Still hide skeleton on error
        />
      )}
    </div>
  );
};

// ======================
// VIRTUAL SCROLL LIST
// ======================

interface VirtualScrollItem {
  id: string | number;
  height: number;
  data: any;
}

interface VirtualScrollProps {
  items: VirtualScrollItem[];
  renderItem: (item: VirtualScrollItem, index: number) => React.ReactNode;
  height: number;
  itemHeight: number;
  className?: string;
}

export const VirtualScroll: React.FC<VirtualScrollProps> = ({
  items,
  renderItem,
  height,
  itemHeight,
  className
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(height / itemHeight) + 1,
    items.length
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className={cn('overflow-auto', className)}
      style={{ height }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {items.slice(visibleStart, visibleEnd).map((item, index) => (
            <div key={item.id} style={{ height: itemHeight }}>
              {renderItem(item, visibleStart + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ======================
// RESPONSIVE BREAKPOINT HOOK
// ======================

interface Breakpoints {
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
  '2xl': boolean;
}

export const useBreakpoints = (): Breakpoints => {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      setBreakpoints({
        sm: width >= 640,
        md: width >= 768,
        lg: width >= 1024,
        xl: width >= 1280,
        '2xl': width >= 1536
      });
    };

    updateBreakpoints();
    window.addEventListener('resize', updateBreakpoints);
    return () => window.removeEventListener('resize', updateBreakpoints);
  }, []);

  return breakpoints;
};

// ======================
// MOBILE SAFE AREA
// ======================

interface MobileSafeAreaProps {
  children: React.ReactNode;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  className?: string;
}

export const MobileSafeArea: React.FC<MobileSafeAreaProps> = ({
  children,
  edges = ['top', 'bottom'],
  className
}) => {
  const safeAreaClasses = edges.map(edge => {
    switch (edge) {
      case 'top': return 'pt-safe-area-inset-top';
      case 'bottom': return 'pb-safe-area-inset-bottom';
      case 'left': return 'pl-safe-area-inset-left';
      case 'right': return 'pr-safe-area-inset-right';
      default: return '';
    }
  }).join(' ');

  return (
    <div 
      className={cn(safeAreaClasses, className)}
      style={{
        paddingTop: edges.includes('top') ? 'env(safe-area-inset-top)' : undefined,
        paddingBottom: edges.includes('bottom') ? 'env(safe-area-inset-bottom)' : undefined,
        paddingLeft: edges.includes('left') ? 'env(safe-area-inset-left)' : undefined,
        paddingRight: edges.includes('right') ? 'env(safe-area-inset-right)' : undefined,
      }}
    >
      {children}
    </div>
  );
};

// ======================
// PERFORMANCE MONITOR
// ======================

interface PerformanceMetrics {
  fps: number;
  memory?: number;
  loadTime: number;
}

export const usePerformanceMonitor = (): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    loadTime: 0
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    // Start measuring
    measureFPS();

    // Measure memory if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memory: Math.round(memory.usedJSHeapSize / 1024 / 1024)
      }));
    }

    // Measure load time
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime: Math.round(loadTime) }));

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return metrics;
};

// ======================
// MOBILE VIEWPORT
// ======================

export const MobileViewport: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Fix iOS viewport height issue
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    const preventZoom = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', preventZoom, { passive: false });

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
      document.removeEventListener('touchend', preventZoom);
    };
  }, []);

  return <>{children}</>;
}; 