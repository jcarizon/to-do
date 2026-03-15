import { PriorityBadgeProps } from "./types";

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
      style={{
        backgroundColor: priority.color + "22",
        color: priority.color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: priority.color }}
      />
      {priority.label}
    </span>
  );
}