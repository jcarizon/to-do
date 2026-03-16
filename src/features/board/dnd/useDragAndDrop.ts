import { useState, useCallback } from 'react';
import { DragState, DragType } from './types';

const initialState: DragState = {
  item: null,
  draggedColumnId: null,
  overColumnId: null,
  draggedTicketId: null,
  overTicketId: null,
  overColumnDropId: null,
};

export function useDragAndDrop() {
  const [dragState, setDragState] = useState<DragState>(initialState);

  const startColumnDrag = useCallback((columnId: string) => {
    setDragState(prev => ({
      ...prev,
      item: { type: 'column', columnId },
      draggedColumnId: columnId,
    }));
  }, []);

  const startTicketDrag = useCallback(
    (ticketId: string, sourceColumnId: string) => {
      setDragState(prev => ({
        ...prev,
        item: { type: 'ticket', ticketId, sourceColumnId },
        draggedTicketId: ticketId,
      }));
    },
    [],
  );

  const setOverColumn = useCallback((columnId: string | null) => {
    setDragState(prev => ({ ...prev, overColumnId: columnId }));
  }, []);

  const setOverTicket = useCallback((ticketId: string | null) => {
    setDragState(prev => ({ ...prev, overTicketId: ticketId }));
  }, []);

  const setOverColumnDrop = useCallback((columnId: string | null) => {
    setDragState(prev => ({ ...prev, overColumnDropId: columnId }));
  }, []);

  const resetDrag = useCallback(() => {
    setDragState(initialState);
  }, []);

  return {
    dragState,
    startColumnDrag,
    startTicketDrag,
    setOverColumn,
    setOverTicket,
    setOverColumnDrop,
    resetDrag,
  };
}