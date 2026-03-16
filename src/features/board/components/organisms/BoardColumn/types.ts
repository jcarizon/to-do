import { Column } from "@/features/board/types";
import { Priority, Ticket } from "@/features/tickets/types";

interface BoardColumnProps {
  column: Column;
  tickets: Ticket[];
  priorities: Priority[];
  uid: string;
  boardId: string;
  columnOrder: string[];
  onOpenTicket: (ticket: Ticket) => void;
  onAddTicket: (columnId: string) => void;
  onColumnReorder: (draggedId: string, targetId: string) => void;
  onTicketMove: (ticketId: string, targetColumnId: string) => void;
  onTicketReorder: (draggedId: string, targetId: string, columnId: string) => void;
}

export type { BoardColumnProps };