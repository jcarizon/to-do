import { ButtonHTMLAttributes } from "react";

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
}

interface UseButtonProps {
  disabled?: boolean;
  isLoading?: boolean;
}

export type { 
  ButtonProps, 
  ButtonVariant, 
  ButtonSize, 
  UseButtonProps 
};