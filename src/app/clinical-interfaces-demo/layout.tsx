import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clinical Interfaces Demo | Praneya Healthcare',
  description: 'Sophisticated clinical interface components for premium healthcare platform',
  robots: { index: false, follow: false } // Demo page - don't index
};

export default function ClinicalInterfacesDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
