import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { TicketModalProps } from "./types";
import { useCallback, useEffect, useRef, useState } from "react";
import { editTicket, removeTicket, saveDraft } from "@/features/tickets/store/ticketsSlice";
import { Ticket } from "@/features/tickets/types";
import { appendBoardEvent, appendTicketEvent, loadTicketHistory } from "@/features/history/store/historySlice";
import { writeBoardEvent } from "@/features/history/utils/historyWriter";

export const useTicketModal = ({
  ticket,
  priorities,
  uid,
  boardId,
  onClose,
  onUpdatePriorities,
}: TicketModalProps) => {
  const debounce = <T extends (...args: Parameters<T>) => void>(
    fn: T,
    ms: number,
  ): (...args: Parameters<T>) => void => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  };

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(
    ticket.descriptionDraft || ticket.description,
  );
  const [expiryDate, setExpiryDate] = useState(ticket.expiryDate ?? '');
  const [priority, setPriority] = useState<string | null>(ticket.priority);
  const [notifyDaysBefore, setNotifyDaysBefore] = useState(ticket.notifyDaysBefore);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [historyOpen, setHistoryOpen] = useState(false);

  const ticketHistory = useAppSelector(
    (state) => state.history.ticketEvents[ticket.id] ?? [],
  );

  const ticketHistoryLoading = useAppSelector(
    (state) => state.history.loadingTickets[ticket.id],
  );

  useEffect(() => {
    if (!historyOpen) return;
    if (ticketHistoryLoading === true) return; 
    if (ticketHistory.length > 0) return;  
    if (ticketHistoryLoading === false) return; 
    
    dispatch(loadTicketHistory({ uid, boardId, ticketId: ticket.id }));
  }, [historyOpen, ticketHistory.length, ticketHistoryLoading, uid, boardId, ticket.id, dispatch]);

  const originalRef = useRef({
    title: ticket.title,
    description: ticket.description,
    expiryDate: ticket.expiryDate,
    priority: ticket.priority,
    notifyDaysBefore: ticket.notifyDaysBefore,
  });

  const debouncedSaveDraft = useCallback(
    debounce((value: string) => {
      dispatch(saveDraft({ uid, boardId, ticketId: ticket.id, draft: value }));
    }, 800),
    [ticket.id, uid, boardId],
  );

  useEffect(() => {
    debouncedSaveDraft(description);
  }, [description, debouncedSaveDraft]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);

    const changes: Partial<Ticket> = {
      title,
      description,
      descriptionDraft: description,
      expiryDate: expiryDate || null,
      priority,
      notifyDaysBefore,
    };

    await dispatch(editTicket({ uid, boardId, ticketId: ticket.id, changes }));

    const orig = originalRef.current;
    const fields: Array<[string, string | null, string | null]> = [
      ['title', orig.title, title],
      ['description', orig.description, description],
      ['expiryDate', orig.expiryDate, expiryDate || null],
      ['priority', orig.priority, priority],
      ['notifyDaysBefore', String(orig.notifyDaysBefore), String(notifyDaysBefore)],
    ];
    for (const [field, oldValue, newValue] of fields) {
      if (oldValue !== newValue) {
        dispatch(
          appendTicketEvent({
            id: crypto.randomUUID(),
            ticketId: ticket.id,
            field,
            oldValue: oldValue ?? '',
            newValue: newValue ?? '',
            timestamp: new Date().toISOString(),
          }),
        );
      }
    }

    setIsSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    await dispatch(removeTicket({ uid, boardId, ticketId: ticket.id }));

    const description = `Ticket "${ticket.title}" was deleted.`;
    const event = {
      id: crypto.randomUUID(),
      type: 'TICKET_DELETED' as const,
      description,
      timestamp: new Date().toISOString(),
    };
    dispatch(appendBoardEvent(event));
    writeBoardEvent(uid, boardId, event.type, event.description);

    onClose();
  };

  return {
    debounce,
    title, setTitle,
    description, setDescription,
    expiryDate, setExpiryDate,
    priority, setPriority,
    notifyDaysBefore, setNotifyDaysBefore,
    isSaving,
    confirmDelete, setConfirmDelete,
    handleSave,
    handleDelete,
    // history
    historyOpen, setHistoryOpen,
    ticketHistory,
    historyLoading: ticketHistoryLoading === true,
  };
};