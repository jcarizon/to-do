export type Priority = {
  id: string;
  label: string;
  color: string;
  order: number;
};

export interface Ticket {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string;
  descriptionDraft: string;
  expiryDate: string | null;
  priority: string | null;
  priorityOrder: number;
  notifyDaysBefore: number;
  createdAt: string;
  updatedAt: string;
}

export interface TicketsState {
  tickets: Record<string, Ticket>;
  loading: boolean;
  error: string | null;
}