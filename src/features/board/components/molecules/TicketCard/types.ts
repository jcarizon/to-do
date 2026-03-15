import { Priority, Ticket } from "@/features/tickets/types";

interface TicketCardProps {
  ticket: Ticket;
  priorities: Priority[];
  onClick: () => void;
}

export type { TicketCardProps };