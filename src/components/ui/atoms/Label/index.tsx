import { LabelHTMLAttributes } from 'react';
import { LabelProps } from './types';

export function Label({ required, children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={['block text-sm font-medium text-gray-700', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}