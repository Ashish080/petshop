'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════
   BUTTON — The single button component for the entire app.
   ═══════════════════════════════════════════════════════════
   
   Replaces: LoginButton, AdoptPetButton, CartPawButton,
             MobileStickyCtas inline buttons, Navbar inline buttons.
   
   Usage:
     <Button>Default</Button>
     <Button variant="secondary" size="sm" icon={<Heart />}>Wishlist</Button>
     <Button variant="danger" loading>Deleting...</Button>
     <Button variant="ghost" size="xs">Cancel</Button>
     <Button size="lg" fullWidth icon={<ShoppingBag />}>Add to Cart</Button>
     <Button size="xl">Large Button</Button>
*/

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-semibold leading-none whitespace-nowrap',
    'transition-all duration-[--duration-fast]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.97]',
    'cursor-pointer',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-brand text-white',
          'hover:bg-brand-hover',
          'shadow-xs',
          'hover:shadow-brand',
        ],
        secondary: [
          'bg-bg-tertiary text-text-primary',
          'border border-border',
          'hover:bg-bg-secondary hover:border-border-hover',
        ],
        outline: [
          'border-2 border-border bg-transparent',
          'text-text-primary',
          'hover:bg-bg-tertiary hover:border-border-hover',
        ],
        ghost: [
          'bg-transparent text-text-secondary',
          'hover:bg-bg-tertiary hover:text-text-primary',
        ],
        danger: [
          'bg-danger text-white',
          'hover:bg-danger/90',
          'shadow-xs',
        ],
        success: [
          'bg-success text-white',
          'hover:bg-success/90',
          'shadow-xs',
        ],
        link: [
          'bg-transparent text-brand underline-offset-4',
          'hover:underline',
          'p-0 h-auto',
        ],
        brand: [
          'bg-text-primary text-text-inverse',
          'hover:bg-text-primary/90',
          'shadow-xs',
        ],
      },
      size: {
        xs: 'h-7  px-2.5 text-xs  rounded-[--radius-sm]',
        sm: 'h-9  px-3.5 text-sm  rounded-[--radius-md]',
        md: 'h-11 px-5   text-sm  rounded-[--radius-md]',
        lg: 'h-13 px-7   text-base rounded-[--radius-lg]',
        xl: 'h-16 px-10  text-lg   rounded-[--radius-xl]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show loading spinner and disable the button */
  loading?: boolean;
  /** Icon on the left side */
  icon?: ReactNode;
  /** Icon on the right side */
  iconRight?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      icon,
      iconRight,
      children,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{iconRight}</span>
      )}
    </button>
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
