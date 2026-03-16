import { DropIndicatorProps } from "./types";

export function DropIndicator({ visible, axis }: DropIndicatorProps) {
  if (!visible) return null;
  if (axis === 'horizontal') {
    return (
      <div className="absolute inset-y-0 -left-[2px] w-[3px] rounded-full bg-indigo-400 z-10 pointer-events-none" />
    );
  }
  return <div className="h-[3px] w-full rounded-full bg-indigo-400 my-0.5 pointer-events-none" />;
}