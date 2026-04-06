'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/* ═══════════════════════════════════════════════════════════
   CARD — Composable card component with variant support.
   ═══════════════════════════════════════════════════════════
   
   Usage:
     <Card>Simple card</Card>
     <Card variant="interactive">Hoverable card</Card>
     <Card variant="elevated" padding="lg">
       <CardHeader>
         <CardTitle>Title</CardTitle>
         <CardDescription>Description</CardDescription>
       </CardHeader>
       <CardContent>...</CardContent>
       <CardFooter>...</CardFooter>
     </Card>
*/

const variants = {
  default: 'bg-bg-tertiary border border-border shadow-xs',
  elevated: 'bg-bg-elevated border border-border shadow-md',
  ghost: 'bg-transparent border-none shadow-none',
  interactive: [
    'bg-bg-tertiary border border-border shadow-xs',
    'hover:shadow-sm hover:border-border-hover',
    'hover:-translate-y-0.5',
    'transition-all duration-[--duration-normal] ease-[--ease-out-expo]',
    'cursor-pointer',
  ].join(' '),
  glass: [
    'glass shadow-md',
  ].join(' '),
  inset: 'bg-bg-inset border border-border/50',
} as const;

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
  padding?: keyof typeof paddingMap;
}

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[--radius-lg] overflow-hidden',
        variants[variant],
        paddingMap[padding],
        className
      )}
      {...props}
    />
  );
}

/* ── Sub-components ── */

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-h4 text-text-primary tracking-tight', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-body-sm mt-1', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-6 flex items-center gap-3', className)}
      {...props}
    />
  );
}

/* ── Skeleton variant for loading states ── */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-[--radius-lg] bg-bg-secondary border border-border overflow-hidden', className)}>
      {/* Image skeleton */}
      <div className="h-48 animate-shimmer" />
      {/* Content skeleton */}
      <div className="p-6 space-y-3">
        <div className="h-3 w-16 rounded-[--radius-sm] animate-shimmer" />
        <div className="h-5 w-3/4 rounded-[--radius-sm] animate-shimmer" />
        <div className="h-4 w-1/2 rounded-[--radius-sm] animate-shimmer" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 w-20 rounded-[--radius-sm] animate-shimmer" />
          <div className="h-10 w-10 rounded-[--radius-md] animate-shimmer" />
        </div>
      </div>
    </div>
  );
}
