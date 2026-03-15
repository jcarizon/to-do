"use client";

import Link from "next/link";
import { useLoginForm } from "../hooks/useLoginForm";
import {
  AuthHeader,
  FormField,
  PasswordField,
  Button,
  ErrorText
} from "@/components/ui";

export default function LoginForm() {
  const { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    loading, 
    error, 
    handleSubmit 
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to your TechLint board"
      />
      <div className="flex flex-col gap-5">
        <FormField
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          required
          disabled={loading}
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="••••••••"
          required
          disabled={loading}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <Button type="submit" isLoading={loading} fullWidth>
          Sign in
        </Button>
      </div>

      <p className="text-center text-sm text-zinc-500">
        No account?{" "}
        <Link
          href="/register"
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}