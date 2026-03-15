import { AuthCardProps } from "./types";

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}