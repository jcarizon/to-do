import { differenceInDays, parseISO } from "date-fns";
import { ExpiryBadgeProps, UrgencyLevel } from "./types";

const URGENCY_STYLES: Record<UrgencyLevel, { badge: string; border: string }> = {
  safe:     { badge: "bg-zinc-700/50 text-zinc-400",    border: "border-zinc-700" },
  warning:  { badge: "bg-green-500/20 text-green-400",  border: "border-green-600" },
  urgent:   { badge: "bg-yellow-500/20 text-yellow-400",border: "border-yellow-500" },
  critical: { badge: "bg-orange-500/20 text-orange-400",border: "border-orange-500" },
  overdue:  { badge: "bg-red-500/20 text-red-400",      border: "border-red-500" },
};

const getUrgency = (daysLeft: number, notifyDaysBefore: number): UrgencyLevel => {
  if (daysLeft < 0) return "overdue";
  if (daysLeft === 0) return "critical";
  if (daysLeft <= 1) return "critical";
  if (daysLeft <= 3) return "urgent";
  if (daysLeft <= notifyDaysBefore) return "warning";
  return "safe";
}

export const useExpiryBadge = ({ expiryDate, notifyDaysBefore } : ExpiryBadgeProps) => {
  const formatLabel = (daysLeft: number): string => {
    if (daysLeft < 0) return "Overdue";
    if (daysLeft === 0) return "Due today";
    return `${daysLeft}d left`;
  }

  const daysLeft = differenceInDays(parseISO(expiryDate), new Date());
  const urgency = getUrgency(daysLeft, notifyDaysBefore);
  const { badge } = URGENCY_STYLES[urgency];

  return { 
    getUrgency, 
    URGENCY_STYLES, 
    formatLabel,
    badge,
    daysLeft
  };
};

export const getExpiryBorderClass = (
  expiryDate: string | null,
  notifyDaysBefore: number
): string => {
  if (!expiryDate) return "border-zinc-700";
  const daysLeft = differenceInDays(parseISO(expiryDate), new Date());
  return URGENCY_STYLES[getUrgency(daysLeft, notifyDaysBefore)].border;
}