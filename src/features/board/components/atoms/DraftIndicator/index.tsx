import { DraftIndicatorProps } from "./types";

export function DraftIndicator({ draft, saved }: DraftIndicatorProps) {
  if (draft === saved) return null;

  return (
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
      <span className="text-[10px] text-amber-400/80">Draft saved</span>
    </div>
  );
}