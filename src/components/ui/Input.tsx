'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={`w-full px-4 py-2 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 
          focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 ${className || ''}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
