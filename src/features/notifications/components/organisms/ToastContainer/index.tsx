'use client';
 
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeToast } from '@/features/notifications/store/notificationsSlice';
import { ToastItem } from '../../atoms';
 
export function ToastContainer() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.notifications.toasts);
 
  if (toasts.length === 0) return null;
 
  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={(id) => dispatch(removeToast(id))}
        />
      ))}
    </div>
  );
}

