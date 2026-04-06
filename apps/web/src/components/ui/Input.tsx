'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════
   INPUT — Form input with built-in label, error, hint, icons.
   ═══════════════════════════════════════════════════════════
   
   Usage:
     <Input label="Email" placeholder="you@example.com" />
     <Input label="Password" type="password" error="Too short" />
     <Input inputSize="lg" iconLeft={<Search size={18} />} />
     <Input hint="We'll never share your email" />
*/

const inputVariants = cva(
  [
    'w-full bg-bg-tertiary text-text-primary',
    'border border-border rounded-[--radius-md]',
    'placeholder:text-text-disabled',
    'transition-all duration-[--duration-fast]',
    'focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-brand',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      inputSize: {
        sm: 'h-9  px-3 text-sm',
        md: 'h-11 px-4 text-sm',
        lg: 'h-13 px-5 text-base',
      },
      hasError: {
        true: 'border-danger focus:ring-danger/20 focus:border-danger',
      },
    },
    defaultVariants: {
      inputSize: 'md',
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Label displayed above the input */
  label?: string;
  /** Hint text displayed below the input */
  hint?: string;
  /** Error message — also triggers error styling */
  error?: string;
  /** Icon on the left side of the input */
  iconLeft?: ReactNode;
  /** Icon on the right side of the input */
  iconRight?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputSize,
      hasError,
      label,
      hint,
      error,
      iconLeft,
      iconRight,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-lg text-text-primary block"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary [&>svg]:h-[18px] [&>svg]:w-[18px]">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({
                inputSize,
                hasError: hasError || !!error,
                className,
              }),
              iconLeft && 'pl-10',
              iconRight && 'pr-10'
            )}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            {...props}
          />

          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary [&>svg]:h-[18px] [&>svg]:w-[18px]">
              {iconRight}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-body-xs text-danger" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-body-xs text-text-tertiary">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
