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

export async function createUserDocument(
  uid: string,
  data: { email: string; displayName: string }
) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
  }
}

export async function updateUserDocument(
  uid: string,
  data: Partial<{ displayName: string; email: string }>
) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Below are functions for managing boards

export async function createBoard(uid: string, boardId: string, title: string) {
  await setDoc(doc(db, 'users', uid, 'boards', boardId), {
    title,
    createdAt: new Date().toISOString(),
    columnOrder: [],
  })
}

export async function fetchBoard(uid: string, boardId: string) {
  const snap = await getDoc(doc(db, 'users', uid, 'boards', boardId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateColumnOrder(uid: string, boardId: string, columnOrder: string[]) {
  await updateDoc(doc(db, 'users', uid, 'boards', boardId), { columnOrder });
}

// Below are functions for managing columns
export async function createColumn(uid: string, boardId: string, columnId: string, data: object) {
  await setDoc(doc(db, 'users', uid, 'boards', boardId, 'columns', columnId), data);
}

export async function fetchColumns(uid: string, boardId: string) {
  const snap = await getDocs(collection(db, 'users', uid, 'boards', boardId, 'columns'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteColumn(uid: string, boardId: string, columnId: string) {
  await deleteDoc(doc(db, 'users', uid, 'boards', boardId, 'columns', columnId));
}

// Below are functions for managing tickets
export async function createTicket(uid: string, boardId: string, ticketId: string, data: object) {
  await setDoc(doc(db, 'users', uid, 'boards', boardId, 'tickets', ticketId), data);
}

export async function fetchTickets(uid: string, boardId: string) {
  const snap = await getDocs(collection(db, 'users', uid, 'boards', boardId, 'tickets'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateTicket(uid: string, boardId: string, ticketId: string, data: object) {
  await updateDoc(doc(db, 'users', uid, 'boards', boardId, 'tickets', ticketId), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteTicket(uid: string, boardId: string, ticketId: string) {
  await deleteDoc(doc(db, 'users', uid, 'boards', boardId, 'tickets', ticketId));
}

// Below are functions for managing history events
export async function appendBoardHistoryEvent(uid: string, boardId: string, event: object) {
  const ref = doc(db, 'users', uid, 'boards', boardId, 'history', 'board_history');
  await setDoc(ref, { events: arrayUnion(event) }, { merge: true });
}

export async function appendTicketHistoryEvent(uid: string, boardId: string, ticketId: string, event: object) {
  const ref = doc(db, 'users', uid, 'boards', boardId, 'tickets', ticketId, 'history', 'ticket_history');
  await setDoc(ref, { events: arrayUnion(event) }, { merge: true });
}

export async function fetchBoardHistory(uid: string, boardId: string) {
  const snap = await getDoc(doc(db, 'users', uid, 'boards', boardId, 'history', 'board_history'));
  return snap.exists() ? (snap.data().events ?? []) : [];
}

export async function fetchTicketHistory(uid: string, boardId: string, ticketId: string) {
  const snap = await getDoc(doc(db, 'users', uid, 'boards', boardId, 'tickets', ticketId, 'history', 'ticket_history'));
  return snap.exists() ? (snap.data().events ?? []) : [];
}