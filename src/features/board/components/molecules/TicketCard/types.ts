import { Priority, Ticket } from "@/features/tickets/types";

interface TicketCardProps {
  ticket: Ticket;
  priorities: Priority[];
  onClick: () => void;
  onMoveToColumn: (ticketId: string, targetColumnId: string) => void;
  onReorderInColumn: (draggedId: string, targetId: string, columnId: string) => void;
}

export type { TicketCardProps };