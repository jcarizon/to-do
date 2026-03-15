'use client';

import { Button, Input, Label } from '@/components/ui/atoms';
import { ModalShell } from '@/components/ui/molecules';
import { AddTicketModalProps } from './types';
import { useAddTicketModal } from './useAddTicketModal';

export function AddTicketModal({
  uid,
  boardId,
  columnId,
  ticketCount,
  onClose,
}: AddTicketModalProps) {
  const { title, setTitle, isSubmitting, handleSubmit } = useAddTicketModal({
    uid,
    boardId,
    columnId,
    ticketCount,
    onClose,
  });
  
  const footer = (
    <>
      <span />
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={!title.trim()}
        >
          Add ticket
        </Button>
      </div>
    </>
  );

  return (
    <ModalShell
      title="New Ticket"
      onClose={onClose}
      footer={footer}
      maxWidth="max-w-sm"
    >
      <div className="space-y-4">

        <div className="space-y-1.5">
          <Label htmlFor="ticket-title">Title</Label>
          <Input
            id="ticket-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="What needs to be done?"
            className="!bg-zinc-800 !text-zinc-100 !border-zinc-700 focus:!border-zinc-500"
          />
        </div>

        <p className="text-xs text-zinc-600">
          Press Enter or click Add ticket. Edit full details afterwards.
        </p>

      </div>
    </ModalShell>
  );
}