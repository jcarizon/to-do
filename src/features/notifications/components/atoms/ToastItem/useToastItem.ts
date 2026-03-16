import { useEffect, useState } from "react";
import { ToastItemProps } from "./types";

export const useToastItem = ({ toast, onDismiss }: ToastItemProps) => {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const duration = toast.duration ?? 4000;

  const TYPE_STYLES = {
    info:    { bar: 'bg-indigo-500', icon: 'ℹ', text: 'text-indigo-400' },
    success: { bar: 'bg-green-500',  icon: '✓', text: 'text-green-400'  },
    warning: { bar: 'bg-yellow-500', icon: '⚠', text: 'text-yellow-400' },
    error:   { bar: 'bg-red-500',    icon: '✕', text: 'text-red-400'    },
  };

  const styles = TYPE_STYLES[toast.type];
 
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);
 
  useEffect(() => {
    const t = setTimeout(() => handleDismiss(), duration);
    return () => clearTimeout(t);
  }, [duration]);
 
  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  return { 
    visible, 
    leaving, 
    duration, 
    styles, 
    handleDismiss 
  };
};