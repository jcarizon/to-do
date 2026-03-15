'use client';

import { useEffect, type ReactNode } from 'react';
import { ModalShellProps } from './types';

export function ModalShell({
  title,
  onClose,
  children,
  footer,
  maxWidth = 'max-w-lg',
}: ModalShellProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={[
          'bg-zinc-900 border border-zinc-700 rounded-xl w-full shadow-2xl',
          'flex flex-col max-h-[90vh]',
          maxWidth,
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 flex-shrink-0">
          <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-zinc-500 hover:text-zinc-200 transition-colors text-lg leading-none focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 rounded"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-800 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}