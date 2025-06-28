module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'plugin:security/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'security'],
  rules: {
    // Healthcare-specific TypeScript rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/require-await': 'error',
    
    // Security rules for healthcare data
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-require': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    
    // Clinical safety rules
    'no-console': 'warn', // Console logs might leak health data
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // Healthcare data handling rules
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'off', // Handled by TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    
    // Error handling for clinical safety
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    
    // Code clarity for healthcare context
    'complexity': ['error', 10],
    'max-depth': ['error', 4],
    'max-lines': ['error', 500],
    'max-lines-per-function': ['error', 100],
    'max-params': ['error', 5],
    
    // Naming conventions for healthcare data
    '@typescript-eslint/naming-convention': [
      'error',
      {
        'selector': 'variable',
        'types': ['boolean'],
        'format': ['PascalCase'],
        'prefix': ['is', 'should', 'has', 'can', 'did', 'will']
      },
      {
        'selector': 'variableLike',
        'format': ['camelCase', 'UPPER_CASE']
      },
      {
        'selector': 'typeLike',
        'format': ['PascalCase']
      },
      {
        'selector': 'interface',
        'format': ['PascalCase'],
        'prefix': ['I']
      },
      {
        'selector': 'typeAlias',
        'format': ['PascalCase'],
        'suffix': ['Type']
      },
      {
        'selector': 'enum',
        'format': ['PascalCase'],
        'suffix': ['Enum']
      }
    ]
  },
  overrides: [
    {
      files: ['src/lib/clinical/**/*.ts', 'src/lib/healthcare/**/*.ts'],
      rules: {
        // Stricter rules for clinical code
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        'complexity': ['error', 8],
        'max-lines-per-function': ['error', 75],
        'no-console': 'error', // No console logs in clinical code
        
        // Require explicit error handling
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/promise-function-async': 'error'
      }
    },
    {
      files: ['src/lib/family/**/*.ts'],
      rules: {
        // Family privacy protection rules
        'no-console': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'security/detect-object-injection': 'error'
      }
    },
    {
      files: ['src/lib/security/**/*.ts'],
      rules: {
        // Maximum security for security modules
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        'no-console': 'error',
        'complexity': ['error', 6],
        'max-lines-per-function': ['error', 50]
      }
    },
    {
      files: ['**/*.test.ts', '**/*.spec.ts'],
      rules: {
        // Relaxed rules for tests
        '@typescript-eslint/no-explicit-any': 'warn',
        'no-console': 'off',
        'max-lines-per-function': 'off'
      }
    }
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    project: ['./tsconfig.json', './tsconfig.server.json']
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}; 