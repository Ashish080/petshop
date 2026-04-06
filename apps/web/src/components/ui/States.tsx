'use client';

import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { motionPresets } from '@/lib/motion';

/* ═══════════════════════════════════════════════════════════
   EMPTY STATE — Beautiful placeholder for zero-data states.
   ═══════════════════════════════════════════════════════════
   
   Usage:
     <EmptyState
       icon={<Package size={40} />}
       title="No orders yet"
       description="When you place orders, they'll appear here."
       action={<Button>Browse Products</Button>}
     />
*/

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      {...motionPresets.fadeUp}
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      {icon && (
        <div className="w-20 h-20 rounded-[--radius-xl] bg-bg-secondary border border-border flex items-center justify-center text-text-tertiary mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-h4 text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-body-sm max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ERROR STATE — Graceful error display with retry action.
   ═══════════════════════════════════════════════════════════
   
   Usage:
     <ErrorState
       title="Something went wrong"
       description="We couldn't load your orders."
       onRetry={() => refetch()}
     />
*/

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      {...motionPresets.fadeUp}
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      <div className="w-20 h-20 rounded-[--radius-xl] bg-danger-muted border border-danger/20 flex items-center justify-center mb-6">
        <svg
          className="w-10 h-10 text-danger"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h3 className="text-h4 text-text-primary mb-2">{title}</h3>
      <p className="text-body-sm max-w-sm mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 h-11 text-sm font-semibold rounded-[--radius-md] bg-brand text-white hover:bg-brand-hover transition-colors active:scale-[0.97]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
          </svg>
          Try Again
        </button>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUCCESS STATE — Celebratory confirmation display.
   ═══════════════════════════════════════════════════════════
*/

interface SuccessStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SuccessState({
  title = 'Success!',
  description,
  action,
  className,
}: SuccessStateProps) {
  return (
    <motion.div
      {...motionPresets.fadeUp}
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-success-muted border border-success/20 flex items-center justify-center mb-6"
      >
        <svg
          className="w-10 h-10 text-success"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>
      <h3 className="text-h4 text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-body-sm max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  );
}
