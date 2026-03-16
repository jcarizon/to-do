'use client';

import type { PushPermissionStatus } from '@/features/notifications/hooks/useFcmPush';

interface PushPermissionButtonProps {
  status: PushPermissionStatus;
  pushEnabled: boolean;
  onClick: () => void;
}

export function PushPermissionButton({ status, pushEnabled, onClick }: PushPermissionButtonProps) {
  if (status === 'granted') {
    return (
      <button
        type="button"
        onClick={onClick}
        title={pushEnabled ? 'Push notifications on — click to turn off' : 'Push notifications off — click to turn on'}
        aria-label={pushEnabled ? 'Disable push notifications' : 'Enable push notifications'}
        className={[
          'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
          'transition-colors duration-150',
          pushEnabled
            ? 'text-green-400 hover:text-red-400'
            : 'text-zinc-500 hover:text-green-400',
        ].join(' ')}
      >
        <span aria-hidden="true">{pushEnabled ? '🔔' : '🔕'}</span>
        <span className="hidden sm:inline">{pushEnabled ? 'Push on' : 'Push off'}</span>
      </button>
    );
  }

  const CONFIG: Record<
    Exclude<PushPermissionStatus, 'granted'>,
    { icon: string; label: string; title: string; className: string; disabled: boolean }
  > = {
    default: {
      icon: '🔔',
      label: 'Enable push',
      title: 'Enable push notifications',
      className: 'text-zinc-500 hover:text-zinc-300',
      disabled: false,
    },
    denied: {
      icon: '🔕',
      label: 'Push blocked',
      title: 'Push notifications blocked — enable in browser settings',
      className: 'text-red-500 cursor-not-allowed',
      disabled: true,
    },
    unsupported: {
      icon: '🔕',
      label: 'Unsupported',
      title: 'Push notifications not supported in this browser',
      className: 'text-zinc-700 cursor-not-allowed',
      disabled: true,
    },
  };

  const { icon, label, title, className, disabled } = CONFIG[status];

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={[
        'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
        'transition-colors duration-150 disabled:opacity-60',
        className,
      ].join(' ')}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}