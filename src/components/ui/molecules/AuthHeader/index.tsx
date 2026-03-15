import { LogoMark } from "@/components/icons";
import { AuthHeaderProps } from "./types";


export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-center gap-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
        <LogoMark />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>

      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}