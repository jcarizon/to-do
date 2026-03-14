import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
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