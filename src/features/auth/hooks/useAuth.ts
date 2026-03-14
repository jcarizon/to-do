"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase";
import { setUser, setAuthLoading } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { AuthUser } from "../types";

export function useAuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthLoading(true));

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        };
        dispatch(setUser(user));
        document.cookie = `__session=${firebaseUser.uid}; path=/; SameSite=Lax`;
      } else {
        dispatch(setUser(null));
        document.cookie =
          "__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}

export function useAuth() {
  const { user, loading, authReady, error } = useAppSelector((state) => state.auth);
  return { user, loading, authReady, error };
}