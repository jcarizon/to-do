import { getExpiryBorderClass } from "../../atoms";
import { TicketCardProps } from "./types";

export const useTicketCard = ({ ticket, priorities, onClick }: TicketCardProps) => {
  const priority = priorities.find((p) => p.id === ticket.priority) ?? null;

  const borderClass = getExpiryBorderClass(
    ticket.expiryDate,
    ticket.notifyDaysBefore
  );

  const hasDraft =
    !!ticket.descriptionDraft &&
    ticket.descriptionDraft !== ticket.description;

  return { 
    priority, 
    borderClass, 
    hasDraft,
    onClick
  };
};