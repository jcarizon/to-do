import { getExpiryBorderClass } from "../../atoms";
import { TicketCardProps } from "./types";
import { useTicketDrag } from "@/features/board/hooks/useTicketDrag";

export const useTicketCard = ({ 
  ticket, 
  priorities, 
  onClick, 
  onMoveToColumn, 
  onReorderInColumn 
}: TicketCardProps) => {
  const priority = priorities.find((p) => p.id === ticket.priority) ?? null;
  const borderClass = getExpiryBorderClass(ticket.expiryDate, ticket.notifyDaysBefore);
  const hasDraft = !!ticket.descriptionDraft && ticket.descriptionDraft !== ticket.description;

  const { isDraggingThis, isDragOver, ticketDragHandlers } = useTicketDrag({
    ticketId: ticket.id,
    columnId: ticket.columnId,
    onMoveToColumn,
    onReorderInColumn,
  });

  return { priority, borderClass, hasDraft, onClick, isDraggingThis, isDragOver, ticketDragHandlers };
};