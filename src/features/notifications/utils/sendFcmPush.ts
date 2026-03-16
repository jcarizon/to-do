import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from '@/lib/firebase/firebase';

export const FCM_VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? '';

export async function requestFcmToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const token = await getToken(messaging, { vapidKey: FCM_VAPID_KEY });
    return token ?? null;
  } catch {
    return null;
  }
}

export function sendLocalPush(title: string, body: string): void {
  if (typeof window === 'undefined') return;
  if (Notification.permission !== 'granted') return;

  new Notification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'techlint-expiry',
  });
}

export function onForegroundMessage(
  handler: (payload: { title?: string; body?: string }) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};

  try {
    const messaging = getMessaging(app);
    const unsubscribe = onMessage(messaging, (payload) => {
      handler({
        title: payload.notification?.title,
        body: payload.notification?.body,
      });
    });
    return unsubscribe;
  } catch {
    return () => {};
  }
}