import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,

  collection,
  getDocs,
  deleteDoc,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type { 
  IUser, 
  IBoardDocumentBase,
  ICreateBoardDocument,
  IUpdateBoardDocument,
  ICreateColumnDocument,
  IDeleteColumnDocument,
  ICreateTicketDocument,
  IUpdateTicketDocument,
  IDeleteTicketDocument,
  IAppendBoardHistoryEventDocument,
  IAppendTicketHistoryEventDocument,
  ITicketHistoryDocument,
} from "./types";

export async function createUserDocument({ uid, data }: IUser) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
  }
}

export async function updateUserDocument({ uid, data }: IUser) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Below are functions for managing boards
export async function createBoard({ uid, boardId, title }: ICreateBoardDocument) {
  await setDoc(doc(db, 'users', uid, 'boards', boardId), {
    title,
    createdAt: new Date().toISOString(),
    columnOrder: [],
  })
}

export async function fetchBoard({ uid, boardId }: IBoardDocumentBase) {
  const snap = await getDoc(doc(db, 'users', uid, 'boards', boardId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateColumnOrder({ uid, boardId, columnOrder }: IUpdateBoardDocument) {
  await updateDoc(doc(db, 'users', uid, 'boards', boardId), { columnOrder });
}

// Below are functions for managing columns
export async function createColumn({ uid, boardId, columnId, data }: ICreateColumnDocument) {
  await setDoc(doc(db, 'users', uid, 'boards', boardId, 'columns', columnId), data);
}

export async function fetchColumns({ uid, boardId }: IBoardDocumentBase) {
  const snap = await getDocs(collection(db, 'users', uid, 'boards', boardId, 'columns'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteColumn({ uid, boardId, columnId }: IDeleteColumnDocument) {
  await deleteDoc(doc(db, 'users', uid, 'boards', boardId, 'columns', columnId));
}

// Below are functions for managing tickets
export async function createTicket({ uid, boardId, ticketId, data }: ICreateTicketDocument) {
  await setDoc(doc(db, 'users', uid, 'boards', boardId, 'tickets', ticketId), data);
}

export async function fetchTickets({ uid, boardId }: IBoardDocumentBase) {
  const snap = await getDocs(collection(db, 'users', uid, 'boards', boardId, 'tickets'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateTicket({ uid, boardId, ticketId, data }: IUpdateTicketDocument) {
  await updateDoc(doc(db, 'users', uid, 'boards', boardId, 'tickets', ticketId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteTicket({ uid, boardId, ticketId }: IDeleteTicketDocument) {
  await deleteDoc(doc(db, 'users', uid, 'boards', boardId, 'tickets', ticketId));
}

// Below are functions for managing history events
export async function appendBoardHistoryEvent({ uid, boardId, event }: IAppendBoardHistoryEventDocument) {
  const ref = doc(db, 'users', uid, 'boards', boardId, 'history', 'board_history');
  await setDoc(ref, { events: arrayUnion(event) }, { merge: true });
}

export async function appendTicketHistoryEvent({ uid, boardId, ticketId, event }: IAppendTicketHistoryEventDocument) {
  const ref = doc(db, 'users', uid, 'boards', boardId, 'tickets', ticketId, 'history', 'ticket_history');
  await setDoc(ref, { events: arrayUnion(event) }, { merge: true });
}

export async function fetchBoardHistory({ uid, boardId }: IBoardDocumentBase) {
  const snap = await getDoc(doc(db, 'users', uid, 'boards', boardId, 'history', 'board_history'));
  return snap.exists() ? (snap.data().events ?? []) : [];
}

export async function fetchTicketHistory({ uid, boardId, ticketId }: ITicketHistoryDocument) {
  const snap = await getDoc(doc(db, 'users', uid, 'boards', boardId, 'tickets', ticketId, 'history', 'ticket_history'));
  return snap.exists() ? (snap.data().events ?? []) : [];
}