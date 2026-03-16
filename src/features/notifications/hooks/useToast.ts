'use client';
 
import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addToast, removeToast } from '@/features/notifications/store/notificationsSlice';
import type { ToastType } from '@/features/notifications/types';
 
export function useToast() {
  const dispatch = useAppDispatch();
 
  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      dispatch(addToast({ id: crypto.randomUUID(), message, type, duration }));
    },
    [dispatch],
  );
 
  const dismiss = useCallback(
    (id: string) => { dispatch(removeToast(id)); },
    [dispatch],
  );
 
  return { toast, dismiss };
}

