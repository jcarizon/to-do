import { addTicket } from "@/features/tickets/store/ticketsSlice";
import { Ticket } from "@/features/tickets/types";
import { useAppDispatch } from "@/store/hooks";
import { useState } from "react";
import { AddTicketModalProps } from "./types";

export const useAddTicketModal = ({
  uid,
  boardId,
  columnId,
  ticketCount,
  onClose,
}: AddTicketModalProps) => {
  const dispatch = useAppDispatch();
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleSubmit = async () => {
      if (!title.trim() || isSubmitting) return;
      setIsSubmitting(true);
  
      const now = new Date().toISOString();
      const newTicket: Omit<Ticket, 'id'> = {
        boardId,
        columnId,
        title: title.trim(),
        description: '',
        descriptionDraft: '',
        expiryDate: null,
        priority: null,
        priorityOrder: ticketCount,
        notifyDaysBefore: 3,
        createdAt: now,
        updatedAt: now,
      };
  
      await dispatch(addTicket({ uid, boardId, ticket: newTicket }));
      setIsSubmitting(false);
      onClose();
    };
  
  return {
    title,
    setTitle,
    isSubmitting,
    handleSubmit,
  };
};