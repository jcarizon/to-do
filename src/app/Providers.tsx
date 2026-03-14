"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAuthListener } from "@/features/auth/hooks/useAuth";

function AuthGate({ children }: { children: ReactNode }) {
  useAuthListener();
  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthGate>{children}</AuthGate>
    </Provider>
  );
}