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

  // Drag and Drop Props
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export type { BoardColumnProps };