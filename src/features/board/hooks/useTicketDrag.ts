import { DragEvent, useState } from 'react';
import { useDragContext } from './useDragContext';
import { UseTicketDragArgs } from '../types';

export function useTicketDrag({ ticketId, columnId, onMoveToColumn, onReorderInColumn }: UseTicketDragArgs) {
  const { dragging, setDragging } = useDragContext();
  const [isDragOver, setIsDragOver] = useState(false);

  const isDraggingThis = dragging?.type === 'ticket' && dragging.ticketId === ticketId;

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('type', 'ticket');
    event.dataTransfer.setData('ticketId', ticketId);
    event.dataTransfer.setData('sourceColumnId', columnId);
    setDragging({ type: 'ticket', ticketId, sourceColumnId: columnId });
  }

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (dragging?.type !== 'ticket' || dragging.ticketId === ticketId) return;
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsDragOver(false);
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const type = event.dataTransfer.getData('type');
    const draggedId = event.dataTransfer.getData('ticketId');
    const srcColumnId = event.dataTransfer.getData('sourceColumnId');
    if (type !== 'ticket' || draggedId === ticketId) return;
    if (srcColumnId === columnId) {
      onReorderInColumn(draggedId, ticketId, columnId);
    } else {
      onMoveToColumn(draggedId, columnId);
    }
  }

  const onDragEnd = () => {
    setDragging(null);
    setIsDragOver(false);
  }

  return {
    isDraggingThis,
    isDragOver,
    ticketDragHandlers: { draggable: true as const, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd },
  };
}