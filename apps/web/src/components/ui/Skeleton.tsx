'use client';

import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════
   SKELETON — Shimmer loading placeholder.
   ═══════════════════════════════════════════════════════════
   
   Usage:
     <Skeleton className="h-4 w-32" />        ← Text line
     <Skeleton className="h-48 w-full" />      ← Image block
     <Skeleton circle className="h-10 w-10" /> ← Avatar
*/

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Render as a circle (avatar, icon placeholder) */
  circle?: boolean;
}

export function Skeleton({ circle, className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-shimmer',
        circle ? 'rounded-full' : 'rounded-[--radius-sm]',
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

/* ── Common skeleton patterns ── */

export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-2/3' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-14 w-14' };
  return <Skeleton circle className={sizeMap[size]} />;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-[--radius-lg] bg-bg-secondary border border-border p-6 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 py-4 px-5 border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === 0 ? 'w-48' : i === cols - 1 ? 'w-16' : 'w-24'
          )}
        />
      ))}
    </div>
  );
}
