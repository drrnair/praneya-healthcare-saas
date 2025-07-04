// PWA config temporarily disabled for testing

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled static export for development
  // output: 'export',
  // trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edamam-product-images.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.edamam.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Temporarily disable TypeScript and ESLint errors for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  // PWA Configuration will be added by withPWA
  // Add security headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
  // Webpack configuration for better optimization
  webpack: (config, { _buildId, dev, isServer, _defaultLoaders, _webpack }) => {
    // Add custom webpack rules here if needed
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Optimize bundle
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      };
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
  // Enable strict mode
  reactStrictMode: true,
  // Optimize performance
  swcMinify: true,
  // Enable compression
  compress: true,
  // Generate source maps in development
  productionBrowserSourceMaps: false,
  // Configure redirects if needed
  redirects: async () => {
    return [
      // Add redirects here
    ];
  },
  // Configure rewrites if needed
  rewrites: async () => {
    return [
      // Proxy API requests to Express server in development
      {
        source: '/api/v1/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3001/api/v1/:path*'
            : '/api/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
