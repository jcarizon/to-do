import { ErrorTextProps } from "./types";

export const ErrorText = ({ id, children, className = '' }: ErrorTextProps) => {  
  return (
    <p
      id={id}
      role="alert"
      className={['text-sm text-red-600', className].filter(Boolean).join(' ')}
    >
      {children}
    </p>
  );
}