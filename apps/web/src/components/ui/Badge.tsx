'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════
   BADGE — Status indicators, tags, and labels.
   ═══════════════════════════════════════════════════════════
   
   Usage:
     <Badge>Default</Badge>
     <Badge variant="success" dot>Active</Badge>
     <Badge variant="danger" size="sm">Error</Badge>
     <Badge variant="brand">Premium</Badge>
*/

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-semibold leading-none whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-bg-secondary text-text-secondary border border-border',
        brand:   'bg-brand-muted text-brand',
        success: 'bg-success-muted text-success',
        warning: 'bg-warning-muted text-warning',
        danger:  'bg-danger-muted text-danger',
        info:    'bg-info-muted text-info',
        accent:  'bg-accent-muted text-accent',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px] rounded-[--radius-sm]',
        md: 'px-2.5 py-1 text-xs rounded-[--radius-sm]',
        lg: 'px-3 py-1.5 text-xs rounded-[--radius-md]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const dotColorMap: Record<string, string> = {
  default: 'bg-text-tertiary',
  brand:   'bg-brand',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
  info:    'bg-info',
  accent:  'bg-accent',
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a colored dot indicator before the text */
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColorMap[variant || 'default']
          )}
        />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
