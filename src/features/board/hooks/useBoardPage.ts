'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useAppDispatch } from '@/store/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useBoard } from '@/features/board/hooks/useBoard';
import { logoutUser } from '@/features/auth/store/authSlice';
import { addColumn } from '@/features/board/store/boardSlice';
import { appendBoardEvent } from '@/features/history/store/historySlice';
import { db } from '@/lib/firebase/firebase';
import type { Board, Column } from '@/features/board/types';
import type { Ticket, Priority } from '@/features/tickets/types';

export function useBoardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { board, columns, tickets, loading, error, uid, boardId } = useBoard();

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addTicketColumnId, setAddTicketColumnId] = useState<string | null>(null);

  const priorities: Priority[] = board?.priorities ?? [];

  const orderedColumns = (board?.columnOrder ?? [])
    .map((id) => columns[id])
    .filter((col): col is Column => col !== undefined);

  const ticketsForColumn = (columnId: string): Ticket[] =>
    Object.values(tickets).filter((t) => t.columnId === columnId);

  const handleLogout = () => dispatch(logoutUser());

  const handleOpenTicket = (ticket: Ticket) => setActiveTicket(ticket);
  const handleCloseTicket = () => setActiveTicket(null);

  const handleOpenAddCategory = () => setShowAddCategory(true);
  const handleCloseAddCategory = () => setShowAddCategory(false);

  const handleUpdatePriorities = async (updated: Priority[]) => {
    if (!uid || !boardId || !board) return;
    await updateDoc(doc(db, 'users', uid, 'boards', boardId), {
      priorities: updated,
    });
    const updatedBoard: Board = { ...board, priorities: updated };
    dispatch({ type: 'board/setBoard', payload: updatedBoard });
  };

  const handleAddColumn = async (title: string, color: string) => {
    await dispatch(
      addColumn({
        uid,
        boardId,
        title,
        color,
        columnOrder: board?.columnOrder ?? [],
      }),
    );
    dispatch(
      appendBoardEvent({
        id: crypto.randomUUID(),
        type: 'COLUMN_CREATED',
        description: `Column "${title}" was created.`,
        timestamp: new Date().toISOString(),
      }),
    );
  };

  return {
    user,
    handleLogout,
    board,
    loading,
    error,
    uid,
    boardId,
    orderedColumns,
    ticketsForColumn,
    priorities,
    activeTicket,
    handleOpenTicket,
    handleCloseTicket,
    showAddCategory,
    handleOpenAddCategory,
    handleCloseAddCategory,
    addTicketColumnId,
    setAddTicketColumnId,
    handleUpdatePriorities,
    handleAddColumn,
  };
}