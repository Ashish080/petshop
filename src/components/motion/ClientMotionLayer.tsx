'use client';

import dynamic from 'next/dynamic';

const CursorGlow = dynamic(
  () => import('./CursorGlow').then((m) => ({ default: m.CursorGlow })),
  { ssr: false }
);

const ScrollProgress = dynamic(
  () => import('./ScrollProgress').then((m) => ({ default: m.ScrollProgress })),
  { ssr: false }
);

export function ClientMotionLayer() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
    </>
  );
}
