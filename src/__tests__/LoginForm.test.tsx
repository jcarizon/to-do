import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import authReducer from "@/features/auth/store/authSlice";
import LoginForm from "@/features/auth/components/LoginForm";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));

const makeStore = () =>
  configureStore({ reducer: { auth: authReducer } });

const renderForm = (store = makeStore()) =>
  render(
    <Provider store={store}>
      <LoginForm />
    </Provider>
  );

const mockPush = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
});

// ─── Rendering ────────────────────────────────────────────────────────────────

describe("LoginForm — rendering", () => {
  it("renders email, password fields and submit button", () => {
    renderForm();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders link to register page", () => {
    renderForm();
    expect(screen.getByRole("link", { name: /create one/i })).toHaveAttribute(
      "href",
      "/register"
    );
  });

  it("button is enabled on initial render", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled();
  });
});

// ─── Happy Path ───────────────────────────────────────────────────────────────

describe("LoginForm — happy path", () => {
  it("redirects to /board on successful login", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: "uid-123", email: "test@example.com", displayName: "Test" },
    });

    renderForm();
    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "test@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/board");
    });
  });
});

// ─── Error Cases ──────────────────────────────────────────────────────────────

describe("LoginForm — error cases", () => {
  it("shows error message on failed login", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    renderForm();
    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "wrong@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("does not redirect on failed login", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("Invalid credentials")
    );

    renderForm();
    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "wrong@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

// ─── Edge Cases ───────────────────────────────────────────────────────────────

describe("LoginForm — edge cases", () => {
  it("disables button while loading", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockReturnValueOnce(
      new Promise(() => {}) // never resolves
    );

    renderForm();
    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "test@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByRole("button", { name: /signing in/i })).toBeDisabled();
  });

  it("clears previous error on new submission", async () => {
    (signInWithEmailAndPassword as jest.Mock)
      .mockRejectedValueOnce(new Error("First error"))
      .mockResolvedValueOnce({
        user: { uid: "uid-123", email: "test@example.com", displayName: "Test" },
      });

    renderForm();
    await userEvent.type(
      screen.getByPlaceholderText("you@example.com"),
      "test@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText("First error")).toBeInTheDocument()
    );

    await userEvent.clear(screen.getByPlaceholderText("••••••••"));
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "correctpass");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.queryByText("First error")).not.toBeInTheDocument()
    );
  });
});