import { ExpiryBadgeProps } from "./types";
import { useExpiryBadge } from "./useExpiryBadge";

export function ExpiryBadge({ expiryDate, notifyDaysBefore }: ExpiryBadgeProps) {
  const { badge, formatLabel, daysLeft } = useExpiryBadge({ expiryDate, notifyDaysBefore });

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${badge}`}>
      ⏱ {formatLabel(daysLeft)}
    </span>
  );
}