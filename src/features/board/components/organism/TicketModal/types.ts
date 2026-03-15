import { Priority, Ticket } from "@/features/tickets/types";

interface TicketModalProps {
  ticket: Ticket;
  priorities: Priority[];
  uid: string;
  boardId: string;
  onClose: () => void;
  onUpdatePriorities?: (priorities: Priority[]) => void;
}

export type { TicketModalProps };