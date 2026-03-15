'use client';

import { Button, Spinner } from '@/components/ui/atoms';
import { TicketCard } from '@/features/board/components/molecules';
import { TicketModal, AddCategoryModal, AddTicketModal } from '@/features/board/components/organisms';
import { useBoardPage } from '@/features/board/hooks/useBoardPage';

export function BoardTemplate() {
  const {
    user,
    handleLogout,
    board,
    loading,
    orderedColumns,
    ticketsForColumn,
    priorities,
    activeTicket,
    handleOpenTicket,
    handleCloseTicket,
    showAddCategory,
    handleOpenAddCategory,
    handleCloseAddCategory,
    handleUpdatePriorities,
    uid,
    boardId,
    handleAddColumn,
    addTicketColumnId,
    setAddTicketColumnId,
  } = useBoardPage();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center gap-3">
        <Spinner size="md" className="text-zinc-500" />
        <span className="text-sm text-zinc-500">Loading board…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">

      <header className="h-14 border-b border-zinc-800/60 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-zinc-100 tracking-tight">
            TechLint
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-sm text-zinc-400">
            {board?.title ?? 'Board'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-xs text-zinc-600 hidden sm:block">
              {user.displayName ?? user.email}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-5 p-6 h-full items-start min-w-max">

          {orderedColumns.map((column) => {
            const colTickets = ticketsForColumn(column.id);
            const sorted = [...colTickets].sort(
              (a, b) => a.priorityOrder - b.priorityOrder,
            );

            return (
              <div key={column.id} className="flex flex-col w-72 flex-shrink-0">

                <div className="flex items-center gap-2 mb-2 px-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: column.color }}
                  />
                  <h3 className="text-sm font-semibold text-zinc-300 truncate flex-1">
                    {column.title}
                  </h3>
                  <span className="text-xs text-zinc-600 font-mono">
                    {colTickets.length}
                  </span>
                </div>

                <div
                  className="h-0.5 rounded-full mb-3 opacity-50"
                  style={{ backgroundColor: column.color }}
                />

                <div className="space-y-2 min-h-[60px]">
                  {sorted.length === 0 ? (
                    <div className="border border-dashed border-zinc-800 rounded-lg p-4 text-center">
                      <p className="text-xs text-zinc-600">No tickets yet</p>
                    </div>
                  ) : (
                    sorted.map((ticket) => (
                      <TicketCard
                        key={ticket.id}
                        ticket={ticket}
                        priorities={priorities}
                        onClick={() => handleOpenTicket(ticket)}
                      />
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setAddTicketColumnId(column.id)}
                  className="mt-3 w-full text-xs text-zinc-700 hover:text-zinc-400 border border-dashed border-zinc-800 hover:border-zinc-600 rounded-lg py-2 transition-all"
                >
                  + Add ticket
                </button>

              </div>
            );
          })}

          <div className="flex-shrink-0 w-72">
            <button
              type="button"
              onClick={handleOpenAddCategory}
              className="w-full border-2 border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl py-8 text-zinc-600 hover:text-zinc-400 transition-all text-sm flex flex-col items-center gap-2"
            >
              <span className="text-2xl leading-none">+</span>
              <span>Add column</span>
            </button>
          </div>

        </div>
      </main>

      {activeTicket && (
        <TicketModal
          ticket={activeTicket}
          priorities={priorities}
          uid={uid}
          boardId={boardId}
          onClose={handleCloseTicket}
          onUpdatePriorities={handleUpdatePriorities}
        />
      )}

      {showAddCategory && (
        <AddCategoryModal
          onClose={handleCloseAddCategory}
          onSubmit={handleAddColumn}
        />
      )}

      {addTicketColumnId && (
        <AddTicketModal
          uid={uid}
          boardId={boardId}
          columnId={addTicketColumnId}
          ticketCount={ticketsForColumn(addTicketColumnId).length}
          onClose={() => setAddTicketColumnId(null)}
        />
      )}

    </div>
  );
}