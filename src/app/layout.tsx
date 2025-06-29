import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { HealthcareProviders } from '@/components/layout/HealthcareProviders';
import { MedicalDisclaimerBanner } from '@/components/layout/MedicalDisclaimerBanner';
import { SecurityHeaders } from '@/components/layout/SecurityHeaders';
import { ConsentManagement } from '@/components/layout/ConsentManagement';
import { HealthcareThemeProvider } from '@/lib/design-system/theme-provider';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { MobileViewport } from '@/components/mobile/ResponsiveLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const defaultUrl = 'https://praneya-healthcare.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || defaultUrl),
  title: {
    default: 'Praneya Healthcare Nutrition Platform',
    template: '%s | Praneya Healthcare'
  },
  description: 'Healthcare nutrition SaaS platform with clinical AI integration, family meal planning, and HIPAA-compliant health data management.',
  keywords: [
    'healthcare nutrition',
    'clinical AI',
    'meal planning',
    'family health',
    'HIPAA compliant',
    'nutrition analysis',
    'dietary restrictions',
    'food allergies',
    'chronic conditions',
    'diabetes management'
  ],
  authors: [{ name: 'Praneya Healthcare Team' }],
  creator: 'Praneya Healthcare',
  publisher: 'Praneya Healthcare',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: process.env.NODE_ENV === 'production',
    follow: process.env.NODE_ENV === 'production',
    googleBot: {
      index: process.env.NODE_ENV === 'production',
      follow: process.env.NODE_ENV === 'production',
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION }
  }),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || defaultUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || defaultUrl,
    siteName: 'Praneya Healthcare Nutrition Platform',
    title: 'Healthcare Nutrition SaaS with Clinical AI',
    description: 'HIPAA-compliant healthcare nutrition platform with AI-powered meal planning, family health management, and clinical oversight.',
    images: [
      {
        url: '/images/og-image-healthcare.png',
        width: 1200,
        height: 630,
        alt: 'Praneya Healthcare Nutrition Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Praneya Healthcare Nutrition Platform',
    description: 'HIPAA-compliant healthcare nutrition platform with AI-powered meal planning.',
    images: ['/images/twitter-image-healthcare.png'],
    creator: '@PraneyaHealth',
  },
  manifest: '/manifest.json',
  other: {
    // Healthcare-specific meta tags
    'healthcare-platform': 'true',
    'hipaa-compliant': 'true',
    'clinical-oversight': 'enabled',
    'data-classification': 'PHI',
    // Security headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Praneya Healthcare'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Healthcare safety - prevent accidental zooming on critical data
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA meta tags */}
        <meta name="application-name" content="Praneya Healthcare" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Praneya Healthcare" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#0891B2" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Safe area insets support */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        
        {/* iOS splash screens */}
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-2732.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1668-2388.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1536-2048.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1125-2436.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1242-2208.jpg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-640-1136.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <SecurityHeaders />
        <MedicalDisclaimerBanner />
        <MobileViewport>
          <HealthcareProviders>
            <HealthcareThemeProvider userId="demo-user" subscriptionTier="enhanced">
              <MobileNavigation />
              {children}
            </HealthcareThemeProvider>
          </HealthcareProviders>
        </MobileViewport>
        <ConsentManagement />
        
        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
