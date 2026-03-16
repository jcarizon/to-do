import { DragEvent, useState } from 'react';
import { useDragContext } from './useDragContext';
import { UseColumnDragArgs } from '../types';

export function useColumnDrag({ columnId, onReorder }: UseColumnDragArgs) {
  const { dragging, setDragging } = useDragContext();
  const [isDragOver, setIsDragOver] = useState(false);

  const isDraggingThis = dragging?.type === 'column' && dragging.columnId === columnId;

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('type', 'column');
    event.dataTransfer.setData('columnId', columnId);
    setDragging({ type: 'column', columnId });
  }

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (dragging?.type !== 'column' || dragging.columnId === columnId) return;
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  }

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) setIsDragOver(false);
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const type = event.dataTransfer.getData('type');
    const draggedId = event.dataTransfer.getData('columnId');
    if (type !== 'column' || draggedId === columnId) return;
    onReorder(draggedId, columnId);
  }

  const onDragEnd = () => {
    setDragging(null);
    setIsDragOver(false);
  }

  return { 
    isDraggingThis, 
    isDragOver, 
    columnDragHandlers: { 
      onDragStart, 
      onDragOver, 
      onDragLeave, 
      onDrop, 
      onDragEnd 
    } 
  };
}