interface ExpiryBadgeProps {
  expiryDate: string;
  notifyDaysBefore: number;
  daysLeft?: number;
}

type UrgencyLevel = "safe" | "warning" | "urgent" | "critical" | "overdue";

export type { ExpiryBadgeProps, UrgencyLevel };