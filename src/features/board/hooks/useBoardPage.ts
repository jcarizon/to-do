'use client';

import { useMemo, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useAppDispatch } from '@/store/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useBoard } from '@/features/board/hooks/useBoard';
import { logoutUser } from '@/features/auth/store/authSlice';
import { addColumn, reorderColumnsOptimistic, reorderColumns } from '@/features/board/store/boardSlice';
import { editTicket, moveTicketOptimistic, reorderTicketPriorityOptimistic } from '@/features/tickets/store/ticketsSlice';
import { appendBoardEvent } from '@/features/history/store/historySlice';
import { db } from '@/lib/firebase/firebase';
import type { Board, Column } from '@/features/board/types';
import type { Ticket, Priority } from '@/features/tickets/types';
import type { DragPayload } from '@/features/board/types';

export function useBoardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { board, columns, tickets, loading, error, uid, boardId } = useBoard();

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addTicketColumnId, setAddTicketColumnId] = useState<string | null>(null);

  const [dragging, setDragging] = useState<DragPayload | null>(null);

  const priorities: Priority[] = board?.priorities ?? [];

  const orderedColumns = (board?.columnOrder ?? [])
    .map((id) => columns[id])
    .filter((col): col is Column => col !== undefined);

  const ticketsForColumn = (columnId: string): Ticket[] =>
    Object.values(tickets).filter((t) => t.columnId === columnId);

  const handleColumnReorder = (draggedId: string, targetId: string) => {
    if (!board) return;
    const order = board.columnOrder;
    const from = order.indexOf(draggedId);
    const to = order.indexOf(targetId);

    if (from === -1 || to === -1 || from === to) return;

    const next = [...order];
    next.splice(from, 1);
    next.splice(to, 0, draggedId);
    
    dispatch(reorderColumnsOptimistic(next));
    dispatch(reorderColumns({ uid, boardId, columnOrder: next }));
    dispatch(appendBoardEvent({ id: crypto.randomUUID(), type: 'COLUMN_REORDERED', description: 'Columns reordered.', timestamp: new Date().toISOString() }));
  };

  const handleTicketMove = (ticketId: string, targetColumnId: string) => {
    const ticket = tickets[ticketId];
    if (!ticket || ticket.columnId === targetColumnId) return;
    dispatch(moveTicketOptimistic({ ticketId, columnId: targetColumnId }));
    dispatch(editTicket({ uid, boardId, ticketId, changes: { columnId: targetColumnId } }));
    dispatch(appendBoardEvent({ id: crypto.randomUUID(), type: 'TICKET_MOVED', description: `"${ticket.title}" moved to ${columns[targetColumnId]?.title ?? targetColumnId}.`, timestamp: new Date().toISOString() }));
  };

  const handleTicketReorder = (draggedId: string, targetId: string, columnId: string) => {
    const columnTickets = Object.values(tickets)
      .filter((t) => t.columnId === columnId)
      .sort((a, b) => a.priorityOrder - b.priorityOrder);
    const from = columnTickets.findIndex((t) => t.id === draggedId);
    const to = columnTickets.findIndex((t) => t.id === targetId);

    if (from === -1 || to === -1 || from === to) return;

    const reordered = [...columnTickets];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    reordered.forEach((ticket, idx) => {
      if (ticket.priorityOrder !== idx) {
        dispatch(reorderTicketPriorityOptimistic({ ticketId: ticket.id, priorityOrder: idx }));
        dispatch(editTicket({ uid, boardId, ticketId: ticket.id, changes: { priorityOrder: idx } }));
      }
    });
  };

  const handleLogout = () => dispatch(logoutUser());
  const handleOpenTicket = (ticket: Ticket) => setActiveTicket(ticket);
  const handleCloseTicket = () => setActiveTicket(null);
  const handleOpenAddCategory = () => setShowAddCategory(true);
  const handleCloseAddCategory = () => setShowAddCategory(false);

  const handleUpdatePriorities = async (updated: Priority[]) => {
    if (!uid || !boardId || !board) return;
    await updateDoc(doc(db, 'users', uid, 'boards', boardId), { priorities: updated });
    dispatch({ type: 'board/setBoard', payload: { ...board, priorities: updated } as Board });
  };

  const handleAddColumn = async (title: string, color: string) => {
    await dispatch(addColumn({ 
      uid, 
      boardId, 
      title, 
      color, 
      columnOrder: board?.columnOrder ?? [] 
    }));

    dispatch(appendBoardEvent({ 
      id: crypto.randomUUID(), 
      type: 'COLUMN_CREATED', 
      description: `Column "${title}" was created.`, 
      timestamp: new Date().toISOString() 
    }));
  };

  const dragContextValue = useMemo(() => ({ dragging, setDragging }), [dragging]);

  return {
    user, handleLogout,
    board, loading, error, uid, boardId,
    orderedColumns, ticketsForColumn, priorities,
    activeTicket, handleOpenTicket, handleCloseTicket,
    showAddCategory, handleOpenAddCategory, handleCloseAddCategory,
    addTicketColumnId, setAddTicketColumnId,
    handleUpdatePriorities, handleAddColumn,
    // DnD
    dragContextValue,
    handleColumnReorder, handleTicketMove, handleTicketReorder,
  };
}