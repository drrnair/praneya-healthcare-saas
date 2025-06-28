/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Healthcare Color System
      colors: {
        // Primary Colors - Trust & Clinical Accuracy
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)', 
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)', // Trustworthy Teal
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
          DEFAULT: 'var(--color-primary-500)',
        },
        // Secondary Colors - Wellness & Growth
        secondary: {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)', // Healing Green
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
          950: 'var(--color-secondary-950)',
          DEFAULT: 'var(--color-secondary-500)',
        },
        // Accent Colors - Energy & Motivation
        accent: {
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)', // Vitality Orange
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
          950: 'var(--color-accent-950)',
          DEFAULT: 'var(--color-accent-500)',
        },
        // Semantic Colors - Clinical Communication
        success: {
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          200: 'var(--color-success-200)',
          300: 'var(--color-success-300)',
          400: 'var(--color-success-400)',
          500: 'var(--color-success-500)', // Nurturing Green
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
          800: 'var(--color-success-800)',
          900: 'var(--color-success-900)',
          950: 'var(--color-success-950)',
          DEFAULT: 'var(--color-success-500)',
        },
        warning: {
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          200: 'var(--color-warning-200)',
          300: 'var(--color-warning-300)',
          400: 'var(--color-warning-400)',
          500: 'var(--color-warning-500)', // Mindful Amber
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
          800: 'var(--color-warning-800)',
          900: 'var(--color-warning-900)',
          950: 'var(--color-warning-950)',
          DEFAULT: 'var(--color-warning-500)',
        },
        error: {
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          200: 'var(--color-error-200)',
          300: 'var(--color-error-300)',
          400: 'var(--color-error-400)',
          500: 'var(--color-error-500)', // Compassionate Red
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
          800: 'var(--color-error-800)',
          900: 'var(--color-error-900)',
          950: 'var(--color-error-950)',
          DEFAULT: 'var(--color-error-500)',
        },
        // Neutral Colors - Calming & Sophisticated
        neutral: {
          50: 'var(--color-neutral-50)',   // Calming Light
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)', // Professional Gray
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)', // Sophisticated Dark
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)',
          DEFAULT: 'var(--color-neutral-500)',
        },
        // Subscription Tier Colors
        tier: {
          primary: 'var(--tier-primary)',
          accent: 'var(--tier-accent)',
          background: 'var(--tier-background)',
          surface: 'var(--tier-surface)',
          border: 'var(--tier-border)',
        }
      },

      // Healthcare Typography System
      fontFamily: {
        primary: 'var(--font-primary)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',     // 16px minimum for accessibility
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)',
      },
      lineHeight: {
        tight: 'var(--leading-tight)',
        snug: 'var(--leading-snug)',
        normal: 'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)', // Healthcare optimized
        loose: 'var(--leading-loose)',
      },
      fontWeight: {
        light: 'var(--font-light)',
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
        extrabold: 'var(--font-extrabold)',
      },

      // Healthcare Shadow System
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        raised: 'var(--shadow-raised)',
        floating: 'var(--shadow-floating)',
        modal: 'var(--shadow-modal)',
        // Healthcare-specific shadows
        card: 'var(--shadow-card)',
        dialog: 'var(--shadow-dialog)',
        tooltip: 'var(--shadow-tooltip)',
        dropdown: 'var(--shadow-dropdown)',
        // Tier-specific shadows
        tier: 'var(--tier-shadow)',
      },

      // Healthcare Spacing System
      spacing: {
        px: 'var(--space-px)',
        0: 'var(--space-0)',
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
        32: 'var(--space-32)',
      },

      // Healthcare Border Radius
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-base)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        full: 'var(--radius-full)',
      },

      // Healthcare Responsive Breakpoints
      screens: {
        sm: 'var(--breakpoint-sm)',   // 640px
        md: 'var(--breakpoint-md)',   // 768px
        lg: 'var(--breakpoint-lg)',   // 1024px
        xl: 'var(--breakpoint-xl)',   // 1280px
        '2xl': 'var(--breakpoint-2xl)', // 1536px
      },

      // Healthcare Animation System
      transitionDuration: {
        fast: 'var(--transition-fast)',     // 150ms
        DEFAULT: 'var(--transition-base)', // 250ms
        slow: 'var(--transition-slow)',    // 350ms
      },
      transitionTimingFunction: {
        'ease-healthcare': 'var(--ease-healthcare)', // Gentle, trustworthy easing
      },

      // Healthcare Z-Index System
      zIndex: {
        hide: 'var(--z-hide)',
        base: 'var(--z-base)',
        docked: 'var(--z-docked)',
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        banner: 'var(--z-banner)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
        toast: 'var(--z-toast)',
      },

      // Healthcare Background Images
      backgroundImage: {
        'tier-gradient': 'var(--tier-gradient)',
        'primary-gradient': 'linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%)',
        'secondary-gradient': 'linear-gradient(135deg, var(--color-secondary-50) 0%, var(--color-secondary-100) 100%)',
        'accent-gradient': 'linear-gradient(135deg, var(--color-accent-50) 0%, var(--color-accent-100) 100%)',
        'wellness-gradient': 'linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-secondary-50) 50%, var(--color-accent-50) 100%)',
      },

      // Healthcare Container Sizes
      container: {
        center: true,
        padding: {
          DEFAULT: 'var(--space-4)',
          sm: 'var(--space-6)',
          lg: 'var(--space-8)',
          xl: 'var(--space-12)',
          '2xl': 'var(--space-16)',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    },
  },
  plugins: [
    // Healthcare-specific Tailwind plugins
    function({ addUtilities, addComponents, theme }) {
      // Healthcare Text Utilities
      addUtilities({
        '.text-healthcare-primary': {
          color: 'var(--color-primary-500)',
          fontWeight: 'var(--font-medium)',
        },
        '.text-healthcare-secondary': {
          color: 'var(--color-secondary-500)',
          fontWeight: 'var(--font-medium)',
        },
        '.text-healthcare-accent': {
          color: 'var(--color-accent-500)',
          fontWeight: 'var(--font-medium)',
        },
        '.text-accessible': {
          fontSize: 'var(--text-base)',
          lineHeight: 'var(--leading-relaxed)',
          color: 'var(--color-neutral-800)',
        },
        '.text-tier': {
          color: 'var(--tier-primary)',
        }
      });

      // Healthcare Card Components
      addComponents({
        '.card-healthcare': {
          backgroundColor: 'var(--color-neutral-50)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          padding: 'var(--space-6)',
          border: '1px solid var(--color-neutral-200)',
          transition: 'all var(--transition-base) var(--ease-healthcare)',
          '&:hover': {
            boxShadow: 'var(--shadow-floating)',
            transform: 'translateY(-2px)',
          }
        },
        '.card-tier': {
          backgroundColor: 'var(--tier-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--tier-shadow)',
          padding: 'var(--space-6)',
          border: '1px solid var(--tier-border)',
          background: 'var(--tier-background)',
        },
        '.btn-healthcare-primary': {
          backgroundColor: 'var(--color-primary-500)',
          color: 'white',
          padding: 'var(--space-3) var(--space-6)',
          borderRadius: 'var(--radius-md)',
          fontWeight: 'var(--font-medium)',
          transition: 'all var(--transition-base) var(--ease-healthcare)',
          border: 'none',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'var(--color-primary-600)',
            boxShadow: 'var(--shadow-raised)',
          },
          '&:focus': {
            outline: '2px solid var(--color-primary-300)',
            outlineOffset: '2px',
          },
          '&:disabled': {
            backgroundColor: 'var(--color-neutral-400)',
            cursor: 'not-allowed',
          }
        },
        '.btn-healthcare-secondary': {
          backgroundColor: 'var(--color-secondary-500)',
          color: 'white',
          padding: 'var(--space-3) var(--space-6)',
          borderRadius: 'var(--radius-md)',
          fontWeight: 'var(--font-medium)',
          transition: 'all var(--transition-base) var(--ease-healthcare)',
          border: 'none',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'var(--color-secondary-600)',
            boxShadow: 'var(--shadow-raised)',
          },
          '&:focus': {
            outline: '2px solid var(--color-secondary-300)',
            outlineOffset: '2px',
          }
        },
        '.btn-tier': {
          backgroundColor: 'var(--tier-primary)',
          color: 'white',
          padding: 'var(--space-3) var(--space-6)',
          borderRadius: 'var(--radius-md)',
          fontWeight: 'var(--font-medium)',
          transition: 'all var(--transition-base) var(--ease-healthcare)',
          border: 'none',
          cursor: 'pointer',
          '&:hover': {
            filter: 'brightness(0.9)',
            boxShadow: 'var(--tier-shadow)',
          }
        },
        '.input-healthcare': {
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-neutral-300)',
          fontSize: 'var(--text-base)',
          lineHeight: 'var(--leading-relaxed)',
          transition: 'all var(--transition-base) var(--ease-healthcare)',
          '&:focus': {
            outline: 'none',
            borderColor: 'var(--color-primary-500)',
            boxShadow: '0 0 0 3px var(--color-primary-100)',
          },
          '&::placeholder': {
            color: 'var(--color-neutral-400)',
          }
        },
        '.badge-healthcare': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: 'var(--space-1) var(--space-3)',
          borderRadius: 'var(--radius-full)',
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-medium)',
          backgroundColor: 'var(--color-primary-100)',
          color: 'var(--color-primary-700)',
        },
        '.alert-success': {
          backgroundColor: 'var(--color-success-50)',
          border: '1px solid var(--color-success-200)',
          color: 'var(--color-success-800)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-md)',
        },
        '.alert-warning': {
          backgroundColor: 'var(--color-warning-50)',
          border: '1px solid var(--color-warning-200)',
          color: 'var(--color-warning-800)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-md)',
        },
        '.alert-error': {
          backgroundColor: 'var(--color-error-50)',
          border: '1px solid var(--color-error-200)',
          color: 'var(--color-error-800)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-md)',
        }
      });
    }
  ],
  // Dark mode configuration
  darkMode: ['class', '[data-theme="dark"]'],
}; 