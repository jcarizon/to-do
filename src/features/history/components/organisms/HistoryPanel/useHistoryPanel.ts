'use client';
 
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadBoardHistory, loadTicketHistory } from '@/features/history/store/historySlice';
import { HistoryTab, UseHistoryPanelArgs } from './types';
 
export function useHistoryPanel({ uid, boardId }: UseHistoryPanelArgs) {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<HistoryTab>('board');
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
 
  const boardEvents = useAppSelector((state) => state.history.boardEvents);
  const ticketEvents = useAppSelector((state) => state.history.ticketEvents);
  const tickets = useAppSelector((state) => state.tickets.tickets);
  const loading = useAppSelector((state) => state.history.loading);
 
  const ticketList = Object.values(tickets).sort((a, b) => a.title.localeCompare(b.title));
 
  useEffect(() => {
    if (!uid || !boardId) return;
    dispatch(loadBoardHistory({ uid, boardId }));
  }, [uid, boardId, dispatch]);
 
  useEffect(() => {
    if (!selectedTicketId || !uid || !boardId) return;
    if (ticketEvents[selectedTicketId]) return;
    dispatch(loadTicketHistory({ uid, boardId, ticketId: selectedTicketId }));
  }, [selectedTicketId, uid, boardId, ticketEvents, dispatch]);
 
  const handleTabChange = (tab: HistoryTab) => {
    setActiveTab(tab);
    if (tab === 'ticket' && !selectedTicketId && ticketList.length > 0) {
      setSelectedTicketId(ticketList[0].id);
    }
  };
 
  const selectedTicketHistory = selectedTicketId
    ? (ticketEvents[selectedTicketId] ?? [])
    : [];
 
  return {
    activeTab, 
    handleTabChange,
    selectedTicketId, 
    setSelectedTicketId,
    boardEvents, 
    selectedTicketHistory,
    ticketList, 
    loading,
  };
}

