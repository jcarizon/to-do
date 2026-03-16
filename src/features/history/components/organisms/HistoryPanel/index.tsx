'use client';

import { Spinner } from '@/components/ui/atoms';
import { BoardHistoryList, TicketHistoryList } from '../../molecules';
import { HistoryEventRow } from '../../atoms';
import { TicketHistoryEventRow } from '../../atoms';
import { useHistoryPanel } from './useHistoryPanel';
import { HistoryPanelProps } from './types';

export function HistoryPanel({ uid, boardId, onClose }: HistoryPanelProps) {
  const TABS = [
    { key: 'all',    label: 'All'    },
    { key: 'board',  label: 'Board'  },
    { key: 'ticket', label: 'Ticket' },
  ] as const;

  const {
    activeTab, handleTabChange,
    selectedTicketId, setSelectedTicketId,
    boardEvents, selectedTicketHistory,
    allEvents, allLoading,
    ticketList, loading,
  } = useHistoryPanel({ uid, boardId });

  const isLoading = loading || allLoading;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose} aria-hidden="true" />

      <aside className="fixed right-0 top-0 bottom-0 z-50 w-96 bg-zinc-950
        border-l border-zinc-800 flex flex-col shadow-2xl">

        <div className="flex items-center justify-between px-5 py-4
          border-b border-zinc-800 flex-shrink-0">
          <h2 className="text-sm font-semibold text-zinc-100">Activity History</h2>
          <button type="button" onClick={onClose}
            className="text-zinc-600 hover:text-zinc-300 transition-colors text-lg"
            aria-label="Close history panel">
            ✕
          </button>
        </div>

        <div className="flex border-b border-zinc-800 flex-shrink-0">
          {TABS.map(({ key, label }) => (
            <button key={key} type="button" onClick={() => handleTabChange(key)}
              className={[
                'flex-1 py-2.5 text-xs font-medium capitalize transition-colors',
                activeTab === key
                  ? 'text-zinc-100 border-b-2 border-indigo-500'
                  : 'text-zinc-500 hover:text-zinc-300',
              ].join(' ')}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'ticket' && (
          <div className="px-5 py-3 border-b border-zinc-800 flex-shrink-0">
            {ticketList.length === 0 ? (
              <p className="text-xs text-zinc-600">No tickets on this board.</p>
            ) : (
              <select value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-300
                  text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-500">
                <option value="" disabled>Select a ticket…</option>
                {ticketList.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>{ticket.title}</option>
                ))}
              </select>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2">
              <Spinner size="sm" className="text-zinc-500" />
              <span className="text-xs text-zinc-500">Loading…</span>
            </div>
          ) : activeTab === 'all' ? (
            allEvents.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-zinc-600">No activity yet.</p>
              </div>
            ) : (
              <div className="divide-y-0">
                {allEvents.map((event) =>
                  event.kind === 'board' ? (
                    <HistoryEventRow key={event.id} event={event} />
                  ) : (
                    <TicketHistoryEventRow key={event.id} event={event} />
                  )
                )}
              </div>
            )
          ) : activeTab === 'board' ? (
            <BoardHistoryList events={boardEvents} />
          ) : (
            <TicketHistoryList events={selectedTicketHistory} />
          )}
        </div>
      </aside>
    </>
  );
}