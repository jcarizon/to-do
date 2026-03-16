'use client';

import { Button, Input } from '@/components/ui/atoms';
import { TicketCard } from '@/features/board/components/molecules';
import { DropIndicator } from '@/features/board/components/atoms';
import { BoardColumnProps } from './types';
import { useBoardColumn } from './useBoardColumn';

export function BoardColumn({
  column, tickets, priorities, uid, boardId, columnOrder,
  onOpenTicket, onAddTicket, onColumnReorder, onTicketMove, onTicketReorder,
}: BoardColumnProps) {
  const {
    sorted, liveTitle, inputRef,
    menuOpen, setMenuOpen, confirmDelete, 
    setConfirmDelete, closeMenu, isRenaming, 
    renameValue, setRenameValue, startRename, 
    commitRename, cancelRename, handleDelete,
    isDraggingThis, isColumnDragOver, columnDragHandlers,
    isTicketDragOver, onColumnTicketDragOver, onColumnTicketDragLeave, 
    onColumnTicketDrop,
  } = useBoardColumn({ 
    column, tickets, priorities, 
    uid, boardId, columnOrder, 
    onOpenTicket, onAddTicket, onColumnReorder, 
    onTicketMove, onTicketReorder 
  });

  const hasTickets = tickets.length > 0;

  return (
    <div
      className="relative flex flex-col w-72 flex-shrink-0"
      draggable
      {...columnDragHandlers}
    >
      <DropIndicator axis="horizontal" visible={isColumnDragOver} />

      <div className={[
        "flex flex-col w-full transition-opacity duration-150",
        isDraggingThis ? "opacity-40" : "opacity-100",
      ].join(" ")}>

        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: column.color }} />

          {isRenaming ? (
            <Input
              ref={inputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') cancelRename(); }}
              className="flex-1 !bg-zinc-800 !text-zinc-100 !border-zinc-600 focus:!border-zinc-400 !py-0.5 !px-2 text-sm font-semibold"
            />
          ) : (
            <h3
              className="text-sm font-semibold text-zinc-300 truncate flex-1 cursor-pointer hover:text-white transition-colors"
              onDoubleClick={startRename}
              title="Double-click to rename"
            >
              {liveTitle}
            </h3>
          )}

          <span className="text-xs text-zinc-600 font-mono flex-shrink-0">{tickets.length}</span>

          <div className="relative flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={() => setMenuOpen((v) => !v)} className="!px-1.5 !py-0.5 text-zinc-600 hover:text-zinc-300" aria-label="Column options">
              ⋯
            </Button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={closeMenu} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 w-44">
                  <button type="button" onClick={() => { onAddTicket(column.id); closeMenu(); }} className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors">
                    + Add ticket
                  </button>
                  <button type="button" onClick={startRename} className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors">
                    Rename column
                  </button>
                  <div className="my-1 border-t border-zinc-700" />

                  {hasTickets ? (
                    <div className="px-3 py-2">
                      <p className="text-[10px] text-zinc-500 leading-snug">
                        Move or delete all {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} before deleting this column.
                      </p>
                    </div>
                  ) : !confirmDelete ? (
                    <button type="button" onClick={() => setConfirmDelete(true)} className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-zinc-700 transition-colors">
                      Delete column
                    </button>
                  ) : (
                    <div className="px-3 py-2 space-y-2">
                      <p className="text-[10px] text-zinc-500 leading-snug">Delete this column? This cannot be undone.</p>
                      <div className="flex gap-2">
                        <Button variant="danger" size="sm" onClick={handleDelete}>Confirm</Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="h-0.5 rounded-full mb-3 opacity-50" style={{ backgroundColor: column.color }} />

        <div
          className={[
            "flex-1 space-y-2 min-h-[60px] rounded-lg transition-colors",
            isTicketDragOver ? "bg-indigo-400/5 ring-1 ring-indigo-400/30" : "",
          ].join(" ")}
          onDragOver={onColumnTicketDragOver}
          onDragLeave={onColumnTicketDragLeave}
          onDrop={onColumnTicketDrop}
        >
          {sorted.length === 0 ? (
            <div className={[
              "border border-dashed rounded-lg p-4 text-center transition-colors",
              isTicketDragOver ? "border-indigo-400/50" : "border-zinc-800",
            ].join(" ")}>
              <p className="text-xs text-zinc-600">No tickets yet</p>
            </div>
          ) : (
            sorted.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                priorities={priorities}
                onClick={() => onOpenTicket(ticket)}
                onMoveToColumn={onTicketMove}
                onReorderInColumn={onTicketReorder}
              />
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => onAddTicket(column.id)}
          className="mt-3 w-full text-xs text-zinc-700 hover:text-zinc-400 border border-dashed border-zinc-800 hover:border-zinc-600 rounded-lg py-2 transition-all"
        >
          + Add ticket
        </button>
      </div>
    </div>
  );
}