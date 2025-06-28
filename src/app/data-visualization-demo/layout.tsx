import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Data Visualization Demo | Praneya Healthcare',
  description: 'Interactive demo of Praneya\'s comprehensive data visualization suite for healthcare analytics, featuring health trends, nutrition tracking, family dashboards, and AI-powered insights.',
  keywords: [
    'data visualization',
    'healthcare analytics',
    'health charts',
    'medical dashboards',
    'nutrition tracking',
    'family health',
    'medication adherence',
    'AI recipe analysis',
    'interactive charts',
    'health metrics'
  ]
};

export default function DataVisualizationDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 