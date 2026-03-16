import { Ticket } from "../tickets/types";

export type ToastType = 'info' | 'warning' | 'error' | 'success';
 
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}
 
export interface NotificationsState {
  toasts: Toast[];
}
 
export interface UseExpiryScannerArgs {
  tickets: Record<string, Ticket>;
  enabled: boolean;
}