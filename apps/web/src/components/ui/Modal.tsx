'use client';

import { Fragment, type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { easing, duration } from '@/lib/motion';

/* ═══════════════════════════════════════════════════════════
   MODAL — Animated overlay dialog with composable API.
   ═══════════════════════════════════════════════════════════
   
   Usage:
     <Modal open={isOpen} onClose={() => setOpen(false)} title="Confirm">
       <p>Are you sure?</p>
     </Modal>

     <Modal open={isOpen} onClose={close} title="Delete" size="sm"
       footer={
         <>
           <Button variant="ghost" onClick={close}>Cancel</Button>
           <Button variant="danger" onClick={handleDelete}>Delete</Button>
         </>
       }
     >
       This action cannot be undone.
     </Modal>
*/

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]',
} as const;

interface ModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Callback when the modal is dismissed */
  onClose: () => void;
  /** Header title */
  title?: string;
  /** Subtitle below the title */
  description?: string;
  /** Width preset */
  size?: keyof typeof sizeMap;
  /** Main content */
  children: ReactNode;
  /** Footer content (typically action buttons) */
  footer?: ReactNode;
  /** Additional class for the panel container */
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  className,
}: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Fragment>
          {/* ── Backdrop ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
            className="fixed inset-0 z-50 bg-overlay backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Panel Container ── */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{
                duration: duration.normal,
                ease: easing.outExpo,
              }}
              className={cn(
                'w-full rounded-[--radius-lg] bg-bg-elevated border border-border shadow-lg',
                'overflow-hidden',
                sizeMap[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Header ── */}
              {(title || description) && (
                <div className="flex items-start justify-between p-6 border-b border-border">
                  <div>
                    {title && (
                      <h2 id="modal-title" className="text-h4 text-text-primary">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="mt-1 text-body-sm">
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-[--radius-sm] text-text-tertiary hover:text-text-primary hover:bg-bg-tertiary transition-colors duration-[--duration-fast]"
                    aria-label="Close dialog"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {/* ── Content ── */}
              <div className="p-6">{children}</div>

              {/* ── Footer ── */}
              {footer && (
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-bg-secondary/50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}
