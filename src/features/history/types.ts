export interface BoardHistoryEvent {
  id: string;
  type: 'COLUMN_CREATED' | 'COLUMN_DELETED' | 'COLUMN_REORDERED' | 'TICKET_MOVED' | 'TICKET_DELETED';
  description: string;
  timestamp: string;
}

export interface TicketHistoryEvent {
  id: string;
  ticketId: string;
  field: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}

export interface HistoryState {
  boardEvents: BoardHistoryEvent[];
  ticketEvents: Record<string, TicketHistoryEvent[]>;
  loading: boolean;
}

export type AllHistoryEvent =
  | ({ kind: 'board' } & BoardHistoryEvent)
  | ({ kind: 'ticket' } & TicketHistoryEvent);