export type DragType = 'column' | 'ticket';

export interface ColumnDragItem {
  type: 'column';
  columnId: string;
}

export interface TicketDragItem {
  type: 'ticket';
  ticketId: string;
  sourceColumnId: string;
}

export type DragItem = ColumnDragItem | TicketDragItem;

export interface DragState {
  item: DragItem | null;
  draggedColumnId: string | null;
  overColumnId: string | null;
  draggedTicketId: string | null;
  overTicketId: string | null;
  overColumnDropId: string | null;
}