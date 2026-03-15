interface AddTicketModalProps {
  uid: string;
  boardId: string;
  columnId: string;
  ticketCount: number;
  onClose: () => void;
}

export type { AddTicketModalProps };