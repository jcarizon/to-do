import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import authReducer from "@/features/auth/store/authSlice";
import RegisterForm from "@/features/auth/components/RegisterForm";

jest.mock("next/navigation", () => ({ useRouter: jest.fn() }));
jest.mock("@/lib/firestore", () => ({ createUserDocument: jest.fn() }));

const makeStore = () =>
  configureStore({ reducer: { auth: authReducer } });

const renderForm = (store = makeStore()) =>
  render(
    <Provider store={store}>
      <RegisterForm />
    </Provider>
  );

const mockPush = jest.fn();

const fillForm = async (overrides?: {
  displayName?: string;
  email?: string;
  password?: string;
  confirm?: string;
}) => {
  const inputs = {
    displayName: "Jane Doe",
    email: "jane@example.com",
    password: "password123",
    confirm: "password123",
    ...overrides,
  };

  await userEvent.type(screen.getByPlaceholderText("Jane Doe"), inputs.displayName);
  await userEvent.type(
    screen.getByPlaceholderText("you@example.com"),
    inputs.email
  );
  const passwordFields = screen.getAllByPlaceholderText("••••••••");
  await userEvent.type(passwordFields[0], inputs.password);
  await userEvent.type(passwordFields[1], inputs.confirm);
};

beforeEach(() => {
  jest.clearAllMocks();
  (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
});

// ─── Rendering ────────────────────────────────────────────────────────────────

describe("RegisterForm — rendering", () => {
  it("renders all fields and submit button", () => {
    renderForm();
    expect(screen.getByPlaceholderText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("••••••••")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("renders link to login page", () => {
    renderForm();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });
});

// ─── Happy Path ───────────────────────────────────────────────────────────────

describe("RegisterForm — happy path", () => {
  it("redirects to /board on successful registration", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: "uid-123", email: "jane@example.com" },
    });
    (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);

    renderForm();
    await fillForm();
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/board");
    });
  });
});

// ─── Error Cases ──────────────────────────────────────────────────────────────

describe("RegisterForm — error cases", () => {
  it("shows error when passwords do not match", async () => {
    renderForm();
    await fillForm({ confirm: "differentpass" });
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it("shows error when password is less than 6 chars", async () => {
    renderForm();
    await fillForm({ password: "abc", confirm: "abc" });
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    expect(
      screen.getByText("Password must be at least 6 characters.")
    ).toBeInTheDocument();
    expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
  });

  it("shows Firebase error on failed registration", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("auth/email-already-in-use")
    );

    renderForm();
    await fillForm();
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText("auth/email-already-in-use")
      ).toBeInTheDocument();
    });
  });

  it("does not redirect on failed registration", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(
      new Error("auth/email-already-in-use")
    );

    renderForm();
    await fillForm();
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

// ─── Edge Cases ───────────────────────────────────────────────────────────────

describe("RegisterForm — edge cases", () => {
  it("disables button while loading", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockReturnValueOnce(
      new Promise(() => {})
    );

    renderForm();
    await fillForm();
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    expect(
      screen.getByRole("button", { name: /creating account/i })
    ).toBeDisabled();
  });

  it("clears local error on new submission attempt", async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: "uid-123", email: "jane@example.com" },
    });
    (updateProfile as jest.Mock).mockResolvedValueOnce(undefined);

    renderForm();
    // First trigger local error
    await fillForm({ confirm: "mismatch" });
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );
    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();

    // Fix and resubmit
    const confirmField = screen.getAllByPlaceholderText("••••••••")[1];
    await userEvent.clear(confirmField);
    await userEvent.type(confirmField, "password123");
    await userEvent.click(
      screen.getByRole("button", { name: /create account/i })
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Passwords do not match.")
      ).not.toBeInTheDocument();
    });
  });
});