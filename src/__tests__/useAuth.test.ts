import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import authReducer, { setUser } from "@/features/auth/store/authSlice";
import { useAuth, useAuthListener } from "@/features/auth/hooks/useAuth";

const makeStore = () =>
  configureStore({ reducer: { auth: authReducer } });

const makeWrapper = (store: ReturnType<typeof makeStore>) =>
  ({ children }: { children: React.ReactNode }) =>
    React.createElement(Provider, { store }, children);

const mockUser = {
  uid: "uid-123",
  email: "test@example.com",
  displayName: "Test User",
};

// ─── useAuth ──────────────────────────────────────────────────────────────────

describe("useAuth", () => {
  it("returns initial state", () => {
    const store = makeStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper(store),
    });
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.authReady).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("reflects user after setUser dispatch", () => {
    const store = makeStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      store.dispatch(setUser(mockUser));
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.authReady).toBe(true);
  });

  it("reflects null after user is cleared", () => {
    const store = makeStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      store.dispatch(setUser(mockUser));
    });
    act(() => {
      store.dispatch(setUser(null));
    });

    expect(result.current.user).toBeNull();
  });
});

// ─── useAuthListener ──────────────────────────────────────────────────────────

describe("useAuthListener", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset document.cookie
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  it("dispatches setUser when Firebase user is present", () => {
    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (_auth: unknown, callback: (user: unknown) => void) => {
        callback(mockUser);
        return jest.fn(); // unsubscribe
      }
    );

    const store = makeStore();
    renderHook(() => useAuthListener(), { wrapper: makeWrapper(store) });

    const state = store.getState().auth;
    expect(state.user).toEqual(mockUser);
    expect(state.authReady).toBe(true);
  });

  it("dispatches setUser(null) when no Firebase user", () => {
    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (_auth: unknown, callback: (user: null) => void) => {
        callback(null);
        return jest.fn();
      }
    );

    const store = makeStore();
    renderHook(() => useAuthListener(), { wrapper: makeWrapper(store) });

    expect(store.getState().auth.user).toBeNull();
  });

  it("writes __session cookie when user is present", () => {
    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (_auth: unknown, callback: (user: unknown) => void) => {
        callback(mockUser);
        return jest.fn();
      }
    );

    const store = makeStore();
    renderHook(() => useAuthListener(), { wrapper: makeWrapper(store) });

    expect(document.cookie).toContain("__session=uid-123");
  });

  it("clears __session cookie when user is null", () => {
    (onAuthStateChanged as jest.Mock).mockImplementationOnce(
      (_auth: unknown, callback: (user: null) => void) => {
        callback(null);
        return jest.fn();
      }
    );

    const store = makeStore();
    renderHook(() => useAuthListener(), { wrapper: makeWrapper(store) });

    expect(document.cookie).not.toContain("__session=uid");
  });

  it("unsubscribes from onAuthStateChanged on unmount", () => {
    const unsubscribe = jest.fn();
    (onAuthStateChanged as jest.Mock).mockReturnValueOnce(unsubscribe);

    const store = makeStore();
    const { unmount } = renderHook(() => useAuthListener(), {
      wrapper: makeWrapper(store),
    });

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});