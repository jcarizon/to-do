import { DragHandleProps } from "./types";


export function DragHandle({ className = '' }: DragHandleProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex flex-col gap-[3px] cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="block w-3 h-[2px] rounded-full bg-zinc-500 group-hover:bg-zinc-400 transition-colors"
        />
      ))}
    </span>
  );
}