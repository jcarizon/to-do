import { Priority } from "../tickets/types";

export interface Column {
  id: string;
  boardId: string;
  title: string;
  color: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Board {
  id: string;
  uid: string;
  title: string;
  columnOrder: string[];
  priorities?: Priority[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardState {
  board: Board | null;
  columns: Record<string, Column>;
  loading: boolean;
  error: string | null;
}

export type DragPayload =
  | { type: 'column'; columnId: string }
  | { type: 'ticket'; ticketId: string; sourceColumnId: string };

export interface DragContextValue {
  dragging: DragPayload | null;
  setDragging: (payload: DragPayload | null) => void;
}

export interface UseColumnDragArgs {
  columnId: string;
  onReorder: (draggedId: string, targetId: string) => void;
}

export interface UseTicketDragArgs {
  ticketId: string;
  columnId: string;
  onMoveToColumn: (ticketId: string, targetColumnId: string) => void;
  onReorderInColumn: (draggedId: string, targetId: string, columnId: string) => void;
}