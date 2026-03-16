'use client';

import { ToastItemProps } from './types';
import { useToastItem } from './useToastItem';
 
export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { 
    visible, 
    leaving, 
    duration, 
    styles, 
    handleDismiss 
  } = useToastItem({ toast, onDismiss });
 
  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'relative flex items-start gap-3 w-80 rounded-xl',
        'bg-zinc-900 border border-zinc-800 shadow-2xl shadow-black/40',
        'px-4 py-3 overflow-hidden',
        'transition-all duration-300 ease-out',
        visible && !leaving ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4',
      ].join(' ')}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${styles.bar}`} />
      <span className={`text-xs font-bold mt-0.5 flex-shrink-0 ${styles.text}`}>
        {styles.icon}
      </span>
      <p className="flex-1 text-xs text-zinc-300 leading-relaxed">
        {toast.message}
      </p>
      <button type="button" onClick={handleDismiss}
        className="flex-shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors text-xs mt-0.5"
        aria-label="Dismiss">
        ✕
      </button>
      <div className={`absolute bottom-0 left-0 h-px ${styles.bar} opacity-40`}
        style={{ animation: `toast-shrink ${duration}ms linear forwards` }} />
      <style jsx>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to   { width: 0%;   }
        }
      `}</style>
    </div>
  );
}

