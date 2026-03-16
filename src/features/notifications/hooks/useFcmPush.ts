'use client';

import { useCallback, useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { requestFcmToken, onForegroundMessage } from '../utils/sendFcmPush';
import { useToast } from './useToast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setPushEnabled,
  togglePush,
  readPushEnabled,
  PUSH_ENABLED_KEY,
} from '../store/notificationsSlice';

export type PushPermissionStatus = 'default' | 'granted' | 'denied' | 'unsupported';

interface UseFcmPushReturn {
  permissionStatus: PushPermissionStatus;
  fcmToken: string | null;
  pushEnabled: boolean;
  requestPermission: () => Promise<void>;
  handleTogglePush: () => void;
}

export function useFcmPush(uid: string | null): UseFcmPushReturn {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const pushEnabled = useAppSelector((s) => s.notifications.pushEnabled);

  const [permissionStatus, setPermissionStatus] = useState<PushPermissionStatus>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermissionStatus('unsupported');
      return;
    }

    const real = Notification.permission as PushPermissionStatus;
    setPermissionStatus(real);

    dispatch(setPushEnabled(readPushEnabled()));

    if (real === 'granted' && uid) {
      requestFcmToken().then((token) => {
        if (token) {
          setFcmToken(token);
          persistToken(uid, token);
        }
      });
    }
  }, [uid, dispatch]);

  useEffect(() => {
    if (permissionStatus !== 'granted' || !pushEnabled) return;
    const unsubscribe = onForegroundMessage(({ title, body }) => {
      if (body) toast(`${title ? `${title}: ` : ''}${body}`, 'warning', 5000);
    });
    return unsubscribe;
  }, [permissionStatus, pushEnabled, toast]);

  const requestPermission = useCallback(async () => {
    if (!uid) return;
    const token = await requestFcmToken();

    if (token) {
      setFcmToken(token);
      setPermissionStatus('granted');
      dispatch(setPushEnabled(true));
      localStorage.setItem(PUSH_ENABLED_KEY, 'true');
      await persistToken(uid, token);
      toast('Push notifications enabled.', 'success');
    } else {
      const current = Notification.permission as PushPermissionStatus;
      setPermissionStatus(current === 'denied' ? 'denied' : 'default');
      if (current === 'denied') {
        toast('Notifications blocked. Enable them in browser settings.', 'error', 6000);
      }
    }
  }, [uid, toast, dispatch]);

  const handleTogglePush = useCallback(() => {
    const next = !pushEnabled;
    dispatch(togglePush());
    localStorage.setItem(PUSH_ENABLED_KEY, String(next));
    toast(next ? 'Push notifications on.' : 'Push notifications off.', 'info', 2500);
  }, [pushEnabled, dispatch, toast]);

  return { permissionStatus, fcmToken, pushEnabled, requestPermission, handleTogglePush };
}

async function persistToken(uid: string, token: string): Promise<void> {
  try {
    const ref = doc(db, 'users', uid, 'fcmTokens', token);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        token,
        createdAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
      });
    }
  } catch (error) {
    console.error('Error saving FCM token to Firestore:', error);
  }
}