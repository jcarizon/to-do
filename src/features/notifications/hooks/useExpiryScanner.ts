'use client';

import { useEffect, useRef } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToast } from '@/features/notifications/store/notificationsSlice';
import { sendLocalPush } from '../utils/sendFcmPush';
import type { ToastType, UseExpiryScannerArgs } from '@/features/notifications/types';

export function useExpiryScanner({ tickets, enabled }: UseExpiryScannerArgs) {
  const dispatch = useAppDispatch();
  const pushEnabled = useAppSelector((s) => s.notifications.pushEnabled);
  const hasScanned = useRef(false);

  const getToastType = (daysLeft: number): ToastType => {
    if (daysLeft <= 0) return 'error';
    return 'warning';
  };

  const getToastMessage = (title: string, daysLeft: number): string => {
    if (daysLeft < 0) return `"${title}" is overdue by ${Math.abs(daysLeft)} day(s).`;
    if (daysLeft === 0) return `"${title}" is due today.`;
    if (daysLeft === 1) return `"${title}" expires tomorrow.`;
    return `"${title}" expires in ${daysLeft} days.`;
  };

  useEffect(() => {
    if (!enabled || hasScanned.current) return;
    const ticketList = Object.values(tickets);
    if (ticketList.length === 0) return;
    hasScanned.current = true;

    ticketList.forEach((ticket) => {
      if (!ticket.expiryDate) return;
      const daysLeft = differenceInDays(parseISO(ticket.expiryDate), new Date());
      const threshold = ticket.notifyDaysBefore ?? 3;
      if (daysLeft <= threshold) {
        const message = getToastMessage(ticket.title, daysLeft);
        const type = getToastType(daysLeft);

        dispatch(addToast({
          id: crypto.randomUUID(),
          message,
          type,
          duration: daysLeft < 0 ? 6000 : 4000,
        }));

        if (pushEnabled) {
          const pushTitle = daysLeft <= 0 ? '⚠️ Ticket Overdue' : '🔔 Ticket Expiry Alert';
          sendLocalPush(pushTitle, message);
        }
      }
    });
  }, [enabled, tickets, dispatch, pushEnabled]);
}