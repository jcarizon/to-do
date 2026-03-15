'use client';

import { Button, Spinner } from '@/components/ui/atoms';
import { 
  TicketModal, 
  AddCategoryModal, 
  AddTicketModal,
  BoardColumn
 } from '@/features/board/components/organisms';
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
    dnd,
    handleColumnDrop,
  } = useBoardPage();

  const { dragState, startColumnDrag, setOverColumn, resetDrag } = dnd;

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
          {orderedColumns.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tickets={ticketsForColumn(column.id)}
              priorities={priorities}
              uid={uid}
              boardId={boardId}
              columnOrder={board?.columnOrder ?? []}
              onOpenTicket={handleOpenTicket}
              onAddTicket={setAddTicketColumnId}

              isDragging={dragState.draggedColumnId === column.id}
              isDropTarget={
                dragState.draggedColumnId !== null &&
                dragState.draggedColumnId !== column.id &&
                dragState.overColumnId === column.id
              }
              onDragStart={e => {
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('type', 'column');
                e.dataTransfer.setData('columnId', column.id);
                startColumnDrag(column.id);
              }}
              onDragOver={e => {
                e.preventDefault();
                if (dragState.draggedColumnId && dragState.draggedColumnId !== column.id) {
                  setOverColumn(column.id);
                }
              }}
              onDragLeave={() => setOverColumn(null)}
              onDrop={e => {
                e.preventDefault();
                handleColumnDrop(column.id);
              }}
              onDragEnd={() => resetDrag()}
            />
          ))}

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