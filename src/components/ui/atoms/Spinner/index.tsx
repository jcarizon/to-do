import { SpinnerProps } from "./types";
import { useSpinner } from "./useSpiiner";

export const Spinner = ({ size = 'md', className = '' }: SpinnerProps) => {
  const { sizeClasses } = useSpinner();
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        'inline-block animate-spin rounded-full',
        'border-current border-r-transparent',
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}