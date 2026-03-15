"use client";

import Link from "next/link";
import { useRegisterForm } from "../hooks/useRegisterForm";
import {
  AuthHeader,
  FormField,
  PasswordField,
  Button,
  ErrorText
} from "@/components/ui";

export default function RegisterForm() {
  const { 
    handleSubmit,
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fieldErrors,
    loading,
    error,
  } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} noValidate>
      <AuthHeader
        title="Create your account"
        subtitle="Start organising your work with TechLint"
      />
      <div className="flex flex-col gap-5">
        <FormField
          label="Full name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          autoComplete="name"
          placeholder="Jane Smith"
          error={fieldErrors.displayName}
          required
          disabled={loading}
        />

        <FormField
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          error={fieldErrors.email}
          required
          disabled={loading}
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          error={fieldErrors.password}
          required
          disabled={loading}
        />

        <PasswordField
          label="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={fieldErrors.confirmPassword}
          required
          disabled={loading}
        />

        {error && <ErrorText>{error}</ErrorText>}

        <Button type="submit" isLoading={loading} fullWidth>
          Create account
        </Button>
      </div>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}