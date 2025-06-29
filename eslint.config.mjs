import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        URLSearchParams: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        location: 'readonly',
        screen: 'readonly',
        
        // Timer functions
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        requestIdleCallback: 'readonly',
        
        // DOM types
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLFormElement: 'readonly',
        HTMLImageElement: 'readonly',
        HTMLLinkElement: 'readonly',
        HTMLSpanElement: 'readonly',
        HTMLHeadingElement: 'readonly',
        HTMLParagraphElement: 'readonly',
        SVGSVGElement: 'readonly',
        Event: 'readonly',
        KeyboardEvent: 'readonly',
        CustomEvent: 'readonly',
        FormData: 'readonly',
        Image: 'readonly',
        Blob: 'readonly',
        
        // Web APIs
        performance: 'readonly',
        PerformanceObserver: 'readonly',
        PerformanceNavigationTiming: 'readonly',
        IntersectionObserver: 'readonly',
        Notification: 'readonly',
        NotificationPermission: 'readonly',
        PushSubscription: 'readonly',
        ServiceWorkerRegistration: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
        crypto: 'readonly',
        btoa: 'readonly',
        CSS: 'readonly',
        getComputedStyle: 'readonly',
        
        // React/JSX
        React: 'readonly',
        JSX: 'readonly',
        
        // Node.js globals
        process: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        NodeJS: 'readonly',
        
        // Jest/Testing globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        
        // Path module for Node.js
        path: 'readonly',
        
        // Additional missing globals
        MouseEvent: 'readonly',
        TouchEvent: 'readonly',
        alert: 'readonly',
        
        // Type definitions that are referenced
        HealthMetric: 'readonly',
        NutritionData: 'readonly',
        FamilyMember: 'readonly',
        AccessibilityManager: 'readonly',
        
        // Database functions
        initializeDatabase: 'readonly',
        initializeRedis: 'readonly',
        healthCheck: 'readonly',
        healthCheckRedis: 'readonly',
        closeDatabase: 'readonly',
        closeRedis: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      // Basic rules
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'warn',
      'no-undef': 'error',
    },
  },
  {
    // Server-side and script files
    files: ['database/**/*.{ts,js}', 'scripts/**/*.{ts,js}', 'src/server/**/*.{ts,js}'],
    rules: {
      'no-console': 'off', // Allow console in server code
    },
  },
  {
    // Test files
    files: ['**/*.{test,spec}.{ts,tsx,js,jsx}', 'tests/**/*.{ts,tsx,js,jsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'public/**',
      '*.min.js',
    ],
  },
];
