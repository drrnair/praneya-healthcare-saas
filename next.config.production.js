/**
 * Production Next.js Configuration for Healthcare Applications
 * Optimized for medical data handling, HIPAA compliance, and clinical workflows
 */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'healthcare-data-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours for non-PHI data
        },
        cacheKeyWillBeUsed: async ({ request }) => {
          // Never cache PHI data
          if (request.url.includes('/api/health-profile') || 
              request.url.includes('/api/clinical-data')) {
            return null;
          }
          return request.url;
        }
      },
    },
    {
      urlPattern: /\/api\/emergency\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'emergency-access-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60, // 1 hour for emergency data
        },
      },
    }
  ],
  // Healthcare-specific PWA configuration
  buildExcludes: [/middleware-manifest\.json$/],
  disable: process.env.NODE_ENV === 'development'
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Enable modern JavaScript features for better performance
    modernMinify: true,
    // Optimize for healthcare workflow patterns
    optimizeCss: true,
    // Enable server components for better performance
    serverComponents: true,
    // Optimize images for medical imagery
    optimizeImages: true,
  },

  // Production optimizations
  productionBrowserSourceMaps: false, // Disabled for healthcare security
  poweredByHeader: false, // Remove Next.js header for security
  
  // Image optimization with medical imagery considerations
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [
      'praneya-healthcare.com',
      'medical-images.praneya.com',
      'cdn.praneya-health.com'
    ],
    // Medical imagery quality preservation
    quality: 90, // Higher quality for medical images
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: false, // Security for healthcare
  },

  // Webpack optimization for healthcare dependencies
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Healthcare-specific optimizations
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Prioritize healthcare/clinical libraries
          healthcare: {
            test: /[\\/]node_modules[\\/](medical-|healthcare-|clinical-)/,
            name: 'healthcare-vendor',
            priority: 30,
          },
          // Security libraries for HIPAA compliance
          security: {
            test: /[\\/]node_modules[\\/](crypto|bcrypt|jsonwebtoken|helmet)/,
            name: 'security-vendor',
            priority: 25,
          },
          // AI/ML libraries for healthcare analysis
          ai: {
            test: /[\\/]node_modules[\\/](@google|openai|tensorflow)/,
            name: 'ai-vendor',
            priority: 20,
          },
          // Data visualization for medical charts
          visualization: {
            test: /[\\/]node_modules[\\/](chart\.js|d3|recharts|plotly)/,
            name: 'viz-vendor',
            priority: 15,
          },
          // React and core framework
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom|next)/,
            name: 'framework',
            priority: 10,
          },
          default: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      },
    };

    // Healthcare data handling optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      '@healthcare': path.resolve(__dirname, 'src/lib/healthcare'),
      '@clinical': path.resolve(__dirname, 'src/lib/clinical-interfaces'),
      '@security': path.resolve(__dirname, 'src/lib/security'),
    };

    // Medical imagery optimization
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
            // Preserve medical image quality
            quality: 95,
          },
        },
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 90, // High quality for medical images
            },
            optipng: {
              enabled: true,
            },
            pngquant: {
              quality: [0.85, 0.95], // High quality range
              speed: 4,
            },
            gifsicle: {
              interlaced: false,
            },
            webp: {
              quality: 90, // High quality for medical imagery
            },
          },
        },
      ],
    });

    return config;
  },

  // Security headers for healthcare compliance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.praneya-health.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https://medical-images.praneya.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.praneya-health.com wss://realtime.praneya-health.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // Healthcare-specific security headers
          {
            key: 'X-Healthcare-Compliance',
            value: 'HIPAA-Compliant'
          },
          {
            key: 'X-Medical-Data-Protection',
            value: 'PHI-Protected'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'X-PHI-Access-Control',
            value: 'audit-required'
          }
        ],
      },
      {
        source: '/health/(.*)',
        headers: [
          {
            key: 'X-Medical-Data',
            value: 'protected'
          },
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate'
          }
        ],
      }
    ];
  },

  // Redirects for healthcare compliance
  async redirects() {
    return [
      {
        source: '/health-data',
        destination: '/health/dashboard',
        permanent: true,
      },
      {
        source: '/medical-records',
        destination: '/health/records',
        permanent: true,
      }
    ];
  },

  // Environment variables for production monitoring
  env: {
    HEALTHCARE_MODE: 'production',
    MONITORING_ENABLED: 'true',
    AUDIT_LOGGING: 'comprehensive',
    PERFORMANCE_TRACKING: 'enabled',
    COMPLIANCE_VALIDATION: 'strict'
  },

  // Output configuration for deployment
  output: 'standalone',
  trailingSlash: false,
  
  // Compression for better performance
  compress: true,
  
  // React strict mode for better healthcare app reliability
  reactStrictMode: true,
  
  // SWC minification for better performance
  swcMinify: true,
};

module.exports = withBundleAnalyzer(withPWA(nextConfig)); 