export interface Ticket {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  descriptionDraft: string | null;
  expiryDate: string | null;
  priorityId: string | null;
  priorityOrder: number;
  notifyDaysBefore: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketState {
  tickets: Record<string, Ticket>;
  loading: boolean;
  error: string | null;
}

export type TicketCreatePayload = Pick<Ticket,
  'boardId' | 'columnId' | 'title' | 'description' |
  'expiryDate' | 'priorityId' | 'notifyDaysBefore'
>;

export type TicketUpdatePayload = 
  Partial<Omit<Ticket, 'id' | 'boardId' | 'createdAt'>> & { id: string };