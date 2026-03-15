import { appendBoardHistoryEvent, appendTicketHistoryEvent } from '@/lib/firebase/firestore';
import { nanoid } from '@reduxjs/toolkit';

export async function writeBoardEvent(
  uid: string,
  boardId: string,
  type: string,
  description: string
) {
  await appendBoardHistoryEvent(uid, boardId, {
    id: nanoid(),
    type,
    description,
    timestamp: new Date().toISOString(),
  });
}

export async function writeTicketEvent(
  uid: string,
  boardId: string,
  ticketId: string,
  field: string,
  oldValue: string,
  newValue: string
) {
  await appendTicketHistoryEvent(uid, boardId, ticketId, {
    id: nanoid(),
    ticketId,
    field,
    oldValue,
    newValue,
    timestamp: new Date().toISOString(),
  });
}