/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ===================
      // FONT FAMILIES
      // ===================
      fontFamily: {
        'primary': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'secondary': ['Roboto', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },

      // ===================
      // HEALTHCARE COLOR SYSTEM
      // ===================
      colors: {
        // Primary Healthcare Brand
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#007BFF', // Deep Medical Blue
          600: '#1976D2',
          700: '#1565C0',
          800: '#0D47A1',
          900: '#0A369D',
        },

        // Success - Healing Green
        success: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#28A745', // Main Success
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },

        // Warning - Warm Amber
        warning: {
          50: '#FFF8E1',
          100: '#FFECB3',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#FFC107', // Main Warning
          600: '#FFB300',
          700: '#FFA000',
          800: '#FF8F00',
          900: '#FF6F00',
        },

        // Error - Medical Alert Red
        error: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },

        // Info - Medical Info Blue
        info: {
          50: '#E1F5FE',
          100: '#B3E5FC',
          200: '#81D4FA',
          300: '#4FC3F7',
          400: '#29B6F6',
          500: '#03A9F4',
          600: '#039BE5',
          700: '#0288D1',
          800: '#0277BD',
          900: '#01579B',
        },

        // Secondary - Fresh Mint
        secondary: {
          50: '#E8F6EC',
          100: '#C5E9D0',
          200: '#9FDAB1',
          300: '#79CB92',
          400: '#5DC07A',
          500: '#52B265', // Fresh Mint
          600: '#4BAB5E',
          700: '#42A254',
          800: '#39994A',
          900: '#2A8939',
        },

        // Accent - Soft Sage
        accent: {
          50: '#F0F7ED',
          100: '#DAEBD2',
          200: '#C2DEB4',
          300: '#AAD197', // Soft Sage
          400: '#A1D297',
          500: '#92C67F',
          600: '#84BA71',
          700: '#73AC61',
          800: '#639E51',
          900: '#4A8A3A',
        },

        // Copper - Warmth & Authenticity
        copper: {
          50: '#FDF4F0',
          100: '#FAE3DA',
          200: '#F6D1C2',
          300: '#F2BEAA',
          400: '#EFAC98',
          500: '#C27133', // Earthy Copper
          600: '#B8682F',
          700: '#AD5E2A',
          800: '#A35426',
          900: '#924621',
        },

        // Neutral System
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#6C757D', // Warm Gray
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },

        // Forest - Stability & Trust
        forest: {
          50: '#E8F2EF',
          100: '#C5DFD7',
          200: '#9FCABC',
          300: '#79B5A1',
          400: '#5DA68D',
          500: '#346152', // Deep Forest
          600: '#2F594B',
          700: '#285043',
          800: '#21483C',
          900: '#153D2F',
        },
      },

      // ===================
      // TYPOGRAPHY SCALE
      // ===================
      fontSize: {
        'xs': ['0.625rem', { lineHeight: '1.25', letterSpacing: '0.025em' }],
        'sm': ['0.75rem', { lineHeight: '1.375', letterSpacing: '0.025em' }],
        'base': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'lg': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'xl': ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
        '2xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.025em' }],
        '3xl': ['1.5rem', { lineHeight: '1.375', letterSpacing: '-0.025em' }],
        '4xl': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.025em' }],
        '5xl': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.025em' }],
        '6xl': ['3rem', { lineHeight: '1.125', letterSpacing: '-0.025em' }],
        '7xl': ['3.75rem', { lineHeight: '1.125', letterSpacing: '-0.025em' }],
        '8xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.025em' }],
      },

      // ===================
      // SPACING SYSTEM
      // ===================
      spacing: {
        '0': '0',
        'px': '1px',
        '0.5': '0.125rem',
        '1': '0.25rem',
        '1.5': '0.375rem',
        '2': '0.5rem',
        '2.5': '0.625rem',
        '3': '0.75rem',
        '3.5': '0.875rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },

      // ===================
      // BORDER RADIUS
      // ===================
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
        // Healthcare-specific
        'healthcare-card': '0.75rem',
        'healthcare-button': '0.5rem',
        'healthcare-input': '0.375rem',
      },

      // ===================
      // BOX SHADOW SYSTEM
      // ===================
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'DEFAULT': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
        // Healthcare-specific shadows
        'healthcare-card': '0 4px 12px rgba(0, 123, 255, 0.08), 0 2px 4px rgba(0, 123, 255, 0.04)',
        'healthcare-hover': '0 8px 24px rgba(0, 123, 255, 0.12), 0 4px 8px rgba(0, 123, 255, 0.06)',
        'healthcare-focus': '0 0 0 3px rgba(0, 123, 255, 0.1)',
        'wellness-glow': '0 0 20px rgba(40, 167, 69, 0.15)',
        'energy-glow': '0 0 20px rgba(255, 193, 7, 0.15)',
      },

      // ===================
      // ANIMATION & TRANSITIONS
      // ===================
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },

      transitionTimingFunction: {
        'healthcare': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'micro-interaction': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // ===================
      // ANIMATION KEYFRAMES
      // ===================
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'pulse-healthcare': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 123, 255, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(0, 123, 255, 0)' },
        },
        'wellness-breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'micro-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-healthcare': 'pulse-healthcare 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wellness-breathe': 'wellness-breathe 3s ease-in-out infinite',
        'micro-bounce': 'micro-bounce 0.5s ease-in-out',
      },

      // ===================
      // BACKDROP BLUR
      // ===================
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },

      // ===================
      // Z-INDEX SCALE
      // ===================
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        'auto': 'auto',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    
    // Custom Healthcare Plugin
    function({ addUtilities, addComponents, theme }) {
      // Healthcare-specific utility classes
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.scroll-smooth': {
          'scroll-behavior': 'smooth',
        },
        '.focus-healthcare': {
          '&:focus': {
            outline: 'none',
            'box-shadow': theme('boxShadow.healthcare-focus'),
          },
        },
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
      });

      // Healthcare component classes
      addComponents({
        '.btn-healthcare-primary': {
          '@apply inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-500 border border-transparent rounded-healthcare-button shadow-healthcare-card hover:bg-primary-600 hover:shadow-healthcare-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ease-healthcare touch-manipulation': {},
        },
        '.btn-healthcare-secondary': {
          '@apply inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-healthcare-button hover:bg-primary-100 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 ease-healthcare touch-manipulation': {},
        },
        '.btn-healthcare-success': {
          '@apply inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-success-500 border border-transparent rounded-healthcare-button shadow-healthcare-card hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 transition-all duration-200 ease-healthcare touch-manipulation': {},
        },
        '.card-healthcare': {
          '@apply bg-white rounded-healthcare-card shadow-healthcare-card border border-neutral-200 p-6 transition-all duration-300 ease-healthcare hover:shadow-healthcare-hover': {},
        },
        '.card-healthcare-elevated': {
          '@apply bg-white rounded-healthcare-card shadow-lg border border-neutral-200 p-8 transition-all duration-300 ease-healthcare hover:shadow-xl': {},
        },
        '.input-healthcare': {
          '@apply block w-full px-4 py-3 text-base text-neutral-900 placeholder-neutral-500 bg-white border border-neutral-300 rounded-healthcare-input focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 ease-healthcare': {},
        },
        '.gradient-healthcare-primary': {
          'background': 'linear-gradient(135deg, theme("colors.primary.500") 0%, theme("colors.primary.600") 100%)',
        },
        '.gradient-healthcare-wellness': {
          'background': 'linear-gradient(135deg, theme("colors.success.400") 0%, theme("colors.secondary.500") 100%)',
        },
        '.gradient-healthcare-energy': {
          'background': 'linear-gradient(135deg, theme("colors.warning.400") 0%, theme("colors.copper.500") 100%)',
        },
        '.text-gradient-primary': {
          'background': 'linear-gradient(135deg, theme("colors.primary.500") 0%, theme("colors.primary.700") 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      });
    },
  ],
  darkMode: 'class',
}; 