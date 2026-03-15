import { ReactNode } from "react";

interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

export type { ModalShellProps };