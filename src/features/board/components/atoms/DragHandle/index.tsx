import { DragHandleProps } from "./types";

export function DragHandle({ className = '' }: DragHandleProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex flex-col gap-[3px] cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex gap-[3px]">
          <span className="w-[3px] h-[3px] rounded-full bg-zinc-500" />
          <span className="w-[3px] h-[3px] rounded-full bg-zinc-500" />
        </span>
      ))}
    </span>
  );
}