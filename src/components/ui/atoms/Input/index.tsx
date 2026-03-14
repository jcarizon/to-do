import { InputHTMLAttributes, forwardRef } from 'react';
import { InputProps } from './types';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError = false, className = '', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={[
        'block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900',
        'placeholder:text-gray-400',
        'transition-colors duration-150',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400',
        hasError
          ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
          : 'border-gray-300 focus:border-indigo-400 focus:ring-indigo-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={hasError ? 'true' : undefined}
      {...props}
    />
  );
});