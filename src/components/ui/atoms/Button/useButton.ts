import { ButtonSize, ButtonVariant, UseButtonProps } from "./types";

export const useButton = ({ disabled, isLoading }: UseButtonProps) => {
  const isDisabled = disabled || isLoading;

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500 disabled:bg-indigo-300',
    secondary:
      'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus-visible:ring-indigo-500 disabled:text-gray-400',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-400 disabled:text-gray-300',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return { variantClasses, sizeClasses, isDisabled };
};