'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadBoardHistory, loadTicketHistory } from '@/features/history/store/historySlice';
import type { AllHistoryEvent } from '@/features/history/types';
import { HistoryTab, UseHistoryPanelArgs } from './types';

export function useHistoryPanel({ uid, boardId }: UseHistoryPanelArgs) {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<HistoryTab>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [allLoading, setAllLoading] = useState(false);

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
    if (activeTab !== 'all' || !uid || !boardId || ticketList.length === 0) return;

    const unloaded = ticketList.filter((t) => !ticketEvents[t.id]);
    if (unloaded.length === 0) return;

    setAllLoading(true);
    Promise.all(
      unloaded.map((t) => dispatch(loadTicketHistory({ uid, boardId, ticketId: t.id })))
    ).finally(() => setAllLoading(false));
  }, [activeTab, uid, boardId, ticketList.length]);

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

  const allEvents: AllHistoryEvent[] = [
    ...boardEvents.map((e) => ({ kind: 'board' as const, ...e })),
    ...Object.values(ticketEvents)
      .flat()
      .map((e) => ({ kind: 'ticket' as const, ...e })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    activeTab,
    handleTabChange,
    selectedTicketId,
    setSelectedTicketId,
    boardEvents,
    selectedTicketHistory,
    allEvents,
    allLoading,
    ticketList,
    loading,
  };
}