import { Toast } from '@/features/notifications/types';
 
export interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

