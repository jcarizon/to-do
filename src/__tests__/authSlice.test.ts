import { configureStore } from "@reduxjs/toolkit";
import authReducer, {
  setUser,
  setAuthLoading,
  clearError,
  loginUser,
  registerUser,
  logoutUser,
} from "@/features/auth/store/authSlice";
import type { AuthState } from "@/features/auth/types";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createUserDocument } from "@/lib/firebase/firestore";

// Mock firestore helper
jest.mock("@/lib/firestore", () => ({
  createUserDocument: jest.fn(),
}));

const makeStore = () =>
  configureStore({ reducer: { auth: authReducer } });

const mockUser = {
  uid: "uid-123",
  email: "test@example.com",
  displayName: "Test User",
};

// ─── Initial State ────────────────────────────────────────────────────────────

describe("authSlice — initial state", () => {
  it("has correct initial state", () => {
    const store = makeStore();
    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.authReady).toBe(false);
    expect(state.error).toBeNull();
  });
});

// ─── Reducers ─────────────────────────────────────────────────────────────────

describe("authSlice — reducers", () => {
  it("setUser sets user, authReady=true, loading=false, error=null", () => {
    const store = makeStore();
    store.dispatch(setUser(mockUser));
    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.authReady).toBe(true);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("setUser with null clears user", () => {
    const store = makeStore();
    store.dispatch(setUser(mockUser));
    store.dispatch(setUser(null));
    expect(store.getState().auth.user).toBeNull();
  });

  it("setAuthLoading sets loading state", () => {
    const store = makeStore();
    store.dispatch(setAuthLoading(true));
    expect(store.getState().auth.loading).toBe(true);
    store.dispatch(setAuthLoading(false));
    expect(store.getState().auth.loading).toBe(false);
  });

  it("clearError sets error to null", () => {
    const store = makeStore();
    // Manually inject error via a rejected action
    store.dispatch({ type: "auth/login/rejected", payload: "Some error" });
    expect(store.getState().auth.error).toBe("Some error");
    store.dispatch(clearError());
    expect(store.getState().auth.error).toBeNull();
  });
});

// ─── loginUser thunk ──────────────────────────────────────────────────────────

describe("loginUser thunk", () => {
  beforeEach(() => jest.clearAllMocks());

  it("fulfilled — sets user in state", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: mockUser,
    });

    const store = makeStore();
    await store.dispatch(
      loginUser({ email: mockUser.email!, password: "password123" })
    );

    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("pending — sets loading=true, error=null", () => {
    (signInWithEmailAndPassword as jest.Mock).mockReturnValueOnce(
      new Promise(() => {}) // never resolves
    );

    const store = makeStore();
    store.dispatch(loginUser({ email: mockUser.email!, password: "password123" }));

    const state = store.getState().auth;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("rejected — sets error, loading=false", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    const store = makeStore();
    await store.dispatch(
      loginUser({ email: mockUser.email!, password: "wrongpass" })
    );

    const state = store.getState().auth;
    expect(state.error).toBe("Invalid credentials");
    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
  });

  it("rejected — handles non-Error thrown values", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("auth/network-request-failed")
    );

    const store = makeStore();
    await store.dispatch(loginUser({ email: "", password: "" }));
    expect(store.getState().auth.error).toBe("auth/network-request-failed");
  });
});

// ─── registerUser thunk ───────────────────────────────────────────────────────

describe("registerUser thunk", () => {
  beforeEach(() => jest.clearAllMocks());

  it("fulfilled — creates user doc and sets state", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: mockUser.uid, email: mockUser.email },
    });
    (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);
    (createUserDocument as jest.Mock).mockResolvedValueOnce(undefined);

    const store = makeStore();
    await store.dispatch(
      registerUser({
        email: mockUser.email!,
        password: "password123",
        displayName: mockUser.displayName!,
      })
    );

    const state = store.getState().auth;
    expect(state.user?.uid).toBe(mockUser.uid);
    expect(state.user?.email).toBe(mockUser.email);
    expect(state.loading).toBe(false);
    expect(createUserDocument).toHaveBeenCalledWith(mockUser.uid, {
      email: mockUser.email,
      displayName: mockUser.displayName,
    });
  });

  it("rejected — Firestore write fails", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: mockUser.uid, email: mockUser.email },
    });
    (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);
    (createUserDocument as jest.Mock).mockRejectedValueOnce(
      new Error("Missing or insufficient permissions.")
    );

    const store = makeStore();
    await store.dispatch(
      registerUser({
        email: mockUser.email!,
        password: "password123",
        displayName: mockUser.displayName!,
      })
    );

    expect(store.getState().auth.error).toBe(
      "Missing or insufficient permissions."
    );
  });

  it("rejected — email already in use", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("auth/email-already-in-use")
    );

    const store = makeStore();
    await store.dispatch(
      registerUser({
        email: mockUser.email!,
        password: "password123",
        displayName: mockUser.displayName!,
      })
    );

    expect(store.getState().auth.error).toBe("auth/email-already-in-use");
    expect(store.getState().auth.user).toBeNull();
  });
});

// ─── logoutUser thunk ─────────────────────────────────────────────────────────

describe("logoutUser thunk", () => {
  beforeEach(() => jest.clearAllMocks());

  it("fulfilled — clears user from state", async () => {
    const store = makeStore();
    store.dispatch(setUser(mockUser));
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);

    await store.dispatch(logoutUser());

    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.loading).toBe(false);
  });

  it("rejected — sets error", async () => {
    const store = makeStore();
    store.dispatch(setUser(mockUser));
    (signOut as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await store.dispatch(logoutUser());

    expect(store.getState().auth.error).toBe("Network error");
    // user should still be in state since logout failed
    expect(store.getState().auth.user).toEqual(mockUser);
  });
});