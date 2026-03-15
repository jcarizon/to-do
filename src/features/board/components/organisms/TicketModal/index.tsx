'use client';

import { Button, Input, Label } from '@/components/ui/atoms';
import { ModalShell } from '@/components/ui/molecules';
import { DraftIndicator } from '@/features/board/components/atoms';
import { PrioritySelector } from '@/features/board/components/molecules';
import { TicketModalProps } from './types';
import { useTicketModal } from './useTicketModal';
import { formatDate } from '@/lib/utils/formatDate';

export function TicketModal({
  ticket,
  priorities,
  uid,
  boardId,
  onClose,
  onUpdatePriorities,
}: TicketModalProps) {
  const { 
    title, 
    description, 
    priority, 
    expiryDate, 
    notifyDaysBefore, 
    isSaving, 
    confirmDelete, 
    handleSave, 
    handleDelete,
    setTitle,
    setDescription,
    setPriority,
    setExpiryDate,
    setNotifyDaysBefore,
    setConfirmDelete
  } = useTicketModal({ ticket, priorities, uid, boardId, onClose, onUpdatePriorities });

  const footer = (
    <>
      {confirmDelete ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-red-400">Delete this ticket?</span>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Confirm
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirmDelete(true)}
          className="text-zinc-500 hover:text-red-400"
        >
          Delete ticket
        </Button>
      )}

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          isLoading={isSaving}
          disabled={!title.trim()}
        >
          Save
        </Button>
      </div>
    </>
  );

  return (
    <ModalShell title="Edit Ticket" onClose={onClose} footer={footer}>
      <div className="space-y-5">

        <div className="space-y-1.5">
          <Label htmlFor="ticket-title">Title</Label>
          <Input
            id="ticket-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ticket title"
            className="!bg-zinc-800 !text-zinc-100 !border-zinc-700 focus:!border-zinc-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="ticket-description">Description</Label>
            <DraftIndicator draft={description} saved={ticket.description} />
          </div>
          <textarea
            id="ticket-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Add a description…"
            className={[
              'block w-full rounded-lg border px-3.5 py-2.5 text-sm',
              'bg-zinc-800 text-zinc-100 border-zinc-700',
              'placeholder:text-zinc-600',
              'focus:outline-none focus:border-zinc-500',
              'transition-colors duration-150 resize-y',
            ].join(' ')}
          />
        </div>

        <div className="space-y-1.5">
          <Label>Priority</Label>
          <PrioritySelector
            priorities={priorities}
            selected={priority}
            onChange={setPriority}
            onUpdatePriorities={onUpdatePriorities}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="ticket-expiry">Expiry Date</Label>
            <Input
              id="ticket-expiry"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="!bg-zinc-800 !text-zinc-100 !border-zinc-700 focus:!border-zinc-500 [color-scheme:dark]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ticket-notify">Notify (days before)</Label>
            <Input
              id="ticket-notify"
              type="number"
              min={0}
              max={30}
              value={String(notifyDaysBefore)}
              onChange={(e) => setNotifyDaysBefore(Number(e.target.value))}
              className="!bg-zinc-800 !text-zinc-100 !border-zinc-700 focus:!border-zinc-500"
            />
          </div>
        </div>

        <div className="text-[10px] text-zinc-600 space-y-0.5 pt-1 border-t border-zinc-800">
          <p>Created: {formatDate(ticket.createdAt)}</p>
          {ticket.updatedAt && (
            <p>Updated: {formatDate(ticket.updatedAt)}</p>
          )}
        </div>

      </div>
    </ModalShell>
  );
}