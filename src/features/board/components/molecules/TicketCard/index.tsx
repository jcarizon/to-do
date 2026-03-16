import { PriorityBadge, ExpiryBadge, DraftIndicator, DropIndicator } from "@/features/board/components/atoms";
import { TicketCardProps } from "./types";
import { useTicketCard } from "./useTicketCard";

export function TicketCard({ 
  ticket, 
  priorities, 
  onClick, 
  onMoveToColumn, 
  onReorderInColumn 
}: TicketCardProps) {
  const { 
    priority, 
    borderClass, 
    hasDraft, 
    isDraggingThis, 
    isDragOver, 
    ticketDragHandlers 
  } = useTicketCard({
    ticket, priorities, onClick, onMoveToColumn, onReorderInColumn,
  });

  return (
    <div className="relative">
      <DropIndicator axis="vertical" visible={isDragOver} />
      <div
        {...ticketDragHandlers}
        onClick={isDraggingThis ? undefined : onClick}
        className={[
          "w-full text-left bg-zinc-800 rounded-lg p-3",
          `border-l-2 ${borderClass}`,
          "hover:brightness-110 transition-all cursor-pointer",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500",
          "group",
          isDraggingThis ? "opacity-40 scale-[0.98]" : "opacity-100",
        ].join(" ")}
      >
        <p className="text-sm text-zinc-200 font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {ticket.title}
        </p>

        {(priority || ticket.expiryDate) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {priority && <PriorityBadge priority={priority} />}
            {ticket.expiryDate && (
              <ExpiryBadge expiryDate={ticket.expiryDate} notifyDaysBefore={ticket.notifyDaysBefore} />
            )}
          </div>
        )}

        {hasDraft && (
          <div className="mt-1.5">
            <DraftIndicator draft={ticket.descriptionDraft} saved={ticket.description} />
          </div>
        )}
      </div>
    </div>
  );
}