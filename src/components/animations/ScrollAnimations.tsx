'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ANIMATION_VARIANTS, SPRING_PRESETS } from '@/lib/animations/animation-system';

// Intersection Observer Hook with enhanced options
function useIntersectionObserver(
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px'
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
          if (entry.isIntersecting && !hasIntersected) {
            setHasIntersected(true);
          }
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}

// Fade In Up Animation with custom easing
interface FadeInUpProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  once = true,
  className
}) => {
  const { ref, hasIntersected } = useIntersectionObserver(0.1);
  const controls = useAnimation();

  useEffect(() => {
    if (hasIntersected || !once) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.6, -0.05, 0.01, 0.99]
        }
      });
    }
  }, [hasIntersected, once, controls, delay, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container for Children
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className
}) => {
  const { ref, hasIntersected } = useIntersectionObserver(0.1);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.6, -0.05, 0.01, 0.99]
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Slide In Animation
interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'left',
  delay = 0,
  className
}) => {
  const { ref, hasIntersected } = useIntersectionObserver(0.2);
  
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -100, y: 0 };
      case 'right': return { x: 100, y: 0 };
      case 'up': return { x: 0, y: -100 };
      case 'down': return { x: 0, y: 100 };
      default: return { x: -100, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ ...getInitialPosition(), opacity: 0 }}
      animate={hasIntersected ? {
        x: 0,
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.8,
          delay,
          ease: [0.6, -0.05, 0.01, 0.99]
        }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale In Animation
interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  delay = 0,
  className
}) => {
  const { ref, hasIntersected } = useIntersectionObserver(0.2);

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={hasIntersected ? {
        scale: 1,
        opacity: 1,
        transition: {
          ...SPRING_PRESETS.BOUNCY,
          delay
        }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Parallax Scroll Effect
interface ParallaxScrollProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export const ParallaxScroll: React.FC<ParallaxScrollProps> = ({
  children,
  speed = 0.5,
  className
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll Progress Indicator
interface ScrollProgressProps {
  className?: string;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({ className }) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 transform-gpu z-50",
        className
      )}
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "0%"
      }}
    />
  );
};

// Reveal on Scroll
interface RevealOnScrollProps {
  children: React.ReactNode;
  width?: 'fit' | 'full';
  className?: string;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  width = 'fit',
  className
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -200px 0px" });

  return (
    <div ref={ref} className={cn(width === 'full' ? 'w-full' : 'w-fit', className)}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 }
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Enhanced Scroll Fade In with direction support
export const ScrollFadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}> = ({ children, delay = 0, direction = 'up', className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: -40 },
    right: { x: 40 }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction]
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0,
        transition: {
          duration: 0.6,
          delay,
          ease: [0.6, -0.05, 0.01, 0.99]
        }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll Scale Animation
export const ScrollScale: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          delay,
          ease: [0.6, -0.05, 0.01, 0.99]
        }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scroll Stagger Animation
export const ScrollStagger: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -200px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 75 }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: delay + 0.25,
          ease: [0.6, -0.05, 0.01, 0.99]
        }
      } : {}}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={ANIMATION_VARIANTS.fadeInUp}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export const Parallax: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}; 