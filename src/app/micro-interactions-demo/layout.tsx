'use client';

import { MicroInteractionProvider } from '@/lib/micro-interactions/MicroInteractionManager';

export default function MicroInteractionsDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MicroInteractionProvider initialQuality="high">
      {children}
    </MicroInteractionProvider>
  );
} 